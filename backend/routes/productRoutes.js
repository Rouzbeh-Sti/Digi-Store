const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts } = require('../controllers/productController');
const { getSellerAnalytics, updateSellerProduct } = require('../controllers/sellerController');
const { verifyToken, isSeller } = require('../middleware/authMiddleware');

router.get('/', getAllProducts); 
router.post('/', verifyToken, isSeller, createProduct); 
router.get('/seller/analytics', verifyToken, isSeller, getSellerAnalytics);
router.put('/seller/product-edit', verifyToken, isSeller, updateSellerProduct);

module.exports = router;