const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Get Dashboard Data (Purchased Products & Licenses)
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.userId; // From verifyToken middleware

        // Fetch all successful order items for this user
        const purchases = await prisma.orderItem.findMany({
            where: {
                order: {
                    buyerId: userId,
                    status: 'COMPLETED'
                }
            },
            include: {
                product: {
                    select: { id: true, title: true, description: true }
                },
                license: {
                    select: { licenseKey: true, isValid: true, createdAt: true }
                }
            },
            orderBy: {
                order: { createdAt: 'desc' }
            }
        });

        res.status(200).json(purchases);
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Failed to load dashboard data." });
    }
};

// 2. Secure Download Endpoint
const downloadProduct = async (req, res) => {
    try {
        const { licenseKey } = req.params;
        const userId = req.user.userId;

        // Find the license and deeply include the order to verify ownership
        const license = await prisma.license.findUnique({
            where: { licenseKey },
            include: {
                orderItem: {
                    include: { order: true, product: true }
                }
            }
        });

        // Security Check 1: Does the license exist?
        if (!license) {
            return res.status(404).json({ message: "License not found." });
        }

        // Security Check 2: Does the logged-in user actually own this?
        if (license.orderItem.order.buyerId !== userId) {
            return res.status(403).json({ message: "Access denied. You do not own this license." });
        }

        // Security Check 3: Is the license still valid?
        if (!license.isValid) {
            return res.status(403).json({ message: "This license is no longer valid." });
        }

        // In a full production environment, this is where you would generate a time-limited 
        // signed URL (like AWS S3) or pipe a local file stream. We'll simulate a secure URL here.
        const secureDownloadUrl = `https://storage.your-ecommerce-app.com/downloads/${license.orderItem.product.id}?token=${license.licenseKey}`;

        res.status(200).json({
            message: "Download authorized.",
            fileName: `${license.orderItem.product.title}.zip`,
            downloadUrl: secureDownloadUrl
        });

    } catch (error) {
        console.error("Download Error:", error);
        res.status(500).json({ message: "Failed to process download request." });
    }
};

module.exports = { getDashboard, downloadProduct };