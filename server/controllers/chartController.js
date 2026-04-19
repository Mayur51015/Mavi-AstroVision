import BirthDetail from '../models/BirthDetail.js';
import { getSunSign, getMoonSign, getAscendant, getBirthChart } from '../services/astrologyApiService.js';

// @desc    Generate birth chart
// @route   POST /api/chart/generate
// @access  Private
export const generateBirthChart = async (req, res) => {
  try {
    const { birthDetailId } = req.body;

    const birthDetail = await BirthDetail.findById(birthDetailId);
    if (!birthDetail || birthDetail.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Birth detail not found' });
    }

    // Fetch chart data from astrology API
    const chartPromises = [
      getSunSign(birthDetail),
      getMoonSign(birthDetail),
      getAscendant(birthDetail),
      getBirthChart(birthDetail),
    ];

    const [sunSignData, moonSignData, ascendantData, chartData] = await Promise.all(chartPromises);

    // Store the fetched data
    birthDetail.rawChartData = {
      sunSign: sunSignData,
      moonSign: moonSignData,
      ascendant: ascendantData,
      planets: chartData,
    };

    birthDetail.chartData = {
      sunSign: sunSignData?.sign,
      moonSign: moonSignData?.sign,
      ascendant: ascendantData?.sign,
      generatedAt: new Date(),
    };

    await birthDetail.save();

    res.json({ success: true, chartData: birthDetail.chartData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get birth chart
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
        birthDetail: {
          firstName: birthDetail.firstName,
          lastName: birthDetail.lastName,
          dateOfBirth: birthDetail.dateOfBirth,
          timeOfBirth: birthDetail.timeOfBirth,
          placeOfBirth: birthDetail.placeOfBirth,
        },
        astrological: birthDetail.chartData,
        rawData: birthDetail.rawChartData,
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
    const charts = await BirthDetail.find({ userId: req.user._id }).select(
      'firstName lastName dateOfBirth placeOfBirth sunSign moonSign ascendant createdAt'
    );

    res.json({ success: true, charts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download chart as PDF
// @route   GET /api/chart/:chartId/download
// @access  Private
export const downloadChart = async (req, res) => {
  try {
    const { chartId } = req.params;

    const birthDetail = await BirthDetail.findById(chartId);
    if (!birthDetail || birthDetail.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Chart not found' });
    }

    // Generate PDF (using html2canvas and jsPDF on frontend is better)
    // For now, just return the data
    res.json({
      success: true,
      message: 'PDF generation should be done on frontend for better UX',
      chartData: birthDetail.chartData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
