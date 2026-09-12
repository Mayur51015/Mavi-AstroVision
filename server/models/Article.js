import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Article excerpt is required'],
      maxlength: 300,
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Planetary Transits',
        'Birth Chart Wisdom',
        'Love & Relationships',
        'Rituals & Moon Magic',
        'Esoteric Philosophy',
      ],
      index: true,
    },
    tags: [String],
    author: {
      name: { type: String, default: 'Mavi Cosmic Council' },
      role: { type: String, default: 'Master Astrologer' },
      avatar: String,
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Article', articleSchema);
