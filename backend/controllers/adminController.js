const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch all products with seller details for the admin review panel
const getAdminProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                seller: { select: { id: true, fullName: true, storeName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("Admin Get Products Error:", error);
        res.status(500).json({ message: "Failed to fetch products registry." });
    }
};

// Handle product approval or rejection status updates
const verifyProduct = async (req, res) => {
    try {
        const { productId, status } = req.body;

        if (!productId || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            return res.status(400).json({ message: "Invalid product ID or status value." });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(productId) },
            data: { status: status }
        });

        res.status(200).json({ message: "Product status successfully modified.", product: updatedProduct });
    } catch (error) {
        console.error("Admin Verify Product Error:", error);
        res.status(500).json({ message: "Failed to update product verification status." });
    }
};

// Retrieve all registered platform users for admin controls
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, fullName: true, role: true, storeName: true, isBanned: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("Admin Get Users Error:", error);
        res.status(500).json({ message: "Failed to fetch users registry." });
    }
};

// Toggle suspension and ban restriction state on any user account
const toggleUserBan = async (req, res) => {
    try {
        const { userId, isBanned } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { isBanned: Boolean(isBanned) }
        });

        res.status(200).json({ message: "User account restriction status updated successfully.", user: updatedUser });
    } catch (error) {
        console.error("Admin Toggle Ban Error:", error);
        res.status(500).json({ message: "Failed to apply restriction on user account." });
    }
};

// Mutate and update user roles globally within the platform system
const updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;

        if (!['BUYER', 'SELLER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ message: "Invalid role value." });
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { role }
        });

        res.status(200).json({ message: "User access authorization role modified.", user: updatedUser });
    } catch (error) {
        console.error("Admin Shift Role Error:", error);
        res.status(500).json({ message: "Failed to modify user access role structure." });
    }
};

// Fetch comprehensive financial transaction logs across the shop system
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            include: {
                order: { include: { buyer: { select: { fullName: true, email: true } } } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Admin Get Transactions Error:", error);
        res.status(500).json({ message: "Failed to fetch transaction logs." });
    }
};

// fetch all subscription plans for admin management and overview
const getSubscriptionPlans = async (req, res) => {
    try {
        const plans = await prisma.subscriptionPlan.findMany({ orderBy: { id: 'asc' } });
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: "خطا در دریافت پلن‌ها." });
    }
};

// Update price and active status of a subscription plan for admin control
const updateSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { price, isActive } = req.body;

        const updatedPlan = await prisma.subscriptionPlan.update({
            where: { id: parseInt(id) },
            data: {
                price: parseFloat(price),
                isActive: Boolean(isActive)
            }
        });
        res.status(200).json({ message: "پلن با موفقیت بروزرسانی شد.", plan: updatedPlan });
    } catch (error) {
        res.status(500).json({ message: "خطا در بروزرسانی پلن." });
    }
};


module.exports = {
    getAdminProducts,
    verifyProduct,
    getAllUsers,
    toggleUserBan,
    updateUserRole,
    getAllTransactions,
    getSubscriptionPlans,
    updateSubscriptionPlan
};