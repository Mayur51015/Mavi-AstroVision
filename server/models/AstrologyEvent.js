import mongoose from 'mongoose';

const astrologyEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    kind: {
      type: String,
      required: true,
    },
    headline: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
    },
    longDescription: {
      type: String,
    },
    sign: {
      type: String,
    },
    importance: {
      type: Number,
      default: 50,
    },
    url: {
      type: String,
    },
    timeEt: {
      type: String,
    },
    fetchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    source: {
      type: String,
      default: 'cosmyday',
    },
  },
  { timestamps: true }
);

// Compound index for common queries
astrologyEventSchema.index({ date: 1, importance: -1 });

export default mongoose.model('AstrologyEvent', astrologyEventSchema);
