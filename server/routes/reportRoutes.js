import express from 'express';
import {
  downloadBirthChartReport,
  downloadCosmicLifeMapReport,
  downloadSynastryReport,
  getReportTemplates,
} from '../controllers/reportController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/templates', getReportTemplates);
router.get('/cosmic-life-map/pdf', protect, downloadCosmicLifeMapReport);
router.get('/cosmic-life-map/:chartId/pdf', optionalAuth, downloadCosmicLifeMapReport);
router.get('/birth-chart/:chartId/pdf', optionalAuth, downloadBirthChartReport);
router.post('/synastry/pdf', optionalAuth, downloadSynastryReport);

export default router;
