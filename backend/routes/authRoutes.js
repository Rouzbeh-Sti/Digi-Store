const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Map endpoints to controller functions
router.post('/register', registerUser);
router.post('/login', loginUser);

// Export the router to be used in server.js
module.exports = router;