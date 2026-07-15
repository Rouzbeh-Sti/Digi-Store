const express = require('express');
const router = express.Router();
const { createProduct, getSellerAnalytics, updateProduct } = require('../controllers/sellerController');
const { verifyToken, isSeller } = require('../middleware/authMiddleware');

router.use(verifyToken, isSeller);

router.post('/product', createProduct);
router.get('/analytics', getSellerAnalytics);
router.put('/product-edit', updateProduct);

module.exports = router;