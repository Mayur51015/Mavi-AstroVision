import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Sparkles,
  Search,
  Clock,
  Eye,
  Tag,
  ArrowRight,
  Compass,
} from 'lucide-react';
import api from '../utils/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'Birth Chart Wisdom',
    'Planetary Transits',
    'Love & Relationships',
    'Rituals & Moon Magic',
    'Esoteric Philosophy',
  ];

  useEffect(() => {
    fetchArticles();
  }, [category]);

  const fetchArticles = async (query = search) => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'All') params.category = category;
      if (query.trim()) params.search = query;

      const res = await api.get('/articles', { params });
      if (res.data.success) {
        setArticles(res.data.articles || []);
      }
    } catch (err) {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchArticles(search);
  };

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const standardArticles = articles.filter((a) => a._id !== featuredArticle?._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-950 via-cosmic-900 to-cosmic-800 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen size={13} /> Celestial Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-gradient-gold">
            Astrological Journal & Wisdom
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            Deep-dive articles on natal interpretations, planetary transits, sacred synastry, and esoteric astrology.
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="card-cosmic p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-gold-500 text-cosmic-950 font-bold shadow-cosmic'
                    : 'bg-white/5 border border-white/5 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={15} />
            <input
              type="text"
              placeholder="Search wisdom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-cosmic-950/80 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 focus:border-gold-400 outline-none"
            />
          </form>
        </div>

        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Article Card */}
            {featuredArticle && category === 'All' && !search && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-cosmic overflow-hidden border border-white/10 hover:border-gold-500/50 transition-all grid grid-cols-1 md:grid-cols-2 group"
              >
                <div className="h-64 md:h-auto overflow-hidden relative">
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-gold-500 text-cosmic-950 shadow-lg">
                      Featured Wisdom
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span className="text-gold-400 font-semibold">{featuredArticle.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {featuredArticle.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white group-hover:text-gold-400 transition-colors leading-snug">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xs text-white/40">By {featuredArticle.author?.name}</span>
                    <Link
                      to={`/articles/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-400 hover:text-gold-300"
                    >
                      Read Article <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(category === 'All' && !search ? standardArticles : articles).map((art, idx) => (
                <motion.div
                  key={art._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="card-cosmic overflow-hidden border border-white/10 hover:border-gold-500/40 flex flex-col justify-between group"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-cosmic-950/80 backdrop-blur-md text-gold-400 font-semibold border border-white/10">
                        {art.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-white/40">
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {art.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={11} /> {art.views} views
                        </span>
                      </div>

                      <h3 className="font-cinzel text-base font-bold text-white group-hover:text-gold-400 transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h3>

                      <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {art.tags?.slice(0, 2).map((t) => (
                          <span key={t} className="text-[10px] text-white/40">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/articles/${art.slug}`}
                        className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1"
                      >
                        Read <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
