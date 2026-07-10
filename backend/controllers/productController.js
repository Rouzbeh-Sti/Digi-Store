const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all products (Catalog for Buyers) - Now with Search & Limit support
const getAllProducts = async (req, res) => {
    try {
        const { search, limit } = req.query;

        let queryOptions = {
            include: {
                seller: {
                    select: { fullName: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        };

        // If a search query is provided, ask the database to filter results
        if (search) {
            queryOptions.where = {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            };
        }

        // If a limit is provided, restrict the number of returned records
        if (limit) {
            queryOptions.take = parseInt(limit);
        }

        const products = await prisma.product.findMany(queryOptions);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products." });
    }
};

// Handle the creation of a new product by an authenticated seller
const createProduct = async (req, res) => {
    try {
        // Extract category along with other fields from the request body
        const { title, description, price, category } = req.body;
        const sellerId = req.user.userId;

        if (!title || price === undefined) {
            return res.status(400).json({ message: "Title and price are required." });
        }

        const newProduct = await prisma.product.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                category: category || "General", // Fallback to 'General' if no category is provided
                sellerId
            }
        });

        res.status(201).json({ message: "Product created successfully!", product: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Failed to create product." });
    }
};

// Fetch a single product by its ID to display on the product details page
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                seller: {
                    select: { fullName: true }
                }
            }
        });

        // Return a 404 status if the product does not exist
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Failed to fetch product details." });
    }
};

// Fetch products created by the currently logged in seller
const getSellerProducts = async (req, res) => {
    try {
        const sellerId = req.user.userId;
        const products = await prisma.product.findMany({
            where: { sellerId: sellerId },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching seller products:", error);
        res.status(500).json({ message: "Failed to fetch seller products." });
    }
};

// Make sure to export the new function at the bottom of the file
// module.exports = { getAllProducts, createProduct, getProductById, getSellerProducts };

module.exports = { getAllProducts, createProduct, getProductById, getSellerProducts };