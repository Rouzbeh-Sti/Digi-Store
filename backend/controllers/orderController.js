const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

const generateLicenseKey = (productTitle) => {
    const prefix = productTitle.substring(0, 4).toUpperCase().padEnd(4, 'X');
    const randomHex = crypto.randomBytes(6).toString('hex').toUpperCase();
    return `${prefix}-${randomHex.slice(0, 4)}-${randomHex.slice(4, 8)}-${randomHex.slice(8, 12)}`;
};

const createOrder = async (req, res) => {
    try {
        const { productIds, paymentMethod } = req.body; 
        const buyerId = req.user.userId;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ message: "سبد خرید شما خالی است." });
        }

        const products = await prisma.product.findMany({
            where: { id: { in: productIds.map(id => parseInt(id)) } }
        });

        if (products.length !== productIds.length) {
            return res.status(404).json({ message: "برخی از محصولات در پایگاه داده یافت نشدند." });
        }

        const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

        // Execute as a single atomic database transaction
        const result = await prisma.$transaction(async (tx) => {
            
            const order = await tx.order.create({
                data: {
                    buyerId: buyerId,
                    totalAmount: totalAmount,
                    status: 'COMPLETED',
                }
            });

            const transaction = await tx.transaction.create({
                data: {
                    orderId: order.id,
                    amount: totalAmount,
                    paymentMethod: paymentMethod || 'CREDIT_CARD',
                    status: 'SUCCESS'
                }
            });

            const processedItems = [];
            for (const product of products) {
                const orderItem = await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: product.id,
                        price: product.price
                    }
                });

                const license = await tx.license.create({
                    data: {
                        licenseKey: generateLicenseKey(product.title),
                        productId: product.id,
                        orderItemId: orderItem.id,
                        isValid: true
                    }
                });
                
                processedItems.push({ orderItem, license });
            }

            return { order, transaction, processedItems };
        });

        res.status(201).json({
            message: "پرداخت موفقیت‌آمیز بود! لایسنس‌های شما صادر شد.",
            order: result.order,
            transaction: result.transaction
        });

    } catch (error) {
        console.error("Checkout Error:", error);
        res.status(500).json({ message: "خطا در پردازش سبد خرید و صدور لایسنس." });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const buyerId = req.user.userId;
        const orders = await prisma.order.findMany({
            where: { buyerId: buyerId },
            include: {
                items: {
                    include: {
                        product: true,
                        license: true
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