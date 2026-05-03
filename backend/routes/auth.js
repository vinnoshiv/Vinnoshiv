const express = require('express');
const router = express.Router();
const { adminLogin, adminVerify } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', adminLogin);
router.get('/verify', protect, adminVerify);

module.exports = router;
