import express from 'express';
import {
  generateBirthChart,
  getBirthChartDetails,
  getUserCharts,
  getPrimaryChart,
  previewChart,
  downloadChart,
  searchLocation,
  getCosmicLifeMap,
  getDailyGuidanceController,
} from '../controllers/chartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/preview', previewChart);
router.post('/generate', protect, generateBirthChart);
router.get('/primary', protect, getPrimaryChart);
router.get('/user/all', protect, getUserCharts);
router.get('/search-location', protect, searchLocation);
router.get('/life-map', protect, getCosmicLifeMap);
router.get('/daily-guidance', protect, getDailyGuidanceController);
router.get('/:chartId', protect, getBirthChartDetails);
router.get('/:chartId/download', protect, downloadChart);

export default router;
