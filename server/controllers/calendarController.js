import { getTodayCelestialWeather, getMonthlyCalendar } from '../services/ephemerisCalendarService.js';

// @desc    Get celestial weather for today
// @route   GET /api/calendar/today
// @access  Public
export const getTodayWeather = async (req, res) => {
  try {
    const weather = getTodayCelestialWeather();
    res.json({ success: true, weather });
  } catch (error) {
    console.error('getTodayWeather error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get monthly cosmic calendar
// @route   GET /api/calendar/month/:year?/:month?
// @access  Public
export const getCalendarForMonth = async (req, res) => {
  try {
    const year = Number(req.params.year) || new Date().getFullYear();
    const month = Number(req.params.month) || new Date().getMonth() + 1;

    const calendar = getMonthlyCalendar(year, month);
    res.json({ success: true, calendar });
  } catch (error) {
    console.error('getCalendarForMonth error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
