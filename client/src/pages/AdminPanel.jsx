import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, Trash2 } from 'lucide-react';
import api from '../utils/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [horoscopes, setHoroscopes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHoroscope, setNewHoroscope] = useState({
    sunSign: 'Aries',
    date: new Date().toISOString().split('T')[0],
    timePeriod: 'daily',
    prediction: '',
    mood: 'neutral',
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'stats') {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data.users);
      } else if (activeTab === 'horoscopes') {
        const res = await api.get('/admin/horoscopes');
        setHoroscopes(res.data.horoscopes);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHoroscope = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/horoscopes', newHoroscope);
      toast.success('Horoscope created successfully!');
      setNewHoroscope({
        sunSign: 'Aries',
        date: new Date().toISOString().split('T')[0],
        timePeriod: 'daily',
        prediction: '',
        mood: 'neutral',
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to create horoscope');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteHoroscope = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/horoscopes/${id}`);
      toast.success('Horoscope deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete horoscope');
    }
  };

  if (loading && !stats && !users.length && !horoscopes.length) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-950 via-cosmic-900 to-cosmic-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gold-400 mb-2">Admin Panel</h1>
          <p className="text-cosmic-300">Manage your astrology platform</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-cosmic-700">
          {['stats', 'users', 'horoscopes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 font-semibold transition capitalize border-b-2 ${
                activeTab === tab
                  ? 'border-gold-500 text-gold-400'
                  : 'border-transparent text-cosmic-400 hover:text-cosmic-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="bg-cosmic-900/50 border border-cosmic-700 p-6 rounded-xl">
              <p className="text-cosmic-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gold-400">{stats.totalUsers}</p>
            </div>
            <div className="bg-cosmic-900/50 border border-cosmic-700 p-6 rounded-xl">
              <p className="text-cosmic-400 text-sm">Admins</p>
              <p className="text-3xl font-bold text-cosmic-300">{stats.admins}</p>
            </div>
            <div className="bg-cosmic-900/50 border border-cosmic-700 p-6 rounded-xl">
              <p className="text-cosmic-400 text-sm">Total Horoscopes</p>
              <p className="text-3xl font-bold text-cosmic-300">{stats.totalHoroscopes}</p>
            </div>
            <div className="bg-cosmic-900/50 border border-cosmic-700 p-6 rounded-xl">
              <p className="text-cosmic-400 text-sm">Published</p>
              <p className="text-3xl font-bold text-cosmic-300">{stats.publishedHoroscopes}</p>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-cosmic-900/50 border border-cosmic-700 rounded-xl overflow-hidden"
          >
            <table className="w-full">
              <thead className="bg-cosmic-800">
                <tr>
                  <th className="px-6 py-3 text-left text-cosmic-400 font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-cosmic-400 font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-cosmic-400 font-semibold">Role</th>
                  <th className="px-6 py-3 text-left text-cosmic-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-cosmic-700 hover:bg-cosmic-800/50">
                    <td className="px-6 py-3 text-white">{user.firstName} {user.lastName}</td>
                    <td className="px-6 py-3 text-cosmic-300 text-sm">{user.email}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-gold-500 text-cosmic-950' : 'bg-cosmic-700 text-cosmic-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Horoscopes Tab */}
        {activeTab === 'horoscopes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 bg-cosmic-900/50 border border-cosmic-700 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-gold-400 mb-4">Create Horoscope</h3>
              <form onSubmit={handleCreateHoroscope} className="space-y-4">
                <div>
                  <label className="text-cosmic-400 text-sm block mb-1">Sign</label>
                  <select
                    value={newHoroscope.sunSign}
                    onChange={(e) => setNewHoroscope({...newHoroscope, sunSign: e.target.value})}
                    className="w-full bg-cosmic-800 border border-cosmic-700 rounded px-3 py-2 text-white focus:border-gold-500 outline-none"
                  >
                    {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-cosmic-400 text-sm block mb-1">Date</label>
                  <input
                    type="date"
                    value={newHoroscope.date}
                    onChange={(e) => setNewHoroscope({...newHoroscope, date: e.target.value})}
                    className="w-full bg-cosmic-800 border border-cosmic-700 rounded px-3 py-2 text-white focus:border-gold-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-cosmic-400 text-sm block mb-1">Period</label>
                  <select
                    value={newHoroscope.timePeriod}
                    onChange={(e) => setNewHoroscope({...newHoroscope, timePeriod: e.target.value})}
                    className="w-full bg-cosmic-800 border border-cosmic-700 rounded px-3 py-2 text-white focus:border-gold-500 outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="text-cosmic-400 text-sm block mb-1">Mood</label>
                  <select
                    value={newHoroscope.mood}
                    onChange={(e) => setNewHoroscope({...newHoroscope, mood: e.target.value})}
                    className="w-full bg-cosmic-800 border border-cosmic-700 rounded px-3 py-2 text-white focus:border-gold-500 outline-none"
                  >
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>

                <div>
                  <label className="text-cosmic-400 text-sm block mb-1">Prediction</label>
                  <textarea
                    value={newHoroscope.prediction}
                    onChange={(e) => setNewHoroscope({...newHoroscope, prediction: e.target.value})}
                    rows="4"
                    className="w-full bg-cosmic-800 border border-cosmic-700 rounded px-3 py-2 text-white focus:border-gold-500 outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold-500 hover:bg-gold-600 text-cosmic-950 font-semibold py-2 rounded-lg transition"
                >
                  Create
                </button>
              </form>
            </motion.div>

            {/* Horoscopes List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-cosmic-900/50 border border-cosmic-700 rounded-xl overflow-hidden"
            >
              <div className="overflow-y-auto max-h-[500px]">
                <table className="w-full">
                  <thead className="bg-cosmic-800 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-cosmic-400 font-semibold">Sign</th>
                      <th className="px-6 py-3 text-left text-cosmic-400 font-semibold">Date</th>
                      <th className="px-6 py-3 text-left text-cosmic-400 font-semibold">Period</th>
                      <th className="px-6 py-3 text-left text-cosmic-400 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horoscopes.slice(0, 10).map((horo) => (
                      <tr key={horo._id} className="border-t border-cosmic-700 hover:bg-cosmic-800/50">
                        <td className="px-6 py-3 text-white font-semibold">{horo.sunSign}</td>
                        <td className="px-6 py-3 text-cosmic-300 text-sm">
                          {new Date(horo.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-cosmic-300 text-sm capitalize">{horo.timePeriod}</td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => handleDeleteHoroscope(horo._id)}
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
