/**
 * Astrological interpretation data and generator for birth charts
 */

export const SIGN_INTERPRETATIONS = {
  Aries: {
    archetype: 'The Pioneer & Trailblazer',
    sun: 'Dynamic, courageous, and driven by initiative. You are energized by new beginnings and boldly blaze your own path with fierce passion and unyielding optimism.',
    moon: 'Passionate and spontaneous emotional nature. You react quickly, crave immediate resolution, and thrive when given independence to process your inner feelings.',
    ascendant: 'Projecting confidence, directness, and magnetic energy. The world sees a fearless leader who charges toward challenges with unmistakable vitality.',
    strengths: ['Fearless Courage', 'Decisive Action', 'Inspirational Zeal', 'Honesty & Candor'],
    shadows: ['Impatience', 'Impulsivity', 'Short Temper', 'Difficulty Compromising'],
  },
  Taurus: {
    archetype: 'The Architect & Anchor',
    sun: 'Grounded, patient, and appreciative of beauty and comfort. You possess unwavering endurance, values security, and bring enduring stability to everything you touch.',
    moon: 'Calm, steady, and sensory-driven emotional world. You seek comfort in physical sanctuaries, delicious food, loyal bonds, and predictable routines.',
    ascendant: 'Radiating calm reliability, elegance, and grounded charm. Others view you as composed, trustworthy, and possessing impeccable taste in material life.',
    strengths: ['Unshakable Loyalty', 'Financial Prudence', 'Artistic Appreciation', 'Enduring Patience'],
    shadows: ['Resistance to Change', 'Possessiveness', 'Stubbornness', 'Over-indulgence'],
  },
  Gemini: {
    archetype: 'The Messenger & Polymath',
    sun: 'Curious, versatile, and intellectually quick-witted. You are animated by the exchange of ideas, lifelong learning, storytelling, and connecting diverse viewpoints.',
    moon: 'Mentally vibrant and talkative emotional state. You process feelings through intellect, dialogue, humor, and curiosity, needing constant mental stimulation.',
    ascendant: 'Playful, observant, and articulate first impression. You enter rooms with an inquisitive gaze, youthful spark, and rapid conversational charm.',
    strengths: ['Intellectual Agility', 'Witty Communication', 'Adaptability', 'Broad Curiosity'],
    shadows: ['Restlessness', 'Superficiality', 'Nervous Tension', 'Indecision'],
  },
  Cancer: {
    archetype: 'The Protector & Intuitive',
    sun: 'Deeply intuitive, nurturing, and emotionally profound. You are bonded to family and memory, fiercely protecting those you love and guided by inner emotional compasses.',
    moon: 'Home in your natural domicile. Emotionally rich, psychic, and deeply compassionate. Your mood ebbs and flows like oceanic tides, retaining profound empathy.',
    ascendant: 'Warm, welcoming, and gentle presence. You project safe harbor, empathy, and protective caring that immediately puts others at ease.',
    strengths: ['Emotional Depth', 'Maternal/Paternal Warmth', 'Profound Loyalty', 'Instinctual Wisdom'],
    shadows: ['Moodiness', 'Defensive Guard', 'Clinging to the Past', 'Vulnerability Overwhelm'],
  },
  Leo: {
    archetype: 'The Sovereign & Luminary',
    sun: 'Warm-hearted, radiant, and naturally charismatic. You shine with artistic flair, noble generosity, and a joyous desire to uplift the world through authentic creative expression.',
    moon: 'Generous and dramatic heart. You need genuine appreciation, romantic loyalty, and pride in your relationships to feel emotionally fulfilled.',
    ascendant: 'Regal, magnetic, and majestic entrance. People notice your radiant confidence, striking hair or posture, and golden sunny aura.',
    strengths: ['Natural Leadership', 'Heartfelt Generosity', 'Creative Brilliance', 'Inspiring Magnetism'],
    shadows: ['Pride', 'Need for Constant Validation', 'Domineering Tendencies', 'Drama Sensitivity'],
  },
  Virgo: {
    archetype: 'The Healer & Craftsman',
    sun: 'Discerning, analytical, and devoted to service and refinement. You see how to improve any system, heal disharmony, and master craft through dedicated attention to detail.',
    moon: 'Thoughtful and practical inner landscape. You express love through acts of helpful service and feel most serene when your environment is clean, orderly, and purposeful.',
    ascendant: 'Poised, observant, and modest demeanour. You convey sharp intelligence, neat presentation, and an aura of quiet capability.',
    strengths: ['Methodical Precision', 'Selfless Service', 'Analytical Genius', 'Integrity & Craft'],
    shadows: ['Perfectionism', 'Over-critical Tendencies', 'Anxious Overthinking', 'Workaholism'],
  },
  Libra: {
    archetype: 'The Peacemaker & Diplomat',
    sun: 'Harmonious, graceful, and deeply attuned to justice and aesthetics. You seek balance, partnership, and exquisite harmony in relationships and artistic surroundings.',
    moon: 'Peace-loving and socially gracious feelings. You feel safest when relationships are peaceful and harmonious, often prioritizing mutual agreement over confrontation.',
    ascendant: 'Charming, socially magnetic, and polished. You carry symmetrical elegance, sweet smiles, and an effortless ability to make everyone feel welcomed.',
    strengths: ['Diplomatic Mastery', 'Aesthetic Eye', 'Fairness & Justice', 'Relationship Harmony'],
    shadows: ['Conflict Avoidance', 'People Pleasing', 'Indecision', 'Co-dependency'],
  },
  Scorpio: {
    archetype: 'The Alchemist & Mystic',
    sun: 'Intense, magnetic, and transformative. You possess unyielding will, piercing psychological insight, and the profound capacity to rise from ashes with renewed power.',
    moon: 'Fiercely protective, passionate, and deeply guarded emotions. You experience feelings at ocean depths and reward trust with unshakable lifelong devotion.',
    ascendant: 'Enigmatic, hypnotic, and commanding presence. Your gaze penetrates superficial facades, leaving an unforgettable aura of power and mystery.',
    strengths: ['Psychological Depth', 'Unbreakable Resilience', 'Transformative Power', 'Fierce Loyalty'],
    shadows: ['Suspicion & Paranoia', 'Grudges', 'Control Needs', 'Secretiveness'],
  },
  Sagittarius: {
    archetype: 'The Philosopher & Explorer',
    sun: 'Expansive, optimistic, and seeker of ultimate truth. You are propelled by high ideals, thirst for adventure, cultural philosophy, and boundless freedom.',
    moon: 'Spirited, jovial, and freedom-loving inner world. You heal emotional distress through outdoor adventures, philosophical studies, laughter, and expansive horizons.',
    ascendant: 'Lively, candid, and upbeat first impression. You greet life with infectious optimism, broad smiles, and an undeniable aura of wanderlust.',
    strengths: ['Visionary Thinking', 'Philosophical Wisdom', 'Humor & Good Faith', 'Adventurous Spirit'],
    shadows: ['Restlessness', 'Tactlessness', 'Overpromising', 'Dogmatic Convictions'],
  },
  Capricorn: {
    archetype: 'The Master & Sovereign Builder',
    sun: 'Disciplined, ambitious, and endowed with stoic endurance. You build lasting legacies through relentless persistence, strategic foresight, and quiet mastery.',
    moon: 'Self-contained, pragmatic, and mature emotional demeanor. You shoulder duty gracefully, seeking stability and earning genuine respect before opening your heart.',
    ascendant: 'Authoritative, stately, and mature presence. You project professionalism, wisdom beyond your years, and executive competence.',
    strengths: ['Unrivaled Discipline', 'Strategic Long-Game', 'Integrity & Duty', 'Executive Leadership'],
    shadows: ['Emotional Guardedness', 'Pessimism', 'Fear of Vulnerability', 'Hyper-materialism'],
  },
  Aquarius: {
    archetype: 'The Visionary & Rebel',
    sun: 'Innovative, egalitarian, and ahead of your time. You champion humanitarian progress, unconventional truth, and intellectual freedom outside conventional norms.',
    moon: 'Objective, friendly, and emotionally independent. You observe feelings with cool detachment, valuing broad camaraderie and authentic uniqueness above all.',
    ascendant: 'Distinctive, eccentric, and electrifying aura. You stand out from crowds with unconventional style, original ideas, and welcoming egalitarian kindness.',
    strengths: ['Visionary Foresight', 'Humanitarian Heart', 'Original Thinking', 'Intellectual Freedom'],
    shadows: ['Emotional Detachment', 'Stubborn Rebellion', 'Alienation', 'Impersonal Coolness'],
  },
  Pisces: {
    archetype: 'The Dreamer & Compassionate Soul',
    sun: 'Mystical, empathetic, and poetically attuned to the unseen. You bridge worlds through compassionate imagination, musical or spiritual talent, and boundaryless empathy.',
    moon: 'Psychic, porous, and profoundly tender emotional ocean. You absorb energies from your surroundings, requiring sanctuary, artistic outlet, and spiritual connection.',
    ascendant: 'Dreamy, gentle, and ethereal presence. People feel instantly disarmed by your soulful eyes, compassionate demeanor, and poetic mystique.',
    strengths: ['Boundless Empathy', 'Creative Imagination', 'Spiritual Insight', 'Healing Compassion'],
    shadows: ['Escapism', 'Weak Boundaries', 'Victim Mentality', 'Idealistic Disillusionment'],
  },
};

export const HOUSE_THEMES = {
  1: { name: 'First House of Self', domain: 'Identity, physical appearance, vitality, first impressions, and self-expression.' },
  2: { name: 'Second House of Values & Wealth', domain: 'Personal finances, material resources, self-worth, and tangible talents.' },
  3: { name: 'Third House of Mind & Communication', domain: 'Intellect, local community, siblings, short trips, writing, and early learning.' },
  4: { name: 'Fourth House of Home & Ancestry', domain: 'Private life, family roots, domestic foundation, psychological sanctuary, and mother/father energy.' },
  5: { name: 'Fifth House of Pleasure & Creativity', domain: 'Artistic creativity, romance, playfulness, children, hobbies, and joyful self-expression.' },
  6: { name: 'Sixth House of Wellness & Service', domain: 'Daily habits, physical health, work routines, service to others, and mindful craft.' },
  7: { name: 'Seventh House of Partnership', domain: 'Committed relationships, marriage, business contracts, open rivals, and diplomacy.' },
  8: { name: 'Eighth House of Transformation', domain: 'Shared wealth, intimacy, psychological rebirth, inheritance, occult mysteries, and metamorphosis.' },
  9: { name: 'Ninth House of Wisdom & Philosophy', domain: 'Higher education, international travel, philosophy, spirituality, and expanding worldview.' },
  10: { name: 'Tenth House of Legacy & Career', domain: 'Public reputation, life vocation, social standing, honors, and professional ambitions.' },
  11: { name: 'Eleventh House of Community & Hopes', domain: 'Social networks, collective vision, humanitarian goals, friendships, and future aspirations.' },
  12: { name: 'Twelfth House of Spirit & Subconscious', domain: 'Dreams, solitary retreat, karmic patterns, hidden strengths, meditation, and spiritual unity.' },
};

/**
 * Generate full narrative interpretation for a calculated birth chart
 */
export function generateChartInterpretation(chart) {
  const { bigThree, planets, houses, aspects, balances, chartRuler } = chart;

  const sunData = SIGN_INTERPRETATIONS[bigThree.sun.sign] || SIGN_INTERPRETATIONS.Aries;
  const moonData = SIGN_INTERPRETATIONS[bigThree.moon.sign] || SIGN_INTERPRETATIONS.Cancer;
  const ascData = SIGN_INTERPRETATIONS[bigThree.ascendant.sign] || SIGN_INTERPRETATIONS.Leo;

  // 1. Big Three Synthesis
  const bigThreeNarrative = `Your cosmic blueprint is anchored by a ${bigThree.sun.sign} Sun, ${bigThree.moon.sign} Moon, and ${bigThree.ascendant.sign} Ascendant. Your ${bigThree.sun.sign} Sun is your inner light and conscious purpose—${sunData.sun} Meanwhile, your emotional truth is guided by your ${bigThree.moon.sign} Moon: ${moonData.moon} To the outer world, your ${bigThree.ascendant.sign} Rising provides the vehicle of expression: ${ascData.ascendant}`;

  // 2. Dominant Elements & Modalities
  const dominantElement = [...balances.elements].sort((a, b) => b.count - a.count)[0];
  const dominantModality = [...balances.modalities].sort((a, b) => b.count - a.count)[0];

  const elementDescriptions = {
    Fire: 'A fiery soul driven by inspiration, passion, spontaneity, and creative spark. You thrive when pursuing bold quests.',
    Earth: 'An earthy anchor characterized by practical mastery, realistic plans, sensory discernment, and patient execution.',
    Air: 'An airy intellect propelled by conceptual curiosity, social connections, objective analysis, and verbal agility.',
    Water: 'A watery mystic guided by emotional depth, empathetic resonance, psychic sensitivity, and creative imagination.',
  };

  const modalityDescriptions = {
    Cardinal: 'Strong initiator energy; you lead movements, trigger fresh projects, and welcome new chapters.',
    Fixed: 'High endurance and concentration; you preserve values, sustain deep efforts, and hold your ground against adversity.',
    Mutable: 'Exceptional adaptability and fluidity; you navigate changing environments gracefully and connect diverse possibilities.',
  };

  // 3. Planet in House Interpretations
  const planetInterpretations = planets.map(p => {
    const houseInfo = HOUSE_THEMES[p.house] || HOUSE_THEMES[1];
    const signInfo = SIGN_INTERPRETATIONS[p.sign] || SIGN_INTERPRETATIONS.Aries;
    return {
      planet: p.name,
      symbol: p.planetSymbol,
      sign: p.sign,
      house: p.house,
      houseName: houseInfo.name,
      formatted: p.formatted,
      retrograde: p.retrograde,
      summary: `${p.name} in ${p.sign} placed in the ${houseInfo.name}. This infuses your ${houseInfo.domain.toLowerCase()} with ${p.sign}'s qualities of ${signInfo.strengths.slice(0, 2).join(' and ')}.`,
      deepInsight: p.retrograde 
        ? `Because ${p.name} is in retrograde motion, its energy turns reflective and internalized, urging you to develop deep personal authority in this realm rather than seeking external validation.`
        : `${p.name} operates directly and overtly here, radiating confidence in matters of ${houseInfo.domain.split(',')[0].trim().toLowerCase()}.`,
    };
  });

  // 4. Key Aspects Interpretations
  const keyAspects = aspects.slice(0, 8).map(a => ({
    title: `${a.planet1} ${a.aspectSymbol} ${a.aspect} ${a.planet2}`,
    nature: a.nature,
    orb: `${a.orb}°`,
    interpretation: `${a.planet1} and ${a.planet2} interact via a ${a.aspect} (${a.nature}). This creates an active dialogue between your ${a.planet1.toLowerCase()} drives and ${a.planet2.toLowerCase()} principles, providing powerful character catalyst and soul growth.`,
  }));

  // 5. Life Domains Highlights
  return {
    overview: {
      headline: `${bigThree.sun.sign} Sun • ${bigThree.moon.sign} Moon • ${bigThree.ascendant.sign} Rising`,
      archetype: `${sunData.archetype} blending with ${moonData.archetype}`,
      chartRulerInsight: `Your chart ruler is ${chartRuler.planet}, positioned as ${chartRuler.placement}. This celestial conductor shapes how your life journey unfolds, highlighting this area as a focal point of destiny.`,
      bigThreeSynthesis: bigThreeNarrative,
      dominantEnergy: {
        element: dominantElement.element,
        elementInsight: elementDescriptions[dominantElement.element],
        modality: dominantModality.modality,
        modalityInsight: modalityDescriptions[dominantModality.modality],
      },
    },
    planets: planetInterpretations,
    aspects: keyAspects,
    strengths: [...new Set([...sunData.strengths, ...moonData.strengths])],
    growthEdges: [...new Set([...sunData.shadows, ...moonData.shadows])],
  };
}
