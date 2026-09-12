import User from '../models/User.js';
import BirthDetail from '../models/BirthDetail.js';
import { getTodayCelestialWeather } from '../services/ephemerisCalendarService.js';
import { SIGN_INTERPRETATIONS, HOUSE_THEMES } from '../services/chartInterpretationService.js';
import { calculateSignCompatibility } from '../services/compatibilityService.js';
import { ZODIAC_SIGNS } from '../services/astroEngine.js';

/**
 * Intelligent domain-specific Astrology AI responder when no external LLM API key is provided
 */
function generateAstrologicalResponse(message, userContext) {
  const lower = message.toLowerCase();

  // 1. Compatibility questions (e.g. "Aries and Leo", "Are Scorpio and Taurus compatible?")
  const signsMentioned = ZODIAC_SIGNS.filter(s => lower.includes(s.name.toLowerCase()));
  if (signsMentioned.length >= 2) {
    const s1 = signsMentioned[0].name;
    const s2 = signsMentioned[1].name;
    const compat = calculateSignCompatibility(s1, s2);
    return `✨ **Cosmic Compatibility: ${s1} & ${s2}**\n\n` +
      `**Overall Harmony:** ${compat.overallScore}%\n` +
      `**Dynamic:** ${compat.dynamic}\n\n` +
      `• **Romance & Chemistry:** ${compat.scores.romance}%\n` +
      `• **Intellectual Dialogue:** ${compat.scores.communication}%\n` +
      `• **Shared Values:** ${compat.scores.values}%\n` +
      `• **Long-Term Longevity:** ${compat.scores.longTerm}%\n\n` +
      `*Cosmic Advice:* ${s1} (${compat.signA.element}) and ${s2} (${compat.signB.element}) create an evolving union. Respect each other's emotional rhythms to transform friction into spiritual growth.`;
  }

  // 2. Personal chart / Big Three questions ("What is my sun sign?", "tell me about my chart", "who am I?")
  if (lower.includes('my chart') || lower.includes('my sun') || lower.includes('my moon') || lower.includes('my rising') || lower.includes('who am i')) {
    if (userContext?.sunSign) {
      const sunData = SIGN_INTERPRETATIONS[userContext.sunSign] || SIGN_INTERPRETATIONS.Aries;
      let reply = `🌟 **Your Cosmic Blueprint:**\n\n` +
        `• **Sun in ${userContext.sunSign}:** ${sunData.sun}\n`;
      if (userContext.moonSign) {
        const moonData = SIGN_INTERPRETATIONS[userContext.moonSign] || SIGN_INTERPRETATIONS.Cancer;
        reply += `• **Moon in ${userContext.moonSign}:** ${moonData.moon}\n`;
      }
      if (userContext.ascendant) {
        const ascData = SIGN_INTERPRETATIONS[userContext.ascendant] || SIGN_INTERPRETATIONS.Leo;
        reply += `• **Rising in ${userContext.ascendant}:** ${ascData.ascendant}\n`;
      }
      reply += `\n*Your Core Superpower:* ${sunData.strengths.slice(0, 3).join(', ')}.`;
      return reply;
    } else {
      return `I would love to analyze your exact placements! You haven't added your birth details yet. Please visit your **Profile** or the **Birth Chart** tab so I can give you personalized readings based on your exact Sun, Moon, and Rising signs!`;
    }
  }

  // 3. Questions about specific zodiac signs ("Tell me about Scorpio", "What is Taurus like?")
  if (signsMentioned.length === 1) {
    const s = signsMentioned[0];
    const data = SIGN_INTERPRETATIONS[s.name] || SIGN_INTERPRETATIONS.Aries;
    return `🌌 **The Archetype of ${s.name} (${s.symbol})**\n\n` +
      `**Title:** ${data.archetype}\n` +
      `**Element:** ${s.element} • **Modality:** ${s.modality} • **Ruler:** ${s.ruler}\n\n` +
      `**Core Nature:** ${data.sun}\n\n` +
      `✨ **Gifts & Strengths:** ${data.strengths.join(', ')}\n` +
      `⚠️ **Shadows & Growth Edges:** ${data.shadows.join(', ')}\n\n` +
      `*Cosmic Wisdom:* ${s.name} teaches humanity how to master ${s.element.toLowerCase()} consciousness and express authentic purpose.`;
  }

  // 4. Retrograde questions
  if (lower.includes('retrograde') || lower.includes('mercury retrograde')) {
    const weather = getTodayCelestialWeather();
    const activeRetro = weather.retrogrades;
    if (activeRetro.length > 0) {
      const list = activeRetro.map(r => `• **${r.planet} (${r.symbol})** in ${r.formatted}`).join('\n');
      return `🪐 **Planetary Retrograde Watch:**\n\n` +
        `Currently, the following planets are in apparent retrograde motion:\n${list}\n\n` +
        `*Guidance:* Retrogrades are sacred cosmic pauses for introspection, review, and inner calibration rather than hurried forward leaps.`;
    } else {
      return `✨ Good cosmic news! There are currently no major personal planets in retrograde motion. Celestial currents are moving direct, supporting forward momentum, decisive communications, and contracts.`;
    }
  }

  // 5. Moon phase questions
  if (lower.includes('moon') || lower.includes('full moon') || lower.includes('new moon')) {
    const weather = getTodayCelestialWeather();
    return `🌙 **Current Lunar Frequency:**\n\n` +
      `• **Phase:** ${weather.moon.emoji} ${weather.moon.phase} (${weather.moon.illuminationPercentage}% illuminated)\n` +
      `• **Current Moon Sign:** ${weather.moon.formatted} (${weather.moon.symbol})\n` +
      `• **Recommended Ritual:** ${weather.moon.spiritualRitual}\n\n` +
      `Upcoming: **${weather.upcomingEvents[0].event}** on ${weather.upcomingEvents[0].date}.`;
  }

  // 6. Houses questions ("What does 7th house mean?", "10th house")
  for (let i = 1; i <= 12; i++) {
    if (lower.includes(`${i}th house`) || lower.includes(`house ${i}`)) {
      const house = HOUSE_THEMES[i];
      return `🏛️ **The ${house.name}:**\n\n` +
        `**Domain of Life:** ${house.domain}\n\n` +
        `Planets located in your ${i}th house express their primary energy and life lessons through these specific worldly experiences.`;
    }
  }

  // 7. Saturn Return
  if (lower.includes('saturn return')) {
    return `🪐 **The Sacred Saturn Return:**\n\n` +
      `Occurring between ages 27–30 (and again around 58–60), the Saturn Return marks your astrological rite of passage into authentic adulthood and sovereignty.\n\n` +
      `It strips away unfulfilling expectations and compels you to build enduring, real-world foundations aligned with your true destiny. Embrace duty, integrity, and radical self-responsibility!`;
  }

  // Default cosmic oracle reply
  return `✨ Greetings seeker of the stars. As the cosmos unfolds, each planetary transit mirrors the evolution of your consciousness.\n\n` +
    `You can ask me about:\n` +
    `• Your **Sun, Moon, and Rising signs**\n` +
    `• **Zodiac compatibility** between any two signs\n` +
    `• Today's **Moon phase and celestial weather**\n` +
    `• Deep meanings of the **12 astrological houses**\n` +
    `• Life transits like **Saturn Return** or **Mercury Retrograde**\n\n` +
    `What aspect of your cosmic journey would you like to illuminate?`;
}

import axios from 'axios';

// @desc    Get AI service status
// @route   GET /api/ai/status
// @access  Public
export const getAiStatus = async (req, res) => {
  const isConfigured = Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
  res.json({
    success: true,
    configured: isConfigured,
    provider: process.env.GEMINI_API_KEY ? 'gemini' : (process.env.OPENAI_API_KEY ? 'openai' : null),
  });
};

// @desc    Chat with AI Astrologer
// @route   POST /api/ai/chat
// @access  Public / Optional Auth
export const chatWithAi = async (req, res) => {
  try {
    const isConfigured = Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);

    // If AI service is not configured, explicitly inform client (Phase 15: no fake replies)
    if (!isConfigured) {
      return res.json({
        success: true,
        configured: false,
        message: 'AI service configuration required. Please configure GEMINI_API_KEY or OPENAI_API_KEY to unlock live chart conversations.',
      });
    }

    const { message, history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    let userContext = null;
    if (req.user) {
      const user = await User.findById(req.user._id);
      const bd = await BirthDetail.findOne({ userId: req.user._id }).sort({ isPrimary: -1, createdAt: -1 });

      userContext = {
        name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Seeker',
        sunSign: bd?.sunSign || user.sunSign,
        moonSign: bd?.moonSign || user.moonSign,
        ascendant: bd?.ascendant || user.ascendant,
        birthDate: bd?.dateOfBirth,
        birthPlace: bd?.placeOfBirth,
        chartRuler: bd?.chartData?.chartRuler?.planet,
      };
    }

    const systemPrompt = `You are the Mavi-AstroVision AI Cosmic Companion.
You offer grounded, perceptive astrological reflections based on Western Tropical ephemeris and psychological astrology.
Always maintain a compassionate, empowering, and respectful tone.
Never present astrology as deterministic fatalism or scientifically absolute medical/financial facts; frame it as symbolic archetypes, cycles, and personal exploration.
${userContext ? `User context: Name: ${userContext.name}, Sun: ${userContext.sunSign || 'Unknown'}, Moon: ${userContext.moonSign || 'Unknown'}, Ascendant: ${userContext.ascendant || 'Unknown'}, Chart Ruler: ${userContext.chartRuler || 'Unknown'}` : 'User has not configured a birth chart yet.'}`;

    let reply = '';

    if (process.env.GEMINI_API_KEY) {
      const geminiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
            },
          ],
        },
        { timeout: 15000 }
      );
      reply = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || 'The cosmic spheres are reflecting on your question.';
    } else if (process.env.OPENAI_API_KEY) {
      const openaiRes = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.slice(-4),
            { role: 'user', content: message },
          ],
        },
        {
          headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
          timeout: 15000,
        }
      );
      reply = openaiRes.data.choices?.[0]?.message?.content || 'The cosmic spheres are reflecting on your question.';
    }

    res.json({
      success: true,
      configured: true,
      reply,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('chatWithAi error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'AI companion response failed. Please try again.' });
  }
};

