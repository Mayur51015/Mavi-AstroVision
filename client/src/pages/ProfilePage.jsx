import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Edit3,
  Save,
  CheckCircle2,
  Shield,
  Settings,
  Compass,
  Sun,
  Moon,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import StarsBackground from '../components/StarsBackground';
import Loader from '../components/Loader';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';

const AVATAR_PRESETS = [
  '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🌟', '🌙', '☀️', '🔮',
];

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [birthDetail, setBirthDetail] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: 'other',
    bio: '',
    profileImage: '',
  });

  const [birthForm, setBirthForm] = useState({
    dateOfBirth: '',
    timeOfBirth: '12:00',
    placeOfBirth: '',
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile');
      const u = res.data.user;
      const b = res.data.birthDetail;

      setBirthDetail(b);
      setFormData({
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        phone: u.phone || '',
        gender: u.gender || 'other',
        bio: u.bio || '',
        profileImage: u.profileImage || '',
      });

      if (b) {
        setBirthForm({
          dateOfBirth: b.dateOfBirth ? new Date(b.dateOfBirth).toISOString().split('T')[0] : '',
          timeOfBirth: b.timeOfBirth || '12:00',
          placeOfBirth: b.placeOfBirth || '',
        });
      }
    } catch {
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', formData);
      updateUser(res.data.user);

      // If birth details were updated
      if (birthForm.dateOfBirth && birthForm.placeOfBirth) {
        const bRes = await api.post('/users/birth-details', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: birthForm.dateOfBirth,
          timeOfBirth: birthForm.timeOfBirth,
          placeOfBirth: birthForm.placeOfBirth,
          latitude: birthDetail?.latitude || 19.0760,
          longitude: birthDetail?.longitude || 72.8777,
          timezone: birthDetail?.timezone || 'UTC',
        });
        setBirthDetail(bRes.data.birthDetail);
      }

      toast.success('Celestial profile updated! ✨');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const calculateCompletion = () => {
    let score = 0;
    if (formData.firstName) score += 15;
    if (formData.lastName) score += 15;
    if (user?.email) score += 15;
    if (formData.bio) score += 15;
    if (formData.profileImage) score += 10;
    if (birthDetail?.dateOfBirth || birthForm.dateOfBirth) score += 15;
    if (birthDetail?.placeOfBirth || birthForm.placeOfBirth) score += 15;
    return Math.min(100, score);
  };

  const completion = calculateCompletion();

  if (loading) return <Loader text="Aligning seeker profile..." />;

  const inputClass = `w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold-500/40 ${
    isDark
      ? 'bg-obsidian-950 border-obsidian-700 text-slate-100 placeholder-slate-500 focus:border-gold-500/60 disabled:opacity-60 disabled:cursor-not-allowed'
      : 'bg-slate-50 border-slate-200 text-slate-900 disabled:opacity-60'
  }`;

  const labelClass = `block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* ─── Page Header ─── */}
      <PageHeader
        title="Celestial Profile"
        subtitle="Manage your personal identity, astrological coordinates, and avatar signature"
        badge={
          <Badge variant="gold" className="text-[10px] tracking-wider uppercase font-semibold">
            Seeker Profile
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2.5">
            <Link to="/settings">
              <Button variant="secondary" size="sm">
                <Settings size={14} /> Settings
              </Button>
            </Link>
            <Button
              variant={isEditing ? 'outline' : 'primary'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 size={14} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </div>
        }
      />

      {/* ─── Profile Completion Bar ─── */}
      <div className="card-saas p-5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Sparkles className="text-gold-400" size={15} />
            <span>Profile Astrological Completion</span>
          </div>
          <span className="text-xs font-mono font-bold text-gold-400">{completion}%</span>
        </div>
        <div className="h-1.5 w-full bg-obsidian-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold-500 to-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        {completion < 100 && (
          <p className="text-[11px] text-slate-500 mt-2">
            Tip: Complete your birth details and cosmic bio to achieve 100% chart synthesis precision.
          </p>
        )}
      </div>

      {/* ─── Main Grid: Identity Card & Form ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Avatar & Natal Signs Summary */}
        <div className="md:col-span-1 space-y-4">
          <div className="card-saas p-6 text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-gold-500/30 to-iris-500/30 p-0.5 shadow-md">
                <div className="w-full h-full rounded-2xl bg-obsidian-950 flex items-center justify-center text-3xl font-cinzel font-bold text-gold-400 border border-gold-500/30">
                  {formData.profileImage || formData.firstName?.charAt(0) || '✨'}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-cinzel font-bold text-white">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            </div>

            {/* Big 3 Signs */}
            <div className="pt-4 border-t border-obsidian-800 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-obsidian-950 border border-obsidian-800">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">SUN</span>
                <span className="text-xs font-semibold text-gold-400 truncate block">
                  {birthDetail?.sunSign || '—'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-obsidian-950 border border-obsidian-800">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">MOON</span>
                <span className="text-xs font-semibold text-iris-400 truncate block">
                  {birthDetail?.moonSign || '—'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-obsidian-950 border border-obsidian-800">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">RISING</span>
                <span className="text-xs font-semibold text-emerald-400 truncate block">
                  {birthDetail?.ascendant || '—'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/birth-chart" className="w-full">
                <Button variant="secondary" size="sm" className="w-full text-xs">
                  <Compass size={13} /> View Full Wheel
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Editable Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSaveProfile} className="card-saas p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-obsidian-800 pb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <User size={15} className="text-gold-400" /> Personal Identity Details
              </h3>
              {isEditing && (
                <Badge variant="iris" className="text-[10px]">
                  Editing Active
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.firstName}
                  onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.lastName}
                  onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Gender / Pronouns</label>
                <select
                  disabled={!isEditing}
                  value={formData.gender}
                  onChange={(e) => setFormData((p) => ({ ...p, gender: e.target.value }))}
                  className={inputClass}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other / Non-Binary</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Cosmic Bio</label>
              <textarea
                rows={3}
                disabled={!isEditing}
                value={formData.bio}
                onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Share your spiritual journey or celestial reflections..."
                className={inputClass}
              />
            </div>

            {isEditing && (
              <div className="space-y-2">
                <label className={labelClass}>Avatar Archetype Preset</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_PRESETS.map((symbol) => (
                    <button
                      type="button"
                      key={symbol}
                      onClick={() => setFormData((p) => ({ ...p, profileImage: symbol }))}
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center text-sm transition-all ${
                        formData.profileImage === symbol
                          ? 'bg-gold-500 border-gold-400 text-obsidian-950 font-bold scale-105 shadow'
                          : 'bg-obsidian-950 border-obsidian-800 text-slate-300 hover:bg-obsidian-800'
                      }`}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Natal Coordinates Section */}
            <div className="pt-5 border-t border-obsidian-800 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Compass size={15} className="text-gold-400" /> Natal Birth Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Birth Date</label>
                  <input
                    type="date"
                    disabled={!isEditing}
                    value={birthForm.dateOfBirth}
                    onChange={(e) => setBirthForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Birth Time</label>
                  <input
                    type="time"
                    disabled={!isEditing}
                    value={birthForm.timeOfBirth}
                    onChange={(e) => setBirthForm((p) => ({ ...p, timeOfBirth: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Birth Place</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={birthForm.placeOfBirth}
                    onChange={(e) => setBirthForm((p) => ({ ...p, placeOfBirth: e.target.value }))}
                    placeholder="e.g. London, UK"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="pt-4 border-t border-obsidian-800 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={saving}
                  className="font-semibold"
                >
                  <Save size={15} /> Save All Changes
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
