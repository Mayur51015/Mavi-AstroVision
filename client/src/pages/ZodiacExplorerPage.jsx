import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Search, Compass, Flame, Droplets, Wind, Mountain, ArrowRight } from 'lucide-react';
import { ZODIAC_SIGNS } from '../utils/astrologyData';

export default function ZodiacExplorerPage() {
  const [filterElement, setFilterElement] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const elements = [
    { label: 'All', icon: <Sparkles size={14} /> },
    { label: 'Fire', icon: <Flame size={14} className="text-red-400" /> },
    { label: 'Earth', icon: <Mountain size={14} className="text-emerald-400" /> },
    { label: 'Air', icon: <Wind size={14} className="text-amber-400" /> },
    { label: 'Water', icon: <Droplets size={14} className="text-blue-400" /> },
  ];

  const filteredSigns = ZODIAC_SIGNS.filter((sign) => {
    const matchesElement = filterElement === 'All' || sign.element === filterElement;
    const matchesSearch =
      sign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sign.glyphName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesElement && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-950 via-cosmic-900 to-cosmic-800 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={13} /> Celestial Archetypes
          </div>
          <h1 className="text-4xl sm:text-5xl font-cinzel font-bold text-gradient-gold">
            Zodiac Constellations
          </h1>
          <p className="text-sm sm:text-base text-white/70">
            Explore the twelve ancient cosmic archetypes, ruling planets, elemental energies, and mythologies that shape human consciousness.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 card-cosmic p-4">
          {/* Element Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {elements.map((el) => (
              <button
                key={el.label}
                onClick={() => setFilterElement(el.label)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filterElement === el.label
                    ? 'bg-gold-500 text-cosmic-950 font-bold shadow-cosmic'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {el.icon}
                {el.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              placeholder="Search sign, traits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cosmic-950/80 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 focus:border-gold-400 outline-none"
            />
          </div>
        </div>

        {/* 12 Zodiac Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSigns.map((sign, idx) => (
            <motion.div
              key={sign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="card-cosmic p-6 relative overflow-hidden group border border-white/10 hover:border-gold-500/50 flex flex-col justify-between"
            >
              {/* Elemental Corner Glow */}
              <div
                className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: sign.color }}
              />

              <div>
                {/* Header: Glyph & Title */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
                      style={{ color: sign.color }}
                    >
                      {sign.symbol}
                    </span>
                    <div>
                      <h3 className="font-cinzel text-xl font-bold text-white group-hover:text-gold-400 transition-colors">
                        {sign.name}
                      </h3>
                      <p className="text-xs text-white/50">{sign.glyphName}</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                    {sign.dates}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      sign.element === 'Fire'
                        ? 'bg-red-500/15 border-red-500/30 text-red-300'
                        : sign.element === 'Earth'
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : sign.element === 'Air'
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        : 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                    }`}
                  >
                    {sign.element}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/60">
                    {sign.modality}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300">
                    Ruler: {sign.ruler}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-white/70 leading-relaxed mb-4 line-clamp-3">
                  {sign.summary}
                </p>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {sign.keywords.slice(0, 4).map((kw) => (
                    <span key={kw} className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={`/zodiac/${sign.id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-gold-500/20 border border-white/10 hover:border-gold-500/40 text-xs font-semibold text-white/80 hover:text-gold-300 flex items-center justify-center gap-2 transition-all group/btn"
              >
                Explore {sign.name} Deep Dive
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
