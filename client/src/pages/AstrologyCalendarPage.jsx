import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  AlertTriangle,
  Clock,
  Flame,
  Info,
} from 'lucide-react';
import api from '../utils/api';
import { getUpcomingEvents } from '../utils/astrologyApi';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

export default function AstrologyCalendarPage() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [calendarData, setCalendarData] = useState(null);
  const [cosmicEvents, setCosmicEvents] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchTodayWeather();
    fetchCosmicEvents();
  }, []);

  useEffect(() => {
    fetchMonthlyCalendar(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const fetchTodayWeather = async () => {
    try {
      setLoadingWeather(true);
      const res = await api.get('/calendar/today');
      if (res.data.success) {
        setTodayWeather(res.data.weather);
      }
    } catch (err) {
      console.error('Error fetching today weather:', err);
    } finally {
      setLoadingWeather(false);
    }
  };

  const fetchMonthlyCalendar = async (y, m) => {
    try {
      setLoadingCalendar(true);
      const res = await api.get(`/calendar/month/${y}/${m}`);
      if (res.data.success) {
        setCalendarData(res.data.calendar);
      }
    } catch (err) {
      toast.error('Failed to load monthly calendar');
    } finally {
      setLoadingCalendar(false);
    }
  };

  const fetchCosmicEvents = async () => {
    try {
      const res = await getUpcomingEvents(60, 30);
      if (res?.events) {
        setCosmicEvents(res.events);
      }
    } catch (err) {
      console.error('Error fetching cosmic events:', err);
    }
  };

  const getEventsForDay = (dayNum) => {
    return cosmicEvents.filter((evt) => {
      const d = new Date(evt.date);
      return (
        d.getDate() === dayNum &&
        d.getMonth() + 1 === currentMonth &&
        d.getFullYear() === currentYear
      );
    });
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-950 via-cosmic-900 to-cosmic-800 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Moon size={13} /> Lunar Phases & Ingresses
          </div>
          <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-gradient-gold">
            Cosmic Ephemeris Calendar
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            Track daily lunar phases, planetary ingresses, and retrograde watches aligned with universal rhythms.
          </p>
        </div>

        {/* Live Today Weather Banner */}
        {todayWeather && (
          <div className="card-cosmic p-6 sm:p-8 relative overflow-hidden border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              {/* Moon Phase Widget */}
              <div className="flex items-center gap-4 md:border-r border-white/10 pr-4">
                <span className="text-5xl">{todayWeather.moon.emoji}</span>
                <div>
                  <span className="text-[10px] text-white/50 uppercase tracking-wider block">TODAY'S MOON</span>
                  <h3 className="text-lg font-bold text-white leading-tight">{todayWeather.moon.phase}</h3>
                  <p className="text-xs text-blue-300 mt-0.5">{todayWeather.moon.illuminationPercentage}% Illuminated</p>
                </div>
              </div>

              {/* Sun & Moon Signs */}
              <div className="space-y-1.5 md:border-r border-white/10 pr-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Sun in {todayWeather.sun.sign}</span>
                  <span className="text-amber-400 font-bold">{todayWeather.sun.symbol}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Moon in {todayWeather.moon.sign}</span>
                  <span className="text-blue-300 font-bold">{todayWeather.moon.symbol}</span>
                </div>
                <span className="text-[11px] text-white/40 block mt-1">
                  Solar illumination: {todayWeather.sun.formatted}
                </span>
              </div>

              {/* Retrograde Watch */}
              <div className="md:border-r border-white/10 pr-4">
                <span className="text-[10px] text-white/50 uppercase tracking-wider block mb-1">
                  RETROGRADE WATCH
                </span>
                {todayWeather.retrogrades?.length > 0 ? (
                  <div className="space-y-1">
                    {todayWeather.retrogrades.map((r) => (
                      <div key={r.planet} className="text-xs text-red-400 font-semibold flex items-center gap-1.5">
                        <AlertTriangle size={12} /> {r.planet} in {r.sign} ℞
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <Sparkles size={13} /> All Major Planets Direct
                  </p>
                )}
              </div>

              {/* Spiritual Theme of the Day */}
              <div>
                <span className="text-[10px] text-gold-400 uppercase tracking-wider font-bold block mb-1">
                  LUNAR RITUAL FOCUS
                </span>
                <p className="text-xs text-white/80 leading-relaxed">
                  {todayWeather.moon.spiritualRitual}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Calendar Grid */}
        <div className="card-cosmic p-6 sm:p-8 space-y-6">
          {/* Controls Bar */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
              {monthNames[currentMonth - 1]} {currentYear}
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => {
                  setCurrentYear(new Date().getFullYear());
                  setCurrentMonth(new Date().getMonth() + 1);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Calendar Day Matrix */}
          {loadingCalendar ? (
            <div className="py-20 flex items-center justify-center">
              <Loader />
            </div>
          ) : calendarData ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {calendarData.days?.map((day) => {
                const isToday =
                  new Date().getDate() === day.day &&
                  new Date().getMonth() + 1 === currentMonth &&
                  new Date().getFullYear() === currentYear;

                return (
                  <motion.div
                    key={day.day}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setSelectedDay(day)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                      isToday
                        ? 'bg-gold-500/15 border-gold-400 shadow-cosmic'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isToday ? 'text-gold-400' : 'text-white/80'
                        }`}
                      >
                        {day.day}
                      </span>
                      <span className="text-lg">{day.moonEmoji}</span>
                    </div>

                    <div className="space-y-1 my-1">
                      <span className="text-[10px] text-white/50 block leading-tight">
                        🌙 {day.moonSign}
                      </span>
                      <span className="text-[10px] text-white/40 block">
                        {day.illumination}% illum
                      </span>
                    </div>

                    {day.eventHighlight && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 truncate block">
                        {day.eventHighlight}
                      </span>
                    )}

                    {getEventsForDay(day.day).slice(0, 1).map((evt, i) => (
                      <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-300 truncate block">
                        ✨ {evt.headline}
                      </span>
                    ))}
                  </motion.div>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Selected Day Modal */}
        <AnimatePresence>
          {selectedDay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card-cosmic p-6 sm:p-8 max-w-md w-full relative space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedDay.moonEmoji}</span>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {selectedDay.date}
                      </h3>
                      <p className="text-xs text-blue-300">{selectedDay.moonPhase}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="text-xs text-white/40 hover:text-white px-2.5 py-1 rounded-lg bg-white/5"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">Moon Placement:</span>
                    <span className="font-bold text-white">Moon in {selectedDay.moonSign}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">Sun Placement:</span>
                    <span className="font-bold text-gold-400">Sun in {selectedDay.sunSign}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">Lunar Illumination:</span>
                    <span className="font-bold text-white">{selectedDay.illumination}%</span>
                  </div>
                  {selectedDay.eventHighlight && (
                    <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 mt-2">
                      ✨ <strong>Celestial Milestone:</strong> {selectedDay.eventHighlight}
                    </div>
                  )}

                  {getEventsForDay(selectedDay.day).length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block">
                        Cosmic Transits & Events
                      </span>
                      {getEventsForDay(selectedDay.day).map((evt, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/25 space-y-1">
                          <div className="font-bold text-white text-xs flex items-center justify-between">
                            <span>{evt.headline}</span>
                            <span className="text-[10px] text-gold-300 font-normal">{evt.kind}</span>
                          </div>
                          {evt.shortDescription && (
                            <p className="text-[11px] text-white/70">{evt.shortDescription}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* System Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-400"></span>
            <span>Western Ephemeris & Planetary Movement System</span>
          </div>
          <div>
            Real-Time Astronomical Calculations & Lunar Ingresses
          </div>
        </div>
      </div>
    </div>
  );
}
