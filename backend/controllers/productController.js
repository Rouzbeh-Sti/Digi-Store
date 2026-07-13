const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Public Action: Fetch marketplace approved item indexation structure
const getAllPublicProducts = async (req, res) => {
    try {
        const { search } = req.query;
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
                seller: { select: { fullName: true, storeName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("Get All Public Products Catalog Error:", error);
        res.status(500).json({ message: "Failed to fetch marketplace catalog database logs." });
    }
};

module.exports = { getAllPublicProducts };