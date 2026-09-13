import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Zap,
  Trash2,
  FileText,
  Sparkles,
  Shield,
  BarChart3,
  Search,
  Plus,
  Edit3,
  CheckCircle2,
  Eye,
  RefreshCw,
  Clock,
  Compass,
  X,
  ExternalLink,
  Activity,
  Cpu,
  Database,
  Calendar,
} from 'lucide-react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import MetricCard from '../components/ui/MetricCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';

const AdminPanel = () => {
  const { subtab } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Map route subtab or search query to internal tab
  const resolveTab = (param) => {
    if (!param) return 'overview';
    const lower = param.toLowerCase();
    if (lower === 'users' || lower === 'registry') return 'users';
    if (lower === 'articles' || lower === 'knowledge') return 'articles';
    if (lower === 'astrology' || lower === 'horoscopes') return 'horoscopes';
    if (lower === 'security' || lower === 'system') return 'security';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(() => resolveTab(subtab || searchParams.get('tab')));
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [horoscopes, setHoroscopes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Synchronize activeTab when route changes
  useEffect(() => {
    const nextTab = resolveTab(subtab || searchParams.get('tab'));
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  }, [subtab, searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'overview') {
      navigate('/admin');
    } else if (tabId === 'horoscopes') {
      navigate('/admin/astrology');
    } else {
      navigate(`/admin/${tabId}`);
    }
  };

  // Horoscope form state
  const [newHoroscope, setNewHoroscope] = useState({
    sunSign: 'Aries',
    date: new Date().toISOString().split('T')[0],
    timePeriod: 'daily',
    prediction: '',
    mood: 'positive',
    luckyNumber: 7,
    luckyColor: 'Gold',
  });

  // Article Modal state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Birth Chart Wisdom',
    tags: '',
    coverImage: '',
    readTime: '6 min read',
    featured: false,
    isPublished: true,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'overview' || activeTab === 'security') {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats || res.data.analytics || null);
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data.users || []);
      } else if (activeTab === 'articles') {
        const res = await api.get('/articles?limit=50');
        setArticles(res.data.articles || []);
      } else if (activeTab === 'horoscopes') {
        const res = await api.get('/admin/horoscopes');
        setHoroscopes(res.data.horoscopes || []);
      }
    } catch (error) {
      console.error('Admin fetch error:', error);
      const errMsg = error.response?.data?.message || 'Failed to load admin dataset';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // User Actions
  const handleToggleUserRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = `Are you sure you want to change ${user.firstName || user.email}'s role to ${newRole.toUpperCase()}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await api.put(`/admin/users/${user._id}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Permanently delete user ${name || 'account'}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User account deleted');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  // Horoscope Actions
  const handleCreateHoroscope = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/horoscopes', newHoroscope);
      toast.success('Celestial forecast dispatched successfully!');
      setNewHoroscope({
        sunSign: 'Aries',
        date: new Date().toISOString().split('T')[0],
        timePeriod: 'daily',
        prediction: '',
        mood: 'positive',
        luckyNumber: 7,
        luckyColor: 'Gold',
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to save horoscope forecast');
    }
  };

  const handleDeleteHoroscope = async (id) => {
    if (!window.confirm('Delete this horoscope entry?')) return;
    try {
      await api.delete(`/admin/horoscopes/${id}`);
      toast.success('Horoscope forecast removed');
      setHoroscopes((prev) => prev.filter((h) => h._id !== id));
    } catch (error) {
      toast.error('Failed to delete horoscope');
    }
  };

  // Article Actions
  const handleOpenCreateArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      title: '',
      excerpt: '',
      content: '',
      category: 'Birth Chart Wisdom',
      tags: '',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      readTime: '6 min read',
      featured: false,
      isPublished: true,
    });
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art) => {
    setEditingArticle(art);
    setArticleForm({
      title: art.title,
      excerpt: art.excerpt,
      content: art.content,
      category: art.category,
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : art.tags || '',
      coverImage: art.coverImage || '',
      readTime: art.readTime || '6 min read',
      featured: Boolean(art.featured),
      isPublished: art.isPublished !== false,
    });
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        await api.put(`/articles/${editingArticle._id}`, articleForm);
        toast.success('Article updated successfully!');
      } else {
        await api.post('/articles', articleForm);
        toast.success('New article published!');
      }
      setIsArticleModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save article');
    }
  };

  const handleDeleteArticle = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.success('Article deleted');
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.firstName && u.firstName.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.lastName && u.lastName.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const tabItems = [
    { id: 'overview', label: 'Overview & Metrics', icon: BarChart3 },
    { id: 'users', label: 'User Registry', icon: Users, badge: users.length ? String(users.length) : undefined },
    { id: 'horoscopes', label: 'Astrology Data', icon: Sparkles },
    { id: 'articles', label: 'Knowledge Base', icon: FileText, badge: articles.length ? String(articles.length) : undefined },
    { id: 'security', label: 'System & Security', icon: Shield },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Page Header with System Status & Refresh */}
      <PageHeader
        badge={
          <Badge variant="gold" icon={Shield} size="sm">
            Command Center
          </Badge>
        }
        title="Celestial Administration"
        description="Monitor platform health, inspect seeker accounts, publish astrological insights, and dispatch custom transits."
        actions={
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Engine v2.1 Active
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={fetchData}
              disabled={loading}
              className={loading ? '[&_svg]:animate-spin' : ''}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {/* Modern SaaS Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-none">
        {tabItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gold-500 text-obsidian-950 font-semibold shadow-sm'
                  : 'bg-obsidian-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-obsidian-950/20 text-obsidian-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      {loading && !stats && !users.length && !articles.length && !horoscopes.length ? (
        <div className="py-24 flex justify-center">
          <Loader text="Loading command console..." />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && stats && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <MetricCard
                  title="Total Seekers"
                  value={stats.totalUsers || 0}
                  subtitle="Registered platform accounts"
                  icon={Users}
                  iconColor="text-gold-400"
                  iconBg="bg-gold-500/10 border-gold-500/20"
                />
                <MetricCard
                  title="New Seekers"
                  value={stats.newUsersLast7Days || 0}
                  subtitle="Registrations in last 7 days"
                  icon={Clock}
                  iconColor="text-sky-400"
                  iconBg="bg-sky-500/10 border-sky-500/20"
                />
                <MetricCard
                  title="Operators"
                  value={stats.admins || 0}
                  subtitle="System administrators"
                  icon={Shield}
                  iconColor="text-iris-400"
                  iconBg="bg-iris-500/10 border-iris-500/20"
                />
                <MetricCard
                  title="Natal Charts"
                  value={stats.totalCharts || 0}
                  subtitle="Astronomical ephemeris runs"
                  icon={Compass}
                  iconColor="text-amber-400"
                  iconBg="bg-amber-500/10 border-amber-500/20"
                />
                <MetricCard
                  title="Articles"
                  value={stats.totalArticles || 0}
                  subtitle="Wisdom publications"
                  icon={FileText}
                  iconColor="text-emerald-400"
                  iconBg="bg-emerald-500/10 border-emerald-500/20"
                />
                <MetricCard
                  title="Horoscopes"
                  value={stats.totalHoroscopes || 0}
                  subtitle="Dispatched transit forecasts"
                  icon={Sparkles}
                  iconColor="text-rose-400"
                  iconBg="bg-rose-500/10 border-rose-500/20"
                />
              </div>

              {/* System Architecture & Quick Links */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                        <Zap size={16} />
                      </div>
                      <div>
                        <CardTitle>Platform Capabilities & Architecture</CardTitle>
                        <CardDescription>Core backend modules powering calculations and intelligence</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-obsidian-900/60 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                        <Cpu size={14} />
                        True Ephemeris Engine
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Pure JS <code className="text-slate-300 font-mono">astronomy-engine</code> calculates high-precision geocentric planetary coordinates, retrogrades, and Porphyry houses without third-party API latency.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-obsidian-900/60 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center gap-2 text-iris-400 text-xs font-semibold uppercase tracking-wider">
                        <Activity size={14} />
                        Synastry & Inter-Aspects
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Harmonic cross-aspect computations with weighted matrices across romance, communication, growth, and long-term stability dimensions.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-obsidian-900/60 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                        <FileText size={14} />
                        Vector PDF Dossier Pipeline
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Streamed PDFKit synthesis of multi-page high-resolution natal blueprints, aspect tables, and personalized life map summaries.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-obsidian-900/60 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles size={14} />
                        AI Celestial Oracle
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Context-aware astrological intelligence dialog system interpreting live transits, natal configurations, and philosophical reflections.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex flex-col justify-between">
                  <div>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <CardTitle>Quick Portals</CardTitle>
                          <CardDescription>Direct navigation to primary seeker features</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-2">
                      <Link
                        to="/birth-chart"
                        className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 hover:bg-slate-800/60 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs sm:text-sm font-medium transition"
                      >
                        <span className="flex items-center gap-2">
                          <Compass size={14} className="text-gold-400" />
                          Birth Chart Wheel
                        </span>
                        <ExternalLink size={14} className="text-slate-500" />
                      </Link>
                      <Link
                        to="/compatibility"
                        className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 hover:bg-slate-800/60 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs sm:text-sm font-medium transition"
                      >
                        <span className="flex items-center gap-2">
                          <Activity size={14} className="text-iris-400" />
                          Synastry Matrix
                        </span>
                        <ExternalLink size={14} className="text-slate-500" />
                      </Link>
                      <Link
                        to="/calendar"
                        className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 hover:bg-slate-800/60 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs sm:text-sm font-medium transition"
                      >
                        <span className="flex items-center gap-2">
                          <Calendar size={14} className="text-sky-400" />
                          Ephemeris Calendar
                        </span>
                        <ExternalLink size={14} className="text-slate-500" />
                      </Link>
                      <Link
                        to="/articles"
                        className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 hover:bg-slate-800/60 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs sm:text-sm font-medium transition"
                      >
                        <span className="flex items-center gap-2">
                          <FileText size={14} className="text-emerald-400" />
                          Knowledge Base
                        </span>
                        <ExternalLink size={14} className="text-slate-500" />
                      </Link>
                    </CardContent>
                  </div>

                  <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Database size={13} className="text-slate-500" />
                      Production Cluster
                    </span>
                    <Badge variant="success" size="sm">
                      Database Healthy
                    </Badge>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Search & Filter Toolbar */}
              <Card className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                  <div className="w-full sm:max-w-md">
                    <Input
                      placeholder="Search users by name or email..."
                      icon={Search}
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-44">
                      <Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        options={[
                          { value: 'all', label: 'All Roles' },
                          { value: 'user', label: 'Seekers (User)' },
                          { value: 'admin', label: 'Administrators' },
                        ]}
                      />
                    </div>
                    <Badge variant="outline" size="md">
                      {filteredUsers.length} Seekers
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Users Data Table */}
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-obsidian-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-3.5 font-semibold">User</th>
                        <th className="px-6 py-3.5 font-semibold">Role</th>
                        <th className="px-6 py-3.5 font-semibold">Auth Provider</th>
                        <th className="px-6 py-3.5 font-semibold">Onboarded</th>
                        <th className="px-6 py-3.5 font-semibold">Joined Date</th>
                        <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-sm">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-8">
                            <EmptyState
                              icon={Users}
                              title="No matching seekers found"
                              description="Try adjusting your search query or role filter to see accounts."
                            />
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => {
                          const isAdmin = u.role === 'admin';
                          return (
                            <tr key={u._id} className="hover:bg-slate-800/20 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-500/20 to-iris-500/20 border border-gold-500/30 flex items-center justify-center font-bold text-gold-400 text-sm shrink-0">
                                    {u.firstName ? u.firstName[0].toUpperCase() : u.email[0].toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-slate-100 font-medium truncate">
                                      {u.firstName ? `${u.firstName} ${u.lastName || ''}` : 'Unnamed Seeker'}
                                    </div>
                                    <div className="text-xs text-slate-400 truncate">{u.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  variant={isAdmin ? 'gold' : 'default'}
                                  icon={isAdmin ? Shield : Users}
                                  size="sm"
                                >
                                  {u.role.toUpperCase()}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-300 capitalize">
                                {u.authProvider || 'Email'}
                              </td>
                              <td className="px-6 py-4">
                                {u.isOnboarded ? (
                                  <Badge variant="success" size="sm" icon={CheckCircle2}>
                                    Complete
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" size="sm">
                                    Pending
                                  </Badge>
                                )}
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-400">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant={isAdmin ? 'secondary' : 'outline'}
                                    size="sm"
                                    onClick={() => handleToggleUserRole(u)}
                                    title={isAdmin ? 'Demote to regular user' : 'Promote to administrator'}
                                  >
                                    {isAdmin ? 'Demote' : 'Make Admin'}
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteUser(u._id, u.firstName || u.email)}
                                    title="Delete user account"
                                    icon={Trash2}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ARTICLES TAB */}
          {activeTab === 'articles' && (
            <motion.div
              key="articles"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Header Action Bar */}
              <Card className="p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Astrological Knowledge Base</CardTitle>
                    <CardDescription>
                      Publish deep-dive essays, planetary transit guides, and cosmic wisdom for your community.
                    </CardDescription>
                  </div>
                  <Button
                    variant="primary"
                    icon={Plus}
                    onClick={handleOpenCreateArticle}
                  >
                    Write New Article
                  </Button>
                </div>
              </Card>

              {/* Articles Grid */}
              {articles.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No articles published yet"
                  description="Begin sharing celestial wisdom and philosophical guides with your seekers."
                  actionLabel="Write First Article"
                  onAction={handleOpenCreateArticle}
                  actionIcon={Plus}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((art) => (
                    <Card
                      key={art._id}
                      hover
                      className="overflow-hidden flex flex-col justify-between group"
                    >
                      <div>
                        <div className="h-44 overflow-hidden relative">
                          <img
                            src={art.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop'}
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge variant="gold" size="sm">
                              {art.category}
                            </Badge>
                          </div>
                          {art.featured && (
                            <div className="absolute top-3 right-3">
                              <Badge variant="warning" size="sm">
                                Featured
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <h4 className="font-semibold text-slate-100 text-base mb-2 group-hover:text-gold-400 transition-colors line-clamp-2">
                            {art.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                            {art.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">
                          {art.readTime || '5 min read'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/articles/${art.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-slate-100 transition"
                            title="Preview article"
                          >
                            <Eye size={15} />
                          </Link>
                          <button
                            onClick={() => handleOpenEditArticle(art)}
                            className="p-2 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 transition"
                            title="Edit article"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art._id, art.title)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                            title="Delete article"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* HOROSCOPES TAB */}
          {activeTab === 'horoscopes' && (
            <motion.div
              key="horoscopes"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {/* Create Forecast Form */}
              <Card className="lg:col-span-1 p-5 sm:p-6">
                <CardHeader className="p-0 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <CardTitle>Dispatch Horoscope</CardTitle>
                      <CardDescription>Publish official transit advisory</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <form onSubmit={handleCreateHoroscope} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                      Zodiac Sign
                    </label>
                    <Select
                      value={newHoroscope.sunSign}
                      onChange={(e) => setNewHoroscope({ ...newHoroscope, sunSign: e.target.value })}
                      options={[
                        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
                      ].map((s) => ({ value: s, label: s }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                        Date
                      </label>
                      <input
                        type="date"
                        value={newHoroscope.date}
                        onChange={(e) => setNewHoroscope({ ...newHoroscope, date: e.target.value })}
                        className="w-full bg-obsidian-900/90 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                        Period
                      </label>
                      <Select
                        value={newHoroscope.timePeriod}
                        onChange={(e) => setNewHoroscope({ ...newHoroscope, timePeriod: e.target.value })}
                        options={[
                          { value: 'daily', label: 'Daily' },
                          { value: 'weekly', label: 'Weekly' },
                          { value: 'monthly', label: 'Monthly' },
                          { value: 'yearly', label: 'Yearly' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                        Mood
                      </label>
                      <Select
                        value={newHoroscope.mood}
                        onChange={(e) => setNewHoroscope({ ...newHoroscope, mood: e.target.value })}
                        options={[
                          { value: 'positive', label: 'Positive' },
                          { value: 'neutral', label: 'Neutral' },
                          { value: 'challenging', label: 'Challenging' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                        Lucky #
                      </label>
                      <input
                        type="number"
                        value={newHoroscope.luckyNumber}
                        onChange={(e) => setNewHoroscope({ ...newHoroscope, luckyNumber: parseInt(e.target.value) || 1 })}
                        className="w-full bg-obsidian-900/90 border border-slate-800 rounded-xl px-2 py-2 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                        Color
                      </label>
                      <input
                        type="text"
                        value={newHoroscope.luckyColor}
                        onChange={(e) => setNewHoroscope({ ...newHoroscope, luckyColor: e.target.value })}
                        className="w-full bg-obsidian-900/90 border border-slate-800 rounded-xl px-2 py-2 text-slate-100 text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                      Forecast Content
                    </label>
                    <textarea
                      value={newHoroscope.prediction}
                      onChange={(e) => setNewHoroscope({ ...newHoroscope, prediction: e.target.value })}
                      rows="4"
                      placeholder="Write transit forecast and planetary guidance..."
                      className="w-full bg-obsidian-900/90 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs sm:text-sm focus:border-gold-500/60 focus:outline-none leading-relaxed"
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full">
                    Publish Forecast
                  </Button>
                </form>
              </Card>

              {/* Horoscope Registry Table */}
              <Card className="lg:col-span-2 overflow-hidden flex flex-col">
                <div className="p-4 sm:p-5 bg-obsidian-900/90 border-b border-slate-800 flex justify-between items-center">
                  <div>
                    <CardTitle className="text-sm">Recent Custom Forecasts</CardTitle>
                    <CardDescription>Published administrative transits</CardDescription>
                  </div>
                  <Badge variant="outline" size="sm">
                    {horoscopes.length} entries
                  </Badge>
                </div>

                <div className="overflow-y-auto max-h-[560px]">
                  <table className="w-full text-left">
                    <thead className="bg-obsidian-950/90 text-slate-400 text-xs uppercase tracking-wider sticky top-0 border-b border-slate-800/80">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Sign</th>
                        <th className="px-5 py-3 font-semibold">Date</th>
                        <th className="px-5 py-3 font-semibold">Period</th>
                        <th className="px-5 py-3 font-semibold">Mood</th>
                        <th className="px-5 py-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-sm">
                      {horoscopes.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8">
                            <EmptyState
                              icon={Sparkles}
                              title="No custom forecasts recorded"
                              description="Create daily, weekly, or seasonal transits using the dispatcher form on the left."
                            />
                          </td>
                        </tr>
                      ) : (
                        horoscopes.map((h) => (
                          <tr key={h._id} className="hover:bg-slate-800/20 transition-colors">
                            <td className="px-5 py-3.5 font-semibold text-slate-100">{h.sunSign}</td>
                            <td className="px-5 py-3.5 text-xs text-slate-400">
                              {new Date(h.date).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3.5 text-xs text-slate-300 capitalize">{h.timePeriod}</td>
                            <td className="px-5 py-3.5">
                              <Badge
                                variant={
                                  h.mood === 'positive'
                                    ? 'success'
                                    : h.mood === 'challenging'
                                    ? 'danger'
                                    : 'default'
                                }
                                size="sm"
                              >
                                {h.mood}
                              </Badge>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteHoroscope(h._id)}
                                title="Delete forecast"
                                icon={Trash2}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* SYSTEM & SECURITY TAB */}
          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Infrastructure Telemetry Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Cpu size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Server Runtime
                      </p>
                      <p className="text-sm font-bold text-slate-100">Node.js / Express v4</p>
                      <span className="text-[10px] text-emerald-400 font-mono">Engine v2.1 Active</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                      <Database size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Database Cluster
                      </p>
                      <p className="text-sm font-bold text-slate-100">MongoDB Atlas</p>
                      <span className="text-[10px] text-sky-400 font-mono">Cluster0 (ReplicaSet)</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Security Boundary
                      </p>
                      <p className="text-sm font-bold text-slate-100">Cryptographic JWT</p>
                      <span className="text-[10px] text-gold-400 font-mono">RBAC (protect, adminOnly)</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Production Cloud
                      </p>
                      <p className="text-sm font-bold text-slate-100">Render / Vercel Edge</p>
                      <span className="text-[10px] text-purple-400 font-mono">Cloudflare Secured</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Security Policies and Enforcement */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield size={18} className="text-gold-400" />
                      Role-Based Access Control Policies
                    </CardTitle>
                    <CardDescription>
                      Strict server-side enforcement parameters active in production
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-slate-800/80 text-xs">
                      <div>
                        <p className="font-semibold text-slate-200">JWT Token Lifetime</p>
                        <p className="text-[11px] text-slate-400">Issued via HMAC-SHA256 with 7-day expiration</p>
                      </div>
                      <Badge variant="gold" size="sm">7 Days</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-slate-800/80 text-xs">
                      <div>
                        <p className="font-semibold text-slate-200">Public Credential Sanitization</p>
                        <p className="text-[11px] text-slate-400">0 developer credentials or test passwords in frontend bundle</p>
                      </div>
                      <Badge variant="success" size="sm">Enforced</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-slate-800/80 text-xs">
                      <div>
                        <p className="font-semibold text-slate-200">Admin Authorization Filter</p>
                        <p className="text-[11px] text-slate-400">Requires database role: 'admin' and verified ADMIN_EMAIL registry</p>
                      </div>
                      <Badge variant="gold" size="sm">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-slate-800/80 text-xs">
                      <div>
                        <p className="font-semibold text-slate-200">Unauthenticated / Unauthorized Responses</p>
                        <p className="text-[11px] text-slate-400">Strict HTTP 401 and HTTP 403 status responses on all admin routes</p>
                      </div>
                      <Badge variant="default" size="sm">401 / 403</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity size={18} className="text-sky-400" />
                      Platform Account Directory Telemetry
                    </CardTitle>
                    <CardDescription>
                      Real-time user count telemetry loaded directly from MongoDB Atlas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-slate-800/80 text-xs">
                      <span className="text-slate-300">Total Registered Seekers</span>
                      <span className="font-bold text-slate-100 font-mono text-sm">{stats?.totalUsers ?? '...'}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-slate-800/80 text-xs">
                      <span className="text-slate-300">Authorized System Administrators</span>
                      <span className="font-bold text-gold-400 font-mono text-sm">{stats?.admins ?? '...'}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-slate-800/80 text-xs">
                      <span className="text-slate-300">Standard Seeker Accounts</span>
                      <span className="font-bold text-slate-100 font-mono text-sm">
                        {stats ? stats.totalUsers - stats.admins : '...'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/80 border border-slate-800/80 text-xs">
                      <span className="text-slate-300">New Registrations (Last 7 Days)</span>
                      <span className="font-bold text-emerald-400 font-mono text-sm">{stats?.newUsersLast7Days ?? '...'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Protected API Endpoints Table */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-base">Shielded Administrative API Endpoints</CardTitle>
                  <CardDescription>
                    All endpoints require valid bearer authentication and administrator privileges
                  </CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800/80 bg-obsidian-950/60 text-slate-400">
                        <th className="px-5 py-3 font-semibold uppercase tracking-wider">Method</th>
                        <th className="px-5 py-3 font-semibold uppercase tracking-wider">Endpoint</th>
                        <th className="px-5 py-3 font-semibold uppercase tracking-wider">Security Layer</th>
                        <th className="px-5 py-3 font-semibold uppercase tracking-wider">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      <tr>
                        <td className="px-5 py-3 text-emerald-400 font-bold">GET</td>
                        <td className="px-5 py-3 text-slate-200">/api/admin/stats</td>
                        <td className="px-5 py-3 text-amber-400 font-sans text-xs font-semibold">protect, adminOnly</td>
                        <td className="px-5 py-3 text-slate-400 font-sans text-xs">Command center overview analytics</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3 text-emerald-400 font-bold">GET</td>
                        <td className="px-5 py-3 text-slate-200">/api/admin/users</td>
                        <td className="px-5 py-3 text-amber-400 font-sans text-xs font-semibold">protect, adminOnly</td>
                        <td className="px-5 py-3 text-slate-400 font-sans text-xs">User directory with search & pagination</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3 text-sky-400 font-bold">PUT</td>
                        <td className="px-5 py-3 text-slate-200">/api/admin/users/:id/role</td>
                        <td className="px-5 py-3 text-amber-400 font-sans text-xs font-semibold">protect, adminOnly</td>
                        <td className="px-5 py-3 text-slate-400 font-sans text-xs">Role promotion and demotion</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3 text-rose-400 font-bold">DELETE</td>
                        <td className="px-5 py-3 text-slate-200">/api/admin/users/:id</td>
                        <td className="px-5 py-3 text-amber-400 font-sans text-xs font-semibold">protect, adminOnly</td>
                        <td className="px-5 py-3 text-slate-400 font-sans text-xs">Seeker deletion and profile cleanup</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3 text-emerald-400 font-bold">GET</td>
                        <td className="px-5 py-3 text-slate-200">/api/admin/horoscopes</td>
                        <td className="px-5 py-3 text-amber-400 font-sans text-xs font-semibold">protect, adminOnly</td>
                        <td className="px-5 py-3 text-slate-400 font-sans text-xs">Astrological transit archive</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3 text-amber-400 font-bold">POST</td>
                        <td className="px-5 py-3 text-slate-200">/api/admin/horoscopes</td>
                        <td className="px-5 py-3 text-amber-400 font-sans text-xs font-semibold">protect, adminOnly</td>
                        <td className="px-5 py-3 text-slate-400 font-sans text-xs">Dispatch custom transit advisory</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ARTICLE CREATE / EDIT MODAL */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="card-saas border-slate-700/80 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
                  {editingArticle ? 'Edit Astrological Article' : 'Compose Astrological Wisdom'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publish authoritative commentary to the seeker knowledge base
                </p>
              </div>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <Input
                  label="Title"
                  required
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="e.g. Navigating Saturn in Pisces: Karmic Dissolution"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Category"
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    options={[
                      { value: 'Birth Chart Wisdom', label: 'Birth Chart Wisdom' },
                      { value: 'Planetary Transits', label: 'Planetary Transits' },
                      { value: 'Synastry & Relationships', label: 'Synastry & Relationships' },
                      { value: 'Lunar Living', label: 'Lunar Living' },
                    ]}
                  />
                </div>
                <div>
                  <Input
                    label="Read Time"
                    value={articleForm.readTime}
                    onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                    placeholder="e.g. 7 min read"
                  />
                </div>
              </div>

              <div>
                <Input
                  label="Cover Image URL"
                  type="url"
                  value={articleForm.coverImage}
                  onChange={(e) => setArticleForm({ ...articleForm, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Excerpt (Brief Summary) <span className="text-gold-400">*</span>
                </label>
                <textarea
                  rows="2"
                  value={articleForm.excerpt}
                  onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                  placeholder="Short summary for preview cards..."
                  className="w-full bg-obsidian-900/90 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs sm:text-sm focus:border-gold-500/60 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Content (Markdown Supported) <span className="text-gold-400">*</span>
                </label>
                <textarea
                  rows="8"
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="## Astrological Heading&#10;&#10;Write the in-depth essay or guidance here..."
                  className="w-full bg-obsidian-900/90 border border-slate-800 rounded-xl p-3 text-slate-100 text-xs sm:text-sm font-mono focus:border-gold-500/60 focus:outline-none"
                  required
                />
              </div>

              <div>
                <Input
                  label="Tags (Comma-separated)"
                  value={articleForm.tags}
                  onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                  placeholder="Houses, Natal Astrology, Karmic Lessons"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={articleForm.featured}
                    onChange={(e) => setArticleForm({ ...articleForm, featured: e.target.checked })}
                    className="rounded border-slate-700 text-gold-500 focus:ring-gold-500 bg-obsidian-950"
                  />
                  Feature on Knowledge Base Homepage
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={articleForm.isPublished}
                    onChange={(e) => setArticleForm({ ...articleForm, isPublished: e.target.checked })}
                    className="rounded border-slate-700 text-gold-500 focus:ring-gold-500 bg-obsidian-950"
                  />
                  Published
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <Button
                  variant="secondary"
                  onClick={() => setIsArticleModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingArticle ? 'Update Article' : 'Publish Article'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

