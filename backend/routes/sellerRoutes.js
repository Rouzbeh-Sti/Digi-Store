const express = require('express');
const router = express.Router();
const { sellerCreateProduct, getSellerAnalytics, updateSellerProduct } = require('../controllers/sellerController');
const { verifyToken, isSeller } = require('../middleware/authMiddleware');

router.use(verifyToken, isSeller);

router.post('/product', sellerCreateProduct);
router.get('/analytics', getSellerAnalytics);
router.put('/product-edit', updateSellerProduct);

module.exports = router;