import User from '../models/User.js';
import BirthDetail from '../models/BirthDetail.js';

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

    await birthDetail.save();

    // Update user with birth details reference
    await User.findByIdAndUpdate(req.user._id, { birthDetails: birthDetail._id });

    res.json({ success: true, birthDetail });
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
