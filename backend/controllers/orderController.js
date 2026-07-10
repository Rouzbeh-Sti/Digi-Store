const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Process Checkout: Create Order, OrderItem, and Transaction
const createOrder = async (req, res) => {
    try {
        const { productId, paymentMethod } = req.body;
        const buyerId = req.user.userId; // Extracted from verifyToken middleware

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required." });
        }

        // 1. Verify the product exists and fetch its price
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // 2. Perform a database transaction to ensure all records are created together
        const result = await prisma.$transaction(async (tx) => {
            // Create the Order and the associated OrderItem
            const order = await tx.order.create({
                data: {
                    buyerId: buyerId,
                    totalAmount: product.price,
                    status: 'COMPLETED', // Simulating a successful payment
                    items: {
                        create: [
                            {
                                productId: product.id,
                                price: product.price
                            }
                        ]
                    }
                },
                include: {
                    items: true
                }
            });

            // Create the simulated Payment Transaction
            const transaction = await tx.transaction.create({
                data: {
                    orderId: order.id,
                    amount: product.price,
                    paymentMethod: paymentMethod || 'CREDIT_CARD',
                    status: 'SUCCESS'
                }
            });

            return { order, transaction };
        });

        res.status(201).json({
            message: "Order and payment processed successfully!",
            order: result.order,
            transaction: result.transaction
        });

    } catch (error) {
        console.error("Checkout Error:", error);
        res.status(500).json({ message: "Failed to process checkout." });
    }
};

// Get all orders for the logged-in buyer
const getMyOrders = async (req, res) => {
    try {
        const buyerId = req.user.userId;
        const orders = await prisma.order.findMany({
            where: { buyerId: buyerId },
            include: {
                items: {
                    include: { product: true }
                },
                transaction: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        res.status(500).json({ message: "Failed to fetch orders." });
    }
};

module.exports = { createOrder, getMyOrders };