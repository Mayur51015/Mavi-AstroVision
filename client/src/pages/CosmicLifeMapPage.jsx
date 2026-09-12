import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Compass,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info,
  Calendar,
  Activity,
  Star,
  RefreshCw,
  Sun,
  Moon,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCosmicLifeMap, downloadReportPdf } from '../utils/astrologyApi';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';

export default function CosmicLifeMapPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [lifeMap, setLifeMap] = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [expandedFacet, setExpandedFacet] = useState(null);
  const [activePillarModal, setActivePillarModal] = useState(null);

  useEffect(() => {
    fetchLifeMap();
  }, []);

  const fetchLifeMap = async () => {
    try {
      setLoading(true);
      const res = await getCosmicLifeMap();
      if (res.success && res.lifeMap) {
        setLifeMap(res.lifeMap);
      }
    } catch (err) {
      if (err.response?.status === 404 && err.response?.data?.needsOnboarding) {
        setNeedsOnboarding(true);
      } else {
        toast.error(err.response?.data?.message || 'Could not load your Cosmic Life Map');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      toast.loading('Synthesizing your Cosmic Life Map dossier...', { id: 'pdf-toast' });
      await downloadReportPdf('/reports/cosmic-life-map/pdf', `Cosmic_Life_Map_${user?.firstName || 'Seeker'}.pdf`);
      toast.success('Cosmic Life Map downloaded! ✨', { id: 'pdf-toast' });
    } catch (err) {
      toast.error('Failed to generate PDF dossier', { id: 'pdf-toast' });
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return <Loader text="Synthesizing Your Cosmic Life Map™..." />;
  }

  if (needsOnboarding || !lifeMap) {
    return (
      <div className="py-12 max-w-md mx-auto">
        <EmptyState
          icon={Compass}
          title="Cosmic Life Map™ Awaits"
          description="To generate your personalized 5-pillar matrix, we require your exact moment of birth to calculate your celestial coordinates."
          actionLabel="Complete Onboarding to Begin"
          actionLink="/onboarding"
        />
      </div>
    );
  }

  const { pillars, scorecard, snapshot, bigThree, chartRuler, dailyGuidance, metadata } = lifeMap;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* ─── Page Header ─── */}
      <PageHeader
        title="Your Cosmic Life Map™"
        subtitle="A holistic astrological matrix of your personal patterns, vocational alignment, and evolutionary cycles"
        badge={
          <Badge variant="gold" className="text-[10px] tracking-wider uppercase font-semibold">
            <Sparkles size={11} className="mr-1 inline" /> Signature Experience
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadPdf}
              loading={downloadingPdf}
              className="font-medium shadow-sm"
            >
              <Download size={14} /> Download PDF Dossier
            </Button>
            <Link to="/birth-chart">
              <Button variant="secondary" size="sm">
                <Compass size={14} /> View Chart Wheel
              </Button>
            </Link>
          </div>
        }
      />

      {/* ─── Transparency Disclaimer ─── */}
      <div className="p-4 rounded-xl bg-obsidian-900/80 border border-obsidian-700/80 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck size={16} className="text-gold-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <p className="font-semibold text-slate-200">Personal Reflection Notice:</p>
          <p>{metadata.disclaimer}</p>
        </div>
      </div>

      {/* ─── SECTION 1: INTERACTIVE CELESTIAL MATRIX ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-cinzel font-bold text-white">
              Interactive Celestial Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Click on any celestial node to examine in-depth archetype dynamics.
            </p>
          </div>
        </div>

        <div className="card-saas p-6 sm:p-8 relative overflow-hidden bg-gradient-to-b from-obsidian-900 to-obsidian-950 border-obsidian-700/80">
          {/* Visual Center: YOU */}
          <div className="flex flex-col items-center justify-center relative z-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-2xl bg-obsidian-950 border-2 border-gold-500/60 shadow-lg text-center max-w-sm w-full cursor-pointer transition hover:border-gold-400"
              onClick={() =>
                setActivePillarModal({
                  title: 'Core Celestial Anchor (YOU)',
                  sublabel: 'The Sacred Center',
                  focus: 'The foundational triad of Sun, Moon, and Ascendant working in synthesis.',
                  summary: `You radiate core vital purpose through Sun in ${bigThree?.sun?.sign || 'your sun'}, ground emotional processing through Moon in ${bigThree?.moon?.sign || 'your moon'}, and greet the worldly horizon through Rising in ${bigThree?.ascendant?.sign || 'your rising'}.`,
                  aspects: ['Authentic Solar Vitality', 'Instinctive Lunar Safety', 'Ascendant Persona Presence'],
                })
              }
            >
              <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-gold-400 tracking-wider mb-1">
                <Sparkles size={13} /> ✦ Core Blueprint ✦
              </div>
              <h3 className="text-xl font-cinzel font-bold text-white">
                {lifeMap.user?.name || 'Seeker'}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-obsidian-800 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-gold-500/10 text-gold-400 font-semibold flex items-center gap-1 border border-gold-500/20 text-[11px]">
                  ☉ {bigThree?.sun?.sign}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-iris-500/10 text-iris-300 font-semibold flex items-center gap-1 border border-iris-500/20 text-[11px]">
                  ☽ {bigThree?.moon?.sign}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-semibold flex items-center gap-1 border border-emerald-500/20 text-[11px]">
                  🌅 {bigThree?.ascendant?.sign}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Chart Ruler: <strong className="text-gold-400">{chartRuler?.planet}</strong> ({chartRuler?.placement})
              </p>
            </motion.div>

            {/* Connecting Vertical Line */}
            <div className="w-0.5 h-8 bg-gradient-to-b from-gold-400 to-obsidian-700 my-1" />
          </div>

          {/* Visual Branches: 4 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {pillars.pillars.map((pillar) => (
              <motion.div
                key={pillar.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActivePillarModal(pillar)}
                className="p-5 rounded-xl bg-obsidian-950/80 border border-obsidian-700/80 hover:border-gold-500/50 transition cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400">
                      {pillar.title}
                    </span>
                    <ArrowRight size={13} className="text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition" />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-gold-300 transition-colors">
                    {pillar.sublabel}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {pillar.focus}
                  </p>
                </div>

                <div className="pt-2 border-t border-obsidian-800">
                  <span className="text-[10px] text-gold-400/90 font-mono block">
                    Placement: {pillar.keyPlacement}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Convergence: Current Cycle */}
          <div className="flex flex-col items-center justify-center mt-6 relative z-10">
            <div className="w-0.5 h-8 bg-gradient-to-b from-obsidian-700 to-iris-500 my-1" />

            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() =>
                setActivePillarModal({
                  title: 'Current Ephemeris Cycle',
                  sublabel: pillars.currentCycle.sublabel,
                  focus: pillars.currentCycle.description,
                  summary: pillars.currentCycle.advice,
                  aspects: ['Live Ephemeris Transits', 'Lunar Illumination', 'Seasonal Timing'],
                })
              }
              className="p-5 rounded-xl bg-obsidian-950/90 border border-iris-500/40 text-center max-w-md w-full cursor-pointer hover:border-iris-400 transition"
            >
              <Badge variant="iris" className="text-[9px] uppercase font-bold tracking-wider mb-1.5">
                ACTIVE CYCLE
              </Badge>
              <h4 className="text-sm font-bold text-white">
                {pillars.currentCycle.sublabel}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {pillars.currentCycle.advice}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: COSMIC SCORECARD ─── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider">
              <Activity size={14} /> Archetype Resonances
            </div>
            <h2 className="text-xl font-cinzel font-bold text-white">
              Cosmic Scorecard
            </h2>
          </div>
          <span className="text-xs text-slate-400 max-w-sm sm:text-right">
            Normalized archetype metrics computed from planetary distributions and house weightings.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scorecard.map((item) => (
            <div
              key={item.id}
              className="card-saas p-5 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white text-sm">{item.dimension}</h4>
                  <span className="text-xs font-bold text-gold-400 font-mono">
                    {item.score}/100
                  </span>
                </div>

                {/* Progress Meter */}
                <div className="w-full bg-obsidian-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="bg-gradient-to-r from-gold-500 to-amber-300 h-full rounded-full"
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                  <span className="font-medium text-gold-300">{item.status}</span>
                  <span className="font-mono text-slate-500">{item.rulingSphere}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-obsidian-800">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SECTION 3: COSMIC SNAPSHOT (EXPANDABLE CARDS) ─── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider">
              <Star size={14} /> Personal Patterns
            </div>
            <h2 className="text-xl font-cinzel font-bold text-white">
              Your Cosmic Snapshot
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Six foundational facets of your astrological blueprint. Expand for in-depth insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {snapshot.map((facet) => {
            const isExpanded = expandedFacet === facet.id;

            return (
              <div
                key={facet.id}
                className={`card-saas p-5 transition-all duration-200 cursor-pointer ${
                  isExpanded ? 'border-gold-500/60 bg-obsidian-900 shadow-md' : 'hover:border-obsidian-600'
                }`}
                onClick={() => setExpandedFacet(isExpanded ? null : facet.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">
                        {facet.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">({facet.placement})</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">
                      {facet.headline}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {facet.summary}
                    </p>
                  </div>

                  <div className="shrink-0 p-1.5 rounded-lg bg-obsidian-950 text-slate-400 border border-obsidian-800">
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-3 border-t border-obsidian-800 text-xs">
                  <span className="text-gold-400 font-medium flex items-center gap-1">
                    {isExpanded ? 'Collapse' : 'Explore More'} <ArrowRight size={12} />
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Strength: {facet.strengths?.[0]}
                  </span>
                </div>

                {/* Expanded In-Depth Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-obsidian-800 space-y-4 text-xs"
                    >
                      <div>
                        <span className="text-[11px] font-semibold text-white block mb-1">
                          In-Depth Interpretation:
                        </span>
                        <p className="text-slate-300 leading-relaxed">{facet.deepInsight}</p>
                      </div>

                      {/* Reflection Prompt */}
                      <div className="p-3.5 rounded-xl bg-obsidian-950 border border-gold-500/20 text-gold-300 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider block">
                          Suggested Reflection:
                        </span>
                        <p className="italic text-xs font-serif">&ldquo;{facet.reflectionPrompt}&rdquo;</p>
                      </div>

                      {/* Strengths & Growth Edge */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                          <span className="text-[10px] font-bold text-emerald-400 block mb-1">
                            Innate Strengths:
                          </span>
                          <ul className="space-y-1 text-[11px] text-slate-300">
                            {facet.strengths?.map((s, i) => (
                              <li key={i}>• {s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                          <span className="text-[10px] font-bold text-amber-400 block mb-1">
                            Soul Growth Edge:
                          </span>
                          <p className="text-[11px] text-slate-300">{facet.growthEdge}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 4: TODAY'S COSMIC GUIDANCE HIGHLIGHT ─── */}
      {dailyGuidance && (
        <div className="card-saas p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-obsidian-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Calendar size={16} />
              </div>
              <div>
                <h3 className="text-base font-cinzel font-bold text-white">
                  Today&apos;s Cosmic Guidance
                </h3>
                <span className="text-xs text-slate-500">Personalized daily reflection aligned with your chart</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold self-start sm:self-auto">
              <span>Daily Energy:</span>
              <span className="text-sm font-bold font-mono text-gold-400">{dailyGuidance.energy}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-gold-400 tracking-wider block">
                Today&apos;s Focus
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white">{dailyGuidance.focus}</p>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider block">
                Active Opportunity
              </span>
              <p className="text-xs text-slate-300">{dailyGuidance.opportunity}</p>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block">
                Be Mindful Of
              </span>
              <p className="text-xs text-slate-300">{dailyGuidance.mindfulOf}</p>
            </div>
          </div>

          {dailyGuidance.reflection && (
            <div className="p-4 rounded-xl bg-obsidian-950 border border-iris-500/20 flex items-start gap-3">
              <Sparkles size={16} className="text-iris-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-iris-400 tracking-wider block mb-1">
                  Suggested Mindful Reflection:
                </span>
                <p className="text-xs font-serif italic text-slate-300">
                  &ldquo;{dailyGuidance.reflection}&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── SECTION 5: FOOTER SYSTEM NOTICE ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold-400" />
          <span>System: <strong>{metadata.astrologicalSystem || 'Western (Tropical / Placidus)'}</strong></span>
        </div>

        <div className="text-slate-500">
          Mavi-AstroVision Cosmic Life Map™ • 5-Pillar Archetypal Synthesis
        </div>
      </div>

      {/* ─── PILLAR INSPECTION MODAL ─── */}
      <AnimatePresence>
        {activePillarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="card-saas p-6 sm:p-7 max-w-lg w-full relative space-y-4 border-obsidian-700 bg-obsidian-900"
            >
              <div className="flex items-start justify-between border-b border-obsidian-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider block">
                    {activePillarModal.title}
                  </span>
                  <h3 className="text-lg font-cinzel font-bold text-white">
                    {activePillarModal.sublabel}
                  </h3>
                </div>
                <button
                  onClick={() => setActivePillarModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800 transition"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">DOMAINS OF LIFE:</span>
                  <p className="text-slate-200 leading-relaxed">{activePillarModal.focus}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">ARCHETYPE SYNTHESIS:</span>
                  <p className="text-slate-300 leading-relaxed">{activePillarModal.summary}</p>
                </div>

                {activePillarModal.aspects && (
                  <div className="pt-2 border-t border-obsidian-800">
                    <span className="text-[10px] font-bold text-gold-400 block mb-1.5">HARMONIC PILLARS:</span>
                    <ul className="space-y-1 text-slate-300">
                      {activePillarModal.aspects.map((a, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActivePillarModal(null)}
                  className="font-medium"
                >
                  Understood
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
