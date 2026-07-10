const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto'); // Built-in Node.js module for secure random generation
const prisma = new PrismaClient();

// Helper function to generate a secure, unique license key (e.g., ADCC-8F9A-4B2C-1D3E)
const generateLicenseKey = (productTitle) => {
    const prefix = productTitle.substring(0, 4).toUpperCase().padEnd(4, 'X');
    const randomHex = crypto.randomBytes(6).toString('hex').toUpperCase();
    return `${prefix}-${randomHex.slice(0, 4)}-${randomHex.slice(4, 8)}-${randomHex.slice(8, 12)}`;
};

// Process Checkout: Create Order, OrderItem, Transaction, AND License
const createOrder = async (req, res) => {
    try {
        const { productId, paymentMethod } = req.body;
        const buyerId = req.user.userId;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required." });
        }

        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Use Prisma Transaction to ensure all or nothing is saved
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Order and OrderItem
            const order = await tx.order.create({
                data: {
                    buyerId: buyerId,
                    totalAmount: product.price,
                    status: 'COMPLETED',
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
                    items: true // Include items to get the OrderItem ID
                }
            });

            const orderItem = order.items[0]; // Assuming single-item checkout for now

            // 2. Create the Payment Transaction
            const transaction = await tx.transaction.create({
                data: {
                    orderId: order.id,
                    amount: product.price,
                    paymentMethod: paymentMethod || 'CREDIT_CARD',
                    status: 'SUCCESS'
                }
            });

            // 3. GENERATE LICENSE
            const license = await tx.license.create({
                data: {
                    licenseKey: generateLicenseKey(product.title),
                    productId: product.id,
                    orderItemId: orderItem.id,
                    isValid: true
                }
            });

            return { order, transaction, license };
        });

        res.status(201).json({
            message: "Purchase successful! License generated.",
            order: result.order,
            transaction: result.transaction,
            license: result.license
        });

    } catch (error) {
        console.error("Checkout Error:", error);
        res.status(500).json({ message: "Failed to process checkout and generate license." });
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
                    include: {
                        product: true,
                        license: true // Include the license so the frontend can display it
                    }
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