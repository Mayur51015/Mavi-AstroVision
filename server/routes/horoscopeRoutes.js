import express from 'express';
import {
  getDailyHoroscopeBySign,
  getUserHoroscope,
  getAllHoroscopes,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from '../controllers/horoscopeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/daily/:sign', optionalAuth, getDailyHoroscopeBySign);
router.get('/', optionalAuth, getAllHoroscopes);

// Protected routes
router.get('/me/:period', protect, getUserHoroscope);
router.post('/:id/favorite', protect, addToFavorites);
router.delete('/:id/favorite', protect, removeFromFavorites);
router.get('/favorites', protect, getFavorites);

export default router;
