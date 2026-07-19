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
        const { items } = req.body;
        const buyerId = req.user.userId;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "سبد خرید خالی است." });
        }

        let totalAmount = 0;
        const orderItemsData = [];

        // تفکیک محصولات از پلن‌های اشتراکی
        for (const item of items) {
            if (item.type === 'SUBSCRIPTION') {
                const plan = await prisma.subscriptionPlan.findUnique({ where: { id: parseInt(item.id) } });
                if (!plan) return res.status(404).json({ message: "پلن اشتراک یافت نشد." });
                totalAmount += plan.price;
                orderItemsData.push({ subscriptionPlanId: plan.id, price: plan.price });
            } else {
                const product = await prisma.product.findUnique({ where: { id: parseInt(item.id) } });
                if (!product) return res.status(404).json({ message: "محصول یافت نشد." });
                totalAmount += product.price;
                orderItemsData.push({ productId: product.id, price: product.price });
            }
        }

        // 1. Create Order with PENDING status
        const order = await prisma.order.create({
            data: {
                buyerId: buyerId,
                totalAmount: totalAmount,
                status: 'PENDING',
                items: {
                    create: orderItemsData
                }
            }
        });

        // 2. Request Authority from Zarinpal Sandbox
        const zarinpalRes = await axios.post(ZARINPAL_REQUEST_URL, {
            merchant_id: ZARINPAL_MERCHANT_ID,
            amount: totalAmount * 10,
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
            await prisma.transaction.update({ where: { id: transaction.id }, data: { status: 'FAILED' } });
            await prisma.order.update({ where: { id: transaction.orderId }, data: { status: 'FAILED' } });
            return res.redirect('http://localhost:5173/payment-result?status=failed');
        }

        const verifyRes = await axios.post(ZARINPAL_VERIFY_URL, {
            merchant_id: ZARINPAL_MERCHANT_ID,
            amount: transaction.amount * 10,
            authority: Authority
        });

        if (verifyRes.data.data.code === 100 || verifyRes.data.data.code === 101) {
            await prisma.$transaction(async (tx) => {
                await tx.transaction.update({ where: { id: transaction.id }, data: { status: 'SUCCESS' } });
                await tx.order.update({ where: { id: transaction.orderId }, data: { status: 'COMPLETED' } });

                for (const item of transaction.order.items) {
                    if (item.productId) {
                        // در صورتی که آیتم محصول بود، برای آن لایسنس صادر می‌شود
                        await tx.license.create({
                            data: {
                                licenseKey: generateLicenseKey(item.product.title),
                                productId: item.productId,
                                orderItemId: item.id,
                                isValid: true
                            }
                        });
                    } else if (item.subscriptionPlanId) {
                        // در صورتی که آیتم اشتراک بود، در دیتابیس به کاربر متصل می‌شود
                        const plan = await tx.subscriptionPlan.findUnique({ where: { id: item.subscriptionPlanId } });
                        if (plan) {
                            const durationDays = plan.duration === 'MONTHLY' ? 30 : plan.duration === 'THREE_MONTHS' ? 90 : 365;
                            const endDate = new Date();
                            endDate.setDate(endDate.getDate() + durationDays);

                            await tx.userSubscription.create({
                                data: {
                                    userId: transaction.order.buyerId,
                                    subscriptionPlanId: plan.id,
                                    startDate: new Date(),
                                    endDate: endDate,
                                    isActive: true
                                }
                            });
                        }
                    }
                }
            });
            return res.redirect('http://localhost:5173/payment-result?status=success');
        } else {
            await prisma.transaction.update({ where: { id: transaction.id }, data: { status: 'FAILED' } });
            await prisma.order.update({ where: { id: transaction.orderId }, data: { status: 'FAILED' } });
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
                items: { include: { product: true, license: true, subscriptionPlan: true } },
                transaction: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders." });
    }
};

const checkoutCart = async (req, res) => {
    try {
        const { items, paymentMethod } = req.body;
        const buyerId = req.user.userId;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "سبد خرید خالی است." });
        }

        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: { buyerId, totalAmount: 0, status: 'COMPLETED' }
            });

            let totalAmount = 0;

            for (const item of items) {
                if (item.type === 'SUBSCRIPTION') {
                    // پردازش خرید اشتراک
                    const plan = await tx.subscriptionPlan.findUnique({ where: { id: item.id } });
                    if (!plan) continue;
                    totalAmount += plan.price;

                    await tx.orderItem.create({
                        data: {
                            orderId: order.id,
                            subscriptionPlanId: plan.id,
                            price: plan.price
                        }
                    });

                    const durationDays = plan.duration === 'MONTHLY' ? 30 : plan.duration === 'THREE_MONTHS' ? 90 : 365;
                    const endDate = new Date();
                    endDate.setDate(endDate.getDate() + durationDays);

                    await tx.userSubscription.create({
                        data: {
                            userId: buyerId,
                            subscriptionPlanId: plan.id,
                            startDate: new Date(),
                            endDate: endDate,
                            isActive: true
                        }
                    });
                } else {
                    // پردازش خرید محصول عادی
                    const product = await tx.product.findUnique({ where: { id: item.id } });
                    if (!product) continue;
                    totalAmount += product.price;

                    const orderItem = await tx.orderItem.create({
                        data: {
                            orderId: order.id,
                            productId: product.id,
                            price: product.price
                        }
                    });

                    const crypto = require('crypto');
                    const prefix = product.title.substring(0, 4).toUpperCase().padEnd(4, 'X');
                    const randomHex = crypto.randomBytes(6).toString('hex').toUpperCase();

                    await tx.license.create({
                        data: {
                            licenseKey: `${prefix}-${randomHex.slice(0, 4)}-${randomHex.slice(4, 8)}-${randomHex.slice(8, 12)}`,
                            productId: product.id,
                            orderItemId: orderItem.id,
                            isValid: true
                        }
                    });
                }
            }

            await tx.order.update({
                where: { id: order.id },
                data: { totalAmount }
            });

            const transaction = await tx.transaction.create({
                data: {
                    orderId: order.id,
                    amount: totalAmount,
                    paymentMethod: paymentMethod || 'CREDIT_CARD',
                    status: 'SUCCESS'
                }
            });

            return { order, transaction };
        });

        res.status(201).json({ message: "خرید با موفقیت انجام شد.", order: result.order });
    } catch (error) {
        console.error("Cart Checkout Error:", error);
        res.status(500).json({ message: "خطا در پردازش سبد خرید." });
    }
};


const claimWithSubscription = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.userId;

        // ۱. بررسی وجود محصول و اینکه آیا جزو اشتراک هست یا خیر
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) }
        });

        if (!product) {
            return res.status(404).json({ message: "محصول یافت نشد." });
        }

        if (!product.allowSubscription) {
            return res.status(403).json({ message: "این دوره شامل اشتراک دیجی‌کورس نمی‌شود." });
        }

        // ۲. بررسی اینکه آیا کاربر اشتراک فعال دارد
        const activeSub = await prisma.userSubscription.findFirst({
            where: {
                userId: userId,
                isActive: true,
                endDate: { gte: new Date() }
            }
        });

        if (!activeSub) {
            return res.status(403).json({ message: "شما اشتراک فعالی برای دریافت این دوره ندارید." });
        }

        // ۳. بررسی عدم دریافت تکراری (کاربر قبلا این لایسنس را نگرفته باشد)
        const existingLicense = await prisma.license.findFirst({
            where: {
                productId: parseInt(productId),
                orderItem: {
                    order: {
                        buyerId: userId,
                        status: 'COMPLETED'
                    }
                }
            }
        });

        if (existingLicense) {
            return res.status(400).json({ message: "شما قبلاً به این دوره دسترسی پیدا کرده‌اید." });
        }

        // ۴. ایجاد سفارش با مبلغ ۰ و صدور آنی لایسنس به صورت یکپارچه
        const transactionResult = await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    buyerId: userId,
                    totalAmount: 0,
                    status: 'COMPLETED',
                    items: { // رفع باگ: اسم رابطه در دیتابیس شما items است
                        create: [{
                            productId: parseInt(productId),
                            price: 0
                        }]
                    }
                },
                include: { items: true }
            });

            const license = await tx.license.create({
                data: {
                    // استفاده از تابعی که بالای فایل خودش تعریف شده
                    licenseKey: generateLicenseKey(product.title),
                    productId: parseInt(productId),
                    orderItemId: order.items[0].id,
                    isValid: true
                }
            });

            // ایجاد رسید تراکنش برای نمایش در داشبورد (بخش تاریخچه خرید)
            await tx.transaction.create({
                data: {
                    orderId: order.id,
                    amount: 0,
                    paymentMethod: 'DIGICOURSE_SUBSCRIPTION',
                    status: 'SUCCESS'
                }
            });

            return { order, license };
        });

        res.status(200).json({
            message: "دوره با موفقیت از طریق اشتراک برای شما فعال شد.",
            license: transactionResult.license
        });

    } catch (error) {
        console.error("Claim Subscription Error:", error);
        res.status(500).json({ message: "خطای سرور در فعال‌سازی دوره." });
    }
};


module.exports = { requestPayment, verifyPayment, getMyOrders, checkoutCart, claimWithSubscription };