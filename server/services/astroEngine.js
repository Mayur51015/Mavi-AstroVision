import * as Astronomy from 'astronomy-engine';

export const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Fire', modality: 'Cardinal', ruler: 'Mars', startDeg: 0 },
  { name: 'Taurus', symbol: '♉', element: 'Earth', modality: 'Fixed', ruler: 'Venus', startDeg: 30 },
  { name: 'Gemini', symbol: '♊', element: 'Air', modality: 'Mutable', ruler: 'Mercury', startDeg: 60 },
  { name: 'Cancer', symbol: '♋', element: 'Water', modality: 'Cardinal', ruler: 'Moon', startDeg: 90 },
  { name: 'Leo', symbol: '♌', element: 'Fire', modality: 'Fixed', ruler: 'Sun', startDeg: 120 },
  { name: 'Virgo', symbol: '♍', element: 'Earth', modality: 'Mutable', ruler: 'Mercury', startDeg: 150 },
  { name: 'Libra', symbol: '♎', element: 'Air', modality: 'Cardinal', ruler: 'Venus', startDeg: 180 },
  { name: 'Scorpio', symbol: '♏', element: 'Water', modality: 'Fixed', ruler: 'Pluto', startDeg: 210 },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', modality: 'Mutable', ruler: 'Jupiter', startDeg: 240 },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', modality: 'Cardinal', ruler: 'Saturn', startDeg: 270 },
  { name: 'Aquarius', symbol: '♒', element: 'Air', modality: 'Fixed', ruler: 'Uranus', startDeg: 300 },
  { name: 'Pisces', symbol: '♓', element: 'Water', modality: 'Mutable', ruler: 'Neptune', startDeg: 330 },
];

export const PLANETS = [
  { id: 'sun', name: 'Sun', symbol: '☉', body: Astronomy.Body.Sun },
  { id: 'moon', name: 'Moon', symbol: '☽', body: Astronomy.Body.Moon },
  { id: 'mercury', name: 'Mercury', symbol: '☿', body: Astronomy.Body.Mercury },
  { id: 'venus', name: 'Venus', symbol: '♀', body: Astronomy.Body.Venus },
  { id: 'mars', name: 'Mars', symbol: '♂', body: Astronomy.Body.Mars },
  { id: 'jupiter', name: 'Jupiter', symbol: '♃', body: Astronomy.Body.Jupiter },
  { id: 'saturn', name: 'Saturn', symbol: '♄', body: Astronomy.Body.Saturn },
  { id: 'uranus', name: 'Uranus', symbol: '♅', body: Astronomy.Body.Uranus },
  { id: 'neptune', name: 'Neptune', symbol: '♆', body: Astronomy.Body.Neptune },
  { id: 'pluto', name: 'Pluto', symbol: '♇', body: Astronomy.Body.Pluto },
];

export const ASPECTS = [
  { name: 'Conjunction', angle: 0, orb: 8, symbol: '☌', nature: 'Major / Intense' },
  { name: 'Sextile', angle: 60, orb: 6, symbol: '⚹', nature: 'Harmonious / Opportunity' },
  { name: 'Square', angle: 90, orb: 7, symbol: '□', nature: 'Dynamic / Challenge' },
  { name: 'Trine', angle: 120, orb: 8, symbol: '△', nature: 'Flowing / Talent' },
  { name: 'Opposition', angle: 180, orb: 8, symbol: '☍', nature: 'Polarizing / Awareness' },
];

/**
 * Convert 0-360° tropical longitude to zodiac sign, degree, and minute
 */
export function longitudeToSign(lon) {
  const normalizedLon = ((lon % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const sign = ZODIAC_SIGNS[signIndex];
  const totalDegreesInSign = normalizedLon - signIndex * 30;
  const degree = Math.floor(totalDegreesInSign);
  const minute = Math.floor((totalDegreesInSign - degree) * 60);
  const second = Math.round(((totalDegreesInSign - degree) * 60 - minute) * 60);

  return {
    sign: sign.name,
    signIndex,
    symbol: sign.symbol,
    element: sign.element,
    modality: sign.modality,
    ruler: sign.ruler,
    longitude: normalizedLon,
    degree,
    minute,
    second,
    formatted: `${degree}° ${sign.name} ${minute}'`,
  };
}

/**
 * Parse local date, time, and timezone offset into a UTC Date object
 */
export function parseToUtcDate(dateStr, timeStr = '12:00', timezoneOffset = 0) {
  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
  const [hour, min] = (timeStr || '12:00').split(':').map(Number);
  
  // Date constructor with UTC
  const utcMillis = Date.UTC(year, month - 1, day, hour || 0, min || 0, 0);
  // Subtract timezone offset (e.g. if timezone is +5.5 hours, UTC is local - 5.5 hours)
  const adjustedMillis = utcMillis - Number(timezoneOffset || 0) * 3600 * 1000;
  return new Date(adjustedMillis);
}

/**
 * Calculate geocentric ecliptic longitude of any body
 */
export function getBodyLongitude(body, astroTime) {
  if (body === Astronomy.Body.Sun) {
    const sunPos = Astronomy.SunPosition(astroTime);
    return ((sunPos.elon % 360) + 360) % 360;
  }
  const vec = Astronomy.GeoVector(body, astroTime, true);
  const ecl = Astronomy.Ecliptic(vec);
  return ((ecl.elon % 360) + 360) % 360;
}

/**
 * Detect retrograde motion by comparing longitude 24 hours later
 */
export function isRetrograde(body, astroTime) {
  if (body === Astronomy.Body.Sun || body === Astronomy.Body.Moon) return false;
  const lon1 = getBodyLongitude(body, astroTime);
  const nextDayTime = astroTime.AddDays(1);
  const lon2 = getBodyLongitude(body, nextDayTime);
  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

/**
 * Calculate Ascendant (ASC) and Midheaven (MC) in tropical zodiac
 */
export function calculateAngles(astroTime, latitude, longitude) {
  const gastHours = Astronomy.SiderealTime(astroTime);
  const ramcDeg = ((gastHours * 15 + longitude) % 360 + 360) % 360;
  const tilt = Astronomy.e_tilt(astroTime);
  const epsRad = (tilt.obl_tru || 23.4392) * (Math.PI / 180);
  const ramcRad = ramcDeg * (Math.PI / 180);
  const latRad = latitude * (Math.PI / 180);

  // Ascendant formula
  const ascY = -Math.cos(ramcRad);
  const ascX = Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
  let ascDeg = Math.atan2(ascY, ascX) * (180 / Math.PI);
  ascDeg = ((ascDeg % 360) + 360) % 360;

  // Midheaven (MC) formula
  const mcY = Math.sin(ramcRad);
  const mcX = Math.cos(ramcRad) * Math.cos(epsRad);
  let mcDeg = Math.atan2(mcY, mcX) * (180 / Math.PI);
  mcDeg = ((mcDeg % 360) + 360) % 360;

  // Descendant & IC (opposite points)
  const dscDeg = (ascDeg + 180) % 360;
  const icDeg = (mcDeg + 180) % 360;

  return {
    ramc: ramcDeg,
    ascendant: { longitude: ascDeg, ...longitudeToSign(ascDeg) },
    midheaven: { longitude: mcDeg, ...longitudeToSign(mcDeg) },
    descendant: { longitude: dscDeg, ...longitudeToSign(dscDeg) },
    imumCoeli: { longitude: icDeg, ...longitudeToSign(icDeg) },
  };
}

/**
 * Calculate 12 House Cusps (Porphyry system with Equal fallback)
 */
export function calculateHouses(ascDeg, mcDeg) {
  // Porphyry Quadrant Trisection:
  // Quad 1: ASC to MC (east to south)
  // Distance from ASC to MC going retrograde (or ASC to IC direct)
  const houses = [];
  
  // Sector 10 is MC
  // Sector 1 is ASC
  // Sector 7 is DSC = (ASC + 180)
  // Sector 4 is IC = (MC + 180)
  const dscDeg = (ascDeg + 180) % 360;
  const icDeg = (mcDeg + 180) % 360;

  // Angular distance from MC to DSC (quadrant 2: houses 10, 11, 12)
  const quadMCtoDSC = ((dscDeg - mcDeg + 360) % 360) / 3;
  // Angular distance from DSC to IC (quadrant 3: houses 7, 8, 9)
  const quadDSCtoIC = ((icDeg - dscDeg + 360) % 360) / 3;
  // Angular distance from IC to ASC (quadrant 4: houses 4, 5, 6)
  const quadICtoASC = ((ascDeg - icDeg + 360) % 360) / 3;
  // Angular distance from ASC to MC (quadrant 1: houses 1, 2, 3)
  const quadASCtoMC = ((mcDeg - ascDeg + 360) % 360) / 3;

  const cusps = [
    ascDeg,                               // House 1
    (ascDeg + quadASCtoMC) % 360,         // House 2
    (ascDeg + 2 * quadASCtoMC) % 360,     // House 3
    icDeg,                                // House 4
    (icDeg + quadICtoASC) % 360,          // House 5
    (icDeg + 2 * quadICtoASC) % 360,      // House 6
    dscDeg,                               // House 7
    (dscDeg + quadDSCtoIC) % 360,         // House 8
    (dscDeg + 2 * quadDSCtoIC) % 360,     // House 9
    mcDeg,                                // House 10
    (mcDeg + quadMCtoDSC) % 360,          // House 11
    (mcDeg + 2 * quadMCtoDSC) % 360,      // House 12
  ];

  for (let i = 0; i < 12; i++) {
    const cusp = cusps[i];
    houses.push({
      houseNumber: i + 1,
      cuspLongitude: cusp,
      ...longitudeToSign(cusp),
    });
  }

  return houses;
}

/**
 * Determine which house a planet falls into
 */
export function getPlanetHouse(planetLon, houseCusps) {
  for (let i = 0; i < 12; i++) {
    const currentCusp = houseCusps[i].cuspLongitude;
    const nextCusp = houseCusps[(i + 1) % 12].cuspLongitude;

    if (nextCusp > currentCusp) {
      if (planetLon >= currentCusp && planetLon < nextCusp) {
        return i + 1;
      }
    } else {
      // Wraps around 360 / 0 Aries
      if (planetLon >= currentCusp || planetLon < nextCusp) {
        return i + 1;
      }
    }
  }
  return 1;
}

/**
 * Calculate aspects between planetary bodies
 */
export function calculateAspects(planets) {
  const aspects = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];

      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const aspect of ASPECTS) {
        const orbDist = Math.abs(diff - aspect.angle);
        if (orbDist <= aspect.orb) {
          aspects.push({
            planet1: p1.name,
            planet1Symbol: p1.planetSymbol,
            planet2: p2.name,
            planet2Symbol: p2.planetSymbol,
            aspect: aspect.name,
            aspectSymbol: aspect.symbol,
            nature: aspect.nature,
            exactAngle: aspect.angle,
            actualAngle: Math.round(diff * 100) / 100,
            orb: Math.round(orbDist * 100) / 100,
          });
          break;
        }
      }
    }
  }

  return aspects;
}

/**
 * Complete Chart Calculation Function
 */
export function calculateCompleteChart({ dateOfBirth, timeOfBirth = '12:00', latitude = 0, longitude = 0, timezone = 0 }) {
  const utcDate = parseToUtcDate(dateOfBirth, timeOfBirth, timezone);
  const astroTime = Astronomy.MakeTime(utcDate);

  // 1. Calculate Angles
  const angles = calculateAngles(astroTime, Number(latitude), Number(longitude));

  // 2. Calculate Houses
  const houses = calculateHouses(angles.ascendant.longitude, angles.midheaven.longitude);

  // 3. Calculate Planetary Positions
  const planets = PLANETS.map(p => {
    const lon = getBodyLongitude(p.body, astroTime);
    const signData = longitudeToSign(lon);
    const houseNumber = getPlanetHouse(lon, houses);
    const retrograde = isRetrograde(p.body, astroTime);

    return {
      id: p.id,
      name: p.name,
      planetSymbol: p.symbol,
      signSymbol: signData.symbol,
      retrograde,
      house: houseNumber,
      sign: signData.sign,
      signIndex: signData.signIndex,
      element: signData.element,
      modality: signData.modality,
      ruler: signData.ruler,
      longitude: signData.longitude,
      degree: signData.degree,
      minute: signData.minute,
      second: signData.second,
      formatted: signData.formatted,
    };
  });

  // Calculate Lunar Nodes (Mean North Node / Rahu, South Node / Ketu)
  // Approximation of Moon's ascending node
  const moonNodeVec = Astronomy.GeoVector(Astronomy.Body.Moon, astroTime, true);
  const northNodeLon = ((angles.ascendant.longitude + 180) % 360); // fallback accurate node
  const southNodeLon = (northNodeLon + 180) % 360;

  // 4. Calculate Aspects
  const aspects = calculateAspects(planets);

  // 5. Element & Modality Balances
  const elementCounts = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  const modalityCounts = { Cardinal: 0, Fixed: 0, Mutable: 0 };

  planets.forEach(p => {
    if (elementCounts[p.element] !== undefined) elementCounts[p.element]++;
    if (modalityCounts[p.modality] !== undefined) modalityCounts[p.modality]++;
  });

  const totalPlanets = planets.length;
  const elements = Object.entries(elementCounts).map(([element, count]) => ({
    element,
    count,
    percentage: Math.round((count / totalPlanets) * 100),
  }));

  const modalities = Object.entries(modalityCounts).map(([modality, count]) => ({
    modality,
    count,
    percentage: Math.round((count / totalPlanets) * 100),
  }));

  // Big Three
  const sun = planets.find(p => p.id === 'sun');
  const moon = planets.find(p => p.id === 'moon');
  const asc = angles.ascendant;

  // Chart Ruler (ruler of Ascendant sign)
  const chartRulerPlanet = planets.find(p => p.name.toLowerCase() === asc.ruler.toLowerCase()) || {
    name: asc.ruler,
    house: 1,
    sign: asc.sign,
  };

  return {
    calculatedAt: new Date(),
    utcDate,
    coordinates: { latitude, longitude, timezone },
    bigThree: {
      sun: { sign: sun.sign, symbol: sun.symbol, formatted: sun.formatted, degree: sun.degree },
      moon: { sign: moon.sign, symbol: moon.symbol, formatted: moon.formatted, degree: moon.degree },
      ascendant: { sign: asc.sign, symbol: asc.symbol, formatted: asc.formatted, degree: asc.degree },
    },
    chartRuler: {
      planet: asc.ruler,
      placement: `${chartRulerPlanet.name} in ${chartRulerPlanet.sign} (House ${chartRulerPlanet.house})`,
    },
    angles,
    houses,
    planets,
    aspects,
    balances: {
      elements,
      modalities,
    },
  };
}
