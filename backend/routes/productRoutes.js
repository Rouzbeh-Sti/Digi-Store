const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, getProductById, getSellerProducts } = require('../controllers/productController');
const { verifyToken, isSeller } = require('../middleware/authMiddleware');

// Protected route: Get products created by the logged in seller
// This must be before /:id to prevent "seller" being treated as a product ID
router.get('/seller', verifyToken, isSeller, getSellerProducts);

// Public route: Anyone can view the full catalog and search
router.get('/', getAllProducts);

// Protected route: Only authenticated sellers can create new products
router.post('/', verifyToken, isSeller, createProduct);

// Public route: Get details of a single product
router.get('/:id', getProductById);

module.exports = router;