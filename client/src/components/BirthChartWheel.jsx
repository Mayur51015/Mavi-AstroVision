import React from 'react';
import { motion } from 'framer-motion';

const BirthChartWheel = ({ chartData }) => {
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, rotate: -180 },
    visible: { opacity: 1, rotate: 0 }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className="relative w-80 h-80"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Outer circle */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
          {/* Background circle */}
          <circle cx="200" cy="200" r="180" fill="rgba(107, 90, 142, 0.1)" stroke="#6b5a8e" strokeWidth="2" />
          
          {/* Center circle */}
          <circle cx="200" cy="200" r="20" fill="#f5c842" />
          
          {/* Zodiac signs markers */}
          {zodiacSigns.map((sign, index) => {
            const angle = (index * 30 - 90) * (Math.PI / 180);
            const x = 200 + 150 * Math.cos(angle);
            const y = 200 + 150 * Math.sin(angle);
            
            return (
              <motion.g key={sign} variants={itemVariants}>
                <circle cx={x} cy={y} r="8" fill={index === 0 ? '#f5c842' : '#c9a0ff'} />
                <text x={x} y={y} textAnchor="middle" dy="0.3em" fill="#f5c842" fontSize="14" fontWeight="bold">
                  {sign.substring(0, 3)}
                </text>
              </motion.g>
            );
          })}

          {/* House lines */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((house) => {
            const angle = (house * 30 - 90) * (Math.PI / 180);
            const x2 = 200 + 180 * Math.cos(angle);
            const y2 = 200 + 180 * Math.sin(angle);
            return (
              <line
                key={`line-${house}`}
                x1="200"
                y1="200"
                x2={x2}
                y2={y2}
                stroke="#6b5a8e"
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}
        </svg>

        {/* Chart data display */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center bg-cosmic-900/80 backdrop-blur px-4 py-2 rounded-lg">
            <p className="text-gold-400 font-semibold">
              {chartData?.sunSign || 'Loading...'}
            </p>
            <p className="text-cosmic-300 text-xs">Sun Sign</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Legend */}
      <motion.div
        className="mt-8 grid grid-cols-3 gap-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div>
          <p className="text-cosmic-400 text-sm">☀️ Sun</p>
          <p className="text-gold-400 font-semibold">{chartData?.sunSign}</p>
        </div>
        <div>
          <p className="text-cosmic-400 text-sm">🌙 Moon</p>
          <p className="text-cosmic-300 font-semibold">{chartData?.moonSign || 'N/A'}</p>
        </div>
        <div>
          <p className="text-cosmic-400 text-sm">↑ Ascendant</p>
          <p className="text-cosmic-300 font-semibold">{chartData?.ascendant || 'N/A'}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default BirthChartWheel;
