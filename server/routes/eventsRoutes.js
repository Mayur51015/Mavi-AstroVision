import express from 'express';
import { getUpcomingEvents, getEventById } from '../controllers/eventsController.js';

const router = express.Router();

router.get('/upcoming', getUpcomingEvents);
router.get('/:eventId', getEventById);

export default router;
