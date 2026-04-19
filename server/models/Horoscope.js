import mongoose from 'mongoose';

const horoscopeSchema = new mongoose.Schema(
  {
    sunSign: {
      type: String,
      required: true,
      enum: [
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
      ],
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    timePeriod: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: true,
    },
    prediction: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      enum: ['positive', 'neutral', 'challenging'],
      default: 'neutral',
    },
    luckyNumber: {
      type: Number,
    },
    luckyColor: {
      type: String,
    },
    luckyTime: {
      type: String,
    },
    healthTip: {
      type: String,
    },
    relationshipAdvice: {
      type: String,
    },
    careerAdvice: {
      type: String,
    },
    financialAdvice: {
      type: String,
    },
    compatibility: {
      signs: [String],
      rating: Number,
    },
    source: {
      type: String,
      default: 'astrology-api',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index for common queries
horoscopeSchema.index({ sunSign: 1, date: -1 });
horoscopeSchema.index({ sunSign: 1, timePeriod: 1 });

export default mongoose.model('Horoscope', horoscopeSchema);
