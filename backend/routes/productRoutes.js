const express = require('express');
const router = express.Router();
const { getAllPublicProducts, getProductById } = require('../controllers/productController');

// Map the endpoints
router.get('/', getAllPublicProducts);
router.get('/:id', getProductById); // Added the missing route

module.exports = router;