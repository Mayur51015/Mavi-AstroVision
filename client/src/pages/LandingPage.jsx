import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Sparkles,
  ArrowRight,
  Compass,
  Heart,
  ChevronRight,
  Activity,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Globe,
  BarChart3,
  Moon,
  Sun,
  Award,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import StarsBackground from '../components/StarsBackground';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';

const ZODIAC_SIGNS = [
  { sign: 'Aries', symbol: '♈', element: 'Fire', date: 'Mar 21 – Apr 19' },
  { sign: 'Taurus', symbol: '♉', element: 'Earth', date: 'Apr 20 – May 20' },
  { sign: 'Gemini', symbol: '♊', element: 'Air', date: 'May 21 – Jun 20' },
  { sign: 'Cancer', symbol: '♋', element: 'Water', date: 'Jun 21 – Jul 22' },
  { sign: 'Leo', symbol: '♌', element: 'Fire', date: 'Jul 23 – Aug 22' },
  { sign: 'Virgo', symbol: '♍', element: 'Earth', date: 'Aug 23 – Sep 22' },
  { sign: 'Libra', symbol: '♎', element: 'Air', date: 'Sep 23 – Oct 22' },
  { sign: 'Scorpio', symbol: '♏', element: 'Water', date: 'Oct 23 – Nov 21' },
  { sign: 'Sagittarius', symbol: '♐', element: 'Fire', date: 'Nov 22 – Dec 21' },
  { sign: 'Capricorn', symbol: '♑', element: 'Earth', date: 'Dec 22 – Jan 19' },
  { sign: 'Aquarius', symbol: '♒', element: 'Air', date: 'Jan 20 – Feb 18' },
  { sign: 'Pisces', symbol: '♓', element: 'Water', date: 'Feb 19 – Mar 20' },
];

const LIFE_MAP_PILLARS = [
  {
    pillar: 'Personal Blueprint',
    desc: 'Mathematical decoding of your psychological core through your Sun, Moon, and Ascendant placements.',
    icon: <Sparkles className="w-5 h-5 text-gold-400" />,
    badge: 'Core Identity',
    placement: 'Sun • Moon • Ascendant',
  },
  {
    pillar: 'Career & Ambition',
    desc: 'Vocational alignment, public legacy, and professional strengths decoded through your Midheaven and 10th House.',
    icon: <Layers className="w-5 h-5 text-iris-400" />,
    badge: 'Vocation & Legacy',
    placement: 'Midheaven • 10th House • Saturn',
  },
  {
    pillar: 'Love & Relationships',
    desc: 'Relational resonance, interpersonal reciprocity, and emotional security through Venus, Mars, and the 7th House.',
    icon: <Heart className="w-5 h-5 text-rose-400" />,
    badge: 'Harmony & Bond',
    placement: 'Venus • 7th House • Mars',
  },
  {
    pillar: 'Growth & Transformation',
    desc: 'Evolutionary challenges, deep resilience patterns, and cognitive expansion mapped through Jupiter and Pluto.',
    icon: <Compass className="w-5 h-5 text-emerald-400" />,
    badge: 'Evolutionary Arc',
    placement: 'Jupiter • Pluto • North Node',
  },
  {
    pillar: 'Current Celestial Cycle',
    desc: 'Real-time planetary transits and astronomical seasons mapped to your natal blueprint for conscious timing.',
    icon: <Clock className="w-5 h-5 text-amber-400" />,
    badge: 'Active Seasons',
    placement: 'Current Transits • Ephemeris',
  },
];

const SCORECARD_DIMENSIONS = [
  { name: 'Self Awareness', score: 88, desc: 'Clarity of core values & purpose' },
  { name: 'Career Focus', score: 82, desc: 'Professional trajectory & determination' },
  { name: 'Communication', score: 79, desc: 'Intellectual dialogue & mental agility' },
  { name: 'Relationships', score: 85, desc: 'Empathy & interpersonal harmony' },
  { name: 'Creativity', score: 91, desc: 'Intuitive expression & visionary thinking' },
  { name: 'Growth Potential', score: 86, desc: 'Evolutionary resilience & transformation' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Guided Onboarding',
    desc: 'Input birth date, exact time, and birthplace with verified global geographic coordinates.',
  },
  {
    step: '02',
    title: 'Astronomy Engine Synthesis',
    desc: 'Our high-precision ephemeris calculates your planetary positions, house cusps, and major aspects.',
  },
  {
    step: '03',
    title: '5-Pillar Life Map & Scorecard',
    desc: 'Access your interactive archetype matrix and dimensional scorecards for self-reflection.',
  },
  {
    step: '04',
    title: 'Vector PDF Reports',
    desc: 'Generate downloadable, publication-grade PDF reports with your complete cosmic synthesis.',
  },
];

const LandingPage = () => {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden bg-obsidian-950 text-slate-100">
      {isDark && <StarsBackground />}

      {/* ─── Hero Section ─────────────────────────────── */}
      <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-28 pb-20">
        {/* Subtle celestial depth light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-iris-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl relative space-y-6"
        >
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-900/90 border border-gold-500/25 text-gold-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Sparkles size={13} className="text-gold-400 animate-pulse" />
            <span>Introducing Cosmic Life Map™</span>
            <span className="w-1 h-1 rounded-full bg-gold-400/50" />
            <span className="text-slate-400 lowercase font-normal">v2.4 SaaS</span>
          </div>

          {/* Main Title */}
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
            <span className="text-white">Understand Your Personal</span>
            <br />
            <span className="text-gradient-gold">Cosmic Pattern</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300/80 max-w-2xl mx-auto leading-relaxed font-normal">
            Move beyond generic horoscopes. Mavi-AstroVision provides an enterprise-grade celestial intelligence platform connecting your{' '}
            <strong className="text-white font-medium">Personal Blueprint</strong>,{' '}
            <strong className="text-white font-medium">Career Ambition</strong>,{' '}
            <strong className="text-white font-medium">Relationships</strong>, and{' '}
            <strong className="text-white font-medium">Growth Cycles</strong> — grounded in verified ephemeris mathematics.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
            <Link to="/onboarding" id="hero-cta-lifemap">
              <Button variant="primary" size="lg" className="w-full sm:w-auto font-semibold">
                Generate My Cosmic Life Map™ <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/cosmic-timeline" id="hero-cta-timeline">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <Clock size={16} /> Explore Cosmic Timeline
              </Button>
            </Link>
          </div>

          {/* Trust & Architecture Pills */}
          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5 bg-obsidian-900/60 px-3 py-1.5 rounded-md border border-obsidian-800">
              <Cpu size={14} className="text-emerald-400" /> Astronomy Engine Ephemeris
            </span>
            <span className="flex items-center gap-1.5 bg-obsidian-900/60 px-3 py-1.5 rounded-md border border-obsidian-800">
              <Globe size={14} className="text-gold-400" /> High-Precision Geocoding
            </span>
            <span className="flex items-center gap-1.5 bg-obsidian-900/60 px-3 py-1.5 rounded-md border border-obsidian-800">
              <BarChart3 size={14} className="text-iris-400" /> Publication-Grade PDF Reports
            </span>
          </div>
        </motion.div>

        {/* ─── Hero Product Preview Dashboard Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl mt-12 px-2"
        >
          <div className="rounded-2xl border border-obsidian-700/80 bg-obsidian-900/90 shadow-2xl p-4 sm:p-6 backdrop-blur-xl relative">
            {/* Top Mock Window Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-obsidian-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-500">mavi-astrovision.saas/engine-preview</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-emerald-400">Ephemeris Synchronized</span>
              </div>
            </div>

            {/* Dashboard Telemetry Mock */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              {/* Telemetry 1: Big Three */}
              <div className="p-4 rounded-xl bg-obsidian-950/70 border border-obsidian-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Natal Core</span>
                  <Sun size={14} className="text-gold-400" />
                </div>
                <div className="text-lg font-bold text-white font-cinzel">Sun in Aries</div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" /> 24° 15&apos; • 1st House
                </div>
              </div>

              {/* Telemetry 2: Moon */}
              <div className="p-4 rounded-xl bg-obsidian-950/70 border border-obsidian-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Emotional Anchor</span>
                  <Moon size={14} className="text-iris-400" />
                </div>
                <div className="text-lg font-bold text-white font-cinzel">Moon in Taurus</div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-iris-400" /> 08° 30&apos; • 2nd House
                </div>
              </div>

              {/* Telemetry 3: Ascendant */}
              <div className="p-4 rounded-xl bg-obsidian-950/70 border border-obsidian-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Rising Axis</span>
                  <Compass size={14} className="text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-white font-cinzel">Scorpio Ascendant</div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 18° 42&apos; • East Horizon
                </div>
              </div>

              {/* Telemetry 4: Life Map Index */}
              <div className="p-4 rounded-xl bg-obsidian-950/70 border border-obsidian-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Synthesis Index</span>
                  <Award size={14} className="text-gold-400" />
                </div>
                <div className="text-lg font-bold text-gold-400 font-cinzel">87 / 100</div>
                <div className="text-xs text-slate-400">High Archetype Balance</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Signature Spotlight: The Five Pillars ─────────────────── */}
      <section className="relative z-10 py-24 px-4 sm:px-6 bg-obsidian-900/40 border-y border-obsidian-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3"
          >
            <Badge variant="gold" className="text-[11px] font-semibold tracking-wider uppercase">
              Signature Product Architecture
            </Badge>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-tight">
              The Five Pillars of Your Cosmic Life Map™
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              Synthesizing astronomical house geometry and planetary archetypes into a structured, holistic matrix for career, relationships, and conscious evolution.
            </p>
          </motion.div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {LIFE_MAP_PILLARS.map((p, idx) => (
              <motion.div
                key={p.pillar}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
              >
                <div className="card-saas-hover p-6 h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-obsidian-800/80 border border-obsidian-700 flex items-center justify-center">
                        {p.icon}
                      </div>
                      <Badge variant="outline" className="text-[10px] text-slate-300">
                        {p.badge}
                      </Badge>
                    </div>
                    <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
                      {p.pillar}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">{p.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-obsidian-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>{p.placement}</span>
                    <ChevronRight size={13} className="text-slate-500" />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Scorecard Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
            >
              <div className="card-saas p-6 h-full flex flex-col justify-between bg-gradient-to-br from-obsidian-900 via-obsidian-900 to-gold-950/20 border-gold-500/30">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                      <Activity size={20} />
                    </div>
                    <Badge variant="gold" className="text-[10px]">
                      6 Dimensions
                    </Badge>
                  </div>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Cosmic Scorecard™
                  </h3>
                  <p className="text-xs text-slate-300/80 leading-relaxed font-normal">
                    Evaluate your archetypal profile across Self-Awareness, Career Focus, Relationships, Creativity, and Evolution with normalized statistical metrics.
                  </p>
                </div>
                <div className="pt-4">
                  <Link to="/onboarding">
                    <Button variant="primary" size="sm" className="w-full font-medium text-xs">
                      Calculate My Scorecard <ChevronRight size={13} />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 6-Dimension Scorecard Teaser ─────────────────────── */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <Badge variant="iris" className="text-[11px] font-semibold tracking-wider uppercase">
              Holistic Archetype Assessment
            </Badge>
            <h2 className="font-cinzel text-3xl font-bold text-white">
              6-Dimensional Astrological Scorecard
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Real calculations map celestial angles to self-reflection metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCORECARD_DIMENSIONS.map((dim, idx) => (
              <div key={dim.name} className="card-saas p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{dim.name}</span>
                  <span className="font-mono text-gold-400 font-bold">{dim.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-obsidian-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 to-amber-300 rounded-full transition-all duration-500"
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">{dim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works (4 Steps) ───────────────────── */}
      <section className="relative z-10 py-20 px-4 sm:px-6 bg-obsidian-900/30 border-y border-obsidian-800/80">
        <div className="max-w-5xl mx-auto space-y-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3"
          >
            <Badge variant="outline" className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Structured Methodology
            </Badge>
            <h2 className="font-cinzel text-3xl font-bold text-white">How Mavi-AstroVision Works</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">
              From birth coordinates to comprehensive publication-grade PDF reports in four smooth steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-saas p-6 relative overflow-hidden group hover:border-gold-500/30 transition-all"
              >
                <div className="text-3xl font-cinzel font-bold text-gold-500/25 mb-3 group-hover:text-gold-400/40 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Zodiac Exploration Strip ─────────────────── */}
      <section className="relative z-10 py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Explore the 12 Zodiac Archetypes
            </h2>
            <p className="text-xs text-slate-400">
              Each sign anchors specific houses and planetary energies across your Cosmic Life Map.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {ZODIAC_SIGNS.map((z, i) => (
              <motion.div
                key={z.sign}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
              >
                <Link
                  to={`/zodiac/${z.sign.toLowerCase()}`}
                  className="block card-saas p-3.5 text-center hover:border-gold-500/40 transition-all duration-200 group"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{z.symbol}</div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-gold-400 transition-colors">
                    {z.sign}
                  </div>
                  <div className="text-[10px] text-slate-500">{z.date}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Grounding / Ethical Framing ──── */}
      <section className="relative z-10 py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card-saas p-8 border-obsidian-700/80 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 uppercase tracking-wider">
            <ShieldCheck size={16} /> Grounded Ephemeris & Mindful Self-Reflection
          </div>
          <h3 className="font-cinzel text-xl font-bold text-white">
            Astrology as an Interpretive Mirror, Not Deterministic Fatalism
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            Mavi-AstroVision combines real astronomical planetary coordinates computed via Western Tropical Ephemeris with psychological archetypes. Cosmic Life Map™ and Cosmic Scorecards are engineered as cognitive frameworks for self-awareness, personal discernment, and timing reflection — never deterministic predictions.
          </p>
        </div>
      </section>

      {/* ─── Final Call To Action ─────────────────────── */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center card-saas p-10 sm:p-12 border-gold-500/30 bg-gradient-to-b from-obsidian-900 to-obsidian-950 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={13} /> Your Cosmic Blueprint Awaits
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-gradient-gold">
            Begin Your Cosmic Life Map™
          </h2>
          <p className="text-slate-300/80 text-sm leading-relaxed max-w-md mx-auto">
            Experience the interactive matrix, receive daily celestial weather, and unlock your publication-grade PDF report.
          </p>
          <div className="pt-2">
            <Link to="/onboarding" id="final-cta-onboarding">
              <Button variant="primary" size="lg" className="shadow-cosmic font-semibold">
                Start Guided Onboarding <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
