const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Recommendation Engine v3 - Fixed for Real-World Usage
 * 
 * Problem with v2: Collaborative filtering only works if OTHER users bought
 * the EXACT SAME products. New users buy products nobody else bought.
 * 
 * v3 Solution: When product-level co-purchase is empty, fall back to
 * CATEGORY-LEVEL collaborative filtering:
 * "Users who bought ML products also bought these OTHER ML products"
 * 
 * This is how Amazon/Netflix actually work — they don't need exact 
 * product matches, just category/interest alignment.
 */

const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Get user's purchase history
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
        const purchasedProductTitles = [];

        userOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.product) {
                    purchasedProductIds.add(item.product.id);
                    purchasedCategories.push(item.product.category);
                    purchasedProductTitles.push(item.product.title);
                }
            });
        });

        // Detect dominant category
        const categoryFrequency = {};
        purchasedCategories.forEach(cat => {
            categoryFrequency[cat] = (categoryFrequency[cat] || 0) + 1;
        });

        let dominantCategory = null;
        let maxCount = 0;
        for (const [cat, count] of Object.entries(categoryFrequency)) {
            if (count > maxCount) {
                maxCount = count;
                dominantCategory = cat;
            }
        }
        const hasClearPreference = maxCount >= 2;  // Lowered from 3

        // ═══════════════════════════════════════════════════════
        // COLD START
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
        // 2. PRODUCT-LEVEL Collaborative Filtering
        // Find users who bought the EXACT SAME products
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

        const coPurchaseScores = new Map();
        similarUserOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.product && !purchasedProductIds.has(item.product.id)) {
                    coPurchaseScores.set(
                        item.product.id,
                        (coPurchaseScores.get(item.product.id) || 0) + 1
                    );
                }
            });
        });

        // ═══════════════════════════════════════════════════════
        // 3. CATEGORY-LEVEL Collaborative Filtering (NEW)
        // If product-level is weak, find users who bought SAME CATEGORY products
        // "ML buyers also bought these other ML products"
        // ═══════════════════════════════════════════════════════
        const categoryCoPurchaseScores = new Map();

        if (coPurchaseScores.size < 5 && hasClearPreference) {
            // Product-level CF is weak → use category-level
            const categoryBuyers = await prisma.order.findMany({
                where: {
                    status: 'COMPLETED',
                    buyerId: { not: userId },
                    items: {
                        some: {
                            product: {
                                category: dominantCategory
                            }
                        }
                    }
                },
                include: {
                    items: {
                        where: {
                            productId: { not: null },
                            product: { category: dominantCategory }
                        },
                        include: {
                            product: { select: { id: true, category: true } }
                        }
                    }
                }
            });

            categoryBuyers.forEach(order => {
                order.items.forEach(item => {
                    if (item.product && !purchasedProductIds.has(item.product.id)) {
                        categoryCoPurchaseScores.set(
                            item.product.id,
                            (categoryCoPurchaseScores.get(item.product.id) || 0) + 1
                        );
                    }
                });
            });
        }

        // ═══════════════════════════════════════════════════════
        // 4. GET ALL ELIGIBLE PRODUCTS
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
        // 5. SMART SCORING ENGINE v3
        // ═══════════════════════════════════════════════════════
        const scoredProducts = allProducts.map(product => {
            let score = 0;
            const reasons = [];

            // ── A. PRODUCT-LEVEL Collaborative (Strongest) ──
            const coCount = coPurchaseScores.get(product.id) || 0;
            if (coCount > 0) {
                score += coCount * 6;
                if (coCount >= 2) {
                    reasons.push('خریدارانی مثل شما این را هم خریدند');
                } else {
                    reasons.push('خریداران مشابه این را انتخاب کردند');
                }
            }

            // ── B. CATEGORY-LEVEL Collaborative (NEW - Strong) ──
            const catCoCount = categoryCoPurchaseScores.get(product.id) || 0;
            if (catCoCount > 0 && coCount === 0) {
                // Only apply if no product-level match (avoid double counting)
                score += Math.min(catCoCount * 3, 9);
                if (catCoCount >= 3) {
                    reasons.push('علاقه‌مندان به این حوزه این را هم خریدند');
                } else {
                    reasons.push('در میان علاقه‌مندان این دسته محبوب است');
                }
            }

            // ── C. DOMINANT CATEGORY BOOST ──
            if (hasClearPreference && product.category === dominantCategory) {
                score += 4;
                if (reasons.length === 0) {
                    reasons.push('هم‌راستا با علاقه‌مندی‌های شما');
                }
            } else if (purchasedCategories.includes(product.category)) {
                score += 1;
            }

            // ── D. SUB-CATEGORY SIMILARITY (NEW) ──
            // Check if product title shares keywords with purchased products
            const productTitleLower = product.title.toLowerCase();
            let keywordMatches = 0;
            purchasedProductTitles.forEach(title => {
                const words = title.toLowerCase().split(/\s+/);
                words.forEach(word => {
                    if (word.length > 3 && productTitleLower.includes(word)) {
                        keywordMatches++;
                    }
                });
            });
            if (keywordMatches > 0) {
                score += Math.min(keywordMatches * 0.5, 2);
            }

            // ── E. POPULARITY (Minor tiebreaker) ──
            if (product.averageRating >= 4.5 && product.reviewCount >= 10) {
                score += 0.5;
                if (reasons.length === 0) reasons.push('امتیاز عالی');
            }

            return {
                ...product,
                purchaseCount: product._count.orderItems,
                score,
                recommendationReason: reasons[0] || 'محصول پیشنهادی'
            };
        });

        // 6. Sort by score DESC
        scoredProducts.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.averageRating - a.averageRating;
        });

        // 7. Return top 8
        const recommendations = scoredProducts.slice(0, 8).map(({ _count, score, ...product }) => product);

        res.status(200).json(recommendations);
    } catch (error) {
        console.error("Recommendation Engine Error:", error);
        res.status(500).json({ message: "خطا در تولید پیشنهادات." });
    }
};

/**
 * Product-level "Customers who bought this also bought..."
 */
const getProductRecommendations = async (req, res) => {
    try {
        const { productId } = req.params;
        const parsedId = parseInt(productId);

        const product = await prisma.product.findUnique({
            where: { id: parsedId },
            select: { category: true, title: true }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

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

        // 2. Count co-purchases
        const coPurchaseCount = new Map();
        buyers.forEach(order => {
            order.items.forEach(item => {
                if (item.productId) {
                    coPurchaseCount.set(
                        item.productId,
                        (coPurchaseCount.get(item.productId) || 0) + 1
                    );
                }
            });
        });

        // 3. If few co-purchases, add category-level recommendations
        let recommendedIds = Array.from(coPurchaseCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([id]) => id);

        // 4. Fallback: same category products ordered by popularity
        if (recommendedIds.length < 4) {
            const existingIds = new Set(recommendedIds);
            existingIds.add(parsedId);

            const fallback = await prisma.product.findMany({
                where: {
                    status: 'APPROVED',
                    category: product.category,
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
                take: 6 - recommendedIds.length
            });

            recommendedIds = [...recommendedIds, ...fallback.map(f => f.id)];
        }

        if (recommendedIds.length === 0) {
            return res.status(200).json([]);
        }

        // 5. Fetch full product data
        const recommendations = await prisma.product.findMany({
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

        // 6. Sort and format
        const result = recommendations.map(({ _count, ...p }) => {
            const coCount = coPurchaseCount.get(p.id) || 0;
            let reason = 'هم‌دسته و مرتبط';
            if (coCount >= 2) reason = 'بسیاری از خریداران این کالا، این را هم خریدند';
            else if (coCount === 1) reason = 'خریداران این محصول، این را هم خریدند';

            return {
                ...p,
                purchaseCount: _count.orderItems,
                recommendationReason: reason
            };
        });

        // Sort: co-purchased first
        result.sort((a, b) => {
            const coA = coPurchaseCount.get(a.id) || 0;
            const coB = coPurchaseCount.get(b.id) || 0;
            if (coB !== coA) return coB - coA;
            return b.averageRating - a.averageRating;
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("Product Recommendation Error:", error);
        res.status(500).json({ message: "خطا در دریافت پیشنهادات محصول." });
    }
};

module.exports = { getRecommendations, getProductRecommendations };
