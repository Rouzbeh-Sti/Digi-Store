const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get Buyer purchased items and decrypted software activation keys
const getBuyerDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;

        const purchases = await prisma.orderItem.findMany({
            where: {
                order: { buyerId: userId, status: 'COMPLETED' }
            },
            include: {
                product: { select: { id: true, title: true, description: true } },
                license: { select: { licenseKey: true, isValid: true, createdAt: true } }
            },
            orderBy: { order: { createdAt: 'desc' } }
        });

        res.status(200).json(purchases);
    } catch (error) {
        console.error("Buyer Dashboard Controller Error:", error);
        res.status(500).json({ message: "Failed to load buyer customized history workspace." });
    }
};

// Handle verified downpipe streams for books and protected assets
const downloadSecureProduct = async (req, res) => {
    try {
        const { licenseKey } = req.params;
        const userId = req.user.userId;

        const license = await prisma.license.findUnique({
            where: { licenseKey },
            include: { orderItem: { include: { order: true, product: true } } }
        });

        if (!license) {
            return res.status(404).json({ message: "Requested secure license registry not found." });
        }

        if (license.orderItem.order.buyerId !== userId) {
            return res.status(403).json({ message: "Access denied. Resource asset ownership mismatch." });
        }

        if (!license.isValid) {
            return res.status(403).json({ message: "This active license hash code is no longer valid." });
        }

        const secureDownloadUrl = `https://storage.your-ecommerce-app.com/downloads/${license.orderItem.product.id}?token=${license.licenseKey}`;

        res.status(200).json({
            message: "Download pipeline stream authorized successfully.",
            fileName: `${license.orderItem.product.title}.zip`,
            downloadUrl: secureDownloadUrl
        });
    } catch (error) {
        console.error("Secure download dispatcher breakdown:", error);
        res.status(500).json({ message: "Failed to process target safe download token generation." });
    }
};

// accessing digi-course products with active subscription
const accessDigiCourseProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;

        // 1. check if user has an active subscription
        const activeSub = await prisma.userSubscription.findFirst({
            where: {
                userId: userId,
                isActive: true,
                endDate: { gte: new Date() }
            }
        });

        if (!activeSub) {
            return res.status(403).json({ message: "شما اشتراک فعال دیجی‌کورس ندارید. لطفاً اشتراک تهیه کنید." });
        }

        // 2. check product and its allowSubscription status
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) }
        });

        if (!product) {
            return res.status(404).json({ message: "محصول مورد نظر یافت نشد." });
        }

        if (!product.allowSubscription) {
            return res.status(403).json({ message: "این محصول شامل پلن دیجی‌کورس نمی‌باشد و باید جداگانه خریداری شود." });
        }

        res.status(200).json({
            message: "دسترسی از طریق دیجی‌کورس تایید شد.",
            fileName: `${product.title}.zip`,
            downloadUrl: product.fileUrl || `https://storage.your-ecommerce-app.com/digicourse/${product.id}`
        });

    } catch (error) {
        console.error("DigiCourse Access Error:", error);
        res.status(500).json({ message: "خطا در بررسی دسترسی اشتراک." });
    }
};

module.exports = { getBuyerDashboard, downloadSecureProduct, accessDigiCourseProduct };