import mongoose from 'mongoose';

const birthDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
    dateOfBirth: {
      type: Date,
      required: [true, 'Please provide date of birth'],
    },
    timeOfBirth: {
      type: String,
      required: [true, 'Please provide time of birth (HH:MM)'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time (HH:MM)'],
    },
    placeOfBirth: {
      type: String,
      required: [true, 'Please provide place of birth'],
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    // Astrological signs
    sunSign: {
      type: String,
    },
    moonSign: {
      type: String,
    },
    ascendant: {
      type: String,
    },
    // Chart data from API
    chartData: {
      type: mongoose.Schema.Types.Mixed,
    },
    rawChartData: {
      type: mongoose.Schema.Types.Mixed,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    chartSource: {
      type: String,
      enum: ['local-engine', 'cosmyday'],
      default: 'local-engine',
    },
  },
  { timestamps: true }
);

// Index for quick lookup
birthDetailSchema.index({ userId: 1 });

export default mongoose.model('BirthDetail', birthDetailSchema);
