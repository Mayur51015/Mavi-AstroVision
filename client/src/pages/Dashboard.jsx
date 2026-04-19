import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles, Calendar, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [horoscope, setHoroscope] = useState(null);
  const [birthDetail, setBirthDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const profileRes = await api.get('/users/profile');
        setBirthDetail(profileRes.data.birthDetail);

        // Fetch horoscope if sign exists
        if (profileRes.data.birthDetail?.sunSign) {
          const horoRes = await api.get(
            `/horoscope/me/daily`
          );
          setHoroscope(horoRes.data.horoscope);
        }
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-950 via-cosmic-900 to-cosmic-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cosmic-400 via-gold-400 to-cosmic-300 bg-clip-text text-transparent mb-2">
            Welcome, {user?.firstName} ✨
          </h1>
          <p className="text-cosmic-300">Your cosmic journey continues...</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-cosmic-900/50 backdrop-blur border border-cosmic-700 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cosmic-400 text-sm">Your Sign</p>
                <p className="text-2xl font-bold text-gold-400">
                  {birthDetail?.sunSign || 'Not set'}
                </p>
              </div>
              <Sparkles className="text-gold-500" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-cosmic-900/50 backdrop-blur border border-cosmic-700 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cosmic-400 text-sm">Subscription</p>
                <p className="text-2xl font-bold text-cosmic-300">
                  {user?.subscriptionStatus || 'Free'}
                </p>
              </div>
              <Star className="text-cosmic-400" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-cosmic-900/50 backdrop-blur border border-cosmic-700 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cosmic-400 text-sm">Favorites</p>
                <p className="text-2xl font-bold text-cosmic-300">
                  {user?.favoriteHoroscopes?.length || 0}
                </p>
              </div>
              <Heart className="text-red-400" size={32} />
            </div>
          </motion.div>
        </div>

        {/* Today's Horoscope */}
        {horoscope && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-cosmic-900/50 to-cosmic-800/50 backdrop-blur border border-cosmic-700 rounded-xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-gold-400" size={24} />
              <h2 className="text-2xl font-bold text-gold-400">Today's Horoscope</h2>
            </div>
            <p className="text-cosmic-200 mb-4">
              {horoscope?.prediction || 'Check back soon for your daily cosmic guidance!'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {horoscope?.luckyNumber && (
                <div>
                  <p className="text-cosmic-400 text-sm">Lucky Number</p>
                  <p className="text-xl font-bold text-gold-400">{horoscope.luckyNumber}</p>
                </div>
              )}
              {horoscope?.luckyColor && (
                <div>
                  <p className="text-cosmic-400 text-sm">Lucky Color</p>
                  <p className="text-xl font-bold text-cosmic-300">{horoscope.luckyColor}</p>
                </div>
              )}
              {horoscope?.mood && (
                <div>
                  <p className="text-cosmic-400 text-sm">Today's Mood</p>
                  <p className="text-xl font-bold text-cosmic-300 capitalize">{horoscope.mood}</p>
                </div>
              )}
              {horoscope?.luckyTime && (
                <div>
                  <p className="text-cosmic-400 text-sm">Lucky Time</p>
                  <p className="text-xl font-bold text-cosmic-300">{horoscope.luckyTime}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.a
            href="/horoscope"
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-cosmic-800 to-cosmic-700 hover:from-cosmic-700 hover:to-cosmic-600 border border-cosmic-600 p-6 rounded-xl transition cursor-pointer"
          >
            <h3 className="text-xl font-bold text-gold-400 mb-2">Explore Horoscopes</h3>
            <p className="text-cosmic-300">Read horoscopes for all zodiac signs</p>
          </motion.a>

          <motion.a
           href="/birth-chart"
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-cosmic-800 to-cosmic-700 hover:from-cosmic-700 hover:to-cosmic-600 border border-cosmic-600 p-6 rounded-xl transition cursor-pointer"
          >
            <h3 className="text-xl font-bold text-gold-400 mb-2">View Birth Chart</h3>
            <p className="text-cosmic-300">See your celestial blueprint</p>
          </motion.a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
