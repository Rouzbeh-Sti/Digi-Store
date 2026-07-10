const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected routes: Only logged-in users can purchase and view their orders
router.post('/checkout', verifyToken, createOrder);
router.get('/my-orders', verifyToken, getMyOrders);

module.exports = router;