const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all products (Catalog for Buyers)
const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                seller: {
                    select: { fullName: true } // Include seller's name for the UI
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products." });
    }
};

// Create a new product (For Sellers)
const createProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const sellerId = req.user.userId; // Extracted from verifyToken middleware

        if (!title || price === undefined) {
            return res.status(400).json({ message: "Title and price are required." });
        }

        const newProduct = await prisma.product.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                sellerId
            }
        });

        res.status(201).json({ message: "Product created successfully!", product: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Failed to create product." });
    }
};

module.exports = { getAllProducts, createProduct };