const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Improved Hybrid Recommendation Engine for DigiStore
 * 
 * v2 Changes:
 * 1. COLLABORATIVE FILTERING is now dominant (+5 per co-purchase, was +2)
 * 2. CATEGORY PREFERENCE is contextual - only boosts the user's DOMINANT category
 * 3. POPULARITY is a minor tiebreaker (reduced weights)
 * 4. DIVERSITY BOOST: products in user's dominant interest get extra +2
 * 5. PENALTY: products far from user's interest get -1 (prevents "popular bleed")
 * 
 * This ensures a user who buys ML products sees ML recommendations,
 * not just the most popular web dev products.
 */

const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Get user's COMPLETE purchase history with full product data
        const userOrders = await prisma.order.findMany({
            where: { buyerId: userId, status: 'COMPLETED' },
            include: {
                items: {
                    where: { productId: { not: null } },
                    include: {
                        product: {
                            select: { id: true, category: true, title: true }
                        }
                    }
                }
            }
        });

        const purchasedProductIds = new Set();
        const purchasedCategories = [];

        userOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.product) {
                    purchasedProductIds.add(item.product.id);
                    purchasedCategories.push(item.product.category);
                }
            });
        });

        // ═══════════════════════════════════════════════════════
        // DETECT USER'S DOMINANT INTEREST
        // ═══════════════════════════════════════════════════════
        const categoryFrequency = {};
        purchasedCategories.forEach(cat => {
            categoryFrequency[cat] = (categoryFrequency[cat] || 0) + 1;
        });

        // Find dominant category (most purchased)
        let dominantCategory = null;
        let maxCount = 0;
        for (const [cat, count] of Object.entries(categoryFrequency)) {
            if (count > maxCount) {
                maxCount = count;
                dominantCategory = cat;
            }
        }

        // If user has 3+ purchases in one category, it's their clear preference
        const hasClearPreference = maxCount >= 3;

        // ═══════════════════════════════════════════════════════
        // COLD START: No purchases → return top-rated products
        // ═══════════════════════════════════════════════════════
        if (purchasedProductIds.size === 0) {
            const fallback = await prisma.product.findMany({
                where: { status: 'APPROVED' },
                include: {
                    seller: { select: { fullName: true, storeName: true } },
                    _count: {
                        select: {
                            orderItems: { where: { order: { status: 'COMPLETED' } } }
                        }
                    }
                },
                orderBy: [
                    { averageRating: 'desc' },
                    { reviewCount: 'desc' }
                ],
                take: 8
            });

            const result = fallback.map(({ _count, ...product }) => ({
                ...product,
                purchaseCount: _count.orderItems,
                recommendationReason: 'محبوب در بازارچه'
            }));

            return res.status(200).json(result);
        }

        // ═══════════════════════════════════════════════════════
        // 2. COLLABORATIVE FILTERING (DOMINANT SIGNAL)
        // Find users who bought the SAME products, see what ELSE they bought
        // ═══════════════════════════════════════════════════════
        const similarUserOrders = await prisma.order.findMany({
            where: {
                status: 'COMPLETED',
                buyerId: { not: userId },
                items: {
                    some: {
                        productId: { in: Array.from(purchasedProductIds) }
                    }
                }
            },
            include: {
                items: {
                    where: { productId: { not: null } },
                    include: {
                        product: { select: { id: true, category: true } }
                    }
                }
            }
        });

        // Count co-purchase frequency + track category of co-purchases
        const coPurchaseScores = new Map();
        const coPurchaseCategoryBoost = new Map();

        similarUserOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.product && !purchasedProductIds.has(item.product.id)) {
                    const pid = item.product.id;
                    coPurchaseScores.set(pid, (coPurchaseScores.get(pid) || 0) + 1);

                    // Track which category these co-purchases belong to
                    const cat = item.product.category;
                    if (!coPurchaseCategoryBoost.has(cat)) {
                        coPurchaseCategoryBoost.set(cat, new Set());
                    }
                    coPurchaseCategoryBoost.get(cat).add(pid);
                }
            });
        });

        // ═══════════════════════════════════════════════════════
        // 3. GET ALL ELIGIBLE PRODUCTS
        // ═══════════════════════════════════════════════════════
        const allProducts = await prisma.product.findMany({
            where: {
                status: 'APPROVED',
                id: { notIn: Array.from(purchasedProductIds) }
            },
            include: {
                seller: { select: { fullName: true, storeName: true } },
                _count: {
                    select: {
                        orderItems: { where: { order: { status: 'COMPLETED' } } }
                    }
                }
            }
        });

        // ═══════════════════════════════════════════════════════
        // 4. SMART SCORING ENGINE
        // ═══════════════════════════════════════════════════════
        const scoredProducts = allProducts.map(product => {
            let score = 0;
            const reasons = [];

            // ── A. COLLABORATIVE FILTERING (Highest Weight) ──
            const coCount = coPurchaseScores.get(product.id) || 0;
            if (coCount > 0) {
                // +5 per co-purchase occurrence (was +2)
                score += coCount * 5;

                if (coCount >= 3) {
                    reasons.push('بسیاری از خریداران مشابه این را انتخاب کردند');
                } else {
                    reasons.push('خریداران مشابه این را هم خریدند');
                }
            }

            // ── B. DOMINANT CATEGORY BOOST ──
            // Only boost if this matches user's CLEAR preference
            if (hasClearPreference && product.category === dominantCategory) {
                score += 3;
                reasons.push('هم‌راستا با علاقه‌مندی‌های شما');
            } else if (purchasedCategories.includes(product.category)) {
                // User bought some in this category but it's not dominant
                score += 1;
            }

            // ── C. INTEREST ALIGNMENT PENALTY ──
            // If user has clear preference (e.g., ML), penalize unrelated categories
            if (hasClearPreference && product.category !== dominantCategory) {
                // Small penalty to prevent "popular product bleed"
                score -= 1;
            }

            // ── D. POPULARITY (Minor Tiebreaker) ──
            if (product.averageRating >= 4.5 && product.reviewCount >= 10) {
                score += 1;
                if (reasons.length === 0) reasons.push('امتیاز عالی و محبوب');
            } else if (product.averageRating >= 4.0 && product.reviewCount >= 5) {
                score += 0.5;
                if (reasons.length === 0) reasons.push('امتیاز بالا');
            }

            // ── E. FRESHNESS BOOST ──
            // Slightly boost products with some reviews but not oversaturated
            if (product.reviewCount >= 3 && product.reviewCount <= 30) {
                score += 0.5;
            }

            return {
                ...product,
                purchaseCount: product._count.orderItems,
                score,
                recommendationReason: reasons[0] || 'محصول پیشنهادی'
            };
        });

        // 5. Sort by score DESC, then by co-purchase count DESC, then rating DESC
        scoredProducts.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            const coA = coPurchaseScores.get(a.id) || 0;
            const coB = coPurchaseScores.get(b.id) || 0;
            if (coB !== coA) return coB - coA;
            return b.averageRating - a.averageRating;
        });

        // 6. Return top 8
        const recommendations = scoredProducts.slice(0, 8).map(({ _count, score, ...product }) => product);

        res.status(200).json(recommendations);
    } catch (error) {
        console.error("Recommendation Engine Error:", error);
        res.status(500).json({ message: "خطا در تولید پیشنهادات." });
    }
};

/**
 * Product-level "Customers who bought this also bought..."
 * Public endpoint for product detail pages
 */
const getProductRecommendations = async (req, res) => {
    try {
        const { productId } = req.params;
        const parsedId = parseInt(productId);

        // 1. Find users who bought this product
        const buyers = await prisma.order.findMany({
            where: {
                status: 'COMPLETED',
                items: { some: { productId: parsedId } }
            },
            include: {
                items: {
                    where: { productId: { not: parsedId, not: null } },
                    include: {
                        product: { select: { category: true } }
                    }
                }
            }
        });

        // 2. Count co-purchases + track category distribution
        const coPurchaseCount = new Map();
        const categoryCoPurchaseCount = {};

        buyers.forEach(order => {
            order.items.forEach(item => {
                if (item.productId) {
                    coPurchaseCount.set(
                        item.productId,
                        (coPurchaseCount.get(item.productId) || 0) + 1
                    );
                    const cat = item.product.category;
                    categoryCoPurchaseCount[cat] = (categoryCoPurchaseCount[cat] || 0) + 1;
                }
            });
        });

        // Find dominant co-purchase category
        let dominantCoCategory = null;
        let maxCoCount = 0;
        for (const [cat, count] of Object.entries(categoryCoPurchaseCount)) {
            if (count > maxCoCount) {
                maxCoCount = count;
                dominantCoCategory = cat;
            }
        }

        const recommendedIds = Array.from(coPurchaseCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([id]) => id);

        let recommendations = [];

        if (recommendedIds.length > 0) {
            recommendations = await prisma.product.findMany({
                where: {
                    id: { in: recommendedIds },
                    status: 'APPROVED'
                },
                include: {
                    seller: { select: { fullName: true, storeName: true } },
                    _count: {
                        select: {
                            orderItems: { where: { order: { status: 'COMPLETED' } } }
                        }
                    }
                }
            });
        }

        // 3. FALLBACK: Same category products (prioritize same category as source product)
        if (recommendations.length < 4) {
            const sourceProduct = await prisma.product.findUnique({
                where: { id: parsedId },
                select: { category: true }
            });

            if (sourceProduct) {
                const existingIds = new Set(recommendations.map(r => r.id));
                existingIds.add(parsedId);

                // First try: same category as dominant co-purchase category
                const fallbackCat = dominantCoCategory || sourceProduct.category;

                const fallback = await prisma.product.findMany({
                    where: {
                        status: 'APPROVED',
                        category: fallbackCat,
                        id: { notIn: Array.from(existingIds) }
                    },
                    include: {
                        seller: { select: { fullName: true, storeName: true } },
                        _count: {
                            select: {
                                orderItems: { where: { order: { status: 'COMPLETED' } } }
                            }
                        }
                    },
                    orderBy: [
                        { averageRating: 'desc' },
                        { reviewCount: 'desc' }
                    ],
                    take: 6 - recommendations.length
                });

                recommendations = [...recommendations, ...fallback];
            }
        }

        // 4. Score and sort
        const result = recommendations.map(({ _count, ...product }) => {
            const coCount = coPurchaseCount.get(product.id) || 0;
            let reason = 'خریداران این محصول، این‌ها را هم خریدند';

            if (coCount >= 3) {
                reason = 'محبوب در میان خریداران این کالا';
            } else if (coCount === 0) {
                reason = 'هم‌دسته و مرتبط';
            }

            return {
                ...product,
                purchaseCount: _count.orderItems,
                recommendationReason: reason,
                _coCount: coCount
            };
        });

        // Sort: co-purchased first, then by rating
        result.sort((a, b) => {
            if (b._coCount !== a._coCount) return b._coCount - a._coCount;
            return b.averageRating - a.averageRating;
        });

        // Remove internal _coCount field
        const cleanResult = result.map(({ _coCount, ...rest }) => rest);

        res.status(200).json(cleanResult);
    } catch (error) {
        console.error("Product Recommendation Error:", error);
        res.status(500).json({ message: "خطا در دریافت پیشنهادات محصول." });
    }
};

module.exports = { getRecommendations, getProductRecommendations };
