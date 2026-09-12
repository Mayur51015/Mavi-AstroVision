import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Bell, Moon, Sun, Shield, Trash2, Save, KeyRound, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import StarsBackground from '../components/StarsBackground';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';

const TIMEZONES = [
  'UTC',
  'Asia/Kolkata',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Dubai',
  'Australia/Sydney',
];

const LANGUAGES = [
  { code: 'en', label: 'English (US)' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'de', label: 'Deutsch' },
];

const SettingsPage = () => {
  const { user, updateUser, logout } = useAuth();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);

  // Profile / Account
  const [accountForm, setAccountForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    timezone: user?.timezone || 'UTC',
    preferredLanguage: user?.preferredLanguage || 'en',
  });

  // Password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notifications
  const [notifPreferences, setNotifPreferences] = useState({
    dailyHoroscope: true,
    weeklyHoroscope: false,
    importantEvents: true,
    reportsReady: true,
    emailUpdates: true,
  });

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    if (user) {
      setAccountForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        timezone: user.timezone || 'UTC',
        preferredLanguage: user.preferredLanguage || 'en',
      });
      if (user.notificationPreferences) {
        setNotifPreferences(user.notificationPreferences);
      }
    }
  }, [user]);

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/profile', {
        firstName: accountForm.firstName,
        lastName: accountForm.lastName,
      });
      await api.put('/users/preferences', {
        timezone: accountForm.timezone,
        preferredLanguage: accountForm.preferredLanguage,
      });
      updateUser(res.data.user);
      toast.success('Account settings saved! ✨');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    setLoading(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully! 🔐');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotif = async (key) => {
    const updated = { ...notifPreferences, [key]: !notifPreferences[key] };
    setNotifPreferences(updated);
    try {
      await api.put('/users/preferences', { notificationPreferences: updated });
      toast.success('Preferences updated');
    } catch {
      toast.error('Failed to save notification preference');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      return toast.error('Please type DELETE to confirm');
    }
    setLoading(true);
    try {
      await api.delete('/users/profile');
      toast.success('Account deleted');
      logout();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  const inputClass = `w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold-500/40 ${
    isDark
      ? 'bg-obsidian-950 border-obsidian-700 text-slate-100 placeholder-slate-500 focus:border-gold-500/60'
      : 'bg-slate-50 border-slate-200 text-slate-900'
  }`;

  const labelClass = `block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`;

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* ─── Page Header ─── */}
      <PageHeader
        title="Settings & Preferences"
        subtitle="Manage your platform configurations, credentials, and notification settings"
        badge={
          <Badge variant="outline" className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">
            System Preferences
          </Badge>
        }
      />

      {/* ─── Tab Navigation ─── */}
      <div className="flex items-center gap-2 border-b border-obsidian-800 pb-2">
        {[
          { id: 'account', label: 'Account', icon: User },
          { id: 'security', label: 'Security & Password', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'danger', label: 'Danger Zone', icon: Trash2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-obsidian-900 border border-transparent'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── Tab 1: Account ─── */}
      {activeTab === 'account' && (
        <form onSubmit={handleSaveAccount} className="card-saas p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between border-b border-obsidian-800 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <User size={15} className="text-gold-400" /> Seeker Identity Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                required
                value={accountForm.firstName}
                onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                required
                value={accountForm.lastName}
                onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Reference Timezone</label>
              <select
                value={accountForm.timezone}
                onChange={(e) => setAccountForm({ ...accountForm, timezone: e.target.value })}
                className={inputClass}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Preferred Language</label>
              <select
                value={accountForm.preferredLanguage}
                onChange={(e) => setAccountForm({ ...accountForm, preferredLanguage: e.target.value })}
                className={inputClass}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-obsidian-800 flex justify-end">
            <Button type="submit" variant="primary" size="md" loading={loading} className="font-semibold">
              <Save size={15} /> Save Account Changes
            </Button>
          </div>
        </form>
      )}

      {/* ─── Tab 2: Security & Password ─── */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="card-saas p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between border-b border-obsidian-800 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Lock size={15} className="text-gold-400" /> Password & Authentication
            </h3>
          </div>

          <div>
            <label className={labelClass}>Current Password</label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Min. 6 characters"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Repeat new password"
                className={inputClass}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-obsidian-800 flex justify-end">
            <Button type="submit" variant="primary" size="md" loading={loading} className="font-semibold">
              <KeyRound size={15} /> Update Password
            </Button>
          </div>
        </form>
      )}

      {/* ─── Tab 3: Notifications ─── */}
      {activeTab === 'notifications' && (
        <div className="card-saas p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between border-b border-obsidian-800 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Bell size={15} className="text-gold-400" /> Notification Preferences
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'dailyHoroscope',
                title: 'Daily Cosmic Weather Guidance',
                desc: 'Receive personalized celestial forecast highlights based on your natal chart.',
              },
              {
                id: 'weeklyHoroscope',
                title: 'Weekly Transit Digest',
                desc: 'Summary of major lunations, ingresses, and planetary gateways for the week.',
              },
              {
                id: 'importantEvents',
                title: 'Solar & Lunar Eclipse Alerts',
                desc: 'Direct alerts for high-potency cosmic gateways and station events.',
              },
              {
                id: 'reportsReady',
                title: 'Dossier & Report Notifications',
                desc: 'Alert when a downloadable vector PDF dossier is ready for export.',
              },
            ].map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotif(item.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    notifPreferences[item.id] ? 'bg-gold-500' : 'bg-obsidian-800'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-obsidian-950 absolute top-1 transition-transform ${
                      notifPreferences[item.id] ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Tab 4: Danger Zone ─── */}
      {activeTab === 'danger' && (
        <div className="card-saas p-6 sm:p-7 space-y-5 border-rose-500/30">
          <div className="flex items-center justify-between border-b border-obsidian-800 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <AlertTriangle size={15} /> Irreversible Account Actions
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2 text-xs">
            <p className="font-semibold text-rose-300">Delete Seeker Account</p>
            <p className="text-slate-400 leading-relaxed">
              Once your account is deleted, all stored natal coordinates, charts, saved synastries, and report records will be permanently expunged from the database.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="danger"
              size="md"
              onClick={() => setDeleteModalOpen(true)}
              className="font-semibold"
            >
              <Trash2 size={15} /> Delete My Account
            </Button>
          </div>
        </div>
      )}

      {/* ─── Modal: Delete Confirmation ─── */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="card-saas p-6 sm:p-7 max-w-md w-full relative space-y-4 border-rose-500/40 bg-obsidian-900"
            >
              <div className="flex items-start justify-between border-b border-obsidian-800 pb-3">
                <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                  <AlertTriangle size={16} /> Confirm Irreversible Deletion
                </h3>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800 transition"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Please type <strong className="text-rose-400 font-mono">DELETE</strong> in all caps to confirm that you want to wipe your profile data.
              </p>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className={inputClass}
              />

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-obsidian-800">
                <Button variant="secondary" size="sm" onClick={() => setDeleteModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteAccount}
                  loading={loading}
                  disabled={deleteConfirmText !== 'DELETE'}
                  className="font-semibold"
                >
                  Confirm Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
