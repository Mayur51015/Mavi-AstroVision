import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Sparkles,
  RefreshCw,
  Compass,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ZODIAC_SIGNS } from '../utils/astrologyData';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';

export default function CompatibilityPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState('signs'); // 'signs' or 'synastry'
  const [signA, setSignA] = useState(user?.sunSign || 'Leo');
  const [signB, setSignB] = useState('Sagittarius');
  const [signResult, setSignResult] = useState(null);
  const [loadingSigns, setLoadingSigns] = useState(false);

  // Synastry state
  const [partnerName, setPartnerName] = useState('Cosmic Partner');
  const [partnerBirth, setPartnerBirth] = useState({
    dateOfBirth: '1998-09-15',
    timeOfBirth: '14:30',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: -4,
  });
  const [synastryResult, setSynastryResult] = useState(null);
  const [loadingSynastry, setLoadingSynastry] = useState(false);

  useEffect(() => {
    fetchQuickCompatibility(signA, signB);
  }, [signA, signB]);

  const fetchQuickCompatibility = async (a, b) => {
    try {
      setLoadingSigns(true);
      const res = await api.post('/compatibility/signs', { signA: a, signB: b });
      if (res.data.success) {
        setSignResult(res.data.compatibility);
      }
    } catch {
      toast.error('Failed to calculate sign compatibility');
    } finally {
      setLoadingSigns(false);
    }
  };

  const handleCalculateSynastry = async (e) => {
    e.preventDefault();
    try {
      setLoadingSynastry(true);
      const res = await api.post('/compatibility/synastry', {
        personAName: user?.name || 'You',
        personBName: partnerName,
        personBBirthDetails: partnerBirth,
      });
      if (res.data.success) {
        setSynastryResult(res.data.synastry);
        toast.success('Synastry blueprint calculated! ✨');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Synastry calculation failed');
    } finally {
      setLoadingSynastry(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* ─── Page Header ─── */}
      <PageHeader
        title="Cosmic Compatibility"
        subtitle="Discover the energetic alchemy, passionate resonance, and soul growth between two celestial blueprints"
        badge={
          <Badge variant="gold" className="text-[10px] tracking-wider uppercase font-semibold">
            <Heart size={11} className="mr-1 inline text-rose-400" /> Synastry Engine
          </Badge>
        }
      />

      {/* ─── Mode Selector Tabs ─── */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setMode('signs')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            mode === 'signs'
              ? 'bg-gold-500 text-obsidian-950 font-bold shadow-md'
              : 'bg-obsidian-950 border border-obsidian-800 text-slate-300 hover:text-white'
          }`}
        >
          ✨ Zodiac Sign Match
        </button>
        <button
          onClick={() => setMode('synastry')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            mode === 'synastry'
              ? 'bg-gold-500 text-obsidian-950 font-bold shadow-md'
              : 'bg-obsidian-950 border border-obsidian-800 text-slate-300 hover:text-white'
          }`}
        >
          🌌 Complete Natal Synastry
        </button>
      </div>

      {/* ─── Mode 1: Quick Zodiac Sign Match ─── */}
      {mode === 'signs' && (
        <div className="space-y-6">
          <div className="card-saas p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sign A Picker */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gold-400 uppercase tracking-wider block">
                  First Sign {user?.sunSign === signA && '(Your Sign)'}
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {ZODIAC_SIGNS.map((s) => (
                    <button
                      key={`a-${s.id}`}
                      onClick={() => setSignA(s.name)}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                        signA === s.name
                          ? 'bg-gold-500 text-obsidian-950 font-bold shadow-md scale-105'
                          : 'bg-obsidian-950 hover:bg-obsidian-800 text-slate-300 hover:text-white border border-obsidian-800'
                      }`}
                    >
                      <span className="text-base">{s.symbol}</span>
                      <span className="text-[10px] font-medium mt-0.5">{s.name.slice(0, 3)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign B Picker */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">
                  Second Sign
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {ZODIAC_SIGNS.map((s) => (
                    <button
                      key={`b-${s.id}`}
                      onClick={() => setSignB(s.name)}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                        signB === s.name
                          ? 'bg-rose-500 text-white font-bold shadow-md scale-105'
                          : 'bg-obsidian-950 hover:bg-obsidian-800 text-slate-300 hover:text-white border border-obsidian-800'
                      }`}
                    >
                      <span className="text-base">{s.symbol}</span>
                      <span className="text-[10px] font-medium mt-0.5">{s.name.slice(0, 3)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Display */}
          {loadingSigns ? (
            <div className="py-12 flex items-center justify-center">
              <Loader text="Computing sign resonance matrix..." />
            </div>
          ) : signResult ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Score Banner */}
              <div className="card-saas p-6 sm:p-8 text-center relative overflow-hidden bg-gradient-to-br from-obsidian-900 to-obsidian-950 border-obsidian-700/80">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex items-center gap-4 text-4xl sm:text-5xl">
                    <span className="text-gold-400 font-cinzel">{signResult.signA.symbol}</span>
                    <Heart className="text-rose-500 fill-rose-500" size={26} />
                    <span className="text-rose-400 font-cinzel">{signResult.signB.symbol}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
                    {signResult.signA.name} & {signResult.signB.name}
                  </h2>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-mono font-bold text-gold-400">
                      {signResult.overallScore}%
                    </span>
                    <span className="text-xs text-slate-400">Overall Harmony</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-normal">
                    {signResult.dynamic}
                  </p>
                </div>
              </div>

              {/* Domain Breakdown Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-saas p-4 text-center space-y-1 border-t-2 border-rose-500">
                  <span className="text-xs text-slate-400">Romance & Spark</span>
                  <h4 className="text-2xl font-bold font-mono text-rose-400">{signResult.scores.romance}%</h4>
                </div>
                <div className="card-saas p-4 text-center space-y-1 border-t-2 border-iris-500">
                  <span className="text-xs text-slate-400">Communication</span>
                  <h4 className="text-2xl font-bold font-mono text-iris-400">{signResult.scores.communication}%</h4>
                </div>
                <div className="card-saas p-4 text-center space-y-1 border-t-2 border-emerald-500">
                  <span className="text-xs text-slate-400">Shared Values</span>
                  <h4 className="text-2xl font-bold font-mono text-emerald-400">{signResult.scores.values}%</h4>
                </div>
                <div className="card-saas p-4 text-center space-y-1 border-t-2 border-amber-500">
                  <span className="text-xs text-slate-400">Long-Term Growth</span>
                  <h4 className="text-2xl font-bold font-mono text-amber-400">{signResult.scores.longTerm}%</h4>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      )}

      {/* ─── Mode 2: Full Natal Synastry ─── */}
      {mode === 'synastry' && (
        <div className="space-y-6">
          <div className="card-saas p-6 space-y-5">
            <div>
              <h3 className="text-base font-cinzel font-bold text-white mb-1">
                Compare Your Birth Chart With A Partner
              </h3>
              <p className="text-xs text-slate-400">
                Calculates exact geometric cross-aspects between all 10 planets in both charts (Sun-Moon, Venus-Mars, Mercury, Saturn).
              </p>
            </div>

            <form onSubmit={handleCalculateSynastry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Partner / Friend&apos;s Name</label>
                  <input
                    type="text"
                    required
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-gold-500/60 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={partnerBirth.dateOfBirth}
                    onChange={(e) => setPartnerBirth({ ...partnerBirth, dateOfBirth: e.target.value })}
                    className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-gold-500/60 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Time of Birth</label>
                  <input
                    type="time"
                    value={partnerBirth.timeOfBirth}
                    onChange={(e) => setPartnerBirth({ ...partnerBirth, timeOfBirth: e.target.value })}
                    className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-gold-500/60 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={partnerBirth.latitude}
                    onChange={(e) => setPartnerBirth({ ...partnerBirth, latitude: Number(e.target.value) })}
                    className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-gold-500/60 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={partnerBirth.longitude}
                    onChange={(e) => setPartnerBirth({ ...partnerBirth, longitude: Number(e.target.value) })}
                    className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-gold-500/60 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loadingSynastry}
                  className="font-medium"
                >
                  Calculate Synastry Blueprint
                </Button>
              </div>
            </form>
          </div>

          {/* Synastry Results */}
          {synastryResult && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="card-saas p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-obsidian-800 pb-4">
                  <div>
                    <Badge variant="iris" className="text-[10px] uppercase font-bold tracking-wider mb-1">
                      RELATIONSHIP ARCHETYPE
                    </Badge>
                    <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white mt-1">
                      {synastryResult.archetype}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {synastryResult.names.personA} & {synastryResult.names.personB}
                    </p>
                  </div>

                  <div className="text-center sm:text-right">
                    <span className="text-4xl sm:text-5xl font-mono font-bold text-gold-400 block">
                      {synastryResult.scores.overall}%
                    </span>
                    <span className="text-[11px] text-slate-400">Overall Synastry Score</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {synastryResult.summary}
                </p>
              </div>

              {/* Synastry Aspects List */}
              {synastryResult.synastryAspects?.length > 0 && (
                <div className="card-saas p-6 space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                    <Layers size={16} className="text-gold-400" /> Key Planetary Cross-Aspects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {synastryResult.synastryAspects.map((a, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-obsidian-950 border border-obsidian-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <span className="text-gold-400">
                            {a.personAPlanetSymbol} {a.personAPlanet}
                          </span>
                          <span className="text-rose-400 font-cinzel">{a.aspectSymbol}</span>
                          <span className="text-iris-400">
                            {a.personBPlanetSymbol} {a.personBPlanet}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          Orb {a.orb}°
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Growth Edges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-saas p-6 space-y-3">
                  <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 size={15} /> Key Relationship Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {synastryResult.strengths?.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-saas p-6 space-y-3">
                  <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                    <AlertCircle size={15} /> Conscious Growth Opportunities
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {synastryResult.growthEdges?.map((g, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
