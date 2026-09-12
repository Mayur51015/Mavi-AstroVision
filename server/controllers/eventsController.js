import AstrologyEvent from '../models/AstrologyEvent.js';
import { getUpcomingEvents as fetchCosmydayEvents } from '../services/cosmydayService.js';

const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

/**
 * @desc    Get upcoming astrology events (cached, refreshes every 6 hours)
 * @route   GET /api/events/upcoming
 * @access  Public
 */
export const getUpcomingEvents = async (req, res) => {
  try {
    const { days = 30, min_importance = 50 } = req.query;

    // Check if we have recently fetched events
    const latestEvent = await AstrologyEvent.findOne().sort({ fetchedAt: -1 });
    const isCacheStale = !latestEvent || (Date.now() - latestEvent.fetchedAt.getTime() > CACHE_DURATION_MS);

    if (isCacheStale) {
      // Fetch fresh events from CosmyDay
      const freshEvents = await fetchCosmydayEvents(Number(days), Number(min_importance));

      if (freshEvents.length > 0) {
        // Upsert each event by eventId to avoid duplicates
        const bulkOps = freshEvents.map((evt) => ({
          updateOne: {
            filter: { eventId: evt.eventId },
            update: {
              $set: {
                ...evt,
                date: new Date(evt.date),
                fetchedAt: new Date(),
              },
            },
            upsert: true,
          },
        }));

        await AstrologyEvent.bulkWrite(bulkOps);
      }
    }

    // Return events from cache, filtered by date (upcoming only)
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const events = await AstrologyEvent.find({
      date: { $gte: now },
      importance: { $gte: Number(min_importance) },
    })
      .sort({ date: 1 })
      .limit(20);

    res.json({
      success: true,
      events,
      cached: !isCacheStale,
    });
  } catch (error) {
    console.error('getUpcomingEvents error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch upcoming events' });
  }
};

/**
 * @desc    Get a single event by its CosmyDay event ID
 * @route   GET /api/events/:eventId
 * @access  Public
 */
export const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await AstrologyEvent.findOne({ eventId });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({ success: true, event });
  } catch (error) {
    console.error('getEventById error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
