const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch marketplace approved item indexation structure with limit support
const getAllPublicProducts = async (req, res) => {
    try {
        const { search, limit } = req.query;
        const products = await prisma.product.findMany({
            where: {
                status: 'APPROVED',
                ...(search && {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } }
                    ]
                })
            },
            include: {
                seller: { select: { fullName: true, storeName: true } },
                // Count only OrderItems that belong to a COMPLETED (paid) order,
                // so pending/failed carts never inflate the "students/buyers" number
                _count: {
                    select: {
                        orderItems: { where: { order: { status: 'COMPLETED' } } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            ...(limit && { take: parseInt(limit) })
        });

        // Flatten _count.orderItems into a simple purchaseCount field for the frontend
        const productsWithPurchaseCount = products.map(({ _count, ...product }) => ({
            ...product,
            purchaseCount: _count.orderItems
        }));

        res.status(200).json(productsWithPurchaseCount);
    } catch (error) {
        console.error("Get All Public Products Catalog Error:", error);
        res.status(500).json({ message: "Failed to fetch marketplace catalog database logs." });
    }
};

// Fetch a single product by its ID for the product details page
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                seller: { select: { fullName: true, storeName: true } },
                _count: {
                    select: {
                        orderItems: { where: { order: { status: 'COMPLETED' } } }
                    }
                }
            }
        });

        if (!product) {
            return res.status(404).json({ message: "محصول مورد نظر یافت نشد." });
        }

        const { _count, ...productData } = product;
        res.status(200).json({ ...productData, purchaseCount: _count.orderItems });
    } catch (error) {
        console.error("Get Product By ID Error:", error);
        res.status(500).json({ message: "خطا در دریافت اطلاعات محصول از پایگاه داده." });
    }
};

// Get all verified reviews for a specific product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await prisma.review.findMany({
            where: { productId: parseInt(productId) },
            include: {
                user: { select: { fullName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Get Product Reviews Error:", error);
        res.status(500).json({ message: "Failed to fetch product reviews." });
    }
};

// Leave a rating and review for a product (Only for verified buyers)
const createProductReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.userId;

        const parsedProductId = parseInt(productId);
        const ratingVal = parseInt(rating);

        if (!ratingVal || ratingVal < 1 || ratingVal > 5) {
            return res.status(400).json({ message: "امتیاز باید عددی بین ۱ تا ۵ باشد." });
        }

        // 1. Verify if the buyer has a COMPLETED order for this specific product
        const completedOrder = await prisma.order.findFirst({
            where: {
                buyerId: userId,
                status: 'COMPLETED',
                items: {
                    some: { productId: parsedProductId }
                }
            }
        });

        if (!completedOrder) {
            return res.status(403).json({ message: "ثبت نظر فقط برای خریداران واقعی این محصول مجاز است." });
        }

        // 2. Check if user already reviewed this product (prevent duplicates)
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: parsedProductId
                }
            }
        });

        if (existingReview) {
            return res.status(400).json({ message: "شما قبلاً نظر خود را برای این محصول ثبت کرده‌اید." });
        }

        // 3. Save new review and update product metrics within a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create the review record
            const newReview = await tx.review.create({
                data: {
                    rating: ratingVal,
                    comment: comment || "",
                    userId: userId,
                    productId: parsedProductId
                }
            });

            // Calculate new rating metrics from the database
            const aggregations = await tx.review.aggregate({
                where: { productId: parsedProductId },
                _avg: { rating: true },
                _count: { id: true }
            });

            const newAverage = aggregations._avg.rating || 0.0;
            const newCount = aggregations._count.id || 0;

            // Cache metrics inside the Product record
            await tx.product.update({
                where: { id: parsedProductId },
                data: {
                    averageRating: newAverage,
                    reviewCount: newCount
                }
            });

            return newReview;
        });

        res.status(201).json({
            message: "ثبت نظر با موفقیت انجام شد.",
            review: result
        });

    } catch (error) {
        console.error("Create Product Review Error:", error);
        res.status(500).json({ message: "خطا در ثبت نظر کاربری." });
    }
};

module.exports = { 
    getAllPublicProducts, 
    getProductById,
    getProductReviews,
    createProductReview
};