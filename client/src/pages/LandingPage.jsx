import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Sparkles, Moon, Sun, ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import StarsBackground from '../components/StarsBackground';

const ZODIAC_SIGNS = [
  { sign: 'Aries', symbol: '♈', date: 'Mar 21 – Apr 19' },
  { sign: 'Taurus', symbol: '♉', date: 'Apr 20 – May 20' },
  { sign: 'Gemini', symbol: '♊', date: 'May 21 – Jun 20' },
  { sign: 'Cancer', symbol: '♋', date: 'Jun 21 – Jul 22' },
  { sign: 'Leo', symbol: '♌', date: 'Jul 23 – Aug 22' },
  { sign: 'Virgo', symbol: '♍', date: 'Aug 23 – Sep 22' },
  { sign: 'Libra', symbol: '♎', date: 'Sep 23 – Oct 22' },
  { sign: 'Scorpio', symbol: '♏', date: 'Oct 23 – Nov 21' },
  { sign: 'Sagittarius', symbol: '♐', date: 'Nov 22 – Dec 21' },
  { sign: 'Capricorn', symbol: '♑', date: 'Dec 22 – Jan 19' },
  { sign: 'Aquarius', symbol: '♒', date: 'Jan 20 – Feb 18' },
  { sign: 'Pisces', symbol: '♓', date: 'Feb 19 – Mar 20' },
];

const FEATURES = [
  { icon: '🔮', title: 'Birth Chart (Kundli)', desc: 'Generate your complete Vedic birth chart with planetary positions and house analysis.' },
  { icon: '📅', title: 'Daily Horoscope', desc: 'Receive personalized daily, weekly & monthly predictions for love, career, and health.' },
  { icon: '🤖', title: 'AI Astrology Chatbot', desc: 'Chat with our AI astrologer for personalized cosmic insights based on your birth details.' },
  { icon: '💫', title: 'Planetary Positions', desc: 'Real-time planetary transit analysis to understand cosmic influences on your life.' },
  { icon: '📄', title: 'Kundli PDF Export', desc: 'Download your complete birth chart as a beautifully formatted PDF report.' },
  { icon: '🌙', title: 'Moon Phase Tracker', desc: 'Stay attuned to lunar energies with our precise moon phase tracking system.' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', sign: 'Leo ♌', text: 'The birth chart analysis was incredibly accurate. I was amazed at how well it described my personality.' },
  { name: 'Arjun Mehta', sign: 'Scorpio ♏', text: 'The daily horoscopes have become part of my morning routine. Surprisingly insightful!' },
  { name: 'Ananya Patel', sign: 'Pisces ♓', text: 'The AI chatbot gave me guidance during a difficult career decision. Truly helpful.' },
];

const LandingPage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-cosmic-950' : 'bg-gradient-to-br from-purple-50 to-indigo-50'} relative overflow-hidden`}>
      {isDark && <StarsBackground />}

      {/* ─── Hero Section ─────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        {/* Cosmic orbs */}
        {isDark && (
          <>
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cosmic-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-aurora-purple/20 rounded-full blur-3xl" />
          </>
        )}

        {/* Animated zodiac wheel */}
        <motion.div
          className="relative w-64 h-64 md:w-80 md:h-80 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-gold-500/20"
          >
            {ZODIAC_SIGNS.map((z, i) => (
              <div
                key={z.sign}
                className="absolute w-8 h-8 flex items-center justify-center"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${i * 30}deg) translate(-50%, -150%) rotate(-${i * 30}deg)`,
                  transformOrigin: '50% 150%',
                }}
              >
                <span className="text-gold-400/60 text-lg">{z.symbol}</span>
              </div>
            ))}
          </motion.div>

          {/* Inner ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-8 rounded-full border border-aurora-purple/30"
          />

          {/* Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 bg-gradient-to-br from-gold-500 to-aurora-purple rounded-full flex items-center justify-center shadow-gold"
            >
              <Star className="text-white" size={48} fill="white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="max-w-4xl"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm font-medium mb-6"
          >
            <Sparkles size={14} /> Powered by AstrologyAPI & AI
          </motion.div>

          <h1 className="font-cinzel text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className={isDark ? 'text-white' : 'text-slate-900'}>Discover Your </span>
            <span className="text-gradient-gold">Cosmic Destiny</span>
          </h1>

          <p className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
            Unlock the secrets of the stars with personalized birth charts, daily horoscopes,
            and AI-powered astrology insights. Your cosmic journey begins here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" id="hero-cta-register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gold flex items-center gap-2 text-base"
              >
                Start Your Journey <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link to="/login" id="hero-cta-login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline flex items-center gap-2 text-base"
              >
                <Moon size={18} /> Sign In
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mt-16"
        >
          {[['10K+', 'Birth Charts Generated'], ['500K+', 'Horoscopes Served'], ['98%', 'Accuracy Rate'], ['12', 'Zodiac Signs']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="font-cinzel text-3xl font-bold text-gradient-gold">{val}</div>
              <div className={`text-sm mt-1 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── Zodiac Signs Section ─────────────────────── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-heading">Your Zodiac Sign</h2>
            <p className={`${isDark ? 'text-white/50' : 'text-slate-500'}`}>Discover the cosmic blueprint of all 12 signs</p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {ZODIAC_SIGNS.map((z, i) => (
              <motion.div
                key={z.sign}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className={`rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 ${
                  isDark
                    ? 'bg-white/5 border border-white/10 hover:border-gold-500/50 hover:bg-white/10'
                    : 'bg-white border border-slate-200 hover:border-purple-300 hover:shadow-lg'
                }`}
              >
                <div className="text-3xl mb-2">{z.symbol}</div>
                <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>{z.sign}</div>
                <div className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>{z.date}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section ─────────────────────────── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">Cosmic Features</h2>
            <p className={`${isDark ? 'text-white/50' : 'text-slate-500'}`}>Everything you need for your astrological journey</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] group ${
                  isDark
                    ? 'bg-white/5 border-white/10 hover:border-gold-500/30'
                    : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xl'
                }`}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className={`font-semibold text-lg mb-2 group-hover:text-gold-400 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {f.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-heading">Cosmic Testimonials</h2>
            <p className={`${isDark ? 'text-white/50' : 'text-slate-500'}`}>What our cosmic community says</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`p-6 rounded-2xl border ${
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <p className={`text-sm leading-relaxed mb-4 italic ${isDark ? 'text-white/60' : 'text-slate-600'}`}>"{t.text}"</p>
                <div>
                  <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.name}</p>
                  <p className="text-gold-400 text-xs mt-1">{t.sign}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────── */}
      <section className="relative z-10 py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`max-w-3xl mx-auto text-center rounded-3xl p-12 border ${
            isDark
              ? 'bg-gradient-to-br from-cosmic-800/60 to-aurora-purple/20 border-gold-500/20'
              : 'bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-200'
          }`}
        >
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-gradient-gold mb-4">
            Begin Your Cosmic Journey
          </h2>
          <p className={`mb-8 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
            Join thousands who've discovered their cosmic destiny. Free to start.
          </p>
          <Link to="/register" id="final-cta-register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-gold text-lg"
            >
              Explore the Stars ✨
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 border-t py-8 px-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Star className="text-gold-500" size={20} fill="currentColor" />
            <span className="font-cinzel text-lg font-bold text-gradient-gold">Mavi-AstroVision</span>
          </div>
          <p className={`text-sm ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
            © 2024 Mavi-AstroVision. Cosmic guidance for every soul.
          </p>
          <div className="flex gap-4 text-sm">
            <Link to="/privacy" className={`${isDark ? 'text-white/40 hover:text-white/70' : 'text-slate-400 hover:text-slate-600'} transition-colors`}>Privacy</Link>
            <Link to="/terms" className={`${isDark ? 'text-white/40 hover:text-white/70' : 'text-slate-400 hover:text-slate-600'} transition-colors`}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
