const express = require('express');
const router = express.Router();
const { getAllPublicProducts } = require('../controllers/productController');

router.get('/', getAllPublicProducts);

module.exports = router;