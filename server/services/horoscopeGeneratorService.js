import Horoscope from '../models/Horoscope.js';
import * as Astronomy from 'astronomy-engine';
import { ZODIAC_SIGNS, getBodyLongitude, longitudeToSign } from './astroEngine.js';
import {
  getHoroscope as fetchCosmydayHoroscope,
  parseHoroscopeContent,
  deriveRatingsFromSky,
} from './cosmydayService.js';

// Deterministic seed helper so daily predictions are stable throughout the same day
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const COLORS = [
  'Celestial Gold', 'Deep Indigo', 'Rose Quartz', 'Emerald Green', 
  'Silver Amethyst', 'Sunset Coral', 'Sapphire Blue', 'Crimson Ruby', 
  'Topaz Amber', 'Obsidian Black', 'Pearl White', 'Electric Violet'
];

const SIGN_ELEMENTS = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water'
};

const HARMONIOUS_SIGNS = {
  Aries: ['Leo', 'Sagittarius', 'Gemini'],
  Taurus: ['Virgo', 'Capricorn', 'Cancer'],
  Gemini: ['Libra', 'Aquarius', 'Aries'],
  Cancer: ['Scorpio', 'Pisces', 'Taurus'],
  Leo: ['Aries', 'Sagittarius', 'Libra'],
  Virgo: ['Taurus', 'Capricorn', 'Scorpio'],
  Libra: ['Gemini', 'Aquarius', 'Leo'],
  Scorpio: ['Cancer', 'Pisces', 'Virgo'],
  Sagittarius: ['Aries', 'Leo', 'Aquarius'],
  Capricorn: ['Taurus', 'Virgo', 'Pisces'],
  Aquarius: ['Gemini', 'Libra', 'Sagittarius'],
  Pisces: ['Cancer', 'Scorpio', 'Taurus'],
};

/**
 * Generate or retrieve horoscope for a specific sign and period.
 * Priority: MongoDB cache → CosmyDay API → Local engine fallback
 */
export async function getOrGenerateHoroscope(sign, timePeriod = 'daily', targetDate = new Date()) {
  const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
  
  // Date boundary based on timePeriod
  const d = new Date(targetDate);
  let startDate, endDate;

  if (timePeriod === 'daily') {
    startDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
  } else if (timePeriod === 'weekly') {
    const dayOfWeek = d.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    startDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() - distanceToMonday, 0, 0, 0);
    endDate = new Date(startDate.getTime() + 7 * 24 * 3600 * 1000 - 1);
  } else if (timePeriod === 'monthly') {
    startDate = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0);
    endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
  } else {
    startDate = new Date(d.getFullYear(), 0, 1, 0, 0, 0);
    endDate = new Date(d.getFullYear(), 11, 31, 23, 59, 59);
  }

  // 1. Check database cache first
  const existing = await Horoscope.findOne({
    sunSign: normalizedSign,
    timePeriod,
    date: { $gte: startDate, $lte: endDate },
  });

  if (existing) {
    return existing;
  }

  // 2. Try CosmyDay API (only for daily, weekly, monthly — not yearly)
  if (['daily', 'weekly', 'monthly'].includes(timePeriod)) {
    try {
      const cosmydayData = await fetchCosmydayHoroscope(normalizedSign, timePeriod);

      if (cosmydayData && cosmydayData.content) {
        const sections = parseHoroscopeContent(cosmydayData.content);
        const ratings = deriveRatingsFromSky(cosmydayData.sky);

        // Deterministic extras from sky data
        const seed = hashString(`${cosmydayData.date}-${normalizedSign}-${timePeriod}`);
        const compatibleList = HARMONIOUS_SIGNS[normalizedSign] || ['Leo', 'Sagittarius'];
        const bestSign = compatibleList[seed % compatibleList.length];
        const luckyNum = (seed % 89) + 1;
        const luckyColor = COLORS[seed % COLORS.length];
        const luckyHours = ['08:00 AM', '11:30 AM', '02:15 PM', '05:45 PM', '08:30 PM', '10:00 PM'];
        const luckyTime = luckyHours[seed % luckyHours.length];

        // Determine mood from ratings
        const totalRating = ratings.love + ratings.career + ratings.health + ratings.finance;
        const mood = totalRating >= 16 ? 'positive' : totalRating >= 12 ? 'neutral' : 'challenging';

        const newHoroscope = await Horoscope.create({
          sunSign: normalizedSign,
          date: startDate,
          timePeriod,
          prediction: cosmydayData.content,
          mood,
          luckyNumber: luckyNum,
          luckyColor,
          luckyTime,
          careerAdvice: sections.career || '',
          relationshipAdvice: sections.relationships || '',
          healthTip: sections.energy || '',
          financialAdvice: sections.tip || '',
          compatibility: {
            signs: [bestSign],
            rating: 90 + (seed % 10),
          },
          ratings,
          source: 'cosmyday',
          transitData: cosmydayData.sky || null,
          isPublished: true,
        });

        return newHoroscope;
      }
    } catch (cosmydayErr) {
      console.log('CosmyDay horoscope fetch failed, falling back to local engine:', cosmydayErr.message);
    }
  }

  // 3. Fallback: Local transit-based generation
  return generateLocalHoroscope(normalizedSign, timePeriod, startDate, d);
}

/**
 * Local fallback horoscope generator using astronomy-engine transits.
 * This is the original generation logic preserved as a resilient fallback.
 */
async function generateLocalHoroscope(normalizedSign, timePeriod, startDate, d) {
  // Compute live transits
  const astroTime = Astronomy.MakeTime(d);
  const sunLon = getBodyLongitude(Astronomy.Body.Sun, astroTime);
  const moonLon = getBodyLongitude(Astronomy.Body.Moon, astroTime);
  const venusLon = getBodyLongitude(Astronomy.Body.Venus, astroTime);
  const marsLon = getBodyLongitude(Astronomy.Body.Mars, astroTime);

  const transitSun = longitudeToSign(sunLon);
  const transitMoon = longitudeToSign(moonLon);
  const transitVenus = longitudeToSign(venusLon);
  const transitMars = longitudeToSign(marsLon);

  // Generate deterministic seed for consistency
  const dateKey = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}-${normalizedSign}-${timePeriod}`;
  const seed = hashString(dateKey);

  const compatibleList = HARMONIOUS_SIGNS[normalizedSign] || ['Leo', 'Sagittarius'];
  const bestSign = compatibleList[seed % compatibleList.length];

  // Ratings calculation (between 3 and 5)
  const loveRating = 3 + (seed % 3);
  const careerRating = 3 + ((seed >> 2) % 3);
  const healthRating = 3 + ((seed >> 4) % 3);
  const financeRating = 3 + ((seed >> 6) % 3);

  const luckyNum = (seed % 89) + 1;
  const luckyColor = COLORS[seed % COLORS.length];
  const luckyHours = ['08:00 AM', '11:30 AM', '02:15 PM', '05:45 PM', '08:30 PM', '10:00 PM'];
  const luckyTime = luckyHours[seed % luckyHours.length];

  // Theme descriptions based on transits & periods
  let predictionText = '';
  let careerText = '';
  let relationText = '';
  let healthText = '';
  let financeText = '';

  const element = SIGN_ELEMENTS[normalizedSign] || 'Fire';

  if (timePeriod === 'daily') {
    predictionText = `With the Moon currently transiting ${transitMoon.sign} and the Sun illuminating ${transitSun.sign}, your ${element} spirit receives a dynamic wave of cosmic clarity. Focus on authentic expression today. Align your inner intentions with purposeful action, and resist getting drawn into minor peripheral debates.`;
    careerText = `The current alignment of Mars in ${transitMars.sign} favors strategic planning and decisive communication. Complete outstanding commitments before initiating large proposals.`;
    relationText = `Venus in ${transitVenus.sign} softens interpersonal tensions. Honest empathy and active listening will unlock heartwarming moments of closeness with loved ones.`;
    healthText = `Hydrate generously and prioritize mindful grounding. An evening walk under the starlight will harmonize your nervous system.`;
    financeText = `Favorable conditions for reviewing budgets and long-term security. Steer clear of impulsive online purchases today.`;
  } else if (timePeriod === 'weekly') {
    predictionText = `This week invites a pivotal renewal for ${normalizedSign}. As celestial currents shift between ${transitSun.sign} and ${transitMoon.sign}, you are poised to break through recent plateaus. Trust your instinctual timing when navigating professional milestones and personal conversations.`;
    careerText = `Collaborative ventures flourish around midweek. Your articulate insights will capture leadership attention—step forward with confident preparation.`;
    relationText = `A deep, clarifying conversation with a partner or close confidant restores mutual balance and clarifies joint aspirations for the coming months.`;
    healthText = `Balance high-energy workouts with restorative sleep cycles. Guard your boundary against emotional fatigue.`;
    financeText = `Positive momentum for financial negotiations and asset consolidation. Keep a sharp eye on contractual details.`;
  } else if (timePeriod === 'monthly') {
    predictionText = `The cosmic tapestry of this month emphasizes foundation-building and visionary expansion for ${normalizedSign}. With significant planetary shifts accentuating your solar axis, this is your season to step into greater sovereignty and release outworn attachments.`;
    careerText = `A significant milestone or promotion opportunity arrives as planetary energies align with your career sector. Stay committed to excellence.`;
    relationText = `Romantic connections deepen as vulnerability replaces defensive pride. Singles may encounter magnetic soul connections through shared passions.`;
    healthText = `Embrace routine revitalizing rituals. Nutrition and regular movement will maintain peak vitality throughout the month.`;
    financeText = `Promising long-term returns on structured investments. Seek counsel from experienced mentors before committing to major expenses.`;
  } else {
    // Yearly
    predictionText = `Your annual transit forecast heralds a year of quantum evolution, wisdom expansion, and empowered leadership. As major outer planets transition into new signs, ${normalizedSign} is summoned to manifest authentic aspirations with patience and resilience.`;
    careerText = `A transformative career era begins. New leadership opportunities, creative autonomy, and global recognition are well within your reach.`;
    relationText = `Partnerships undergo profound maturation. You will cultivate relationships built on mutual respect, spiritual depth, and shared visions.`;
    healthText = `A year of holistic vitality. Harmonize mental, emotional, and physical well-being through conscious lifestyle choices and nature retreats.`;
    financeText = `Substantial opportunities for building enduring wealth. Strategic discipline and diversification will yield remarkable security.`;
  }

  // Create new Horoscope document
  const newHoroscope = await Horoscope.create({
    sunSign: normalizedSign,
    date: startDate,
    timePeriod,
    prediction: predictionText,
    mood: loveRating + careerRating >= 8 ? 'positive' : 'neutral',
    luckyNumber: luckyNum,
    luckyColor,
    luckyTime,
    careerAdvice: careerText,
    relationshipAdvice: relationText,
    healthTip: healthText,
    financialAdvice: financeText,
    compatibility: {
      signs: [bestSign],
      rating: 90 + (seed % 10),
    },
    ratings: {
      love: loveRating,
      career: careerRating,
      health: healthRating,
      finance: financeRating,
    },
    source: 'mavi-astrology-engine',
    isPublished: true,
  });

  return newHoroscope;
}
