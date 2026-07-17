const express = require('express');
const router = express.Router();
const { getBuyerDashboard, downloadSecureProduct, accessDigiCourseProduct } = require('../controllers/buyerController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/dashboard', getBuyerDashboard);
router.get('/download/:licenseKey', downloadSecureProduct);
router.get('/digicourse/:productId', accessDigiCourseProduct);

module.exports = router;