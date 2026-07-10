const express = require('express');
const router = express.Router();
const { getDashboard, downloadProduct } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected routes: Only logged-in users can view their panel and download files
router.get('/', verifyToken, getDashboard);
router.get('/download/:licenseKey', verifyToken, downloadProduct);

module.exports = router;