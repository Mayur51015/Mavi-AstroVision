import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js';
import cron from 'node-cron';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import horoscopeRoutes from './routes/horoscopeRoutes.js';
import chartRoutes from './routes/chartRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import compatibilityRoutes from './routes/compatibilityRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';

const app = express();

// Initialize server
(async () => {
  try {
    // Connect to database
    await connectDB();

    // Session middleware
    app.use(session({
      secret: process.env.SESSION_SECRET || 'session_secret',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === 'production' },
    }));
    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Passport serialization
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    });

    // Google OAuth Strategy
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
          return done(new Error('No email associated with this Google account'), null);
        }

        let user = await User.findOne({ email });
        if (!user) {
          const firstName = profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User';
          const lastName = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || 'Google';
          user = await User.create({
            firstName,
            lastName,
            email,
            password: Math.random().toString(36).slice(-8) + 'Aa1!',
            role: 'user',
            googleId: profile.id,
            emailVerified: true,
            profileImage: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          });
        } else {
          if (!user.googleId) user.googleId = profile.id;
          if (!user.profileImage && profile.photos && profile.photos[0]) {
            user.profileImage = profile.photos[0].value;
          }
          user.lastLogin = new Date();
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }));

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // Fallback so /auth/google also works
app.use('/api/users', userRoutes);
app.use('/api/horoscope', horoscopeRoutes);
app.use('/api/chart', chartRoutes);
app.use('/api/compatibility', compatibilityRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '✨ Mavi-AstroVision API is running',
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.path} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Daily horoscope cron job — runs at 6:00 AM every day
cron.schedule('0 6 * * *', async () => {
  console.log('🌅 Running daily horoscope generation cron...');
  // Horoscopes will be generated on-demand when users request them
  // This can be extended to pre-generate and send email notifications
});

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`\n✨ Mavi-AstroVision Server running on port ${PORT}`);
      console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api\n`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n⚠️ Port ${PORT} is already occupied by another process.`);
        console.error(`👉 The Mavi-AstroVision server is already running on this port.\n`);
      } else {
        console.error('❌ Server error:', err.message);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down server...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Server initialization failed:', error.message);
    process.exit(1);
  }
})();
