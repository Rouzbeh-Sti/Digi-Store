const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const axios = require('axios');
const prisma = new PrismaClient();

// Use Zarinpal Sandbox for GitHub portfolio and testing
const ZARINPAL_MERCHANT_ID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
const ZARINPAL_REQUEST_URL = "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
const ZARINPAL_VERIFY_URL = "https://sandbox.zarinpal.com/pg/v4/payment/verify.json";
const ZARINPAL_STARTPAY_URL = "https://sandbox.zarinpal.com/pg/StartPay/";

const generateLicenseKey = (productTitle) => {
    const prefix = productTitle.substring(0, 4).toUpperCase().padEnd(4, 'X');
    const randomHex = crypto.randomBytes(6).toString('hex').toUpperCase();
    return `${prefix}-${randomHex.slice(0, 4)}-${randomHex.slice(4, 8)}-${randomHex.slice(8, 12)}`;
};

// Step 1: Request Payment
const requestPayment = async (req, res) => {
    try {
        const { productIds } = req.body; 
        const buyerId = req.user.userId;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ message: "سبد خرید خالی است." });
        }

        const products = await prisma.product.findMany({
            where: { id: { in: productIds.map(id => parseInt(id)) } }
        });

        if (products.length !== productIds.length) {
            return res.status(404).json({ message: "برخی محصولات یافت نشدند." });
        }

        const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

        // 1. Create Order with PENDING status
        const order = await prisma.order.create({
            data: {
                buyerId: buyerId,
                totalAmount: totalAmount,
                status: 'PENDING',
                items: {
                    create: products.map(p => ({ productId: p.id, price: p.price }))
                }
            }
        });

        // 2. Request Authority from Zarinpal Sandbox
        const zarinpalRes = await axios.post(ZARINPAL_REQUEST_URL, {
            merchant_id: ZARINPAL_MERCHANT_ID,
            amount: totalAmount * 10, // Zarinpal works with Rial
            description: `پرداخت سفارش ${order.id} در دیجی‌استور`,
            callback_url: `http://localhost:5000/api/orders/verify`
        });

        if (zarinpalRes.data.data.code === 100) {
            const authority = zarinpalRes.data.data.authority;

            // 3. Save Transaction logically
            await prisma.transaction.create({
                data: {
                    orderId: order.id,
                    amount: totalAmount,
                    paymentMethod: 'ZARINPAL',
                    status: 'PENDING',
                    authority: authority
                }
            });

            // Return payment URL to frontend
            return res.status(200).json({ 
                paymentUrl: `${ZARINPAL_STARTPAY_URL}${authority}` 
            });
        } else {
            return res.status(500).json({ message: "خطا در اتصال به درگاه پرداخت." });
        }
    } catch (error) {
        console.error("Payment Request Error:", error);
        res.status(500).json({ message: "خطای سرور در ایجاد تراکنش." });
    }
};

// Step 3: Verify Payment (Callback from Bank)
const verifyPayment = async (req, res) => {
    try {
        const { Authority, Status } = req.query;

        if (!Authority) {
            return res.redirect('http://localhost:5173/payment-result?status=failed');
        }

        const transaction = await prisma.transaction.findUnique({
            where: { authority: Authority },
            include: { order: { include: { items: { include: { product: true } } } } }
        });

        if (!transaction || transaction.status === 'SUCCESS') {
            return res.redirect('http://localhost:5173/payment-result?status=invalid');
        }

        if (Status !== 'OK') {
            await prisma.transaction.update({ where: { id: transaction.id }, data: { status: 'FAILED' }});
            await prisma.order.update({ where: { id: transaction.orderId }, data: { status: 'FAILED' }});
            return res.redirect('http://localhost:5173/payment-result?status=failed');
        }

        const verifyRes = await axios.post(ZARINPAL_VERIFY_URL, {
            merchant_id: ZARINPAL_MERCHANT_ID,
            amount: transaction.amount * 10,
            authority: Authority
        });

        if (verifyRes.data.data.code === 100 || verifyRes.data.data.code === 101) {
            await prisma.$transaction(async (tx) => {
                await tx.transaction.update({ where: { id: transaction.id }, data: { status: 'SUCCESS' }});
                await tx.order.update({ where: { id: transaction.orderId }, data: { status: 'COMPLETED' }});

                for (const item of transaction.order.items) {
                    await tx.license.create({
                        data: {
                            licenseKey: generateLicenseKey(item.product.title),
                            productId: item.productId,
                            orderItemId: item.id,
                            isValid: true
                        }
                    });
                }
            });
            // Successful payment route
            return res.redirect('http://localhost:5173/payment-result?status=success');
        } else {
            await prisma.transaction.update({ where: { id: transaction.id }, data: { status: 'FAILED' }});
            await prisma.order.update({ where: { id: transaction.orderId }, data: { status: 'FAILED' }});
            return res.redirect('http://localhost:5173/payment-result?status=failed');
        }

    } catch (error) {
        console.error("Verification Error:", error);
        return res.redirect('http://localhost:5173/payment-result?status=error');
    }
};

const getMyOrders = async (req, res) => {
    try {
        const buyerId = req.user.userId;
        const orders = await prisma.order.findMany({
            where: { buyerId: buyerId },
            include: {
                items: { include: { product: true, license: true } },
                transaction: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders." });
    }
};

module.exports = { requestPayment, verifyPayment, getMyOrders };