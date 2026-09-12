import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Star,
  Cpu,
} from 'lucide-react';
import { getUpcomingEvents } from '../utils/astrologyApi';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';

export default function CosmicTimelinePage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'moon', 'retrograde', 'ingress'

  useEffect(() => {
    fetchTimelineEvents();
  }, []);

  const fetchTimelineEvents = async () => {
    try {
      setLoading(true);
      const res = await getUpcomingEvents(60, 30);
      if (res?.events) {
        setEvents(res.events);
      }
    } catch {
      toast.error('Failed to load cosmic timeline events');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Split into past and future events based on date
  const pastEvents = events
    .filter((e) => new Date(e.date) < today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Fallback past reference events if none yet
  const displayPast =
    pastEvents.length > 0
      ? pastEvents
      : [
          {
            eventId: 'past-ref-1',
            date: new Date(Date.now() - 14 * 86400000).toISOString(),
            kind: 'new_moon',
            headline: 'New Moon Solar Seeding Cycle',
            shortDescription:
              'The previous lunar inception cycle established foundational intentions for conscious growth.',
            longDescription:
              'During the recent New Moon, cosmic currents favored quiet introspection and planting energetic seeds that are currently maturing.',
            importance: 60,
            sign: 'Virgo',
          },
          {
            eventId: 'past-ref-2',
            date: new Date(Date.now() - 7 * 86400000).toISOString(),
            kind: 'first_quarter',
            headline: 'First Quarter Lunar Action Gate',
            shortDescription: 'Overcoming early obstacles and testing resolve toward personal commitments.',
            longDescription:
              'The First Quarter moon required decisive adjustments and active courage to break through hesitations.',
            importance: 50,
            sign: 'Sagittarius',
          },
        ];

  const filteredUpcoming = upcomingEvents.filter((e) => {
    if (filterType === 'all') return true;
    if (filterType === 'moon') return e.kind?.includes('moon');
    if (filterType === 'retrograde') return e.kind?.includes('retrograde');
    if (filterType === 'ingress') return e.kind?.includes('ingress') || e.kind?.includes('sign');
    return true;
  });

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* ─── Page Header ─── */}
      <PageHeader
        title="Cosmic Timeline"
        subtitle="Track the sequential unfolding of celestial transits, lunar thresholds, and planetary gateways"
        badge={
          <Badge variant="iris" className="text-[10px] tracking-wider uppercase font-semibold">
            <Clock size={11} className="mr-1 inline" /> Ephemeris Flow
          </Badge>
        }
      />

      {/* ─── Filter Bar ─── */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {[
          { id: 'all', label: 'All Transits' },
          { id: 'moon', label: '🌕 Lunar Phases' },
          { id: 'retrograde', label: '℞ Retrograde Cycles' },
          { id: 'ingress', label: '🪐 Ingresses' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === f.id
                ? 'bg-gold-500 text-obsidian-950 shadow-md font-bold'
                : 'bg-obsidian-950 text-slate-300 hover:text-white hover:bg-obsidian-800 border border-obsidian-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader text="Tracking celestial timeline..." />
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-10 space-y-7 mt-6">
          {/* Continuous Vertical Timeline Backbone */}
          <div className="absolute top-4 bottom-4 left-3 sm:left-5 w-0.5 bg-gradient-to-b from-obsidian-800 via-gold-500/50 to-iris-500/50" />

          {/* --- PAST SECTION --- */}
          <div className="relative flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-500 ring-4 ring-obsidian-950 z-10 -ml-[4px] sm:-ml-[4px]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              PAST TRANSIT CYCLE
            </span>
          </div>

          {displayPast.map((evt) => (
            <TimelineEventCard
              key={evt.eventId}
              evt={evt}
              isPast={true}
              isExpanded={expandedEvent === evt.eventId}
              onToggle={() => setExpandedEvent(expandedEvent === evt.eventId ? null : evt.eventId)}
            />
          ))}

          {/* --- TODAY MARKER --- */}
          <div className="relative my-6 flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gold-400 ring-4 ring-gold-400/20 flex items-center justify-center z-10 -ml-[9px] sm:-ml-[9px] shadow-sm">
              <Star size={11} className="text-obsidian-950 fill-obsidian-950" />
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={13} />
              <span>
                TODAY • {today.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* --- UPCOMING EVENTS --- */}
          {filteredUpcoming.map((evt) => (
            <TimelineEventCard
              key={evt.eventId}
              evt={evt}
              isPast={false}
              isExpanded={expandedEvent === evt.eventId}
              onToggle={() => setExpandedEvent(expandedEvent === evt.eventId ? null : evt.eventId)}
            />
          ))}

          {/* FUTURE HORIZON NODE */}
          <div className="relative flex items-center gap-3 pt-3">
            <div className="w-2.5 h-2.5 rounded-full bg-iris-400 ring-4 ring-obsidian-950 z-10 -ml-[4px] sm:-ml-[4px]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-iris-400">
              FUTURE CYCLES UNFOLDING
            </span>
          </div>
        </div>
      )}

      {/* Footer System Notice */}
      <div className="p-3.5 rounded-xl bg-obsidian-950 border border-obsidian-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-12">
        <span className="flex items-center gap-1.5">
          <Cpu size={13} className="text-gold-400" /> High-precision geocentric celestial timeline
        </span>
        <span className="text-slate-500">
          Western Tropical Ephemeris • Retrograde & Transit Cycles
        </span>
      </div>
    </div>
  );
}

function TimelineEventCard({ evt, isPast, isExpanded, onToggle }) {
  const dateObj = new Date(evt.date);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="relative z-10">
      {/* Node Bullet on Timeline */}
      <div
        className={`absolute -left-[26px] sm:-left-[34px] top-5 w-2.5 h-2.5 rounded-full ring-4 ring-obsidian-950 ${
          isPast ? 'bg-slate-500' : 'bg-gold-400'
        }`}
      />

      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={onToggle}
        className={`card-saas p-5 cursor-pointer transition-all duration-200 ${
          isExpanded ? 'border-gold-500/60 bg-obsidian-900 shadow-md' : 'hover:border-obsidian-600'
        } ${isPast ? 'opacity-70 hover:opacity-100' : ''}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="gold" className="text-[10px] uppercase font-bold tracking-wider">
                {evt.kind?.replace(/_/g, ' ') || 'Transit'}
              </Badge>
              <span className="text-xs text-slate-400 font-mono font-medium">{formattedDate}</span>
              {evt.sign && (
                <span className="text-xs text-slate-400 font-semibold">• in {evt.sign}</span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
              {evt.headline}
            </h3>

            {evt.shortDescription && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {evt.shortDescription}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-1">
            <span className="text-xs text-gold-400 font-mono font-bold hidden sm:block">
              {evt.importance}%
            </span>
            <div className="p-1 rounded-md bg-obsidian-950 border border-obsidian-800 text-slate-400">
              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </div>
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-obsidian-800 space-y-3 text-xs"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider block mb-1">
                  Cosmic Significance:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {evt.longDescription ||
                    evt.shortDescription ||
                    'This transit triggers conscious recalibration and energetic alignment across your astrological houses.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-obsidian-800 text-[11px] text-slate-500">
                <span>Astrological System: Western Ephemeris</span>
                <span className="font-mono">Impact Index: {evt.importance}/100</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
