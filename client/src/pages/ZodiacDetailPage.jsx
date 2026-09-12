import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowLeft,
  Heart,
  Briefcase,
  Moon,
  Shield,
  Star,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { ZODIAC_SIGNS } from '../utils/astrologyData';
import api from '../utils/api';

export default function ZodiacDetailPage() {
  const { sign: signParam } = useParams();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'love', 'career', 'correspondences'
  const [dailyHoroscope, setDailyHoroscope] = useState(null);
  const [loadingHoroscope, setLoadingHoroscope] = useState(false);

  const sign =
    ZODIAC_SIGNS.find((s) => s.id === signParam?.toLowerCase() || s.name.toLowerCase() === signParam?.toLowerCase()) ||
    ZODIAC_SIGNS[0];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHoroscope();
  }, [sign.name]);

  const fetchHoroscope = async () => {
    try {
      setLoadingHoroscope(true);
      const res = await api.get(`/horoscope/daily/${sign.name}`);
      if (res.data.success) {
        setDailyHoroscope(res.data.horoscope);
      }
    } catch (err) {
      console.error('Error loading daily horoscope:', err);
    } finally {
      setLoadingHoroscope(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-950 via-cosmic-900 to-cosmic-800 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <Link
          to="/zodiac"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft size={14} /> Back to All Zodiac Signs
        </Link>

        {/* Hero Card */}
        <div className="card-cosmic p-6 sm:p-10 relative overflow-hidden border border-white/10">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: sign.color }}
          />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            <span
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-5xl font-bold shadow-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15"
              style={{ color: sign.color }}
            >
              {sign.symbol}
            </span>

            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 font-semibold uppercase tracking-wider">
                  {sign.glyphName}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
                  {sign.dates}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
                  {sign.polarity}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-white">
                {sign.name}
              </h1>

              <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed">
                {sign.summary}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs text-white/60">
                <span>
                  <strong className="text-white">Element:</strong> {sign.element}
                </span>
                <span>•</span>
                <span>
                  <strong className="text-white">Modality:</strong> {sign.modality}
                </span>
                <span>•</span>
                <span>
                  <strong className="text-white">Ruler:</strong> {sign.ruler}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Transit Insight Banner */}
        {dailyHoroscope && (
          <div className="card-cosmic p-5 border-l-4 border-gold-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold">
                <Calendar size={13} /> Today's Celestial Transit for {sign.name}
              </div>
              <p className="text-xs text-white/80 leading-relaxed max-w-3xl">
                {dailyHoroscope.prediction}
              </p>
            </div>
            <Link
              to="/horoscope"
              className="whitespace-nowrap px-4 py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-xs font-semibold text-gold-300 transition-colors"
            >
              Full Horoscope →
            </Link>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Personality & Mythology', icon: <Sparkles size={15} /> },
            { id: 'love', label: 'Love & Compatibility', icon: <Heart size={15} /> },
            { id: 'career', label: 'Career & Ambition', icon: <Briefcase size={15} /> },
            { id: 'correspondences', label: 'Cosmic Correspondences', icon: <Moon size={15} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview & Mythology */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-cosmic p-6 space-y-3">
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={18} /> Core Strengths & Superpowers
                </h3>
                <ul className="space-y-2.5 text-xs text-white/80">
                  {sign.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {str}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-cosmic p-6 space-y-3">
                <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                  <AlertCircle size={18} /> Shadows & Growth Edges
                </h3>
                <ul className="space-y-2.5 text-xs text-white/80">
                  {sign.shadows.map((sh, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {sh}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card-cosmic p-6 sm:p-8 space-y-3">
              <h3 className="text-lg font-cinzel font-bold text-white flex items-center gap-2">
                <BookOpen size={18} className="text-gold-400" /> Mythological Origins
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                {sign.mythology}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Love & Compatibility */}
        {activeTab === 'love' && (
          <div className="space-y-6">
            <div className="card-cosmic p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Heart size={18} className="text-rose-400" /> High Celestial Compatibility
              </h3>
              <p className="text-xs text-white/70">
                {sign.name} resonates deeply with these signs due to shared elemental chemistry or harmonious planetary frequencies:
              </p>
              <div className="flex flex-wrap gap-3">
                {sign.loveCompatibility.high.map((cSign) => (
                  <Link
                    key={cSign}
                    to={`/zodiac/${cSign.toLowerCase()}`}
                    className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                  >
                    <span>✨ {cSign}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-cosmic p-6 space-y-3">
                <h4 className="text-sm font-bold text-amber-300">Moderate Dynamic</h4>
                <div className="flex flex-wrap gap-2">
                  {sign.loveCompatibility.moderate.map((cSign) => (
                    <span
                      key={cSign}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs"
                    >
                      {cSign}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-white/50 mt-2">
                  Requires clear communication and conscious boundary honoring to blossom into lifelong bonds.
                </p>
              </div>

              <div className="card-cosmic p-6 space-y-3">
                <h4 className="text-sm font-bold text-rose-400">Challenging / Karmic Lessons</h4>
                <div className="flex flex-wrap gap-2">
                  {sign.loveCompatibility.challenging.map((cSign) => (
                    <span
                      key={cSign}
                      className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs"
                    >
                      {cSign}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-white/50 mt-2">
                  Spark high passion and evolutionary growth, but need patience to transcend instinctive friction.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Career & Talents */}
        {activeTab === 'career' && (
          <div className="card-cosmic p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-cinzel font-bold text-white flex items-center gap-2 mb-2">
                <Briefcase size={18} className="text-gold-400" /> Ideal Vocations & Career Paths
              </h3>
              <p className="text-xs text-white/70">
                Where {sign.name}'s natural gifts, problem-solving intelligence, and intrinsic motivators thrive best:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {sign.careers.map((career) => (
                <div
                  key={career}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/30 text-xs font-semibold text-white/90 transition-all flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-gold-400" />
                  {career}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Correspondences */}
        {activeTab === 'correspondences' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-cosmic p-5 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-purple-400 font-bold block">
                TAROT CARD
              </span>
              <h4 className="text-base font-bold text-white">{sign.tarotCard}</h4>
              <p className="text-xs text-white/50">Archetypal major arcana guide</p>
            </div>

            <div className="card-cosmic p-5 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold block">
                CRYSTAL / GEMSTONE
              </span>
              <h4 className="text-base font-bold text-white">{sign.stone}</h4>
              <p className="text-xs text-white/50">Resonating energetic minerals</p>
            </div>

            <div className="card-cosmic p-5 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-gold-400 font-bold block">
                LUCKY NUMBERS
              </span>
              <h4 className="text-base font-bold text-white">{sign.luckyNumbers.join(', ')}</h4>
              <p className="text-xs text-white/50">Harmonic numerological keys</p>
            </div>

            <div className="card-cosmic p-5 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold block">
                LUCKY DAY
              </span>
              <h4 className="text-base font-bold text-white">{sign.luckyDay}</h4>
              <p className="text-xs text-white/50">Ruled by celestial sovereign {sign.ruler}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
