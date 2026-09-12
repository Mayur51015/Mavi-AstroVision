import express from 'express';
import { chatWithAi, getAiStatus } from '../controllers/aiController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/status', getAiStatus);
router.post('/chat', optionalAuth, chatWithAi);

export default router;
