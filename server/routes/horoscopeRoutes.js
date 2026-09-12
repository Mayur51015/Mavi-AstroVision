import express from 'express';
import {
  getHoroscopeBySignAndPeriod,
  getDailyHoroscopeBySign,
  getUserHoroscope,
  getAllHoroscopes,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from '../controllers/horoscopeController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Specific routes first
router.get('/favorites', protect, getFavorites);
router.get('/me', protect, getUserHoroscope);
router.get('/me/:period', protect, getUserHoroscope);
router.get('/daily/:sign', optionalAuth, getDailyHoroscopeBySign);
router.get('/:sign/:period', optionalAuth, getHoroscopeBySignAndPeriod);
router.get('/', optionalAuth, getAllHoroscopes);

// Action routes
router.post('/:id/favorite', protect, addToFavorites);
router.delete('/:id/favorite', protect, removeFromFavorites);

export default router;
