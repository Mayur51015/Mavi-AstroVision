import express from 'express';
import {
  generateBirthChart,
  getBirthChartDetails,
  getUserCharts,
  downloadChart,
} from '../controllers/chartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateBirthChart);
router.get('/:chartId', protect, getBirthChartDetails);
router.get('/user/all', protect, getUserCharts);
router.get('/:chartId/download', protect, downloadChart);

export default router;
