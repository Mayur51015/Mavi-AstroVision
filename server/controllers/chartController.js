import BirthDetail from '../models/BirthDetail.js';
import User from '../models/User.js';
import { calculateCompleteChart } from '../services/astroEngine.js';
import { generateChartInterpretation } from '../services/chartInterpretationService.js';
import {
  getNatalChart as fetchCosmydayNatal,
  searchLocation as cosmydaySearchLocation,
  getUpcomingEvents,
} from '../services/cosmydayService.js';
import {
  buildCompleteCosmicLifeMap,
  generateDailyCosmicGuidance,
} from '../services/cosmicLifeMapService.js';

// @desc    Generate or recalculate birth chart
// @route   POST /api/chart/generate
// @access  Private
export const generateBirthChart = async (req, res) => {
  try {
    const { birthDetailId } = req.body;
    let birthDetail = null;

    if (birthDetailId) {
      birthDetail = await BirthDetail.findById(birthDetailId);
      if (!birthDetail || birthDetail.userId.toString() !== req.user._id.toString()) {
        return res.status(404).json({ success: false, message: 'Birth detail record not found' });
      }
    } else {
      // Find primary or latest birth detail
      birthDetail = await BirthDetail.findOne({ userId: req.user._id }).sort({ isPrimary: -1, createdAt: -1 });
    }

    // If still no birthDetail, check if user document has birth details
    if (!birthDetail) {
      const user = await User.findById(req.user._id);
      if (!user.dateOfBirth) {
        return res.status(400).json({
          success: false,
          message: 'No birth details found. Please complete your profile or onboarding first.',
        });
      }

      birthDetail = await BirthDetail.create({
        userId: user._id,
        firstName: user.name?.split(' ')[0] || 'Seeker',
        lastName: user.name?.split(' ').slice(1).join(' ') || 'Cosmic',
        dateOfBirth: user.dateOfBirth,
        timeOfBirth: user.timeOfBirth || '12:00',
        placeOfBirth: user.placeOfBirth || 'Unknown',
        latitude: user.latitude || 0,
        longitude: user.longitude || 0,
        timezone: user.timezone || 'UTC',
        isPrimary: true,
      });
    }

    // Try CosmyDay API first, fall back to local engine
    const dob = new Date(birthDetail.dateOfBirth);
    const [hourStr, minStr] = (birthDetail.timeOfBirth || '12:00').split(':');

    let calculatedChart = null;
    let chartSource = 'local-engine';

    try {
      const cosmydayResult = await fetchCosmydayNatal({
        year: dob.getFullYear(),
        month: dob.getMonth() + 1,
        day: dob.getDate(),
        hour: Number(hourStr) || 12,
        minute: Number(minStr) || 0,
        lat: birthDetail.latitude,
        lon: birthDetail.longitude,
      });

      if (cosmydayResult) {
        // Store CosmyDay raw data and also compute local chart for interpretations
        const localChart = calculateCompleteChart({
          dateOfBirth: birthDetail.dateOfBirth.toISOString(),
          timeOfBirth: birthDetail.timeOfBirth,
          latitude: birthDetail.latitude,
          longitude: birthDetail.longitude,
          timezone: Number(birthDetail.timezone) || 0,
        });

        // Merge: use local chart structure (which our UI expects) enriched with CosmyDay raw data
        calculatedChart = localChart;
        birthDetail.rawChartData = cosmydayResult;
        chartSource = 'cosmyday';
      }
    } catch (cosmydayErr) {
      console.log('CosmyDay natal chart failed, using local engine:', cosmydayErr.message);
    }

    // Fallback to local engine if CosmyDay didn't work
    if (!calculatedChart) {
      calculatedChart = calculateCompleteChart({
        dateOfBirth: birthDetail.dateOfBirth.toISOString(),
        timeOfBirth: birthDetail.timeOfBirth,
        latitude: birthDetail.latitude,
        longitude: birthDetail.longitude,
        timezone: Number(birthDetail.timezone) || 0,
      });
    }

    // Generate psychological and esoteric interpretations
    const interpretations = generateChartInterpretation(calculatedChart);

    // Save chart data and astrological signs
    birthDetail.sunSign = calculatedChart.bigThree.sun.sign;
    birthDetail.moonSign = calculatedChart.bigThree.moon.sign;
    birthDetail.ascendant = calculatedChart.bigThree.ascendant.sign;
    birthDetail.chartData = {
      ...calculatedChart,
      interpretations,
    };
    if (chartSource === 'local-engine') {
      birthDetail.rawChartData = calculatedChart;
    }
    birthDetail.chartSource = chartSource;

    await birthDetail.save();

    // Also sync with User document
    await User.findByIdAndUpdate(req.user._id, {
      sunSign: calculatedChart.bigThree.sun.sign,
      moonSign: calculatedChart.bigThree.moon.sign,
      ascendant: calculatedChart.bigThree.ascendant.sign,
    });

    res.json({
      success: true,
      message: 'Birth chart calculated successfully',
      chartId: birthDetail._id,
      chartData: birthDetail.chartData,
    });
  } catch (error) {
    console.error('generateBirthChart error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Preview chart on the fly (for partner / exploration)
// @route   POST /api/chart/preview
// @access  Public / Private
export const previewChart = async (req, res) => {
  try {
    const { dateOfBirth, timeOfBirth = '12:00', latitude = 0, longitude = 0, timezone = 0 } = req.body;

    if (!dateOfBirth) {
      return res.status(400).json({ success: false, message: 'Date of birth is required' });
    }

    const calculatedChart = calculateCompleteChart({
      dateOfBirth,
      timeOfBirth,
      latitude: Number(latitude),
      longitude: Number(longitude),
      timezone: Number(timezone),
    });

    const interpretations = generateChartInterpretation(calculatedChart);

    res.json({
      success: true,
      chartData: {
        ...calculatedChart,
        interpretations,
      },
    });
  } catch (error) {
    console.error('previewChart error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's primary or latest chart
// @route   GET /api/chart/primary
// @access  Private
export const getPrimaryChart = async (req, res) => {
  try {
    let birthDetail = await BirthDetail.findOne({ userId: req.user._id }).sort({ isPrimary: -1, createdAt: -1 });

    if (!birthDetail || !birthDetail.chartData) {
      // Auto-generate if user has birth details
      const user = await User.findById(req.user._id);
      if (user.dateOfBirth) {
        if (!birthDetail) {
          birthDetail = await BirthDetail.create({
            userId: user._id,
            firstName: user.name?.split(' ')[0] || 'Seeker',
            lastName: user.name?.split(' ').slice(1).join(' ') || 'Cosmic',
            dateOfBirth: user.dateOfBirth,
            timeOfBirth: user.timeOfBirth || '12:00',
            placeOfBirth: user.placeOfBirth || 'Unknown',
            latitude: user.latitude || 0,
            longitude: user.longitude || 0,
            timezone: user.timezone || 'UTC',
            isPrimary: true,
          });
        }

        const calculatedChart = calculateCompleteChart({
          dateOfBirth: birthDetail.dateOfBirth.toISOString(),
          timeOfBirth: birthDetail.timeOfBirth,
          latitude: birthDetail.latitude,
          longitude: birthDetail.longitude,
          timezone: Number(birthDetail.timezone) || 0,
        });

        const interpretations = generateChartInterpretation(calculatedChart);

        birthDetail.sunSign = calculatedChart.bigThree.sun.sign;
        birthDetail.moonSign = calculatedChart.bigThree.moon.sign;
        birthDetail.ascendant = calculatedChart.bigThree.ascendant.sign;
        birthDetail.chartData = {
          ...calculatedChart,
          interpretations,
        };
        await birthDetail.save();
      } else {
        return res.status(404).json({ success: false, message: 'No birth chart found' });
      }
    }

    res.json({
      success: true,
      chart: {
        _id: birthDetail._id,
        birthDetail: {
          firstName: birthDetail.firstName,
          lastName: birthDetail.lastName,
          dateOfBirth: birthDetail.dateOfBirth,
          timeOfBirth: birthDetail.timeOfBirth,
          placeOfBirth: birthDetail.placeOfBirth,
          latitude: birthDetail.latitude,
          longitude: birthDetail.longitude,
        },
        astrological: {
          sunSign: birthDetail.sunSign,
          moonSign: birthDetail.moonSign,
          ascendant: birthDetail.ascendant,
        },
        chartData: birthDetail.chartData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all user's charts
// @route   GET /api/chart/user/all
// @access  Private
export const getUserCharts = async (req, res) => {
  try {
    const charts = await BirthDetail.find({ userId: req.user._id })
      .select('firstName lastName dateOfBirth placeOfBirth sunSign moonSign ascendant isPrimary createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, charts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get birth chart by ID
// @route   GET /api/chart/:chartId
// @access  Private
export const getBirthChartDetails = async (req, res) => {
  try {
    const { chartId } = req.params;

    const birthDetail = await BirthDetail.findById(chartId);
    if (!birthDetail || birthDetail.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Chart not found' });
    }

    res.json({
      success: true,
      chart: {
        _id: birthDetail._id,
        birthDetail: {
          firstName: birthDetail.firstName,
          lastName: birthDetail.lastName,
          dateOfBirth: birthDetail.dateOfBirth,
          timeOfBirth: birthDetail.timeOfBirth,
          placeOfBirth: birthDetail.placeOfBirth,
        },
        astrological: {
          sunSign: birthDetail.sunSign,
          moonSign: birthDetail.moonSign,
          ascendant: birthDetail.ascendant,
        },
        chartData: birthDetail.chartData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download chart as PDF (Placeholder for Phase 5 PDFKit)
// @route   GET /api/chart/:chartId/download
// @access  Private
export const downloadChart = async (req, res) => {
  try {
    const { chartId } = req.params;
    const birthDetail = await BirthDetail.findById(chartId);
    if (!birthDetail || birthDetail.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Chart not found' });
    }

    res.json({
      success: true,
      chartData: birthDetail.chartData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search for birth locations via CosmyDay proxy (Nominatim)
// @route   GET /api/chart/search-location
// @access  Private
export const searchLocation = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ success: false, message: 'Query must be at least 2 characters', locations: [] });
    }

    const locations = await cosmydaySearchLocation(q);
    res.json({ success: true, locations });
  } catch (error) {
    console.error('searchLocation error:', error);
    res.status(500).json({ success: false, message: 'Location search failed', locations: [] });
  }
};

// @desc    Get Cosmic Life Map for authenticated user
// @route   GET /api/chart/life-map
// @access  Private
export const getCosmicLifeMap = async (req, res) => {
  try {
    const birthDetail = await BirthDetail.findOne({ userId: req.user._id }).sort({ isPrimary: -1, createdAt: -1 });

    if (!birthDetail) {
      return res.status(404).json({
        success: false,
        message: 'No birth details found. Complete onboarding to generate your Cosmic Life Map.',
        needsOnboarding: true,
      });
    }

    // If chartData is not generated yet, calculate it now
    if (!birthDetail.chartData) {
      const calculated = calculateCompleteChart({
        dateOfBirth: birthDetail.dateOfBirth.toISOString ? birthDetail.dateOfBirth.toISOString() : birthDetail.dateOfBirth,
        timeOfBirth: birthDetail.timeOfBirth || '12:00',
        latitude: birthDetail.latitude,
        longitude: birthDetail.longitude,
        timezone: Number(birthDetail.timezone) || 0,
      });
      const interpretations = generateChartInterpretation(calculated);
      birthDetail.chartData = { ...calculated, interpretations };
      await birthDetail.save();
    }

    // Fetch upcoming events for current cycle context
    let upcomingEvents = [];
    try {
      upcomingEvents = await getUpcomingEvents(30, 40);
    } catch (e) {
      console.log('Upcoming events fetch skipped:', e.message);
    }

    const lifeMap = buildCompleteCosmicLifeMap(birthDetail.chartData, birthDetail, upcomingEvents);

    res.json({
      success: true,
      lifeMap,
    });
  } catch (error) {
    console.error('getCosmicLifeMap error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Daily Cosmic Guidance for authenticated user
// @route   GET /api/chart/daily-guidance
// @access  Private
export const getDailyGuidanceController = async (req, res) => {
  try {
    const birthDetail = await BirthDetail.findOne({ userId: req.user._id }).sort({ isPrimary: -1, createdAt: -1 });

    // Fetch upcoming events for today's context
    let upcomingEvents = [];
    try {
      upcomingEvents = await getUpcomingEvents(30, 40);
    } catch (e) {
      console.log('Upcoming events fetch skipped for guidance:', e.message);
    }

    const guidance = generateDailyCosmicGuidance(birthDetail?.chartData, upcomingEvents);

    res.json({
      success: true,
      guidance,
    });
  } catch (error) {
    console.error('getDailyGuidanceController error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

