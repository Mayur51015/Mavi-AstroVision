import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  History,
  Compass,
  Trash2,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';
import { getUserFavorites, getUserHistory, toggleFavoriteItem } from '../utils/astrologyApi';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' or 'history'
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({ horoscopes: [], charts: [] });
  const [history, setHistory] = useState({ charts: [], recentHoroscopes: [] });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [favRes, histRes] = await Promise.all([
        getUserFavorites().catch(() => ({ favorites: { horoscopes: [], charts: [] } })),
        getUserHistory().catch(() => ({ history: { charts: [], recentHoroscopes: [] } })),
      ]);

      if (favRes?.favorites) setFavorites(favRes.favorites);
      if (histRes?.history) setHistory(histRes.history);
    } catch {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (type, id) => {
    try {
      await toggleFavoriteItem(type, id);
      toast.success('Removed from favorites');
      loadData();
    } catch {
      toast.error('Could not update favorite');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader text="Retrieving celestial bookmarks..." />
      </div>
    );
  }

  const hasFavorites = favorites.horoscopes.length > 0 || favorites.charts.length > 0;
  const hasHistory = history.charts.length > 0;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <PageHeader
        badge={
          <Badge variant="gold" icon={Bookmark} size="sm">
            Saved Blueprints & Vault
          </Badge>
        }
        title="Favorites & History"
        description="Access bookmarked planetary forecasts, calculated natal charts, and past ephemeris queries."
      />

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-gold-500 text-obsidian-950 font-semibold shadow-sm'
              : 'bg-obsidian-900/80 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Bookmark size={15} />
          <span>Saved Favorites</span>
          {hasFavorites && (
            <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              activeTab === 'favorites' ? 'bg-obsidian-950/20 text-obsidian-950' : 'bg-slate-800 text-slate-300'
            }`}>
              {favorites.horoscopes.length + favorites.charts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'history'
              ? 'bg-gold-500 text-obsidian-950 font-semibold shadow-sm'
              : 'bg-obsidian-900/80 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <History size={15} />
          <span>Calculation History</span>
          {hasHistory && (
            <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              activeTab === 'history' ? 'bg-obsidian-950/20 text-obsidian-950' : 'bg-slate-800 text-slate-300'
            }`}>
              {history.charts.length}
            </span>
          )}
        </button>
      </div>

      {/* ================================================================= */}
      {/* TAB 1: FAVORITES                                                  */}
      {/* ================================================================= */}
      <AnimatePresence mode="wait">
        {activeTab === 'favorites' && (
          <motion.div
            key="favs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {!hasFavorites ? (
              <EmptyState
                icon={Bookmark}
                title="No Favorites Saved Yet"
                description="Bookmark daily transit forecasts or calculated birth charts to revisit them here at any time."
                actionLabel="Explore Daily Horoscopes"
                onAction={() => window.location.href = '/horoscope'}
                actionIcon={Sparkles}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Saved Horoscopes */}
                {favorites.horoscopes.map((h) => (
                  <Card key={h._id} hover className="p-5 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <Badge variant="gold" size="sm">
                          {h.sunSign} • {h.timePeriod}
                        </Badge>
                        <span>{new Date(h.date).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-100 mt-1">
                        Celestial Forecast for {h.sunSign}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                        {h.prediction}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                      <Link
                        to={`/horoscope?sign=${h.sunSign}`}
                        className="text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1.5 transition"
                      >
                        Open Forecast <ArrowRight size={13} />
                      </Link>
                      <button
                        onClick={() => handleRemoveFavorite('horoscope', h._id)}
                        className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Remove bookmark"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Card>
                ))}

                {/* Saved Charts */}
                {favorites.charts.map((c) => (
                  <Card key={c._id} hover className="p-5 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <Badge variant="iris" size="sm">
                          Natal Blueprint
                        </Badge>
                        <span>{new Date(c.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-base font-semibold text-slate-100 mt-1">
                        {c.firstName} {c.lastName} ({c.sunSign || 'Chart'})
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Birthplace: {c.placeOfBirth} • {c.timeOfBirth}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                      <Link
                        to="/birth-chart"
                        className="text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1.5 transition"
                      >
                        Open Wheel <ArrowRight size={13} />
                      </Link>
                      <button
                        onClick={() => handleRemoveFavorite('chart', c._id)}
                        className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Remove bookmark"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: CALCULATION HISTORY                                        */}
        {/* ================================================================= */}
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {!hasHistory ? (
              <EmptyState
                icon={History}
                title="No Calculation History"
                description="Astrological calculations performed in your account will appear here for instant reload without recalculating."
                actionLabel="Generate Natal Chart"
                onAction={() => window.location.href = '/birth-chart'}
                actionIcon={Compass}
              />
            ) : (
              <Card className="divide-y divide-slate-800/80 overflow-hidden">
                {history.charts.map((c) => (
                  <div
                    key={c._id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/20 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-slate-100">
                          {c.firstName} {c.lastName}
                        </h4>
                        {c.isPrimary && (
                          <Badge variant="gold" size="sm">
                            Primary
                          </Badge>
                        )}
                        <span className="text-[11px] text-slate-500">
                          {c.chartSource === 'cosmyday' ? 'Swiss Ephemeris' : 'Planetary Engine'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Born {new Date(c.dateOfBirth).toLocaleDateString()} at {c.timeOfBirth} • {c.placeOfBirth}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-gold-400/90 mt-1.5 font-medium">
                        <span>Sun: {c.sunSign || '—'}</span>
                        <span>• Moon: {c.moonSign || '—'}</span>
                        <span>• Rising: {c.ascendant || '—'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <Link to="/birth-chart">
                        <Button variant="secondary" size="sm" icon={Compass}>
                          View Chart
                        </Button>
                      </Link>
                      <Link to="/cosmic-life-map">
                        <Button variant="primary" size="sm" icon={Sparkles}>
                          Life Map
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

