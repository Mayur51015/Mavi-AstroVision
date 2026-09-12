import * as Astronomy from 'astronomy-engine';
import { getBodyLongitude, longitudeToSign, isRetrograde, PLANETS } from './astroEngine.js';

/**
 * Determine moon phase name and emoji
 */
export function getMoonPhaseInfo(phaseAngleDeg) {
  const norm = ((phaseAngleDeg % 360) + 360) % 360;

  if (norm >= 355 || norm < 5) return { name: 'New Moon', emoji: '🌑', ritual: 'Intention setting, planting seeds, inner quietude' };
  if (norm >= 5 && norm < 85) return { name: 'Waxing Crescent', emoji: '🌒', ritual: 'Building momentum, developing courage, commitment' };
  if (norm >= 85 && norm < 95) return { name: 'First Quarter', emoji: '🌓', ritual: 'Overcoming obstacles, decisive action, pivot points' };
  if (norm >= 95 && norm < 175) return { name: 'Waxing Gibbous', emoji: '🌔', ritual: 'Refining skills, patience, gestation of dreams' };
  if (norm >= 175 && norm < 185) return { name: 'Full Moon', emoji: '🌕', ritual: 'Celebration, illumination, culmination, emotional release' };
  if (norm >= 185 && norm < 265) return { name: 'Waning Gibbous', emoji: '🌖', ritual: 'Gratitude, teaching, sharing harvest, letting go' };
  if (norm >= 265 && norm < 275) return { name: 'Third Quarter', emoji: '🌗', ritual: 'Forgiveness, releasing attachment, conscious closure' };
  return { name: 'Waning Crescent', emoji: '🌘', ritual: 'Rest, spiritual cleansing, recuperation before rebirth' };
}

/**
 * Get astronomical weather and transits for today
 */
export function getTodayCelestialWeather(date = new Date()) {
  const astroTime = Astronomy.MakeTime(date);

  // 1. Moon phase & illumination
  const phaseAngle = Astronomy.MoonPhase(astroTime);
  const illum = Astronomy.Illumination(Astronomy.Body.Moon, astroTime);
  const phaseInfo = getMoonPhaseInfo(phaseAngle);

  // 2. Current Signs for Sun & Moon
  const sunLon = getBodyLongitude(Astronomy.Body.Sun, astroTime);
  const moonLon = getBodyLongitude(Astronomy.Body.Moon, astroTime);
  const sunSign = longitudeToSign(sunLon);
  const moonSign = longitudeToSign(moonLon);

  // 3. Retrograde Watch
  const retrogrades = [];
  const trackedBodies = [
    { name: 'Mercury', body: Astronomy.Body.Mercury, symbol: '☿' },
    { name: 'Venus', body: Astronomy.Body.Venus, symbol: '♀' },
    { name: 'Mars', body: Astronomy.Body.Mars, symbol: '♂' },
    { name: 'Jupiter', body: Astronomy.Body.Jupiter, symbol: '♃' },
    { name: 'Saturn', body: Astronomy.Body.Saturn, symbol: '♄' },
  ];

  trackedBodies.forEach(b => {
    if (isRetrograde(b.body, astroTime)) {
      const lon = getBodyLongitude(b.body, astroTime);
      const signData = longitudeToSign(lon);
      retrogrades.push({
        planet: b.name,
        symbol: b.symbol,
        sign: signData.sign,
        formatted: signData.formatted,
      });
    }
  });

  // 4. Next major lunar events
  const nextNewMoonTime = Astronomy.SearchMoonPhase(0, astroTime, 35);
  const nextFullMoonTime = Astronomy.SearchMoonPhase(180, astroTime, 35);

  return {
    date: date.toISOString().split('T')[0],
    sun: {
      sign: sunSign.sign,
      symbol: sunSign.symbol,
      formatted: sunSign.formatted,
      degree: sunSign.degree,
    },
    moon: {
      sign: moonSign.sign,
      symbol: moonSign.symbol,
      formatted: moonSign.formatted,
      phase: phaseInfo.name,
      emoji: phaseInfo.emoji,
      illuminationPercentage: Math.round(illum.phase_fraction * 100),
      spiritualRitual: phaseInfo.ritual,
    },
    retrogrades,
    upcomingEvents: [
      {
        event: 'Next Full Moon',
        date: nextFullMoonTime ? nextFullMoonTime.date.toISOString().split('T')[0] : null,
        emoji: '🌕',
      },
      {
        event: 'Next New Moon',
        date: nextNewMoonTime ? nextNewMoonTime.date.toISOString().split('T')[0] : null,
        emoji: '🌑',
      },
    ],
  };
}

/**
 * Generate monthly celestial calendar for any given year and month (1-12)
 */
export function getMonthlyCalendar(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const targetDate = new Date(Date.UTC(year, month - 1, d, 12, 0, 0));
    const astroTime = Astronomy.MakeTime(targetDate);

    const phaseAngle = Astronomy.MoonPhase(astroTime);
    const illum = Astronomy.Illumination(Astronomy.Body.Moon, astroTime);
    const phaseInfo = getMoonPhaseInfo(phaseAngle);

    const sunLon = getBodyLongitude(Astronomy.Body.Sun, astroTime);
    const moonLon = getBodyLongitude(Astronomy.Body.Moon, astroTime);
    const sunSign = longitudeToSign(sunLon);
    const moonSign = longitudeToSign(moonLon);

    let eventHighlight = null;
    if (phaseInfo.name === 'New Moon') eventHighlight = `New Moon in ${moonSign.sign}`;
    else if (phaseInfo.name === 'Full Moon') eventHighlight = `Full Moon in ${moonSign.sign}`;
    else if (phaseInfo.name === 'First Quarter') eventHighlight = `First Quarter Moon`;
    else if (phaseInfo.name === 'Third Quarter') eventHighlight = `Third Quarter Moon`;

    days.push({
      day: d,
      date: `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      sunSign: sunSign.sign,
      moonSign: moonSign.sign,
      moonEmoji: phaseInfo.emoji,
      moonPhase: phaseInfo.name,
      illumination: Math.round(illum.phase_fraction * 100),
      eventHighlight,
    });
  }

  return {
    year: Number(year),
    month: Number(month),
    totalDays: daysInMonth,
    days,
  };
}
