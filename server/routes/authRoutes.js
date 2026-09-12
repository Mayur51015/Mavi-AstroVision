import express from 'express';
import { register, login, getCurrentUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Local auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', (req, res, next) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      console.error('❌ Google OAuth error:', err || info);
      const msg = encodeURIComponent(err?.message || info?.message || 'Authentication failed');
      return res.redirect(`${clientUrl}/login?error=${msg}`);
    }

    try {
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
      return res.redirect(`${clientUrl}/login?token=${token}`);
    } catch (tokenErr) {
      console.error('❌ Token generation error:', tokenErr);
      return res.redirect(`${clientUrl}/login?error=token_generation_failed`);
    }
  })(req, res, next);
});

export default router;
