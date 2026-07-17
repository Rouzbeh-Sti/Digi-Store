const express = require('express');
const router = express.Router();
const { 
    getAllPublicProducts, 
    getProductById, 
    getProductReviews, 
    createProductReview 
} = require('../controllers/productController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public route to fetch all products
router.get('/', getAllPublicProducts);

// Public route to fetch a single product details
router.get('/:id', getProductById);

// Public route to get reviews of a specific product
router.get('/:productId/reviews', getProductReviews);

// Protected route to write a review (requires valid token)
router.post('/:productId/reviews', verifyToken, createProductReview);

module.exports = router;