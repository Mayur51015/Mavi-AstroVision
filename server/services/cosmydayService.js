import axios from 'axios';

const BASE_URL = process.env.COSMYDAY_BASE_URL || 'https://api.cosmyday.com';

// Shared axios instance for all CosmyDay requests
const cosmydayClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'User-Agent': 'Mavi-AstroVision/1.0',
    'Content-Type': 'application/json',
  },
});

/**
 * Search for a location by name using CosmyDay's geocoding proxy.
 * Returns an array of { name, displayName, lat, lon, countryCode }.
 *
 * IMPORTANT: This endpoint proxies Nominatim and is rate-limited.
 * Do not call repeatedly — cache or debounce on the frontend.
 */
export async function searchLocation(query) {
  try {
    const res = await cosmydayClient.get('/search-location', {
      params: { q: query },
    });

    if (!Array.isArray(res.data)) return [];

    return res.data.map((loc) => ({
      name: loc.name,
      displayName: loc.display_name,
      lat: parseFloat(loc.lat),
      lon: parseFloat(loc.lon),
      countryCode: loc.address?.country_code || '',
    }));
  } catch (err) {
    console.error('CosmyDay searchLocation error:', err.response?.status || err.message);
    return [];
  }
}

/**
 * Get a natal chart from CosmyDay.
 * Requires: year, month, day, hour, minute, lat, lon
 * Returns the raw CosmyDay natal response or null on failure.
 */
export async function getNatalChart({ year, month, day, hour, minute, lat, lon }) {
  try {
    const res = await cosmydayClient.post('/natal', {
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: Number(hour),
      minute: Number(minute),
      lat: Number(lat),
      lon: Number(lon),
    });

    return res.data;
  } catch (err) {
    const status = err.response?.status;
    const detail = err.response?.data || err.message;
    console.error(`CosmyDay getNatalChart error (${status}):`, detail);
    return null;
  }
}

/**
 * Get horoscope content for a given sign and period.
 * Period: 'daily' | 'weekly' | 'monthly'
 *
 * Returns normalized object:
 * {
 *   date, sign, content, closing, sky, voc, moon,
 *   rawResponse (full original)
 * }
 */
export async function getHoroscope(sign, period = 'daily') {
  const validPeriods = ['daily', 'weekly', 'monthly'];
  const normalizedPeriod = validPeriods.includes(period) ? period : 'daily';
  const normalizedSign = sign.toLowerCase();

  try {
    const res = await cosmydayClient.get(`/content/${normalizedPeriod}/${normalizedSign}`);
    const data = res.data;

    return {
      date: data.date,
      sign: data.sign,
      content: data.content || '',
      closing: data.closing || '',
      sky: data.sky || null,
      voc: data.voc || null,
      moon: data.moon || null,
      rawResponse: data,
    };
  } catch (err) {
    const status = err.response?.status;
    console.error(`CosmyDay getHoroscope error (${status}):`, err.response?.data || err.message);
    return null;
  }
}

/**
 * Get upcoming astrology events from CosmyDay.
 *
 * @param {number} days - Number of days to look ahead (default 30)
 * @param {number} minImportance - Minimum importance filter (default 50)
 * @returns Array of normalized event objects or empty array
 */
export async function getUpcomingEvents(days = 30, minImportance = 50) {
  try {
    const res = await cosmydayClient.get('/events/upcoming', {
      params: { days, min_importance: minImportance },
    });

    const data = res.data;

    if (!data || !Array.isArray(data.events)) return [];

    return data.events.map((evt) => ({
      eventId: evt.id,
      date: evt.date,
      kind: evt.kind,
      headline: evt.headline,
      shortDescription: evt.short,
      longDescription: evt.long,
      sign: evt.sign || null,
      importance: evt.importance || 50,
      url: evt.url || null,
      timeEt: evt.time_et || null,
    }));
  } catch (err) {
    console.error('CosmyDay getUpcomingEvents error:', err.response?.status || err.message);
    return [];
  }
}

/**
 * Parse CosmyDay horoscope content into structured sections.
 * The content string uses emoji headers like 🪐 Overview:, 💼 Work & goals:, etc.
 */
export function parseHoroscopeContent(content) {
  if (!content) return {};

  const sections = {};
  const sectionPatterns = [
    { key: 'overview', pattern: /🪐\s*Overview:\s*/i },
    { key: 'career', pattern: /💼\s*Work\s*[&\u0026]\s*goals:\s*/i },
    { key: 'relationships', pattern: /❤️\s*Relationships:\s*/i },
    { key: 'energy', pattern: /⚡\s*Energy\s*[&\u0026]\s*mood:\s*/i },
    { key: 'tip', pattern: /🔮\s*Today'?s?\s*tip:\s*/i },
  ];

  // Remove the header line (✨ Day, Date — Sign)
  const lines = content.split('\n').filter((l) => l.trim());
  const bodyText = lines.filter((l) => !l.startsWith('✨')).join('\n');

  // Extract each section
  for (let i = 0; i < sectionPatterns.length; i++) {
    const { key, pattern } = sectionPatterns[i];
    const match = bodyText.match(pattern);
    if (match) {
      const startIdx = match.index + match[0].length;
      // Find next section start
      let endIdx = bodyText.length;
      for (let j = i + 1; j < sectionPatterns.length; j++) {
        const nextMatch = bodyText.match(sectionPatterns[j].pattern);
        if (nextMatch) {
          endIdx = nextMatch.index;
          break;
        }
      }
      sections[key] = bodyText.substring(startIdx, endIdx).trim();
    }
  }

  return sections;
}

/**
 * Derive mood ratings from CosmyDay sky transit data.
 * Uses planetary dignity to generate deterministic ratings.
 */
export function deriveRatingsFromSky(sky) {
  if (!sky) return { love: 4, career: 4, health: 4, finance: 4 };

  const dignityScore = (dignity) => {
    switch (dignity) {
      case 'domicile': return 5;
      case 'exaltation': return 5;
      case 'peregrine': return 3;
      case 'detriment': return 2;
      case 'fall': return 2;
      default: return 3;
    }
  };

  // Love: influenced by Venus dignity
  const love = Math.min(5, Math.max(3, dignityScore(sky.venus?.dignity)));
  // Career: influenced by Mars + Saturn
  const career = Math.min(5, Math.max(3, Math.round(
    (dignityScore(sky.mars?.dignity) + dignityScore(sky.saturn?.dignity)) / 2
  )));
  // Health: influenced by Sun + Mars
  const health = Math.min(5, Math.max(3, Math.round(
    (dignityScore(sky.sun?.dignity) + dignityScore(sky.mars?.dignity)) / 2
  )));
  // Finance: influenced by Jupiter
  const finance = Math.min(5, Math.max(3, dignityScore(sky.jupiter?.dignity)));

  return { love, career, health, finance };
}
