const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Authenticates JWT tokens and instantly enforces database-level ban restrictions
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. Token missing." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        
        // Immediate live database checking to neutralize active banned sessions
        const freshUser = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { isBanned: true }
        });

        if (!freshUser || freshUser.isBanned) {
            return res.status(403).json({ message: "Access denied. Your account has been suspended by administration." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

// Validates if the authenticated user possesses the SELLER role clearance
const isSeller = (req, res, next) => {
    if (!req.user || req.user.role !== 'SELLER') {
        return res.status(403).json({ message: "Access denied. Seller privileges required." });
    }
    next();
};

// Validates if the authenticated user possesses the ADMIN role clearance
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Access denied. Administrative privileges required." });
    }
    next();
};

module.exports = { verifyToken, isSeller, isAdmin };