const express = require('express');
const { register, login, logout, getMe, updateDetails, googleCallback } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    googleCallback
);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

module.exports = router;
