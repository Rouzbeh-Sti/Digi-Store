const express = require('express');
const router = express.Router();
const { getPendingProducts, verifyProduct, getAllUsers, toggleUserBan, updateUserRole, getAllTransactions } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken, isAdmin);

router.get('/pending-products', getPendingProducts);
router.post('/verify-product', verifyProduct);
router.get('/users', getAllUsers);
router.post('/user-ban', toggleUserBan);
router.post('/user-role', updateUserRole);
router.get('/transactions', getAllTransactions);

module.exports = router;