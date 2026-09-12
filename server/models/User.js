import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    birthDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BirthDetail',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    subscriptionStatus: {
      type: String,
      enum: ['free', 'premium', 'vip'],
      default: 'free',
    },
    subscriptionExpiry: {
      type: Date,
    },
    favoriteHoroscopes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Horoscope',
      },
    ],
    savedCharts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BirthDetail',
      },
    ],
    googleId: {
      type: String,
      sparse: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    notificationPreferences: {
      dailyHoroscope: { type: Boolean, default: true },
      weeklyHoroscope: { type: Boolean, default: false },
      importantEvents: { type: Boolean, default: true },
      reportsReady: { type: Boolean, default: true },
      emailUpdates: { type: Boolean, default: true },
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Method to get public user data
userSchema.methods.getPublicData = function () {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  user.name = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  return user;
};

export default mongoose.model('User', userSchema);
