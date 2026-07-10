const jwt = require('jsonwebtoken');

// Verifies if the user has a valid JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains { userId, role } from authController
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

// Verifies if the authenticated user is a seller
const isSeller = (req, res, next) => {
    if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Access denied. This action requires Seller privileges." });
    }
    next();
};

module.exports = { verifyToken, isSeller };