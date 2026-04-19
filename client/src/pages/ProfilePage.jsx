import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, LogOut, Edit2, Check, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.put('/users/profile', formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-950 via-cosmic-900 to-cosmic-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gold-400 mb-2">Your Profile</h1>
          <p className="text-cosmic-300">Manage your cosmic identity</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-cosmic-900/50 backdrop-blur border border-cosmic-700 rounded-xl p-8"
        >
          {/* Profile Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-cosmic-600 to-gold-500 rounded-full flex items-center justify-center text-3xl">
              {user?.firstName?.charAt(0)}
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-cosmic-400 text-sm mb-2 block">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-cosmic-800 border border-cosmic-700 rounded px-4 py-2 text-white disabled:opacity-50 focus:border-gold-500 outline-none"
                />
              </div>
              <div>
                <label className="text-cosmic-400 text-sm mb-2 block">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-cosmic-800 border border-cosmic-700 rounded px-4 py-2 text-white disabled:opacity-50 focus:border-gold-500 outline-none"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="text-cosmic-400 text-sm mb-2 block flex items-center gap-2">
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full bg-cosmic-800 border border-cosmic-700 rounded px-4 py-2 text-cosmic-400 disabled:opacity-50"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-cosmic-400 text-sm mb-2 block flex items-center gap-2">
                <Phone size={16} /> Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-cosmic-800 border border-cosmic-700 rounded px-4 py-2 text-white disabled:opacity-50 focus:border-gold-500 outline-none"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-cosmic-400 text-sm mb-2 block">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                rows="4"
                className="w-full bg-cosmic-800 border border-cosmic-700 rounded px-4 py-2 text-white disabled:opacity-50 focus:border-gold-500 outline-none"
              />
            </div>

            {/* Status Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cosmic-700">
              <div>
                <p className="text-cosmic-400 text-sm">Role</p>
                <p className="text-gold-400 font-semibold capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-cosmic-400 text-sm">Subscription</p>
                <p className="text-cosmic-300 font-semibold capitalize">{user?.subscriptionStatus}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-8 border-t border-cosmic-700">
            {!isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-gradient-to-r from-cosmic-600 to-cosmic-500 hover:from-cosmic-500 hover:to-cosmic-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Edit2 size={18} /> Edit Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={logout}
                  className="flex-1 bg-red-900/50 hover:bg-red-900 text-red-200 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition border border-red-700"
                >
                  <LogOut size={18} /> Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <Check size={18} /> Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: user?.firstName || '',
                      lastName: user?.lastName || '',
                      phone: user?.phone || '',
                      bio: user?.bio || '',
                    });
                  }}
                  className="flex-1 bg-cosmic-700 hover:bg-cosmic-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <X size={18} /> Cancel
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
