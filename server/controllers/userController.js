import User from '../models/User.js';
import BirthDetail from '../models/BirthDetail.js';
import { getNatalChart, searchLocation } from '../services/cosmydayService.js';
import { calculateCompleteChart } from '../services/astroEngine.js';

// @desc    Get user profile with birth details
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('birthDetails');
    const birthDetail = await BirthDetail.findOne({ userId: req.user._id });
    res.json({ success: true, user: user.getPublicData(), birthDetail: birthDetail || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, gender, bio, profileImage } = req.body;
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (bio !== undefined) updateData.bio = bio;
    if (profileImage) updateData.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user: user.getPublicData() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add or update birth details
// @route   POST /api/users/birth-details
// @access  Private
export const addBirthDetails = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, timeOfBirth, placeOfBirth, latitude, longitude, timezone } = req.body;

    if (!firstName || !lastName || !dateOfBirth || !timeOfBirth || !placeOfBirth || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'All birth details are required' });
    }

    let birthDetail = await BirthDetail.findOne({ userId: req.user._id });

    if (birthDetail) {
      Object.assign(birthDetail, {
        firstName,
        lastName,
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
        latitude,
        longitude,
        timezone: timezone || 'UTC',
      });
    } else {
      birthDetail = new BirthDetail({
        userId: req.user._id,
        firstName,
        lastName,
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
        latitude,
        longitude,
        timezone: timezone || 'UTC',
        isPrimary: true,
      });
    }

    // Resolve location if lat/lon not provided but placeOfBirth is given
    if ((!birthDetail.latitude || !birthDetail.longitude) && birthDetail.placeOfBirth) {
      try {
        const locations = await searchLocation(birthDetail.placeOfBirth);
        if (locations.length > 0) {
          birthDetail.latitude = locations[0].lat;
          birthDetail.longitude = locations[0].lon;
        }
      } catch (locErr) {
        console.log('Location resolution skipped:', locErr.message);
      }
    }

    // Try to fetch astrological signs via CosmyDay natal, fall back to local engine
    try {
      const dob = new Date(birthDetail.dateOfBirth);
      const [hour, min] = (birthDetail.timeOfBirth || '12:00').split(':').map(Number);

      const natalResult = await getNatalChart({
        year: dob.getFullYear(),
        month: dob.getMonth() + 1,
        day: dob.getDate(),
        hour: hour || 12,
        minute: min || 0,
        lat: birthDetail.latitude,
        lon: birthDetail.longitude,
      });

      if (natalResult) {
        // CosmyDay succeeded — extract signs from the natal chart response
        // Use local engine to compute sign names from the natal data
        const localChart = calculateCompleteChart({
          dateOfBirth: birthDetail.dateOfBirth.toISOString ? birthDetail.dateOfBirth.toISOString() : birthDetail.dateOfBirth,
          timeOfBirth: birthDetail.timeOfBirth,
          latitude: birthDetail.latitude,
          longitude: birthDetail.longitude,
          timezone: Number(birthDetail.timezone) || 0,
        });

        if (localChart?.bigThree) {
          birthDetail.sunSign = localChart.bigThree.sun.sign;
          birthDetail.moonSign = localChart.bigThree.moon.sign;
          birthDetail.ascendant = localChart.bigThree.ascendant.sign;
        }

        birthDetail.rawChartData = natalResult;
        birthDetail.chartSource = 'cosmyday';
      } else {
        throw new Error('CosmyDay returned null');
      }
    } catch (apiErr) {
      console.log('CosmyDay enrichment failed, trying local engine:', apiErr.message);
      try {
        const localChart = calculateCompleteChart({
          dateOfBirth: birthDetail.dateOfBirth.toISOString ? birthDetail.dateOfBirth.toISOString() : birthDetail.dateOfBirth,
          timeOfBirth: birthDetail.timeOfBirth,
          latitude: birthDetail.latitude,
          longitude: birthDetail.longitude,
          timezone: Number(birthDetail.timezone) || 0,
        });

        if (localChart?.bigThree) {
          birthDetail.sunSign = localChart.bigThree.sun.sign;
          birthDetail.moonSign = localChart.bigThree.moon.sign;
          birthDetail.ascendant = localChart.bigThree.ascendant.sign;
        }
        birthDetail.chartSource = 'local-engine';
      } catch (localErr) {
        console.log('Local engine enrichment also skipped:', localErr.message);
      }
    }

    await birthDetail.save();

    // Update user with birth details reference and set isOnboarded
    await User.findByIdAndUpdate(req.user._id, { birthDetails: birthDetail._id, isOnboarded: true });

    res.json({ success: true, birthDetail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
  try {
    const { timezone, preferredLanguage, notificationPreferences } = req.body;
    const updateData = {};
    if (timezone) updateData.timezone = timezone;
    if (preferredLanguage) updateData.preferredLanguage = preferredLanguage;
    if (notificationPreferences) updateData.notificationPreferences = notificationPreferences;

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true });
    res.json({ success: true, user: user.getPublicData() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete own account
// @route   DELETE /api/users/me
// @access  Private
export const deleteMyAccount = async (req, res) => {
  try {
    await BirthDetail.deleteMany({ userId: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Your account has been deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await User.find()
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's favorites (horoscopes & saved charts)
// @route   GET /api/users/favorites
// @access  Private
export const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favoriteHoroscopes')
      .populate('savedCharts');

    res.json({
      success: true,
      favorites: {
        horoscopes: user.favoriteHoroscopes || [],
        charts: user.savedCharts || [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle favorite item (horoscope or chart)
// @route   POST /api/users/favorites/toggle
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const { type, id } = req.body;
    if (!type || !id) {
      return res.status(400).json({ success: false, message: 'Type and ID are required' });
    }

    const user = await User.findById(req.user._id);
    let isFavorite = false;

    if (type === 'horoscope') {
      const idx = user.favoriteHoroscopes.findIndex((item) => item.toString() === id);
      if (idx > -1) {
        user.favoriteHoroscopes.splice(idx, 1);
        isFavorite = false;
      } else {
        user.favoriteHoroscopes.push(id);
        isFavorite = true;
      }
    } else if (type === 'chart') {
      const idx = user.savedCharts.findIndex((item) => item.toString() === id);
      if (idx > -1) {
        user.savedCharts.splice(idx, 1);
        isFavorite = false;
      } else {
        user.savedCharts.push(id);
        isFavorite = true;
      }
    }

    await user.save();
    res.json({ success: true, isFavorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user calculation history
// @route   GET /api/users/history
// @access  Private
export const getUserHistory = async (req, res) => {
  try {
    const charts = await BirthDetail.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);
    const user = await User.findById(req.user._id).populate('favoriteHoroscopes');

    res.json({
      success: true,
      history: {
        charts,
        recentHoroscopes: user.favoriteHoroscopes || [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

