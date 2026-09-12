import express from 'express';
import { getQuickSignCompatibility, calculateSynastry } from '../controllers/compatibilityController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signs', getQuickSignCompatibility);
router.post('/synastry', optionalAuth, calculateSynastry);

export default router;
