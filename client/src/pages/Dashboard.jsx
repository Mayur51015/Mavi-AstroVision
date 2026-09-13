import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Sparkles,
  Calendar,
  Heart,
  Compass,
  FileText,
  ArrowRight,
  Download,
  Activity,
  Sun,
  Moon,
  ChevronRight,
  Cpu,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { getUpcomingEvents, getDailyCosmicGuidance, downloadReportPdf } from '../utils/astrologyApi';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const [birthDetail, setBirthDetail] = useState(null);
  const [primaryChart, setPrimaryChart] = useState(null);
  const [dailyGuidance, setDailyGuidance] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user?._id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // 1. Fetch user profile & birth details
      const profileRes = await api.get('/users/profile');
      setBirthDetail(profileRes.data.birthDetail);

      // 2. Fetch primary chart if available
      try {
        const chartRes = await api.get('/chart/primary');
        const chart = chartRes.data?.chartData || chartRes.data?.chart?.chartData;
        if (chart) {
          setPrimaryChart(chart);
        }
      } catch {
        // Optional chart fetch
      }

      // 3. Fetch personalized Daily Cosmic Guidance
      try {
        const guidanceRes = await getDailyCosmicGuidance();
        if (guidanceRes?.success && guidanceRes?.guidance) {
          setDailyGuidance(guidanceRes.guidance);
        }
      } catch {
        // Optional guidance fetch
      }

      // 4. Fetch upcoming astrology events
      try {
        const eventsRes = await getUpcomingEvents(30, 40);
        if (eventsRes?.events) {
          setUpcomingEvents(eventsRes.events.slice(0, 3));
        }
      } catch {
        // Optional events fetch
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadLifeMap = async () => {
    try {
      toast.loading('Generating Cosmic Life Map PDF...', { id: 'pdf-toast' });
      await downloadReportPdf('/reports/cosmic-life-map/pdf', `Cosmic_Life_Map_${user?.firstName || 'Seeker'}.pdf`);
      toast.success('Downloaded successfully! ✨', { id: 'pdf-toast' });
    } catch {
      toast.error('Could not generate PDF. Please ensure your chart is calculated.', { id: 'pdf-toast' });
    }
  };

  if (loading) return <Loader text="Aligning your personal celestial dashboard..." />;

  const bigThree = primaryChart?.bigThree;

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* ─── Top Welcome & Status Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-saas p-6 sm:p-8 bg-gradient-to-r from-obsidian-900 via-obsidian-900 to-obsidian-950 border-obsidian-700/80 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Badge variant="gold" className="text-[10px] tracking-wider uppercase font-semibold">
              Cosmic Home
            </Badge>
            <Badge variant="success" className="text-[10px] tracking-wider uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1 animate-pulse" />
              Ephemeris Active
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-white tracking-tight">
            Welcome back, <span className="text-gradient-gold">{user?.firstName || 'Seeker'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl font-normal">
            Your personal astrological command center. Planetary transits, natal archetypes, and daily cosmic guidance synchronized with your coordinates.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 flex-wrap">
          {!user?.isOnboarded && (
            <Link to="/onboarding">
              <Button variant="primary" size="sm" className="font-semibold">
                Complete Onboarding <ArrowRight size={14} />
              </Button>
            </Link>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadLifeMap}
            className="text-xs"
          >
            <Download size={14} /> Download PDF Dossier
          </Button>
        </div>
      </motion.div>

      {/* ─── 1. Cosmic Snapshot (Big Three) ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-gold-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Your Cosmic Snapshot (Big Three)
            </h2>
          </div>
          <Link to="/birth-chart" className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 transition">
            View Wheel Details <ChevronRight size={13} />
          </Link>
        </div>

        {bigThree ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {/* Sun Sign */}
            <div className="card-saas p-5 border-l-2 border-gold-500 flex items-center justify-between group hover:border-gold-500/80 transition">
              <div className="space-y-1">
                <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sun size={12} /> Sun Sign (Core Essence)
                </span>
                <div className="text-xl font-cinzel font-bold text-white group-hover:text-gold-300 transition-colors">
                  {bigThree.sun?.sign}
                </div>
                <div className="text-xs text-slate-400 font-mono">{bigThree.sun?.formatted}</div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center text-xl font-cinzel">
                ☉
              </div>
            </div>

            {/* Moon Sign */}
            <div className="card-saas p-5 border-l-2 border-iris-500 flex items-center justify-between group hover:border-iris-500/80 transition">
              <div className="space-y-1">
                <span className="text-[10px] text-iris-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Moon size={12} /> Moon Sign (Soul & Emotions)
                </span>
                <div className="text-xl font-cinzel font-bold text-white group-hover:text-iris-300 transition-colors">
                  {bigThree.moon?.sign}
                </div>
                <div className="text-xs text-slate-400 font-mono">{bigThree.moon?.formatted}</div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-iris-500/10 border border-iris-500/20 text-iris-400 flex items-center justify-center text-xl font-cinzel">
                ☽
              </div>
            </div>

            {/* Ascendant */}
            <div className="card-saas p-5 border-l-2 border-emerald-500 flex items-center justify-between group hover:border-emerald-500/80 transition">
              <div className="space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Compass size={12} /> Ascendant (Rising Horizon)
                </span>
                <div className="text-xl font-cinzel font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {bigThree.ascendant?.sign}
                </div>
                <div className="text-xs text-slate-400 font-mono">{bigThree.ascendant?.formatted}</div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-cinzel">
                🌅
              </div>
            </div>
          </motion.div>
        ) : (
          <EmptyState
            icon={Compass}
            title="No Celestial Blueprint Synthesized"
            description="Complete the guided onboarding flow to compute your natal positions with exact ephemeris data."
            actionLabel="Start Guided Onboarding"
            actionLink="/onboarding"
          />
        )}
      </div>

      {/* ─── 2. Signature Feature Spotlight: Cosmic Life Map™ ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-saas p-6 sm:p-7 bg-gradient-to-br from-obsidian-900 via-obsidian-900 to-gold-950/20 border-gold-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5">
            <Badge variant="gold" className="text-[10px] uppercase font-semibold">
              <Sparkles size={11} className="mr-1 inline" /> Signature Experience
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white tracking-tight">
            Your Cosmic Life Map™
          </h2>
          <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed font-normal">
            Synthesize your birth chart into an interactive 5-pillar matrix connecting Identity Blueprint, Vocational Legacy, Relational Harmony, and Evolutionary Growth Cycles.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <Link to="/cosmic-life-map" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full sm:w-auto font-medium">
              <span>Explore Life Map</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="md"
            onClick={handleDownloadLifeMap}
            className="w-full sm:w-auto text-xs"
          >
            <Download size={14} /> PDF Dossier
          </Button>
        </div>
      </motion.div>

      {/* ─── 3. Today's Cosmic Guidance ─── */}
      {dailyGuidance && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-saas p-6 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-obsidian-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Calendar size={16} />
              </div>
              <div>
                <h3 className="text-base font-cinzel font-bold text-white">
                  Today&apos;s Cosmic Guidance
                </h3>
                <span className="text-[11px] text-slate-500">Real-time daily astrological weather</span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="text-xs text-slate-400 font-medium">Energy Level:</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-obsidian-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 to-amber-300 rounded-full"
                    style={{ width: `${dailyGuidance.energy}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-gold-400">{dailyGuidance.energy}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-obsidian-950/70 border border-obsidian-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-gold-400 tracking-wider">
                Primary Focus
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white">{dailyGuidance.focus}</p>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-950/70 border border-obsidian-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                Active Opportunity
              </span>
              <p className="text-xs text-slate-300">{dailyGuidance.opportunity}</p>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-950/70 border border-obsidian-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                Mindful Attention
              </span>
              <p className="text-xs text-slate-300">{dailyGuidance.mindfulOf}</p>
            </div>
          </div>

          {dailyGuidance.reflection && (
            <div className="p-4 rounded-xl bg-obsidian-950/80 border border-iris-500/20 flex items-start gap-3 text-xs">
              <Sparkles size={16} className="text-iris-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-iris-400 tracking-wider block mb-0.5">
                  Suggested Mindful Reflection:
                </span>
                <p className="text-xs italic text-slate-300 font-serif">
                  &ldquo;{dailyGuidance.reflection}&rdquo;
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ─── 4. Quick Actions & Celestial Portals ─── */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Astrology Intelligence Portals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/birth-chart"
            className="card-saas-hover p-5 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-105 transition-transform">
                <Compass size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-gold-300 transition-colors">
                  Natal Birth Chart
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  10 planets, 12 house cusps, and exact geometric aspect lines.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-obsidian-800 text-xs font-medium text-gold-400 flex items-center gap-1">
              Open Chart Wheel <ArrowRight size={12} />
            </div>
          </Link>

          <Link
            to="/compatibility"
            className="card-saas-hover p-5 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                <Heart size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-rose-300 transition-colors">
                  Compatibility Synastry
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Overlay two charts to analyze relational resonance and growth friction.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-obsidian-800 text-xs font-medium text-rose-400 flex items-center gap-1">
              Compare Charts <ArrowRight size={12} />
            </div>
          </Link>

          <Link
            to="/cosmic-timeline"
            className="card-saas-hover p-5 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-iris-500/10 border border-iris-500/30 flex items-center justify-center text-iris-400 group-hover:scale-105 transition-transform">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-iris-300 transition-colors">
                  Cosmic Timeline
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Track planetary ingresses, lunations, retrogrades, and stations.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-obsidian-800 text-xs font-medium text-iris-400 flex items-center gap-1">
              View Transits <ArrowRight size={12} />
            </div>
          </Link>

          <Link
            to="/reports"
            className="card-saas-hover p-5 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  Reports & Export Hub
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Generate publication-grade PDF dossiers of your complete chart.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-obsidian-800 text-xs font-medium text-emerald-400 flex items-center gap-1">
              Export Dossiers <ArrowRight size={12} />
            </div>
          </Link>
        </div>
      </div>

      {/* ─── 5. Upcoming Celestial Events ─── */}
      {upcomingEvents.length > 0 && (
        <div className="card-saas p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider">
              <Cpu size={14} /> Real-Time Ephemeris Ingresses
            </div>
            <Link to="/cosmic-timeline" className="text-xs text-gold-400 hover:text-gold-300 transition flex items-center gap-1">
              Full Ephemeris Calendar <ChevronRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.map((evt, idx) => (
              <div
                key={evt.eventId || idx}
                className="p-4 rounded-xl bg-obsidian-950/70 border border-obsidian-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="uppercase font-bold text-gold-400">
                      {evt.kind?.replace(/_/g, ' ') || 'Transit'}
                    </span>
                    <span>{new Date(evt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug">
                    {evt.headline}
                  </h4>
                  {evt.shortDescription && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {evt.shortDescription}
                    </p>
                  )}
                </div>
                <div className="pt-2 border-t border-obsidian-800/80 text-[10px] text-slate-500 flex justify-between">
                  <span>{evt.sign ? `Sign: ${evt.sign}` : 'Global'}</span>
                  <span className="text-amber-400">Impact: {evt.importance}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
