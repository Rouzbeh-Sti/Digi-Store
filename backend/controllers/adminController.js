const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getPendingProducts = async (req, res) => {
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

module.exports = { getPendingProducts, verifyProduct, getAllUsers, toggleUserBan, updateUserRole, getAllTransactions };