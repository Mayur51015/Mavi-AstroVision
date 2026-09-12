/**
 * Cosmic Life Map Service
 * Transforms raw astrological natal chart data and live transits into
 * the signature Cosmic Life Map™ experience:
 * - Interactive Life Map Nodes (Personal, Career, Relationships, Growth, Current Cycle)
 * - Cosmic Scorecard (6 interpretive dimensions)
 * - Cosmic Snapshot (6 expandable reflective facets)
 * - Daily Cosmic Guidance (Personalized energy %, focus, opportunity, reflection)
 */

import { SIGN_INTERPRETATIONS, HOUSE_THEMES } from './chartInterpretationService.js';

// Deterministic hash helper for stable values on the same day/sign
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generate Cosmic Scorecard based on planetary distribution, elements, and house placements.
 * Note: These are interpretive visualizations for self-reflection, not scientific measurements.
 */
export function calculateCosmicScorecard(chartData) {
  const elements = chartData?.elementBalance || { fire: 25, earth: 25, air: 25, water: 25 };
  const modalities = chartData?.modalityBalance || { cardinal: 34, fixed: 33, mutable: 33 };
  const planets = chartData?.planets || [];
  const houses = chartData?.houses || [];

  // Helper to check planet placement in specific houses
  const getHouseOfPlanet = (planetName) => {
    const p = planets.find((item) => item.name.toLowerCase() === planetName.toLowerCase());
    return p ? p.house : 1;
  };

  const sunHouse = getHouseOfPlanet('Sun');
  const moonHouse = getHouseOfPlanet('Moon');
  const mercuryHouse = getHouseOfPlanet('Mercury');
  const venusHouse = getHouseOfPlanet('Venus');
  const marsHouse = getHouseOfPlanet('Mars');
  const jupiterHouse = getHouseOfPlanet('Jupiter');

  // 1. Self Awareness: Sun emphasis, 1st & 9th houses, Fire/Air balance
  const selfAwarenessBase = 68 + Math.round((elements.fire * 0.4) + (elements.air * 0.3));
  const selfAwareness = Math.min(96, Math.max(62, selfAwarenessBase + (sunHouse === 1 ? 8 : 0)));

  // 2. Career Focus: 10th & 6th houses, Earth & Fire balance, Mars/Saturn placement
  const careerBase = 65 + Math.round((elements.earth * 0.5) + (elements.fire * 0.3));
  const careerBonus = (marsHouse === 10 || sunHouse === 10) ? 9 : (marsHouse === 6 ? 6 : 2);
  const careerFocus = Math.min(95, Math.max(60, careerBase + careerBonus));

  // 3. Communication: Mercury house, Air element, mutable modality
  const commBase = 66 + Math.round((elements.air * 0.6) + (modalities.mutable * 0.3));
  const commBonus = (mercuryHouse === 3 || mercuryHouse === 9 || mercuryHouse === 1) ? 8 : 3;
  const communication = Math.min(97, Math.max(64, commBase + commBonus));

  // 4. Relationships: 7th house, Venus placement, Water element
  const relBase = 67 + Math.round((elements.water * 0.5) + (elements.air * 0.3));
  const relBonus = (venusHouse === 7 || moonHouse === 7) ? 8 : 3;
  const relationships = Math.min(95, Math.max(61, relBase + relBonus));

  // 5. Creativity: 5th house, Fire/Water element, Neptune & Venus
  const creatBase = 68 + Math.round((elements.fire * 0.4) + (elements.water * 0.4));
  const creatBonus = (sunHouse === 5 || venusHouse === 5) ? 9 : 2;
  const creativity = Math.min(96, Math.max(63, creatBase + creatBonus));

  // 6. Growth: Jupiter house, 9th/12th houses, Cardinal modality
  const growthBase = 70 + Math.round((modalities.cardinal * 0.4) + (elements.fire * 0.3));
  const growthBonus = (jupiterHouse === 9 || sunHouse === 9) ? 8 : 3;
  const growth = Math.min(98, Math.max(65, growthBase + growthBonus));

  const getStatus = (score) => {
    if (score >= 88) return 'Highly Activated';
    if (score >= 78) return 'Harmonic Balance';
    if (score >= 70) return 'Steady Evolution';
    return 'Active Growth Area';
  };

  return [
    {
      id: 'self-awareness',
      dimension: 'Self Awareness',
      score: selfAwareness,
      status: getStatus(selfAwareness),
      description: 'Understanding of core instincts, identity sovereignty, and personal truth.',
      rulingSphere: 'Sun & 1st House',
    },
    {
      id: 'career-focus',
      dimension: 'Career Focus',
      score: careerFocus,
      status: getStatus(careerFocus),
      description: 'Capacity for vocational stamina, structured ambition, and long-range legacy.',
      rulingSphere: '10th House & Midheaven',
    },
    {
      id: 'communication',
      dimension: 'Communication',
      score: communication,
      status: getStatus(communication),
      description: 'Clarity of intellectual expression, active listening, and conceptual translation.',
      rulingSphere: 'Mercury & 3rd House',
    },
    {
      id: 'relationships',
      dimension: 'Relationships',
      score: relationships,
      status: getStatus(relationships),
      description: 'Emotional reciprocity, boundary harmony, and interpersonal magnetism.',
      rulingSphere: 'Venus & 7th House',
    },
    {
      id: 'creativity',
      dimension: 'Creativity',
      score: creativity,
      status: getStatus(creativity),
      description: 'Spontaneous self-expression, innovative intuition, and visionary joy.',
      rulingSphere: '5th House & Neptune',
    },
    {
      id: 'growth',
      dimension: 'Growth',
      score: growth,
      status: getStatus(growth),
      description: 'Openness to paradigm shifts, philosophical expansion, and spiritual maturity.',
      rulingSphere: 'Jupiter & 9th House',
    },
  ];
}

/**
 * Generate Cosmic Snapshot: 6 concise, expandable reflective facets
 */
export function generateCosmicSnapshot(chartData) {
  const sun = chartData?.bigThree?.sun || { sign: 'Aries' };
  const moon = chartData?.bigThree?.moon || { sign: 'Cancer' };
  const asc = chartData?.bigThree?.ascendant || { sign: 'Libra' };
  const chartRuler = chartData?.chartRuler || { planet: 'Venus', placement: '1st House' };

  const sunData = SIGN_INTERPRETATIONS[sun.sign] || SIGN_INTERPRETATIONS.Aries;
  const moonData = SIGN_INTERPRETATIONS[moon.sign] || SIGN_INTERPRETATIONS.Cancer;
  const ascData = SIGN_INTERPRETATIONS[asc.sign] || SIGN_INTERPRETATIONS.Libra;

  return [
    {
      id: 'core-nature',
      title: 'Core Nature',
      placement: `Sun in ${sun.sign}`,
      headline: `The Archetype of ${sunData.archetype}`,
      summary: `Your vital life force is guided by ${sun.sign}. You navigate life with ${sunData.strengths[0]?.toLowerCase() || 'courage'} and express vitality through purposeful contribution.`,
      deepInsight: sunData.sun,
      reflectionPrompt: `How can you honor your authentic ${sun.sign} vitality today without requiring outside validation?`,
      strengths: sunData.strengths.slice(0, 3),
      growthEdge: sunData.shadows[0] || 'Impatience during slow transitions',
    },
    {
      id: 'emotional-pattern',
      title: 'Emotional Pattern',
      placement: `Moon in ${moon.sign}`,
      headline: `Instinctive Sanctuary in ${moon.sign}`,
      summary: `Your inner world seeks sanctuary through ${moon.sign}. Emotional safety comes when your feelings are recognized and given constructive breathing room.`,
      deepInsight: moonData.moon,
      reflectionPrompt: `What does your heart need most right now to feel grounded and spiritually safe?`,
      strengths: moonData.strengths.slice(0, 3),
      growthEdge: moonData.shadows[0] || 'Over-absorbing ambient emotional currents',
    },
    {
      id: 'communication-style',
      title: 'Communication Style',
      placement: `Rising in ${asc.sign}`,
      headline: `The Outer Horizon of ${asc.sign}`,
      summary: `You project your worldview through the lens of ${asc.sign}. Others immediately perceive your ${ascData.strengths[0]?.toLowerCase() || 'presence'} when you enter any space.`,
      deepInsight: ascData.ascendant,
      reflectionPrompt: `Is the persona you show to the world in honest alignment with what you feel inside?`,
      strengths: ascData.strengths.slice(0, 3),
      growthEdge: ascData.shadows[0] || 'Hesitation to share your unvarnished truth',
    },
    {
      id: 'career-energy',
      title: 'Career Energy',
      placement: `Chart Ruler: ${chartRuler.planet}`,
      headline: `Vocational Momentum & Leadership`,
      summary: `Your worldly mission is guided by ${chartRuler.planet} in your ${chartRuler.placement || 'chart'}. You flourish when given autonomy, clear goals, and creative ownership.`,
      deepInsight: `In your career, you achieve peak momentum when combining strategic discipline with genuine passion. Avoid spreading your energy across too many divergent pathways.`,
      reflectionPrompt: `Which single project or craft currently deserves your deepest devotion and craftsmanship?`,
      strengths: ['Strategic Focus', 'Resilience under Pressure', 'Creative Execution'],
      growthEdge: 'Perfectionism delaying decisive action',
    },
    {
      id: 'relationship-pattern',
      title: 'Relationship Pattern',
      placement: `Descendant Connection Axis`,
      headline: `Intimacy, Loyalty & Reciprocity`,
      summary: `In love and partnership, you value authentic depth and unspoken loyalty. You bloom alongside companions who respect your boundaries while inviting vulnerability.`,
      deepInsight: `Your relationship pattern invites you to balance independence with deep surrender. Healthy friction serves as a mirror for mutual transformation rather than a threat.`,
      reflectionPrompt: `Where can you invite more gentle curiosity into your current intimate connections?`,
      strengths: ['Devoted Loyalty', 'Intuitive Empathy', 'Generous Presence'],
      growthEdge: 'Withdrawing into self-reliance when feeling misunderstood',
    },
    {
      id: 'growth-theme',
      title: 'Growth Theme',
      placement: `Evolutionary Soul Horizon`,
      headline: `Transcending Boundaries & Expanding Wisdom`,
      summary: `Your evolutionary assignment is stepping beyond comfortable habits into higher self-trust, spiritual discernment, and sovereign self-expression.`,
      deepInsight: `Life consistently presents situations that require you to graduate from self-doubt. Every threshold crossed strengthens your ability to mentor and uplift others.`,
      reflectionPrompt: `What old fear are you finally ready to release in order to step into your next chapter?`,
      strengths: ['Philosophical Depth', 'Receptivity to Change', 'Karmic Resilience'],
      growthEdge: 'Reluctance to release familiar comfort zones',
    },
  ];
}

/**
 * Generate the Interactive Visual Map Nodes
 */
export function generateLifeMapPillars(chartData, upcomingEvents = []) {
  const sun = chartData?.bigThree?.sun || { sign: 'Aries' };
  const moon = chartData?.bigThree?.moon || { sign: 'Cancer' };
  const asc = chartData?.bigThree?.ascendant || { sign: 'Libra' };
  const chartRuler = chartData?.chartRuler || { planet: 'Venus', placement: '1st House' };

  // Nearest event or default celestial transit
  const nextEvent = upcomingEvents[0] || {
    headline: 'Current Planetary Season',
    kind: 'transit',
    shortDescription: 'The cosmic sphere aligns to illuminate personal growth and authentic presence.',
  };

  return {
    center: {
      title: 'YOU',
      subtitle: 'The Core Celestial Axis',
      sunSign: sun.sign,
      moonSign: moon.sign,
      risingSign: asc.sign,
      chartRuler: `${chartRuler.planet} (${chartRuler.placement || '1st House'})`,
    },
    pillars: [
      {
        id: 'personal',
        title: 'PERSONAL',
        sublabel: 'Identity & Core Instinct',
        primarySign: sun.sign,
        keyPlacement: `Sun in ${sun.sign} • Rising in ${asc.sign}`,
        focus: 'Self-realization, vitality, personal boundaries, and physical sovereignty.',
        summary: `Your identity blends the passionate essence of ${sun.sign} with the perceptive outer grace of ${asc.sign}.`,
        aspects: ['Authentic Selfhood', 'Physical Vitality', 'Instinctive Sovereignty'],
      },
      {
        id: 'career',
        title: 'CAREER',
        sublabel: 'Purpose & Ambition',
        primarySign: 'Midheaven Sphere',
        keyPlacement: `Chart Ruler: ${chartRuler.planet}`,
        focus: 'Vocation, structured ambitions, creative legacy, and societal contribution.',
        summary: `Guided by ${chartRuler.planet}, your worldly contribution thrives when your intellect and heart align on meaningful missions.`,
        aspects: ['Vocational Mastery', 'Strategic Impact', 'Authentic Authority'],
      },
      {
        id: 'relationships',
        title: 'RELATIONSHIPS',
        sublabel: 'Connection & Synergy',
        primarySign: moon.sign,
        keyPlacement: `Moon in ${moon.sign} • 7th House Axis`,
        focus: 'Intimacy, emotional reciprocity, partnership contracts, and spiritual kinship.',
        summary: `Your emotional world, nurtured by Moon in ${moon.sign}, flourishes with partners who honor both your closeness and your freedom.`,
        aspects: ['Emotional Resonance', 'Mutual Transparency', 'Soul Kinship'],
      },
      {
        id: 'growth',
        title: 'GROWTH',
        sublabel: 'Evolution & Wisdom',
        primarySign: 'Jupiter/Saturn Horizon',
        keyPlacement: 'Nodal Evolution Axis',
        focus: 'Shadow work, philosophical expansion, breaking ancestral loops, and self-trust.',
        summary: `Life invites you into profound wisdom by transforming life friction into spiritual clarity and self-leadership.`,
        aspects: ['Karmic Resolution', 'Higher Wisdom', 'Transformative Self-Trust'],
      },
    ],
    currentCycle: {
      title: 'CURRENT CYCLE',
      sublabel: nextEvent.headline || 'Active Ephemeris Alignment',
      type: nextEvent.kind || 'Planetary Transit',
      description: nextEvent.shortDescription || 'The celestial transits urge conscious alignment, mindful communication, and emotional grounding.',
      advice: 'Stay attuned to your inner compass; current planetary currents support mindful focus over frantic rushing.',
    },
  };
}

/**
 * Generate Daily Cosmic Guidance for today
 */
export function generateDailyCosmicGuidance(chartData, upcomingEvents = []) {
  const sunSign = chartData?.bigThree?.sun?.sign || 'Aries';
  const moonSign = chartData?.bigThree?.moon?.sign || 'Cancer';
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  const seed = hashString(`${dateStr}-${sunSign}-${moonSign}`);

  // Dynamic but stable energy % (between 72% and 96%)
  const energy = 72 + (seed % 25);

  const FOCUS_AREAS = [
    'Strategic Communication & Active Listening',
    'Creative Flow & Intuitive Problem-Solving',
    'Rooting Inner Security & Emotional Boundaries',
    'Vocational Organization & Project Momentum',
    'Relational Clarity & Mutual Understanding',
    'Quiet Reflection & Mindful Nervous System Rest',
    'Courageous Decision-Making & Personal Sovereignty',
  ];

  const OPPORTUNITIES = [
    'A meaningful conversation that clears months of silent misunderstanding.',
    'Unexpected clarity regarding a creative or professional roadblock.',
    'Connecting deeply with an ally who shares your long-range vision.',
    'Consolidating your energetic bandwidth to complete high-priority tasks.',
    'A chance to step forward into leadership without second-guessing yourself.',
    'Reclaiming personal time to recalibrate your spiritual equilibrium.',
  ];

  const MINDFUL_OF = [
    'Reacting defensively to perceived delays or minor misunderstandings.',
    'Overextending promises when your energy reserves require consolidation.',
    'Ruminating on past conversations that cannot be rewritten today.',
    'Dismissing intuitive nudges in favor of rigid, excessive logic.',
    'Taking on emotional burdens that belong to others rather than yourself.',
  ];

  const REFLECTIONS = [
    'What single conversation or truth have you been subtly avoiding?',
    'Where are you investing energy simply out of habit rather than authentic joy?',
    'How can you offer yourself the exact patience you so freely give to others?',
    'What would change today if you trusted your instincts without hesitation?',
    'In what area of your life are you being asked to step into greater maturity?',
  ];

  const focus = FOCUS_AREAS[seed % FOCUS_AREAS.length];
  const opportunity = OPPORTUNITIES[(seed + 1) % OPPORTUNITIES.length];
  const mindfulOf = MINDFUL_OF[(seed + 2) % MINDFUL_OF.length];
  const reflection = REFLECTIONS[(seed + 3) % REFLECTIONS.length];

  const nextEvent = upcomingEvents[0] || {
    headline: 'Harmonic Planetary Ephemeris',
    date: today.toISOString(),
  };

  return {
    date: dateStr,
    sunSign,
    energy,
    focus,
    opportunity,
    mindfulOf,
    reflection,
    activeEvent: {
      headline: nextEvent.headline,
      date: nextEvent.date,
    },
    disclaimer: 'Astrology guidance is designed for personal exploration, self-awareness, and reflective contemplation. It is not an absolute prediction.',
  };
}

/**
 * Complete Cosmic Life Map Data Builder
 */
export function buildCompleteCosmicLifeMap(chartData, birthDetail, upcomingEvents = []) {
  const scorecard = calculateCosmicScorecard(chartData);
  const snapshot = generateCosmicSnapshot(chartData);
  const pillars = generateLifeMapPillars(chartData, upcomingEvents);
  const dailyGuidance = generateDailyCosmicGuidance(chartData, upcomingEvents);

  return {
    user: {
      name: `${birthDetail?.firstName || 'Seeker'} ${birthDetail?.lastName || ''}`.trim(),
      dateOfBirth: birthDetail?.dateOfBirth,
      timeOfBirth: birthDetail?.timeOfBirth,
      placeOfBirth: birthDetail?.placeOfBirth,
      latitude: birthDetail?.latitude,
      longitude: birthDetail?.longitude,
    },
    bigThree: chartData?.bigThree || {},
    chartRuler: chartData?.chartRuler || {},
    elements: chartData?.elementBalance || {},
    modalities: chartData?.modalityBalance || {},
    scorecard,
    snapshot,
    pillars,
    dailyGuidance,
    metadata: {
      generatedAt: new Date(),
      astrologicalSystem: 'Western (Tropical / Placidus)',
      source: birthDetail?.chartSource || 'cosmyday',
      disclaimer: 'Cosmic Life Map™ is an astrology-based interpretive framework created for self-reflection, personal insight, and contemplation. It is not scientifically validated or intended as deterministic prediction.',
      attribution: 'Data attribution: CosmyDay (https://cosmyday.com)',
    },
  };
}
