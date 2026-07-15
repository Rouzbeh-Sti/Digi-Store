const express = require('express');
const router = express.Router();
const { requestPayment, verifyPayment, getMyOrders } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected route: Initiating payment requires login
router.post('/request', verifyToken, requestPayment);

// Public route: Zarinpal redirects the user here, no auth token available
router.get('/verify', verifyPayment);

// Protected route: Viewing orders requires login
router.get('/my-orders', verifyToken, getMyOrders);

module.exports = router;