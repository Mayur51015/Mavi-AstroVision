import express from 'express';
import { getTodayWeather, getCalendarForMonth } from '../controllers/calendarController.js';

const router = express.Router();

router.get('/today', getTodayWeather);
router.get('/month/:year?/:month?', getCalendarForMonth);

export default router;
