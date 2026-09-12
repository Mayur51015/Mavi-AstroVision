import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Compass,
  Star,
  Layers,
  Activity,
  Plus,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Search,
  Sun,
  Moon,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BirthChartWheel from '../components/BirthChartWheel';
import api from '../utils/api';
import { searchBirthLocation } from '../utils/astrologyApi';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';

export default function BirthChartPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [charts, setCharts] = useState([]);
  const [selectedChart, setSelectedChart] = useState(null);
  const [activeTab, setActiveTab] = useState('planets'); // 'planets', 'houses', 'aspects', 'balances', 'reading'
  const [expandedPlanet, setExpandedPlanet] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New chart form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    timeOfBirth: '12:00',
    placeOfBirth: '',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5,
  });

  // Location search state
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const locationDebounceRef = useRef(null);

  useEffect(() => {
    loadPrimaryOrCharts();
  }, []);

  const loadPrimaryOrCharts = async () => {
    try {
      setLoading(true);
      // Try to get primary chart first
      try {
        const primaryRes = await api.get('/chart/primary');
        if (primaryRes.data.success && primaryRes.data.chart?.chartData) {
          setSelectedChart(primaryRes.data.chart);
        }
      } catch {
        // If primary not found, try generate
        if (user?.dateOfBirth) {
          const genRes = await api.post('/chart/generate');
          if (genRes.data.success) {
            setSelectedChart({ chartData: genRes.data.chartData, _id: genRes.data.chartId });
          }
        }
      }

      // Also fetch all user's charts
      const allRes = await api.get('/chart/user/all');
      if (allRes.data.success) {
        setCharts(allRes.data.charts || []);
        if (!selectedChart && allRes.data.charts.length > 0) {
          loadSingleChart(allRes.data.charts[0]._id);
        }
      }
    } catch (error) {
      console.error('Error loading charts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSingleChart = async (chartId) => {
    try {
      setLoading(true);
      const res = await api.get(`/chart/${chartId}`);
      if (res.data.success) {
        setSelectedChart(res.data.chart);
      }
    } catch {
      toast.error('Failed to load chart');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChart = async (e) => {
    e.preventDefault();
    try {
      setGenerating(true);
      // First save birth details
      const bdRes = await api.post('/users/birth-details', formData);
      if (bdRes.data.success) {
        // Then generate chart
        const genRes = await api.post('/chart/generate', { birthDetailId: bdRes.data.birthDetail?._id });
        if (genRes.data.success) {
          toast.success('Celestial chart calculated successfully!');
          setShowAddModal(false);
          await loadPrimaryOrCharts();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Calculation failed');
    } finally {
      setGenerating(false);
    }
  };

  if (loading && !selectedChart) {
    return <Loader text="Computing high-precision celestial coordinates..." />;
  }

  const chartData = selectedChart?.chartData;
  const interpretations = chartData?.interpretations;
  const bigThree = chartData?.bigThree;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* ─── Page Header & Chart Switcher ─── */}
      <PageHeader
        title="Natal Birth Chart"
        subtitle="Western (Tropical / Placidus) planetary coordinates calculated via astronomical ephemeris"
        badge={
          <Badge variant="gold" className="text-[10px] tracking-wider uppercase font-semibold">
            <Sparkles size={11} className="mr-1 inline" /> Astrological Blueprint
          </Badge>
        }
        actions={
          <div className="flex items-center gap-3 flex-wrap">
            {charts.length > 1 && (
              <select
                value={selectedChart?._id || ''}
                onChange={(e) => loadSingleChart(e.target.value)}
                className="bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:border-gold-500/60 outline-none"
              >
                {charts.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.firstName} {c.lastName} ({c.sunSign || 'Chart'})
                  </option>
                ))}
              </select>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="font-medium shadow-sm"
            >
              <Plus size={15} /> New Chart
            </Button>
          </div>
        }
      />

      {/* ─── Big Three & Chart Ruler Summary ─── */}
      {bigThree && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-saas p-5 border-l-2 border-gold-500 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider flex items-center gap-1">
                <Sun size={12} /> SUN SIGN
              </span>
              <span className="text-xl font-cinzel text-gold-400">☉</span>
            </div>
            <h3 className="text-lg font-cinzel font-bold text-white">{bigThree.sun.sign}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{bigThree.sun.formatted}</p>
            <span className="text-[11px] text-slate-500 block mt-2">Core Self & Vitality</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="card-saas p-5 border-l-2 border-iris-500 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-iris-400 tracking-wider flex items-center gap-1">
                <Moon size={12} /> MOON SIGN
              </span>
              <span className="text-xl font-cinzel text-iris-400">☽</span>
            </div>
            <h3 className="text-lg font-cinzel font-bold text-white">{bigThree.moon.sign}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{bigThree.moon.formatted}</p>
            <span className="text-[11px] text-slate-500 block mt-2">Emotional Core & Instincts</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="card-saas p-5 border-l-2 border-emerald-500 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <Compass size={12} /> RISING SIGN
              </span>
              <span className="text-xl font-cinzel text-emerald-400">🌅</span>
            </div>
            <h3 className="text-lg font-cinzel font-bold text-white">{bigThree.ascendant.sign}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{bigThree.ascendant.formatted}</p>
            <span className="text-[11px] text-slate-500 block mt-2">Outer Persona & Horizon</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="card-saas p-5 border-l-2 border-amber-500 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                <Star size={12} /> CHART RULER
              </span>
              <Star size={14} className="text-amber-400" />
            </div>
            <h3 className="text-lg font-cinzel font-bold text-white">
              {chartData?.chartRuler?.planet || 'Mercury'}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {chartData?.chartRuler?.placement || 'First House'}
            </p>
            <span className="text-[11px] text-slate-500 block mt-2">Vocation & Life Driver</span>
          </motion.div>
        </div>
      )}

      {/* ─── Wheel & Inspector Section ─── */}
      {chartData ? (
        <div className="card-saas p-6 sm:p-8 flex items-center justify-center">
          <BirthChartWheel chartData={chartData} onSelectPlanet={(p) => setExpandedPlanet(p.name)} />
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No Birth Chart Calculated Yet"
          description="Enter your birth date, exact time, and birth location to compute your authentic astronomical chart with complete planetary positions and house cusps."
          actionLabel="Calculate Your Chart"
          actionOnClick={() => setShowAddModal(true)}
        />
      )}

      {/* ─── Detailed Breakdown Tabs ─── */}
      {chartData && (
        <div className="space-y-6">
          {/* Tabs Navigation Header */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-obsidian-800 pb-2">
            {[
              { id: 'planets', label: 'Planetary Placements', icon: <Star size={14} /> },
              { id: 'houses', label: '12 Houses', icon: <Compass size={14} /> },
              { id: 'aspects', label: 'Aspects Grid', icon: <Layers size={14} /> },
              { id: 'balances', label: 'Elements & Modalities', icon: <Activity size={14} /> },
              { id: 'reading', label: 'Cosmic Blueprint Reading', icon: <BookOpen size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-obsidian-900 border border-transparent'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Planets */}
          {activeTab === 'planets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chartData.planets?.map((p) => {
                const isExpanded = expandedPlanet === p.name;
                const interp = interpretations?.planets?.find((i) => i.planet === p.name);

                return (
                  <div
                    key={p.name}
                    className={`card-saas p-4 cursor-pointer transition-all duration-200 ${
                      isExpanded ? 'border-gold-500/60 bg-obsidian-900 shadow-md' : 'hover:border-obsidian-600'
                    }`}
                    onClick={() => setExpandedPlanet(isExpanded ? null : p.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-obsidian-950 border border-obsidian-800 flex items-center justify-center text-base text-gold-400">
                          {p.planetSymbol}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white text-sm">{p.name}</h4>
                            {p.retrograde && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold">
                                ℞
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            House {p.house} • {p.element} • {p.modality}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-2">
                        <div>
                          <span className="text-xs font-mono font-semibold text-gold-400 block">{p.formatted}</span>
                          <span className="text-[10px] text-slate-500">{p.sign} ({p.signSymbol})</span>
                        </div>
                        <div className="text-slate-500">
                          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && interp && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-obsidian-800 text-xs text-slate-300 space-y-2"
                        >
                          <p className="leading-relaxed">{interp.summary}</p>
                          <div className="p-2.5 rounded-lg bg-obsidian-950 border border-iris-500/20 text-slate-300">
                            {interp.deepInsight}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Houses */}
          {activeTab === 'houses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chartData.houses?.map((h) => (
                <div key={h.houseNumber} className="card-saas p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-obsidian-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-gold-500/10 border border-gold-500/20 text-gold-400 font-bold text-xs flex items-center justify-center font-mono">
                        {h.houseNumber}
                      </span>
                      <span className="font-semibold text-sm text-white">House {h.houseNumber}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-gold-400">
                      {h.degree}° {h.sign} ({h.symbol})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {h.houseNumber === 1 && 'Self, identity, appearance, vitality, and first impressions.'}
                    {h.houseNumber === 2 && 'Personal finances, material security, possessions, and intrinsic values.'}
                    {h.houseNumber === 3 && 'Intellect, communication, local community, and early learning.'}
                    {h.houseNumber === 4 && 'Home, ancestral roots, domestic sanctuary, and foundational bedrock.'}
                    {h.houseNumber === 5 && 'Creative self-expression, romantic devotion, passion, and playfulness.'}
                    {h.houseNumber === 6 && 'Daily work rhythms, bodily wellness, craft mastery, and service.'}
                    {h.houseNumber === 7 && 'Partnerships, matrimonial vows, reciprocal contracts, and diplomacy.'}
                    {h.houseNumber === 8 && 'Shared resources, intimate metamorphosis, psychological rebirth.'}
                    {h.houseNumber === 9 && 'Higher philosophical wisdom, global pilgrimage, and worldview expansion.'}
                    {h.houseNumber === 10 && 'Public honor, career legacy, social authority, and zenith aspirations.'}
                    {h.houseNumber === 11 && 'Collective movements, fraternal alliances, and humanitarian ideals.'}
                    {h.houseNumber === 12 && 'Subconscious depths, spiritual solitude, transcendence, and inner sanctum.'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Aspects */}
          {activeTab === 'aspects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chartData.aspects?.map((asp, idx) => (
                <div key={idx} className="card-saas p-4 flex items-start gap-3">
                  <span className="text-xl text-gold-400 mt-0.5 font-cinzel">{asp.aspectSymbol}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white text-sm">
                        {asp.planet1} {asp.aspect} {asp.planet2}
                      </h4>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        Orb {asp.orb}°
                      </Badge>
                    </div>
                    <p className="text-xs text-iris-400 font-medium">{asp.nature}</p>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Active dialogue between your {asp.planet1.toLowerCase()} drive and {asp.planet2.toLowerCase()}{' '}
                      principles, providing vital developmental focus.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Balances */}
          {activeTab === 'balances' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-saas p-6 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                  <Activity size={16} className="text-gold-400" /> Elemental Distribution
                </h3>
                <div className="space-y-3">
                  {chartData.balances?.elements?.map((el) => (
                    <div key={el.element}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-200">{el.element}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{el.count} planets ({el.percentage}%)</span>
                      </div>
                      <div className="w-full bg-obsidian-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            el.element === 'Fire'
                              ? 'bg-gradient-to-r from-red-500 to-amber-500'
                              : el.element === 'Earth'
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                              : el.element === 'Air'
                              ? 'bg-gradient-to-r from-cyan-400 to-sky-500'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                          }`}
                          style={{ width: `${el.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {interpretations?.overview?.dominantEnergy?.elementInsight && (
                  <div className="p-3 rounded-lg bg-obsidian-950 border border-obsidian-800 text-xs text-slate-300 leading-relaxed mt-4">
                    <strong className="text-gold-400 block mb-1">
                      Dominant Element: {interpretations.overview.dominantEnergy.element}
                    </strong>
                    {interpretations.overview.dominantEnergy.elementInsight}
                  </div>
                )}
              </div>

              <div className="card-saas p-6 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                  <Compass size={16} className="text-iris-400" /> Modality Distribution
                </h3>
                <div className="space-y-3">
                  {chartData.balances?.modalities?.map((m) => (
                    <div key={m.modality}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-200">{m.modality}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{m.count} planets ({m.percentage}%)</span>
                      </div>
                      <div className="w-full bg-obsidian-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            m.modality === 'Cardinal'
                              ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                              : m.modality === 'Fixed'
                              ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                              : 'bg-gradient-to-r from-teal-400 to-cyan-500'
                          }`}
                          style={{ width: `${m.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {interpretations?.overview?.dominantEnergy?.modalityInsight && (
                  <div className="p-3 rounded-lg bg-obsidian-950 border border-obsidian-800 text-xs text-slate-300 leading-relaxed mt-4">
                    <strong className="text-iris-400 block mb-1">
                      Dominant Modality: {interpretations.overview.dominantEnergy.modality}
                    </strong>
                    {interpretations.overview.dominantEnergy.modalityInsight}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 5: Reading */}
          {activeTab === 'reading' && (
            <div className="card-saas p-6 sm:p-8 space-y-6">
              <div>
                <Badge variant="gold" className="text-[10px] uppercase font-bold tracking-wider mb-2">
                  SOUL SYNTHESIS
                </Badge>
                <h3 className="text-2xl font-cinzel font-bold text-white">
                  {interpretations?.overview?.headline || 'Your Cosmic Blueprint'}
                </h3>
                <p className="text-xs text-iris-400 mt-1">
                  {interpretations?.overview?.archetype}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 text-sm text-slate-200 leading-relaxed">
                {interpretations?.overview?.bigThreeSynthesis}
              </div>

              <div className="p-4 rounded-xl bg-obsidian-950 border border-gold-500/20 text-sm text-slate-200 leading-relaxed">
                {interpretations?.overview?.chartRulerInsight}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-obsidian-800">
                <div>
                  <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-1.5">
                    <Sparkles size={15} /> Innate Cosmic Gifts
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {interpretations?.strengths?.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-1.5">
                    <Compass size={15} /> Soul Growth Edges
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {interpretations?.growthEdges?.map((g, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Celestial Engine Notice ─── */}
      {chartData && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-gold-400" />
            <span>Astrological System: <strong className="text-slate-300">Western (Tropical / Placidus)</strong></span>
            <span className="text-slate-500">• High-Precision Geocentric Ephemeris</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Mavi-AstroVision Ephemeris Synthesis
          </div>
        </div>
      )}

      {/* ─── Modal: Add / Recalculate Chart ─── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="card-saas p-6 sm:p-7 max-w-lg w-full relative border-obsidian-700 bg-obsidian-900"
            >
              <div className="flex items-start justify-between border-b border-obsidian-800 pb-3 mb-4">
                <div>
                  <h3 className="text-lg font-cinzel font-bold text-white">
                    Calculate Birth Chart
                  </h3>
                  <p className="text-xs text-slate-400">
                    Provide birth coordinates for ephemeris calculations.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800 transition"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateChart} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-gold-500/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-gold-500/60 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-gold-500/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Time (HH:MM)</label>
                    <input
                      type="time"
                      required
                      value={formData.timeOfBirth}
                      onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                      className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-gold-500/60 outline-none"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-xs text-slate-300 font-semibold block mb-1 flex items-center gap-1">
                    <MapPin size={12} className="text-gold-400" />
                    Place of Birth (City, Country)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Delhi, India or London, UK"
                      value={locationQuery || formData.placeOfBirth}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLocationQuery(val);
                        setFormData({ ...formData, placeOfBirth: val });

                        if (locationDebounceRef.current) clearTimeout(locationDebounceRef.current);
                        if (val.length >= 2) {
                          setSearchingLocation(true);
                          locationDebounceRef.current = setTimeout(async () => {
                            const results = await searchBirthLocation(val);
                            setLocationResults(results);
                            setShowLocationDropdown(results.length > 0);
                            setSearchingLocation(false);
                          }, 400);
                        } else {
                          setLocationResults([]);
                          setShowLocationDropdown(false);
                          setSearchingLocation(false);
                        }
                      }}
                      onFocus={() => locationResults.length > 0 && setShowLocationDropdown(true)}
                      className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-gold-500/60 outline-none pr-8"
                    />
                    {searchingLocation && (
                      <RefreshCw size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
                    )}
                    {!searchingLocation && locationQuery.length >= 2 && (
                      <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    )}
                  </div>

                  {/* Location autocomplete dropdown */}
                  {showLocationDropdown && (
                    <div className="absolute z-20 mt-1 w-full bg-obsidian-900 border border-obsidian-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                      {locationResults.map((loc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              placeOfBirth: loc.displayName,
                              latitude: loc.lat,
                              longitude: loc.lon,
                            });
                            setLocationQuery(loc.displayName);
                            setShowLocationDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-gold-500/10 hover:text-gold-300 transition flex items-center gap-2 border-b border-obsidian-800 last:border-0"
                        >
                          <MapPin size={12} className="text-gold-400 shrink-0" />
                          <span className="truncate">{loc.displayName}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {formData.latitude && formData.longitude && formData.placeOfBirth && (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <span>Coordinates resolved: {Number(formData.latitude).toFixed(4)}°, {Number(formData.longitude).toFixed(4)}°</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-obsidian-800">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={generating}
                    className="font-semibold"
                  >
                    Calculate Chart
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
