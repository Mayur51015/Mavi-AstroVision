import BirthDetail from '../models/BirthDetail.js';
import Horoscope from '../models/Horoscope.js';
import User from '../models/User.js';
import { getDailyHoroscope, getMonthlyHoroscope, getYearlyHoroscope } from '../services/astrologyApiService.js';

const zodiacSigns = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

// @desc    Get today's horoscope for a zodiac sign
// @route   GET /api/horoscope/daily/:sign
// @access  Public
export const getDailyHoroscopeBySign = async (req, res) => {
  try {
    const { sign } = req.params;

    if (!zodiacSigns.includes(sign)) {
      return res.status(400).json({ success: false, message: 'Invalid zodiac sign' });
    }

    // Try to fetch from API
    const apiData = await getDailyHoroscope(sign);

    if (apiData) {
      res.json({ success: true, horoscope: apiData });
    } else {
      res.status(500).json({ success: false, message: 'Unable to fetch horoscope' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get horoscope for current user
// @route   GET /api/horoscope/me/:period
// @access  Private
export const getUserHoroscope = async (req, res) => {
  try {
    const { period = 'daily' } = req.params;

    const birthDetail = await BirthDetail.findOne({ userId: req.user._id });
    if (!birthDetail || !birthDetail.sunSign) {
      return res.status(400).json({ success: false, message: 'Please add your birth details first' });
    }

    const sign = birthDetail.sunSign;

    let horoscope;
    if (period === 'daily') {
      horoscope = await getDailyHoroscope(sign);
    } else if (period === 'monthly') {
      horoscope = await getMonthlyHoroscope(sign);
    } else if (period === 'yearly') {
      horoscope = await getYearlyHoroscope(sign, new Date().getFullYear());
    }

    res.json({ success: true, horoscope });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all horoscopes (paginated, with filters)
// @route   GET /api/horoscope
// @access  Public
export const getAllHoroscopes = async (req, res) => {
  try {
    const { sign, period = 'daily', page = 1, limit = 10 } = req.query;

    const filter = { isPublished: true };
    if (sign) filter.sunSign = sign;
    if (period) filter.timePeriod = period;

    const horoscopes = await Horoscope.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const total = await Horoscope.countDocuments(filter);

    res.json({
      success: true,
      horoscopes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save horoscope to user's favorites
// @route   POST /api/horoscope/:id/favorite
// @access  Private
export const addToFavorites = async (req, res) => {
  try {
    const horoscope = await Horoscope.findById(req.params.id);
    if (!horoscope) {
      return res.status(404).json({ success: false, message: 'Horoscope not found' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favoriteHoroscopes: req.params.id } },
      { new: true }
    );

    res.json({ success: true, message: 'Added to favorites', favorites: user.favoriteHoroscopes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove horoscope from favorites
// @route   DELETE /api/horoscope/:id/favorite
// @access  Private
export const removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favoriteHoroscopes: req.params.id } },
      { new: true }
    );

    res.json({ success: true, message: 'Removed from favorites', favorites: user.favoriteHoroscopes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's favorite horoscopes
// @route   GET /api/horoscope/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favoriteHoroscopes');
    res.json({ success: true, favorites: user.favoriteHoroscopes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
