const express = require('express');
const router = express.Router();
const { getPlans, buySubscription, verifySubscription, checkStatus } = require('../controllers/subscriptionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/plans', getPlans);
router.get('/verify', verifySubscription);

router.post('/buy', verifyToken, buySubscription);
router.get('/status', verifyToken, checkStatus);

module.exports = router;