import express from 'express';
import {
  getProfile,
  updateProfile,
  addBirthDetails,
  changePassword,
  updatePreferences,
  deleteMyAccount,
  getUserFavorites,
  toggleFavorite,
  getUserHistory,
  getAllUsers,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// User profile routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/birth-details', protect, addBirthDetails);
router.put('/change-password', protect, changePassword);
router.put('/preferences', protect, updatePreferences);
router.get('/favorites', protect, getUserFavorites);
router.post('/favorites/toggle', protect, toggleFavorite);
router.get('/history', protect, getUserHistory);
router.delete('/me', protect, deleteMyAccount);

// Admin routes
router.get('/', protect, adminOnly, getAllUsers);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;
