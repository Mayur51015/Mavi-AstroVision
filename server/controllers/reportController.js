import BirthDetail from '../models/BirthDetail.js';
import { generateBirthChartPDF, generateSynastryPDF, generateCosmicLifeMapPDF } from '../services/pdfReportService.js';
import { calculateCompatibility } from '../services/compatibilityService.js';
import { calculateCompleteChart } from '../services/astroEngine.js';
import { buildCompleteCosmicLifeMap } from '../services/cosmicLifeMapService.js';
import { getUpcomingEvents } from '../services/cosmydayService.js';

// @desc    Download Birth Chart PDF
// @route   GET /api/reports/birth-chart/:chartId/pdf
// @access  Private
export const downloadBirthChartReport = async (req, res) => {
  try {
    const { chartId } = req.params;
    const birthDetail = await BirthDetail.findById(chartId);

    if (!birthDetail) {
      return res.status(404).json({ success: false, message: 'Birth chart not found' });
    }

    // Set PDF response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=MaviAstro_BirthChart_${birthDetail.firstName}_${birthDetail.lastName}.pdf`
    );

    generateBirthChartPDF(birthDetail, res);
  } catch (error) {
    console.error('downloadBirthChartReport error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.end();
    }
  }
};

// @desc    Download Signature Cosmic Life Map PDF
// @route   GET /api/reports/cosmic-life-map/pdf OR /api/reports/cosmic-life-map/:chartId/pdf
// @access  Private
export const downloadCosmicLifeMapReport = async (req, res) => {
  try {
    const { chartId } = req.params;
    let birthDetail = null;

    if (chartId) {
      birthDetail = await BirthDetail.findById(chartId);
    } else if (req.user) {
      birthDetail = await BirthDetail.findOne({ userId: req.user._id }).sort({ isPrimary: -1, createdAt: -1 });
    }

    if (!birthDetail || !birthDetail.chartData) {
      if (birthDetail && birthDetail.dateOfBirth) {
        try {
          const dob = new Date(birthDetail.dateOfBirth);
          const [hourStr, minStr] = (birthDetail.timeOfBirth || '12:00').split(':');
          const chartData = calculateCompleteChart(
            dob.getFullYear(),
            dob.getMonth() + 1,
            dob.getDate(),
            parseInt(hourStr, 10) || 12,
            parseInt(minStr, 10) || 0,
            birthDetail.latitude || 0,
            birthDetail.longitude || 0
          );
          birthDetail.chartData = chartData;
          await birthDetail.save();
        } catch (calcErr) {
          console.error('Error auto-calculating chartData for PDF:', calcErr);
        }
      }

      if (!birthDetail || !birthDetail.chartData) {
        return res.status(404).json({ success: false, message: 'Astrological profile not found. Please calculate your birth chart first.' });
      }
    }

    // Fetch upcoming events for current cycle context
    let events = [];
    try {
      events = await getUpcomingEvents(30, 40);
    } catch (e) {
      console.log('Upcoming events fetch skipped for PDF:', e.message);
    }

    const lifeMap = buildCompleteCosmicLifeMap(birthDetail.chartData, birthDetail, events);

    const safeName = `${birthDetail.firstName || 'Seeker'}_${birthDetail.lastName || ''}`.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="MaviAstro_CosmicLifeMap_${safeName}.pdf"`
    );

    generateCosmicLifeMapPDF(lifeMap, res);
  } catch (error) {
    console.error('downloadCosmicLifeMapReport error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.end();
    }
  }
};

// @desc    Download Synastry Compatibility PDF
// @route   POST /api/reports/synastry/pdf
// @access  Public / Private
export const downloadSynastryReport = async (req, res) => {
  try {
    const { personAName = 'Partner 1', personBName = 'Partner 2', chartAData, chartBData } = req.body;

    if (!chartAData || !chartBData) {
      return res.status(400).json({ success: false, message: 'Both charts are required' });
    }

    const synastryData = calculateCompatibility(chartAData, chartBData, personAName, personBName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=MaviAstro_Synastry_${personAName}_${personBName}.pdf`
    );

    generateSynastryPDF(synastryData, res);
  } catch (error) {
    console.error('downloadSynastryReport error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.end();
    }
  }
};

// @desc    Get report templates catalog
// @route   GET /api/reports/templates
// @access  Public
export const getReportTemplates = async (req, res) => {
  res.json({
    success: true,
    templates: [
      {
        id: 'cosmic-life-map',
        title: 'Cosmic Life Map™ Dossier',
        subtitle: 'Signature Personal Blueprint: Identity, Career, Relationships, Scorecard & Current Cycle',
        type: 'cosmic-life-map',
        pages: '3 Pages Signature Dossier',
        format: 'Vector PDF',
        badge: 'Signature Feature',
      },
      {
        id: 'natal-complete',
        title: 'Comprehensive Natal Blueprint',
        subtitle: 'Complete 10-Planet Ephemeris, 12 House Cusps & Psychological Synthesis',
        type: 'birth-chart',
        pages: '2 Pages Full Dossier',
        format: 'Vector PDF',
        badge: 'Popular',
      },
      {
        id: 'synastry-dossier',
        title: 'Synastry & Cosmic Compatibility',
        subtitle: 'Planetary Cross-Aspects, Domain Chemistry & Soul Longevity Ratings',
        type: 'synastry',
        pages: '2 Pages Full Dossier',
        format: 'Vector PDF',
        badge: 'Recommended for Couples',
      },
      {
        id: 'annual-solar-return',
        title: 'Annual Solar Return & Transits',
        subtitle: 'Personalized Year Ahead Forecast Aligned with Your Solar Axis',
        type: 'yearly',
        pages: 'Full Annual Dossier',
        format: 'Vector PDF',
        badge: 'New',
      },
    ],
  });
};

