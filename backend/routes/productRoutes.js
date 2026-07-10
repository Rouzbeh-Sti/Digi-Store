const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct } = require('../controllers/productController');
const { verifyToken, isSeller } = require('../middleware/authMiddleware');

// Public route: Anyone can view the catalog
router.get('/', getAllProducts);

// Protected route: Only authenticated sellers can create products
router.post('/', verifyToken, isSeller, createProduct);

module.exports = router;