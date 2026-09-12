import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Heart,
  Briefcase,
  Activity,
  DollarSign,
  Star,
  Share2,
  Bookmark,
  Clock,
  Palette,
  Compass,
} from 'lucide-react';
import api from '../utils/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ZODIAC_SIGNS } from '../utils/astrologyData';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';

export default function HoroscopePage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const querySign = searchParams.get('sign');
  const initialSign =
    (querySign && ZODIAC_SIGNS.find((s) => s.name.toLowerCase() === querySign.toLowerCase())?.name) ||
    user?.sunSign ||
    'Aries';

  const [selectedSign, setSelectedSign] = useState(initialSign);
  const [period, setPeriod] = useState('daily'); // 'daily', 'weekly', 'monthly', 'yearly'
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Active zodiac sign derived from selected state
  const activeSign = selectedSign;

  useEffect(() => {
    const qSign = searchParams.get('sign');
    const matched = qSign && ZODIAC_SIGNS.find((s) => s.name.toLowerCase() === qSign.toLowerCase())?.name;
    if (matched) {
      setSelectedSign(matched);
    } else if (user?.sunSign && !querySign) {
      setSelectedSign((prev) => (prev === 'Aries' ? user.sunSign : prev));
    }
  }, [user, searchParams]);

  useEffect(() => {
    fetchHoroscope();
  }, [selectedSign, period]);

  const fetchHoroscope = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/horoscope/${selectedSign}/${period}`);
      if (res.data.success) {
        setHoroscope(res.data.horoscope);
        setIsFavorited(false);
      }
    } catch {
      toast.error('Failed to load cosmic forecast');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!horoscope?._id) return;
    try {
      if (isFavorited) {
        await api.delete(`/horoscope/${horoscope._id}/favorite`);
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await api.post(`/horoscope/${horoscope._id}/favorite`);
        setIsFavorited(true);
        toast.success('Saved to celestial favorites!');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please sign in to save favorites');
      } else {
        toast.error('Could not update favorites');
      }
    }
  };

  const handleShare = () => {
    const text = `Celestial ${period} forecast for ${selectedSign}: "${horoscope?.prediction?.slice(0, 120)}..." Read more on Mavi-AstroVision.`;
    if (navigator.share) {
      navigator.share({ title: `Mavi-AstroVision - ${selectedSign} Horoscope`, text });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const renderStars = (rating = 4) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={12}
            className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-obsidian-700'}
          />
        ))}
      </div>
    );
  };

  const activeSignData =
    ZODIAC_SIGNS.find((s) => s.name.toLowerCase() === selectedSign.toLowerCase()) || ZODIAC_SIGNS[0];

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* ─── Page Header ─── */}
      <PageHeader
        title="Horoscope Forecast"
        subtitle="Real-time planetary alignments interpreted for love, vocation, vitality, and wealth"
        badge={
          <Badge variant="gold" className="text-[10px] tracking-wider uppercase font-semibold">
            <Sparkles size={11} className="mr-1 inline" /> Celestial Transits Oracle
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleFavorite}
              className={isFavorited ? 'text-rose-400 border-rose-500/40' : ''}
              title="Save to Favorites"
            >
              <Bookmark size={14} fill={isFavorited ? 'currentColor' : 'none'} />
              <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={handleShare} title="Share Forecast">
              <Share2 size={14} /> Share
            </Button>
          </div>
        }
      />

      {/* ─── Zodiac Sign Selector & Timeframe Bar ─── */}
      <div className="card-saas p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Select Zodiac Archetype
          </span>
          {user?.sunSign && (
            <button
              onClick={() => setSelectedSign(user.sunSign)}
              className="text-xs text-gold-400 hover:text-gold-300 transition"
            >
              Reset to my sign ({user.sunSign})
            </button>
          )}
        </div>

        {/* 12 Signs Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          {ZODIAC_SIGNS.map((s) => {
            const isSelected = selectedSign.toLowerCase() === s.name.toLowerCase();
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSign(s.name)}
                className={`p-2.5 rounded-lg flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-gold-500 text-obsidian-950 font-bold shadow-md scale-105'
                    : 'bg-obsidian-950 text-slate-300 hover:text-white hover:bg-obsidian-800 border border-obsidian-800'
                }`}
              >
                <span className="text-base mb-0.5">{s.symbol}</span>
                <span className="text-[11px] font-medium leading-none">{s.name.slice(0, 4)}</span>
              </button>
            );
          })}
        </div>

        {/* Time Period Tabs */}
        <div className="pt-4 border-t border-obsidian-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {['daily', 'weekly', 'monthly', 'yearly'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  period === p
                    ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-obsidian-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500">
            Active sign: <strong className="text-gold-400">{selectedSign}</strong>
          </div>
        </div>
      </div>

      {/* ─── Main Forecast Card ─── */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Loader text="Consulting celestial ephemeris oracle..." />
        </div>
      ) : horoscope ? (
        <motion.div
          key={`${selectedSign}-${period}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Transit Summary */}
          <div className="card-saas p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-obsidian-900 to-obsidian-950 border-obsidian-700/80">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl sm:text-4xl text-gold-400 font-cinzel">
                {activeSignData.symbol}
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
                  {selectedSign} • <span className="capitalize">{period} Oracle</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {activeSignData.element} • {activeSignData.modality} • Ruled by {activeSignData.ruler}
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {horoscope.prediction}
            </p>
          </div>

          {/* Domain Ratings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-saas p-4 space-y-2 border-l-2 border-rose-500">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Heart size={14} className="text-rose-400" /> Romance
                </span>
                {renderStars(horoscope.ratings?.love || 4)}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {horoscope.relationshipAdvice || 'Warm emotional reciprocity and deepened intimacy.'}
              </p>
            </div>

            <div className="card-saas p-4 space-y-2 border-l-2 border-iris-500">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Briefcase size={14} className="text-iris-400" /> Career
                </span>
                {renderStars(horoscope.ratings?.career || 4)}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {horoscope.careerAdvice || 'Clear execution and strategic leadership alignments.'}
              </p>
            </div>

            <div className="card-saas p-4 space-y-2 border-l-2 border-emerald-500">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Activity size={14} className="text-emerald-400" /> Wellness
                </span>
                {renderStars(horoscope.ratings?.health || 4)}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {horoscope.healthTip || 'Mindful hydration and restorative nervous system grounding.'}
              </p>
            </div>

            <div className="card-saas p-4 space-y-2 border-l-2 border-amber-500">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <DollarSign size={14} className="text-amber-400" /> Finances
                </span>
                {renderStars(horoscope.ratings?.finance || 4)}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {horoscope.financialAdvice || 'Asset consolidation and cautious long-term prudence.'}
              </p>
            </div>
          </div>

          {/* Harmonious Energies Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card-saas p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm font-mono">
                {horoscope.luckyNumber || 7}
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">LUCKY NUMBER</span>
                <span className="text-xs font-semibold text-white">Harmonic Resonance</span>
              </div>
            </div>

            <div className="card-saas p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-iris-500/10 border border-iris-500/20 flex items-center justify-center text-iris-400">
                <Palette size={16} />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">POWER COLOR</span>
                <span className="text-xs font-semibold text-white">{horoscope.luckyColor || 'Gold'}</span>
              </div>
            </div>

            <div className="card-saas p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Clock size={16} />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">PEAK HOURS</span>
                <span className="text-xs font-semibold text-white">{horoscope.luckyTime || '11:30 AM'}</span>
              </div>
            </div>

            <div className="card-saas p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                <Compass size={16} />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">COSMIC COMPANION</span>
                <span className="text-xs font-semibold text-white">
                  {horoscope.compatibility?.signs?.[0] || 'Taurus'}
                </span>
              </div>
            </div>
          </div>

          {/* Source & Ephemeris System */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-obsidian-800 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              <span>System: <strong>Western Tropical Ephemeris</strong></span>
            </div>
            <div className="text-slate-500">
              Personalized {activeSign} transit reflection • {period.toUpperCase()} cycle
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
