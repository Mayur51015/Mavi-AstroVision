import BirthDetail from '../models/BirthDetail.js';
import Horoscope from '../models/Horoscope.js';
import User from '../models/User.js';
import { getOrGenerateHoroscope } from '../services/horoscopeGeneratorService.js';

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// @desc    Get horoscope for a zodiac sign and period (daily/weekly/monthly/yearly)
// @route   GET /api/horoscope/:sign/:period?
// @access  Public
export const getHoroscopeBySignAndPeriod = async (req, res) => {
  try {
    let { sign, period = 'daily' } = req.params;
    const formattedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();

    if (!zodiacSigns.includes(formattedSign)) {
      return res.status(400).json({ success: false, message: 'Invalid zodiac sign' });
    }

    const validPeriods = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validPeriods.includes(period.toLowerCase())) {
      period = 'daily';
    }

    const horoscope = await getOrGenerateHoroscope(formattedSign, period.toLowerCase());

    res.json({ success: true, horoscope });
  } catch (error) {
    console.error('getHoroscopeBySignAndPeriod error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's horoscope for a zodiac sign (backward compatibility)
// @route   GET /api/horoscope/daily/:sign
// @access  Public
export const getDailyHoroscopeBySign = async (req, res) => {
  req.params.period = 'daily';
  return getHoroscopeBySignAndPeriod(req, res);
};

// @desc    Get horoscope for current user
// @route   GET /api/horoscope/me/:period?
// @access  Private
export const getUserHoroscope = async (req, res) => {
  try {
    const { period = 'daily' } = req.params;

    // First check user document
    const user = await User.findById(req.user._id);
    let sign = user?.sunSign;

    if (!sign) {
      const birthDetail = await BirthDetail.findOne({ userId: req.user._id });
      sign = birthDetail?.sunSign;
    }

    if (!sign) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile or add your birth details to unlock your personal horoscope',
      });
    }

    const horoscope = await getOrGenerateHoroscope(sign, period.toLowerCase());

    res.json({ success: true, userSign: sign, horoscope });
  } catch (error) {
    console.error('getUserHoroscope error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all horoscopes (paginated, with filters)
// @route   GET /api/horoscope
// @access  Public
export const getAllHoroscopes = async (req, res) => {
  try {
    const { sign, period = 'daily', page = 1, limit = 12 } = req.query;

    const filter = { isPublished: true };
    if (sign) filter.sunSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
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
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit) || 1,
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
    res.json({ success: true, favorites: user.favoriteHoroscopes || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
