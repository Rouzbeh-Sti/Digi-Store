const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Hybrid Recommendation Engine for DigiStore
 * 
 * Scoring Algorithm:
 * 1. Content-based: Same category as user's purchases (+3 points)
 * 2. Collaborative: Co-purchase frequency with similar users (+2 per occurrence, capped at 6)
 * 3. Popularity boost: Rating >= 4.0 (+1), has reviews (+1)
 * 
 * Excludes already purchased products. Returns top 8.
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
                    include: { product: { select: { id: true, category: true } } }
                }
            }
        });

        const purchasedProductIds = new Set();
        const purchasedCategories = new Set();

        userOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.product) {
                    purchasedProductIds.add(item.product.id);
                    purchasedCategories.add(item.product.category);
                }
            });
        });

        // Fallback for new users: return top-rated products
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

        // 2. Collaborative: find users who bought same products
        const similarUsers = await prisma.order.findMany({
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
                    select: { productId: true }
                }
            }
        });

        // Count co-purchase frequency
        const coPurchaseScores = new Map();
        similarUsers.forEach(order => {
            order.items.forEach(item => {
                if (item.productId && !purchasedProductIds.has(item.productId)) {
                    coPurchaseScores.set(
                        item.productId,
                        (coPurchaseScores.get(item.productId) || 0) + 1
                    );
                }
            });
        });

        // 3. Get all eligible products
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

        // 4. Score each product
        const scoredProducts = allProducts.map(product => {
            let score = 0;
            const reasons = [];

            if (purchasedCategories.has(product.category)) {
                score += 3;
                reasons.push('دسته‌بندی مورد علاقه شما');
            }

            const coPurchaseCount = coPurchaseScores.get(product.id) || 0;
            if (coPurchaseCount > 0) {
                score += Math.min(coPurchaseCount * 2, 6);
                reasons.push('خریداران مشابه این را انتخاب کردند');
            }

            if (product.averageRating >= 4.0) {
                score += 1;
                reasons.push('امتیاز بالا');
            }

            if (product.reviewCount > 0) score += 1;

            return {
                ...product,
                purchaseCount: product._count.orderItems,
                score,
                recommendationReason: reasons[0] || 'محصول پیشنهادی'
            };
        });

        // 5. Sort by score, then rating
        scoredProducts.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.averageRating - a.averageRating;
        });

        // 6. Return top 8, clean response
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

        // Find users who bought this product
        const buyers = await prisma.order.findMany({
            where: {
                status: 'COMPLETED',
                items: { some: { productId: parsedId } }
            },
            include: {
                items: {
                    where: { productId: { not: parsedId, not: null } },
                    select: { productId: true }
                }
            }
        });

        // Count co-purchases
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

        const recommendedIds = Array.from(coPurchaseCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
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

        // Fallback: same category if insufficient co-purchase data
        if (recommendations.length < 4) {
            const product = await prisma.product.findUnique({
                where: { id: parsedId },
                select: { category: true }
            });

            if (product) {
                const existingIds = new Set(recommendations.map(r => r.id));
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
                    orderBy: { averageRating: 'desc' },
                    take: 6 - recommendations.length
                });

                recommendations = [...recommendations, ...fallback];
            }
        }

        // Sort by co-purchase frequency, add purchaseCount
        const result = recommendations.map(({ _count, ...product }) => ({
            ...product,
            purchaseCount: _count.orderItems,
            recommendationReason: 'خریداران این محصول، این‌ها را هم خریدند'
        }));

        if (recommendedIds.length > 0) {
            result.sort((a, b) => {
                const countA = coPurchaseCount.get(a.id) || 0;
                const countB = coPurchaseCount.get(b.id) || 0;
                return countB - countA;
            });
        }

        res.status(200).json(result);

    } catch (error) {
        console.error("Product Recommendation Error:", error);
        res.status(500).json({ message: "خطا در دریافت پیشنهادات محصول." });
    }
};

module.exports = { getRecommendations, getProductRecommendations };