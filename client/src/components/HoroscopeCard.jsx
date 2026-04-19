import { motion } from 'framer-motion';
import { Heart, Briefcase, Activity, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const zodiacSymbols = {
  aries:'♈', taurus:'♉', gemini:'♊', cancer:'♋', leo:'♌', virgo:'♍',
  libra:'♎', scorpio:'♏', sagittarius:'♐', capricorn:'♑', aquarius:'♒', pisces:'♓'
};

const categoryConfig = {
  love: { icon: <Heart size={16} />, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  career: { icon: <Briefcase size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  health: { icon: <Activity size={16} />, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  general: { icon: <Star size={16} />, color: 'text-gold-400', bg: 'bg-gold-500/10', border: 'border-gold-500/20' },
};

const HoroscopeCard = ({ horoscope, index = 0, onClick }) => {
  const { isDark } = useTheme();
  const category = horoscope?.category || 'general';
  const config = categoryConfig[category] || categoryConfig.general;
  const sign = horoscope?.zodiacSign || 'aries';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
        isDark
          ? `bg-white/5 border-white/10 hover:border-gold-500/40 hover:bg-white/8`
          : `bg-white border-slate-200 hover:border-purple-300 hover:shadow-lg`
      }`}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${config.bg} rounded-2xl`} />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
              {zodiacSymbols[sign] || '⭐'}
            </div>
            <div>
              <h3 className={`font-cinzel font-bold capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {sign.charAt(0).toUpperCase() + sign.slice(1)}
              </h3>
              <p className={`text-xs capitalize ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                {horoscope?.type || 'daily'} horoscope
              </p>
            </div>
          </div>

          {/* Category badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${config.color} ${config.bg} ${config.border}`}>
            {config.icon}
            <span className="capitalize">{category}</span>
          </div>
        </div>

        {/* Prediction */}
        <p className={`text-sm leading-relaxed line-clamp-4 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
          {horoscope?.prediction || 'Loading cosmic guidance...'}
        </p>

        {/* Footer */}
        <div className={`mt-4 pt-4 border-t flex items-center justify-between ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
          <span className={`text-xs ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
            {horoscope?.date || new Date().toLocaleDateString()}
          </span>
          <span className={`text-xs font-medium ${config.color}`}>Read more →</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HoroscopeCard;
