import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Download, Edit2, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import BirthChartWheel from '../components/BirthChartWheel';
import api from '../utils/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const BirthChartPage = () => {
  const { user } = useContext(AuthContext);
  const [charts, setCharts] = useState([]);
  const [selectedChart, setSelectedChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    fetchCharts();
  }, []);

  const fetchCharts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/chart/user/all');
      setCharts(res.data.charts || []);
      if (res.data.charts && res.data.charts.length > 0) {
        setSelectedChart(res.data.charts[0]);
      }
    } catch (error) {
      toast.error('Failed to load charts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/users/birth-details', formData);
      toast.success('Birth details saved successfully!');
      setShowForm(false);
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        timeOfBirth: '',
        placeOfBirth: '',
        latitude: '',
        longitude: '',
      });
      fetchCharts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save birth details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    toast.success('Download feature coming soon!');
  };

  if (loading && charts.length === 0) return <Loader />;

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
            Birth Charts
          </h1>
          <p className="text-cosmic-300">Your celestial blueprint</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Charts List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-cosmic-900/50 backdrop-blur border border-cosmic-700 rounded-xl p-4 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowForm(!showForm)}
                className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-cosmic-950 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Plus size={18} /> Add New Chart
              </motion.button>

              {/* Charts List */}
              {charts.map((chart, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedChart(chart)}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    selectedChart?.id === chart.id
                      ? 'bg-gold-500 text-cosmic-950'
                      : 'bg-cosmic-800 text-cosmic-200 hover:bg-cosmic-700'
                  }`}
                >
                  <p className="font-semibold text-sm">
                    {chart.firstName} {chart.lastName}
                  </p>
                  <p className="text-xs opacity-75">
                    {new Date(chart.dateOfBirth).toLocaleDateString()}
                  </p>
                  {chart.sunSign && (
                    <p className="text-xs mt-1">☀️ {chart.sunSign}</p>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Chart Display/Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {showForm ? (
              <div className="bg-cosmic-900/50 backdrop-blur border border-cosmic-700 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gold-400 mb-6">Add Birth Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="bg-cosmic-800 border border-cosmic-700 rounded px-4 py-2 text-white placeholder-cosmic-500 focus:border-gold-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="bg-cosmic-800 border border-cosmic-700 rounded px-4 py-2 text-white placeholder-cosmic-500 focus:border-gold-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="bg-cosmic-800 border border-cosmic-700 rounded px-4 py-2 text-white focus:border-gold-500 outline-none"
                    />
                    <input
                      type="time"
                      required
                      value={formData.timeOfBirth}
                      onChange={(e) => setFormData({...formData, timeOfBirth: e.target.value})}
                      className="bg-cosmic-800 border border-cosmic-700 rounded px-4 py-2 text-white focus:border-gold-500 outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Place of Birth"
                    required
                    value={formData.placeOfBirth}
                    onChange={(e) => setFormData({...formData, placeOfBirth: e.target.value})}
                    className="w-full bg-cosmic-800 border border-cosmic-700 rounded px-4 py-2 text-white placeholder-cosmic-500 focus:border-gold-500 outline-none"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="Latitude"
                      required
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                      className="bg-cosmic-800 border border-cosmic-700 rounded px-4 py-2 text-white placeholder-cosmic-500 focus:border-gold-500 outline-none"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="Longitude"
                      required
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                      className="bg-cosmic-800 border border-cosmic-700 rounded px-4 py-2 text-white placeholder-cosmic-500 focus:border-gold-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold-500 hover:bg-gold-600 text-cosmic-950 font-semibold py-2 rounded-lg transition"
                  >
                    Save & Generate Chart
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full bg-cosmic-800 hover:bg-cosmic-700 text-cosmic-200 font-semibold py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            ) : selectedChart ? (
              <div className="bg-cosmic-900/50 backdrop-blur border border-cosmic-700 rounded-xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gold-400">
                    {selectedChart.firstName} {selectedChart.lastName}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-cosmic-600 to-cosmic-500 hover:from-cosmic-500 hover:to-cosmic-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                  >
                    <Download size={18} /> Download
                  </motion.button>
                </div>

                <BirthChartWheel chartData={selectedChart} />
              </div>
            ) : (
              <div className="bg-cosmic-900/50 backdrop-blur border border-cosmic-700 rounded-xl p-12 text-center">
                <p className="text-cosmic-300 mb-4">No birth charts yet. Create one to get started!</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowForm(true)}
                  className="bg-gold-500 hover:bg-gold-600 text-cosmic-950 font-semibold py-2 px-6 rounded-lg transition"
                >
                  Add Your First Chart
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BirthChartPage;
