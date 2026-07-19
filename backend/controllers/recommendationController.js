const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Get the user's completed purchases
        const userOrders = await prisma.orderItem.findMany({
            where: {
                order: { buyerId: userId, status: 'COMPLETED' },
                productId: { not: null }
            },
            include: { product: true }
        });

        const purchasedProductIds = userOrders.map(item => item.productId);

        // COLD START: If the user has never bought anything, return the absolute highest-rated products
        if (purchasedProductIds.length === 0) {
            const fallback = await getTopRatedProducts([], 8);
            return res.status(200).json(fallback);
        }

        // 2. Calculate the user's favorite categories based on purchase frequency
        const categoryCounts = {};
        userOrders.forEach(item => {
            const cat = item.product.category;
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        const favoriteCategories = Object.keys(categoryCounts).sort(
            (a, b) => categoryCounts[b] - categoryCounts[a]
        );

        // 3. Fetch top-rated recommendations strictly from their favorite categories
        let recommendations = await prisma.product.findMany({
            where: {
                status: 'APPROVED',
                id: { notIn: purchasedProductIds },
                category: { in: favoriteCategories }
            },
            include: {
                seller: { select: { fullName: true, storeName: true } },
                _count: { select: { orderItems: { where: { order: { status: 'COMPLETED' } } } } }
            },
            orderBy: [
                { averageRating: 'desc' },
                { reviewCount: 'desc' }
            ],
            take: 8
        });

        // 4. Pad the array with general popular products if their favorite categories are exhausted
        if (recommendations.length < 8) {
            const currentRecIds = recommendations.map(r => r.id);
            const excludeIds = [...purchasedProductIds, ...currentRecIds];
            const padding = await getTopRatedProducts(excludeIds, 8 - recommendations.length);
            recommendations = [...recommendations, ...padding];
        }

        // 5. Format the output to match frontend expectations
        const formattedRecs = recommendations.map(({ _count, ...product }) => ({
            ...product,
            purchaseCount: _count.orderItems,
            recommendationReason: favoriteCategories.includes(product.category)
                ? `پیشنهاد بر اساس خریدهای شما در دسته ${getCategoryName(product.category)}`
                : 'محبوب‌ترین‌های بازارچه'
        }));

        res.status(200).json(formattedRecs);

    } catch (error) {
        console.error("Simple Recommendation Engine Error:", error);
        res.status(500).json({ message: "خطا در تولید پیشنهادات." });
    }
};

const getProductRecommendations = async (req, res) => {
    try {
        const parsedId = parseInt(req.params.productId);

        const sourceProduct = await prisma.product.findUnique({
            where: { id: parsedId },
            select: { category: true }
        });

        if (!sourceProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Simply recommend the highest-rated products from the EXACT same category
        const recommendations = await prisma.product.findMany({
            where: {
                status: 'APPROVED',
                id: { not: parsedId },
                category: sourceProduct.category
            },
            include: {
                seller: { select: { fullName: true, storeName: true } },
                _count: { select: { orderItems: { where: { order: { status: 'COMPLETED' } } } } }
            },
            orderBy: [
                { averageRating: 'desc' },
                { reviewCount: 'desc' }
            ],
            take: 6
        });

        const formattedRecs = recommendations.map(({ _count, ...product }) => ({
            ...product,
            purchaseCount: _count.orderItems,
            recommendationReason: 'محصولات مشابه در این دسته‌بندی'
        }));

        res.status(200).json(formattedRecs);

    } catch (error) {
        console.error("Product Recommendation Error:", error);
        res.status(500).json({ message: "خطا در دریافت پیشنهادات محصول." });
    }
};

// --- Utilities ---

async function getTopRatedProducts(excludeIds, limit) {
    return await prisma.product.findMany({
        where: {
            status: 'APPROVED',
            id: { notIn: excludeIds }
        },
        include: {
            seller: { select: { fullName: true, storeName: true } },
            _count: { select: { orderItems: { where: { order: { status: 'COMPLETED' } } } } }
        },
        orderBy: [
            { averageRating: 'desc' },
            { reviewCount: 'desc' }
        ],
        take: limit
    });
}

function getCategoryName(category) {
    const map = {
        'Course': 'دوره‌های آموزشی',
        'Book': 'کتاب‌ها',
        'License': 'لایسنس‌ها'
    };
    return map[category] || category;
}

module.exports = { getRecommendations, getProductRecommendations };