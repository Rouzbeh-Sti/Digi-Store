const express = require('express');
const router = express.Router();
const { getRecommendations, getProductRecommendations } = require('../controllers/recommendationController');
const { verifyToken } = require('../middleware/authMiddleware');

// Personal recommendations for logged-in users
router.get('/', verifyToken, getRecommendations);

// Product-level recommendations (public)
router.get('/product/:productId', getProductRecommendations);

module.exports = router;