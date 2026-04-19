import express from 'express';
import {
  getAllUsers,
  deleteUser,
  getUserDetails,
  getAllHoroscopes,
  createHoroscope,
  updateHoroscope,
  deleteHoroscope,
  getDashboardStats,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Apply middleware to all admin routes
router.use(protect, adminOnly);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.delete('/users/:id', deleteUser);

// Horoscope management
router.get('/horoscopes', getAllHoroscopes);
router.post('/horoscopes', createHoroscope);
router.put('/horoscopes/:id', updateHoroscope);
router.delete('/horoscopes/:id', deleteHoroscope);

// Dashboard
router.get('/stats', getDashboardStats);

export default router;
