import { calculateCompleteChart, calculateAspects, ASPECTS, ZODIAC_SIGNS } from './astroEngine.js';

const ELEMENT_HARMONY = {
  Fire: { Fire: 95, Air: 90, Earth: 65, Water: 60 },
  Earth: { Earth: 95, Water: 90, Fire: 65, Air: 60 },
  Air: { Air: 95, Fire: 90, Water: 65, Earth: 60 },
  Water: { Water: 95, Earth: 90, Air: 65, Fire: 60 },
};

const ARCHETYPES = [
  'The Sacred Alchemists',
  'The Dynamic Pioneers',
  'The Cosmic Anchors',
  'The Visionary Builders',
  'The Soulful Companions',
  'The Electrifying Spark',
  'The Karmic Mirror',
];

/**
 * Calculate synastry aspects between Chart A and Chart B
 */
export function calculateSynastryAspects(planetsA, planetsB) {
  const synastryAspects = [];

  for (const pA of planetsA) {
    for (const pB of planetsB) {
      let diff = Math.abs(pA.longitude - pB.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const aspect of ASPECTS) {
        const orbDist = Math.abs(diff - aspect.angle);
        if (orbDist <= aspect.orb) {
          synastryAspects.push({
            personAPlanet: pA.name,
            personAPlanetSymbol: pA.planetSymbol,
            personASign: pA.sign,
            personBPlanet: pB.name,
            personBPlanetSymbol: pB.planetSymbol,
            personBSign: pB.sign,
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

  return synastryAspects;
}

/**
 * Calculate full compatibility analysis between two individuals
 */
export function calculateCompatibility(personAChart, personBChart, nameA = 'Person A', nameB = 'Person B') {
  const planetsA = personAChart.planets;
  const planetsB = personBChart.planets;
  const bigThreeA = personAChart.bigThree;
  const bigThreeB = personBChart.bigThree;

  // 1. Calculate Inter-Chart Aspects
  const synastryAspects = calculateSynastryAspects(planetsA, planetsB);

  // 2. Element & Modality Synergies
  const sunAElement = planetsA.find(p => p.id === 'sun')?.element || 'Fire';
  const sunBElement = planetsB.find(p => p.id === 'sun')?.element || 'Fire';
  const moonAElement = planetsA.find(p => p.id === 'moon')?.element || 'Water';
  const moonBElement = planetsB.find(p => p.id === 'moon')?.element || 'Water';

  const baseSunHarmony = ELEMENT_HARMONY[sunAElement]?.[sunBElement] || 75;
  const baseMoonHarmony = ELEMENT_HARMONY[moonAElement]?.[moonBElement] || 75;

  // 3. Domain Scores Breakdown
  let emotionalScore = Math.round((baseMoonHarmony * 0.6) + (baseSunHarmony * 0.4));
  let chemistryScore = 70;
  let communicationScore = 72;
  let stabilityScore = 70;
  let growthScore = 75;

  // Influence from key synastry aspects
  synastryAspects.forEach(a => {
    // Sun-Moon connections
    if ((a.personAPlanet === 'Sun' && a.personBPlanet === 'Moon') || (a.personAPlanet === 'Moon' && a.personBPlanet === 'Sun')) {
      if (a.aspect === 'Trine' || a.aspect === 'Sextile' || a.aspect === 'Conjunction') {
        emotionalScore = Math.min(99, emotionalScore + 10);
      } else if (a.aspect === 'Square' || a.aspect === 'Opposition') {
        emotionalScore = Math.max(50, emotionalScore - 5);
      }
    }

    // Venus-Mars connections (Chemistry)
    if ((a.personAPlanet === 'Venus' && a.personBPlanet === 'Mars') || (a.personAPlanet === 'Mars' && a.personBPlanet === 'Venus')) {
      if (a.aspect === 'Trine' || a.aspect === 'Sextile' || a.aspect === 'Conjunction') {
        chemistryScore = Math.min(99, chemistryScore + 12);
      } else {
        chemistryScore = Math.min(95, chemistryScore + 6); // Squares between Venus & Mars also increase passion!
      }
    }

    // Mercury-Mercury / Mercury-Sun connections (Communication)
    if (a.personAPlanet === 'Mercury' || a.personBPlanet === 'Mercury') {
      if (a.aspect === 'Trine' || a.aspect === 'Sextile' || a.aspect === 'Conjunction') {
        communicationScore = Math.min(99, communicationScore + 8);
      } else if (a.aspect === 'Square') {
        communicationScore = Math.max(45, communicationScore - 6);
      }
    }

    // Saturn connections (Longevity & Commitment)
    if (a.personAPlanet === 'Saturn' || a.personBPlanet === 'Saturn') {
      if (a.aspect === 'Trine' || a.aspect === 'Sextile') {
        stabilityScore = Math.min(98, stabilityScore + 8);
      } else if (a.aspect === 'Square' || a.aspect === 'Opposition') {
        stabilityScore = Math.max(50, stabilityScore - 4);
      }
    }

    // Jupiter connections (Growth & Joy)
    if (a.personAPlanet === 'Jupiter' || a.personBPlanet === 'Jupiter') {
      growthScore = Math.min(99, growthScore + 6);
    }
  });

  const overallScore = Math.round(
    emotionalScore * 0.25 +
    chemistryScore * 0.25 +
    communicationScore * 0.20 +
    stabilityScore * 0.15 +
    growthScore * 0.15
  );

  // Archetype determination
  const archetypeIndex = (overallScore + emotionalScore + chemistryScore) % ARCHETYPES.length;
  const archetype = ARCHETYPES[archetypeIndex];

  // Insights & Advice
  const strengths = [];
  const growthEdges = [];

  if (emotionalScore >= 80) strengths.push('Profound emotional empathy and instinctual mutual understanding.');
  if (chemistryScore >= 80) strengths.push('Magnetic romantic attraction and natural passion.');
  if (communicationScore >= 80) strengths.push('Effortless intellectual dialogue and shared sense of humor.');
  if (stabilityScore >= 75) strengths.push('Strong foundation for enduring loyalty and mutual responsibility.');
  if (growthScore >= 80) strengths.push('Inspiring each other to expand horizons and achieve grand dreams.');

  if (strengths.length < 3) {
    strengths.push('A complementary union where differences provide opportunities for profound personal growth.');
    strengths.push('Distinct perspectives that keep the relationship dynamic, curious, and evolving.');
  }

  if (communicationScore < 70) growthEdges.push('Practice active listening without assuming unspoken intentions.');
  if (emotionalScore < 70) growthEdges.push('Honor each other’s unique emotional processing speeds and vulnerability rhythms.');
  if (stabilityScore < 65) growthEdges.push('Establish clear, transparent agreements regarding practical goals and long-term values.');
  if (chemistryScore < 65) growthEdges.push('Cultivate intentional romantic dates to keep spontaneity and spark alive.');

  if (growthEdges.length === 0) {
    growthEdges.push('Guard against taking harmonious ease for granted; continue celebrating shared milestones.');
  }

  return {
    names: { personA: nameA, personB: nameB },
    bigThree: {
      personA: bigThreeA,
      personB: bigThreeB,
    },
    scores: {
      overall: overallScore,
      emotional: emotionalScore,
      chemistry: chemistryScore,
      communication: communicationScore,
      stability: stabilityScore,
      growth: growthScore,
    },
    archetype,
    summary: `${nameA} (${bigThreeA.sun.sign} Sun / ${bigThreeA.moon.sign} Moon) and ${nameB} (${bigThreeB.sun.sign} Sun / ${bigThreeB.moon.sign} Moon) form "${archetype}". With an overall celestial harmony of ${overallScore}%, this bond combines ${sunAElement} and ${sunBElement} energies into a rich, evolving partnership.`,
    strengths,
    growthEdges,
    synastryAspects: synastryAspects.slice(0, 10),
  };
}

/**
 * Sign-to-Sign quick compatibility
 */
export function calculateSignCompatibility(signA, signB) {
  const normA = signA.charAt(0).toUpperCase() + signA.slice(1).toLowerCase();
  const normB = signB.charAt(0).toUpperCase() + signB.slice(1).toLowerCase();

  const dataA = ZODIAC_SIGNS.find(s => s.name === normA) || ZODIAC_SIGNS[0];
  const dataB = ZODIAC_SIGNS.find(s => s.name === normB) || ZODIAC_SIGNS[1];

  const elementScore = ELEMENT_HARMONY[dataA.element]?.[dataB.element] || 75;
  const isOpposite = Math.abs(dataA.startDeg - dataB.startDeg) === 180;
  const isTrine = Math.abs(dataA.startDeg - dataB.startDeg) === 120 || Math.abs(dataA.startDeg - dataB.startDeg) === 240;
  const isSquare = Math.abs(dataA.startDeg - dataB.startDeg) === 90 || Math.abs(dataA.startDeg - dataB.startDeg) === 270;

  let overall = elementScore;
  if (isTrine) overall = Math.min(98, overall + 10);
  if (isOpposite) overall = 85; // Magnetic polarity
  if (isSquare) overall = Math.max(60, overall - 8); // Dynamic tension

  return {
    signA: { name: normA, element: dataA.element, modality: dataA.modality, ruler: dataA.ruler, symbol: dataA.symbol },
    signB: { name: normB, element: dataB.element, modality: dataB.modality, ruler: dataB.ruler, symbol: dataB.symbol },
    overallScore: overall,
    scores: {
      romance: Math.min(99, overall + (isOpposite ? 10 : 2)),
      communication: Math.min(99, Math.round(overall * 0.95)),
      values: Math.min(99, Math.round(overall * 0.92)),
      longTerm: Math.min(99, Math.round(overall * 0.94)),
    },
    dynamic: isTrine
      ? 'Harmonious Flow: Natural ease, deep intuitive rapport, and shared instinctual worldview.'
      : isOpposite
      ? 'Magnetic Polarity: Opposites attract with intense chemistry and the opportunity to become whole together.'
      : isSquare
      ? 'Dynamic Friction: High creative tension and transformative growth, requiring conscious patience.'
      : 'Complementary Synergy: Different elemental strengths that enrich and balance everyday life.',
  };
}
