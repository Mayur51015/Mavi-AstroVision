import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2 } from 'lucide-react';
import api from '../utils/api';
import Loader from '../components/Loader';
import HoroscopeCard from '../components/HoroscopeCard';
import toast from 'react-hot-toast';

const HoroscopePage = () => {
  const [selectedSign, setSelectedSign] = useState('Aries');
  const [period, setPeriod] = useState('daily');
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  useEffect(() => {
    fetchHoroscope();
  }, [selectedSign, period]);

  const fetchHoroscope = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/horoscope/daily/${selectedSign}`);
      setHoroscope(res.data.horoscope);
      setIsFavorited(false);
    } catch (error) {
      toast.error('Failed to fetch horoscope');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      await api.post(`/horoscope/${horoscope?.id}/favorite`);
      setIsFavorited(true);
      toast.success('Added to favorites!');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to add favorites');
      } else {
        toast.error('Failed to add to favorites');
      }
    }
  };

  const handleShare = () => {
    const text = `Check out my horoscope for ${selectedSign}: ${horoscope?.prediction?.substring(0, 100)}...`;
    if (navigator.share) {
      navigator.share({ title: 'Mavi-AstroVision', text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  if (loading && !horoscope) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-950 via-cosmic-900 to-cosmic-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cosmic-400 to-gold-500 bg-clip-text text-transparent mb-2">
            Daily Horoscopes
          </h1>
          <p className="text-cosmic-300">Discover what the stars have in store for you</p>
        </motion.div>

        {/*Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cosmic-900/50 backdrop-blur border border-cosmic-700 rounded-xl p-6 mb-8"
        >
          <div className="mb-6">
            <p className="text-gold-400 font-semibold mb-4">Select Your Sign</p>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {zodiacSigns.map((sign) => (
                <motion.button
                  key={sign}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedSign(sign)}
                  className={`py-2 px-3 rounded-lg font-semibold transition ${
                    selectedSign === sign
                      ? 'bg-gold-500 text-cosmic-950'
                      : 'bg-cosmic-800 text-cosmic-300 hover:bg-cosmic-700'
                  }`}
                >
                  {sign.substring(0, 3)}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gold-400 font-semibold mb-4">Period</p>
            <div className="flex gap-3">
              {['daily', 'weekly', 'monthly'].map((p) => (
                <motion.button
                  key={p}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setPeriod(p)}
                  className={`py-2 px-6 rounded-lg font-semibold transition capitalize ${
                    period === p
                      ? 'bg-gold-500 text-cosmic-950'
                      : 'bg-cosmic-800 text-cosmic-300 hover:bg-cosmic-700'
                  }`}
                >
                  {p}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Horoscope Display */}
        {horoscope && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <HoroscopeCard 
              horoscope={horoscope}
              sign={selectedSign}
              onFavorite={handleAddToFavorites}
              isFavorited={isFavorited}
            />

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleShare}
              className="mt-6 w-full bg-gradient-to-r from-cosmic-600 to-cosmic-500 hover:from-cosmic-500 hover:to-cosmic-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Share2 size={20} /> Share This Horoscope
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HoroscopePage;
