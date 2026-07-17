const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

const ZARINPAL_MERCHANT_ID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
const ZARINPAL_REQUEST_URL = "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
const ZARINPAL_VERIFY_URL = "https://sandbox.zarinpal.com/pg/v4/payment/verify.json";
const ZARINPAL_STARTPAY_URL = "https://sandbox.zarinpal.com/pg/StartPay/";

// Fetch all active subscription plans
const getPlans = async (req, res) => {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            where: { isActive: true }
        });
        res.status(200).json(plans);
    } catch (error) {
        console.error("Get Plans Error:", error);
        res.status(500).json({ message: "Failed to load subscription plans." });
    }
};

// Initiate subscription purchase process via Zarinpal Sandbox
const buySubscription = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user.userId;

        const plan = await prisma.subscriptionPlan.findUnique({
            where: { id: parseInt(planId) }
        });

        if (!plan || !plan.isActive) {
            return res.status(404).json({ message: "Selected subscription plan not found or inactive." });
        }

        // Create a temporary reference for tracking this gateway attempt
        const authority = "SUB-" + Math.random().toString(36).substring(2, 15).toUpperCase();

        // Integrate with Zarinpal Sandbox API
        const zarinpalRes = await axios.post(ZARINPAL_REQUEST_URL, {
            merchant_id: ZARINPAL_MERCHANT_ID,
            amount: plan.price * 10, // Convert Toman to Rial
            description: `خرید اشتراک ${plan.title} در دیجی‌استور`,
            callback_url: `http://localhost:5000/api/subscriptions/verify?authority=${authority}&userId=${userId}&planId=${plan.id}`
        });

        if (zarinpalRes.data.data.code === 100) {
            const zarinpalAuth = zarinpalRes.data.data.authority;

            // In production, you would persist this temporary transaction metadata to your DB
            return res.status(200).json({ 
                paymentUrl: `${ZARINPAL_STARTPAY_URL}${zarinpalAuth}` 
            });
        } else {
            return res.status(500).json({ message: "Failed to connect to payment gateway." });
        }

    } catch (error) {
        console.error("Buy Subscription Error:", error);
        res.status(500).json({ message: "Server error processing subscription payment." });
    }
};

// Callback from payment gateway to issue and activate subscription
const verifySubscription = async (req, res) => {
    try {
        const { authority, userId, planId, Authority, Status } = req.query;

        if (Status !== 'OK') {
            return res.redirect('http://localhost:5173/payment-result?status=failed');
        }

        const parsedUserId = parseInt(userId);
        const parsedPlanId = parseInt(planId);

        const plan = await prisma.subscriptionPlan.findUnique({
            where: { id: parsedPlanId }
        });

        if (!plan) {
            return res.redirect('http://localhost:5173/payment-result?status=error');
        }

        // Zarinpal Sandbox Verification request
        const verifyRes = await axios.post(ZARINPAL_VERIFY_URL, {
            merchant_id: ZARINPAL_MERCHANT_ID,
            amount: plan.price * 10,
            authority: Authority
        });

        if (verifyRes.data.data.code === 100 || verifyRes.data.data.code === 101) {
            const now = new Date();
            let durationDays = 30;

            if (plan.duration === 'THREE_MONTHS') durationDays = 90;
            else if (plan.duration === 'YEARLY') durationDays = 365;

            const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

            // Save active subscription schema for the buyer user
            await prisma.userSubscription.create({
                data: {
                    userId: parsedUserId,
                    subscriptionPlanId: parsedPlanId,
                    startDate: now,
                    endDate: endDate,
                    isActive: true
                }
            });

            return res.redirect('http://localhost:5173/payment-result?status=success');
        } else {
            return res.redirect('http://localhost:5173/payment-result?status=failed');
        }

    } catch (error) {
        console.error("Verify Subscription Error:", error);
        return res.redirect('http://localhost:5173/payment-result?status=error');
    }
};

// Check if current user has an active platform subscription
const checkStatus = async (req, res) => {
    try {
        const userId = req.user.userId;

        const activeSub = await prisma.userSubscription.findFirst({
            where: {
                userId: userId,
                isActive: true,
                endDate: { gte: new Date() }
            },
            include: { plan: true },
            orderBy: { endDate: 'desc' }
        });

        res.status(200).json({
            hasActiveSubscription: !!activeSub,
            subscription: activeSub
        });
    } catch (error) {
        console.error("Check Subscription Status Error:", error);
        res.status(500).json({ message: "Failed to check subscription status." });
    }
};

module.exports = { getPlans, buySubscription, verifySubscription, checkStatus };