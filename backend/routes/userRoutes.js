const express = require('express');
const router = express.Router();
const { updateProfile, changePassword } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(verifyToken);

router.put('/profile', updateProfile);
router.put('/password', changePassword);

module.exports = router;