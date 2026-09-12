import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';

const ZODIAC_SECTORS = [
  { sign: 'Aries', symbol: '♈', element: 'Fire', color: '#EF4444', start: 0 },
  { sign: 'Taurus', symbol: '♉', element: 'Earth', color: '#10B981', start: 30 },
  { sign: 'Gemini', symbol: '♊', element: 'Air', color: '#F59E0B', start: 60 },
  { sign: 'Cancer', symbol: '♋', element: 'Water', color: '#3B82F6', start: 90 },
  { sign: 'Leo', symbol: '♌', element: 'Fire', color: '#F97316', start: 120 },
  { sign: 'Virgo', symbol: '♍', element: 'Earth', color: '#059669', start: 150 },
  { sign: 'Libra', symbol: '♎', element: 'Air', color: '#EC4899', start: 180 },
  { sign: 'Scorpio', symbol: '♏', element: 'Water', color: '#8B5CF6', start: 210 },
  { sign: 'Sagittarius', symbol: '♐', element: 'Fire', color: '#6366F1', start: 240 },
  { sign: 'Capricorn', symbol: '♑', element: 'Earth', color: '#047857', start: 270 },
  { sign: 'Aquarius', symbol: '♒', element: 'Air', color: '#06B6D4', start: 300 },
  { sign: 'Pisces', symbol: '♓', element: 'Water', color: '#A855F7', start: 330 },
];

const ASPECT_COLORS = {
  Conjunction: '#EAB308', // Gold
  Sextile: '#38BDF8',    // Cyan
  Square: '#F43F5E',     // Rose
  Trine: '#3B82F6',      // Blue
  Opposition: '#EF4444',  // Red
};

export default function BirthChartWheel({ chartData, onSelectPlanet }) {
  const [activePlanet, setActivePlanet] = useState(null);
  const [activeAspect, setActiveAspect] = useState(null);

  // Center coordinate and radius parameters
  const CX = 300;
  const CY = 300;
  const R_OUTER = 270;
  const R_ZODIAC_INNER = 225;
  const R_HOUSES = 190;
  const R_PLANETS = 145;
  const R_CENTER = 70;

  // Ascendant angle (place ASC at 9 o'clock = 180 degrees in screen coordinate, counter-clockwise)
  const ascLon = chartData?.angles?.ascendant?.longitude || 0;
  // Offset to rotate wheel so Ascendant is at 180 degrees
  // In standard SVG math: angle = ascLon - offset -> we want ascLon to map to 180°
  const rotationOffset = 180 - ascLon;

  const toRad = (deg) => (deg * Math.PI) / 180;

  // Convert zodiac longitude to SVG (x, y) coordinates
  const lonToCoords = (lon, r) => {
    // Screen angle: 180 - (lon + rotationOffset) for counter-clockwise orientation
    const angle = (lon + rotationOffset) % 360;
    // standard trigonometry with 0° at 3 o'clock
    const rad = toRad(angle);
    return {
      x: CX - r * Math.cos(rad),
      y: CY - r * Math.sin(rad),
      angle,
    };
  };

  const planets = chartData?.planets || [];
  const houses = chartData?.houses || [];
  const aspects = chartData?.aspects || [];
  const bigThree = chartData?.bigThree;

  // Generate SVG path for an arc between two angles
  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = {
      x: x - radius * Math.cos(toRad(startAngle + rotationOffset)),
      y: y - radius * Math.sin(toRad(startAngle + rotationOffset)),
    };
    const end = {
      x: x - radius * Math.cos(toRad(endAngle + rotationOffset)),
      y: y - radius * Math.sin(toRad(endAngle + rotationOffset)),
    };
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
  };

  const handlePlanetClick = (p) => {
    setActivePlanet(p);
    if (onSelectPlanet) onSelectPlanet(p);
  };

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center gap-8 w-full">
      {/* Interactive Wheel SVG Container */}
      <div className="relative w-full max-w-[560px] aspect-square flex items-center justify-center select-none">
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full drop-shadow-[0_0_35px_rgba(212,175,55,0.15)]"
        >
          <defs>
            {/* Ambient Background Radial Glow */}
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2A1B4E" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#120A2A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#080414" stopOpacity="1" />
            </radialGradient>

            <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6C667" />
              <stop offset="50%" stopColor="#A47B25" />
              <stop offset="100%" stopColor="#F7DF94" />
            </linearGradient>
          </defs>

          {/* Deep Space Background Circles */}
          <circle cx={CX} cy={CY} r={R_OUTER + 8} fill="#0A051B" stroke="url(#goldBorder)" strokeWidth="2" opacity="0.6" />
          <circle cx={CX} cy={CY} r={R_OUTER} fill="url(#centerGlow)" />
          <circle cx={CX} cy={CY} r={R_ZODIAC_INNER} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <circle cx={CX} cy={CY} r={R_HOUSES} fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx={CX} cy={CY} r={R_PLANETS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* 12 Zodiac Sectors Ring */}
          {ZODIAC_SECTORS.map((z, idx) => {
            const midLon = z.start + 15;
            const glyphPos = lonToCoords(midLon, (R_OUTER + R_ZODIAC_INNER) / 2);
            const dividerPos = lonToCoords(z.start, R_OUTER);
            const dividerInner = lonToCoords(z.start, R_ZODIAC_INNER);

            return (
              <g key={z.sign} className="transition-all duration-300">
                {/* Sector divider line */}
                <line
                  x1={dividerInner.x}
                  y1={dividerInner.y}
                  x2={dividerPos.x}
                  y2={dividerPos.y}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1.5"
                />

                {/* Zodiac Sign Glyph */}
                <text
                  x={glyphPos.x}
                  y={glyphPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={z.color}
                  fontSize="18"
                  fontWeight="bold"
                  className="cursor-pointer hover:scale-125 transition-transform"
                >
                  {z.symbol}
                </text>
              </g>
            );
          })}

          {/* 12 House Cusps & Numbers */}
          {houses.map((h, idx) => {
            const cuspStart = lonToCoords(h.cuspLongitude, R_HOUSES);
            const cuspEnd = lonToCoords(h.cuspLongitude, R_CENTER);
            const isAxis = idx === 0 || idx === 3 || idx === 6 || idx === 9; // ASC, IC, DSC, MC

            // House number label position (midpoint of house)
            const nextCusp = houses[(idx + 1) % 12]?.cuspLongitude || (h.cuspLongitude + 30);
            let midHouseLon = (h.cuspLongitude + nextCusp) / 2;
            if (nextCusp < h.cuspLongitude) midHouseLon = (h.cuspLongitude + nextCusp + 360) / 2;
            const numPos = lonToCoords(midHouseLon, (R_HOUSES + R_PLANETS) / 2);

            return (
              <g key={`house-${h.houseNumber}`}>
                <line
                  x1={cuspStart.x}
                  y1={cuspStart.y}
                  x2={cuspEnd.x}
                  y2={cuspEnd.y}
                  stroke={isAxis ? '#F59E0B' : 'rgba(255,255,255,0.12)'}
                  strokeWidth={isAxis ? 2 : 1}
                />
                <text
                  x={numPos.x}
                  y={numPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isAxis ? '#F59E0B' : 'rgba(255,255,255,0.4)'}
                  fontSize="11"
                  fontFamily="serif"
                  fontWeight={isAxis ? 'bold' : 'normal'}
                >
                  {h.houseNumber}
                </text>
              </g>
            );
          })}

          {/* Planetary Aspect Lines (Chords) in the Center */}
          <g className="opacity-70">
            {aspects.map((asp, idx) => {
              const p1 = planets.find(p => p.name === asp.planet1);
              const p2 = planets.find(p => p.name === asp.planet2);
              if (!p1 || !p2) return null;

              const c1 = lonToCoords(p1.longitude, R_PLANETS);
              const c2 = lonToCoords(p2.longitude, R_PLANETS);

              const isHighlighted =
                activePlanet && (activePlanet.name === p1.name || activePlanet.name === p2.name);
              const strokeColor = ASPECT_COLORS[asp.aspect] || '#A855F7';

              return (
                <line
                  key={`asp-${idx}`}
                  x1={c1.x}
                  y1={c1.y}
                  x2={c2.x}
                  y2={c2.y}
                  stroke={strokeColor}
                  strokeWidth={isHighlighted ? 2.5 : 1}
                  strokeOpacity={activePlanet ? (isHighlighted ? 1 : 0.15) : 0.55}
                  strokeDasharray={asp.aspect === 'Square' || asp.aspect === 'Opposition' ? '4 3' : undefined}
                />
              );
            })}
          </g>

          {/* Planetary Nodes */}
          {planets.map((p) => {
            const coords = lonToCoords(p.longitude, R_PLANETS);
            const isSelected = activePlanet?.id === p.id;

            return (
              <g
                key={p.id}
                onClick={() => handlePlanetClick(p)}
                className="cursor-pointer group"
              >
                {/* Outer halo when active */}
                {isSelected && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="16"
                    fill="rgba(212, 175, 55, 0.25)"
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    className="animate-pulse"
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="11"
                  fill="#170E33"
                  stroke={isSelected ? '#F59E0B' : 'rgba(255,255,255,0.7)'}
                  strokeWidth="1.5"
                  className="transition-all group-hover:scale-125"
                />

                {/* Planet Glyph */}
                <text
                  x={coords.x}
                  y={coords.y + 0.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isSelected ? '#F59E0B' : '#FFFFFF'}
                  fontSize="12"
                  fontWeight="bold"
                >
                  {p.planetSymbol}
                </text>

                {/* Retrograde subscript */}
                {p.retrograde && (
                  <text
                    x={coords.x + 8}
                    y={coords.y + 7}
                    fill="#EF4444"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    ℞
                  </text>
                )}
              </g>
            );
          })}

          {/* Inner Celestial Core Orb */}
          <circle
            cx={CX}
            cy={CY}
            r={R_CENTER}
            fill="#130B29"
            stroke="url(#goldBorder)"
            strokeWidth="2"
            className="filter drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          />

          {/* Core Content: Active Planet or Sun/Ascendant summary */}
          {activePlanet ? (
            <g className="cursor-pointer" onClick={() => setActivePlanet(null)}>
              <text x={CX} y={CY - 22} textAnchor="middle" fill="#F59E0B" fontSize="22" fontWeight="bold">
                {activePlanet.planetSymbol}
              </text>
              <text x={CX} y={CY + 2} textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">
                {activePlanet.name}
              </text>
              <text x={CX} y={CY + 18} textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10">
                {activePlanet.degree}° {activePlanet.sign}
              </text>
              <text x={CX} y={CY + 32} textAnchor="middle" fill="#A855F7" fontSize="9">
                House {activePlanet.house} {activePlanet.retrograde ? '• ℞ Retrograde' : ''}
              </text>
            </g>
          ) : (
            <g>
              <text x={CX} y={CY - 20} textAnchor="middle" fill="#F59E0B" fontSize="10" letterSpacing="2" fontWeight="bold">
                BIRTH CHART
              </text>
              <text x={CX} y={CY - 3} textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">
                {bigThree?.sun?.sign || 'Sun'}
              </text>
              <text x={CX} y={CY + 14} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">
                ASC: {bigThree?.ascendant?.sign || 'Rising'}
              </text>
              <text x={CX} y={CY + 28} textAnchor="middle" fill="#38BDF8" fontSize="9">
                MOON: {bigThree?.moon?.sign || 'Moon'}
              </text>
            </g>
          )}
        </svg>

        {/* Legend Tag */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-cosmic-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-gold-500/30 text-xs text-white/70">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Trine/Sextile</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Square/Opposition</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Conjunction</span>
        </div>
      </div>

      {/* Active Planet or Selected Point Inspector Card */}
      <div className="w-full xl:w-80 flex flex-col gap-4">
        {activePlanet ? (
          <motion.div
            key={activePlanet.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-cosmic p-5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl text-gold-400">{activePlanet.planetSymbol}</span>
                <div>
                  <h4 className="font-bold text-white text-base leading-tight">{activePlanet.name}</h4>
                  <p className="text-xs text-cosmic-300">
                    {activePlanet.formatted} {activePlanet.retrograde && <span className="text-red-400 font-bold ml-1">℞ Retrograde</span>}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePlanet(null)}
                className="text-xs text-white/40 hover:text-white px-2 py-1 rounded bg-white/5"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-white/80 py-1 border-b border-white/5">
                <span className="text-white/50">Zodiac Sign:</span>
                <span className="font-semibold text-gold-300">{activePlanet.sign} ({activePlanet.signSymbol})</span>
              </div>
              <div className="flex justify-between text-white/80 py-1 border-b border-white/5">
                <span className="text-white/50">House Placement:</span>
                <span className="font-semibold text-purple-300">House {activePlanet.house}</span>
              </div>
              <div className="flex justify-between text-white/80 py-1 border-b border-white/5">
                <span className="text-white/50">Element / Modality:</span>
                <span className="font-semibold text-white">{activePlanet.element} • {activePlanet.modality}</span>
              </div>
              <div className="flex justify-between text-white/80 py-1 border-b border-white/5">
                <span className="text-white/50">Ruling Planet:</span>
                <span className="font-semibold text-white">{activePlanet.ruler}</span>
              </div>
            </div>

            {/* Quick Astrological Meaning */}
            <div className="mt-4 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-white/80 leading-relaxed">
              <p className="font-semibold text-purple-300 mb-1 flex items-center gap-1">
                <Sparkles size={12} /> Astrological Influence:
              </p>
              {chartData?.interpretations?.planets?.find(p => p.planet === activePlanet.name)?.summary ||
                `${activePlanet.name} in ${activePlanet.sign} influences your ${activePlanet.house}th house experiences with ${activePlanet.element} energy.`}
            </div>
          </motion.div>
        ) : (
          <div className="card-cosmic p-5 text-center flex flex-col items-center justify-center min-h-[240px]">
            <Sparkles className="text-gold-400 mb-2 animate-bounce" size={24} />
            <h4 className="text-white font-semibold text-sm mb-1">Interactive Celestial Wheel</h4>
            <p className="text-xs text-white/60 max-w-xs mb-3">
              Click on any planet glyph along the orbit or inside the wheel to inspect its exact degree, house placement, and cosmic interpretation.
            </p>
            <div className="w-full grid grid-cols-2 gap-2 text-left text-xs">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <span className="text-white/40 block text-[10px]">SUN SIGN</span>
                <span className="font-bold text-gold-400">{bigThree?.sun?.sign || 'Pending'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <span className="text-white/40 block text-[10px]">MOON SIGN</span>
                <span className="font-bold text-blue-300">{bigThree?.moon?.sign || 'Pending'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <span className="text-white/40 block text-[10px]">RISING SIGN</span>
                <span className="font-bold text-purple-300">{bigThree?.ascendant?.sign || 'Pending'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <span className="text-white/40 block text-[10px]">CHART RULER</span>
                <span className="font-bold text-emerald-400">{chartData?.chartRuler?.planet || 'Pending'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
