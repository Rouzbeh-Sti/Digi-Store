const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch marketplace approved item indexation structure with limit support
const getAllPublicProducts = async (req, res) => {
    try {
        const { search, limit } = req.query; // Extract limit from query
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
            orderBy: { createdAt: 'desc' },
            ...(limit && { take: parseInt(limit) }) // Apply strict limit to DB query if provided
        });
        res.status(200).json(products);
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
                seller: { select: { fullName: true, storeName: true } }
            }
        });

        if (!product) {
            return res.status(404).json({ message: "محصول مورد نظر یافت نشد." });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Get Product By ID Error:", error);
        res.status(500).json({ message: "خطا در دریافت اطلاعات محصول از پایگاه داده." });
    }
};

module.exports = { getAllPublicProducts, getProductById };