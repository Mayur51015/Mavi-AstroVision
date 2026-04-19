import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import cron from 'node-cron';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import horoscopeRoutes from './routes/horoscopeRoutes.js';
import chartRoutes from './routes/chartRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Initialize server
(async () => {
  try {
    // Connect to database
    await connectDB();

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
app.use('/api/users', userRoutes);
app.use('/api/horoscope', horoscopeRoutes);
app.use('/api/chart', chartRoutes);
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
