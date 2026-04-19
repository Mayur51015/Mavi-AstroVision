import User from '../models/User.js';
import BirthDetail from '../models/BirthDetail.js';
import Horoscope from '../models/Horoscope.js';

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password');

    const total = await User.countDocuments(query);
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Also delete associated birth details
    await BirthDetail.deleteMany({ userId: req.params.id });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user details (admin)
// @route   GET /api/admin/users/:id
// @access  Admin
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('birthDetails').select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const birthDetails = await BirthDetail.find({ userId: req.params.id });

    res.json({ success: true, user, birthDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all horoscopes (admin)
// @route   GET /api/admin/horoscopes
// @access  Admin
export const getAllHoroscopes = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const horoscopes = await Horoscope.find()
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Horoscope.countDocuments();

    res.json({
      success: true,
      horoscopes,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create horoscope (admin)
// @route   POST /api/admin/horoscopes
// @access  Admin
export const createHoroscope = async (req, res) => {
  try {
    const {
      sunSign,
      date,
      timePeriod,
      prediction,
      mood,
      luckyNumber,
      luckyColor,
      luckyTime,
      healthTip,
      relationshipAdvice,
      careerAdvice,
      financialAdvice,
    } = req.body;

    if (!sunSign || !date || !timePeriod || !prediction) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const horoscope = await Horoscope.create({
      sunSign,
      date,
      timePeriod,
      prediction,
      mood: mood || 'neutral',
      luckyNumber,
      luckyColor,
      luckyTime,
      healthTip,
      relationshipAdvice,
      careerAdvice,
      financialAdvice,
      source: 'admin',
    });

    res.status(201).json({ success: true, horoscope });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update horoscope (admin)
// @route   PUT /api/admin/horoscopes/:id
// @access  Admin
export const updateHoroscope = async (req, res) => {
  try {
    const horoscope = await Horoscope.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!horoscope) {
      return res.status(404).json({ success: false, message: 'Horoscope not found' });
    }

    res.json({ success: true, horoscope });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete horoscope (admin)
// @route   DELETE /api/admin/horoscopes/:id
// @access  Admin
export const deleteHoroscope = async (req, res) => {
  try {
    const horoscope = await Horoscope.findByIdAndDelete(req.params.id);
    if (!horoscope) {
      return res.status(404).json({ success: false, message: 'Horoscope not found' });
    }

    res.json({ success: true, message: 'Horoscope deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats (admin)
// @route   GET /api/admin/stats
// @access  Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    const totalHoroscopes = await Horoscope.countDocuments();
    const publishedHoroscopes = await Horoscope.countDocuments({ isPublished: true });

    res.json({
      success: true,
      stats: {
        totalUsers,
        admins,
        regularUsers: totalUsers - admins,
        totalHoroscopes,
        publishedHoroscopes,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get analytics
// @route   GET /api/admin/analytics
// @access  Admin
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const totalHoroscopes = await Horoscope.countDocuments();
    const usersWithBirthDetails = await BirthDetail.countDocuments();

    // User registrations by last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Most popular zodiac signs
    const popularSigns = await BirthDetail.aggregate([
      { $group: { _id: '$zodiacSign', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        adminUsers,
        totalHoroscopes,
        usersWithBirthDetails,
        recentUsers,
        popularSigns,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add/edit horoscope content (admin)
// @route   POST /api/admin/horoscope
// @access  Admin
const upsertHoroscope = async (req, res) => {
  try {
    const { zodiacSign, type, category, date, prediction } = req.body;

    if (!zodiacSign || !prediction || !date) {
      return res.status(400).json({ success: false, message: 'zodiacSign, date, and prediction are required' });
    }

    const horoscope = await Horoscope.findOneAndUpdate(
      { zodiacSign, type: type || 'daily', category: category || 'general', date },
      { prediction, source: 'admin', createdBy: req.user._id },
      { upsert: true, new: true }
    );

    res.json({ success: true, horoscope });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
