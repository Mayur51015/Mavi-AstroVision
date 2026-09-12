import BirthDetail from '../models/BirthDetail.js';
import User from '../models/User.js';
import { calculateCompleteChart } from '../services/astroEngine.js';
import { calculateCompatibility, calculateSignCompatibility } from '../services/compatibilityService.js';

// @desc    Quick zodiac signs compatibility
// @route   POST /api/compatibility/signs
// @access  Public
export const getQuickSignCompatibility = async (req, res) => {
  try {
    const { signA, signB } = req.body;
    if (!signA || !signB) {
      return res.status(400).json({ success: false, message: 'Both signA and signB are required' });
    }

    const result = calculateSignCompatibility(signA, signB);
    res.json({ success: true, compatibility: result });
  } catch (error) {
    console.error('getQuickSignCompatibility error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Full natal synastry calculation
// @route   POST /api/compatibility/synastry
// @access  Public / Optional Auth
export const calculateSynastry = async (req, res) => {
  try {
    const {
      personAName = 'Person A',
      personBName = 'Person B',
      personAChartId,
      personABirthDetails,
      personA,
      personBChartId,
      personBBirthDetails,
      personB,
    } = req.body;

    const detailsA = personABirthDetails || personA;
    const detailsB = personBBirthDetails || personB;

    let chartA = null;
    let chartB = null;

    // 1. Resolve Chart A
    if (personAChartId) {
      const bdA = await BirthDetail.findById(personAChartId);
      if (bdA?.chartData?.planets) {
        chartA = bdA.chartData;
      }
    } else if (detailsA) {
      chartA = calculateCompleteChart(detailsA);
    } else if (req.user) {
      // Fallback to logged-in user
      const userBd = await BirthDetail.findOne({ userId: req.user._id }).sort({ isPrimary: -1, createdAt: -1 });
      if (userBd?.chartData?.planets) {
        chartA = userBd.chartData;
      } else {
        const user = await User.findById(req.user._id);
        if (user?.dateOfBirth) {
          chartA = calculateCompleteChart({
            dateOfBirth: user.dateOfBirth.toISOString(),
            timeOfBirth: user.timeOfBirth || '12:00',
            latitude: user.latitude || 0,
            longitude: user.longitude || 0,
            timezone: Number(user.timezone) || 0,
          });
        }
      }
    }

    // 2. Resolve Chart B
    if (personBChartId) {
      const bdB = await BirthDetail.findById(personBChartId);
      if (bdB?.chartData?.planets) {
        chartB = bdB.chartData;
      }
    } else if (detailsB) {
      chartB = calculateCompleteChart(detailsB);
    }

    if (!chartA || !chartB) {
      return res.status(400).json({
        success: false,
        message: 'Could not resolve birth chart data for both individuals. Please provide valid birth details.',
      });
    }

    const synastryResult = calculateCompatibility(chartA, chartB, personAName, personBName);

    res.json({
      success: true,
      synastry: synastryResult,
    });
  } catch (error) {
    console.error('calculateSynastry error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
