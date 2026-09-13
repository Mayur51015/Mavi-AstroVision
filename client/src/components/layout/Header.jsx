import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Moon,
  Sun,
  Bell,
  Sparkles,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const isImageUrl = (val) => {
  if (!val || typeof val !== 'string') return false;
  const trimmed = val.trim();
  return /^(https?:\/\/|data:image\/|\/)/i.test(trimmed);
};

const getAvatarSymbol = (val, firstName) => {
  if (val && typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.length <= 4 && !/^(https?:\/\/|data:)/i.test(trimmed)) {
      return trimmed;
    }
  }
  return firstName?.charAt(0)?.toUpperCase() || '✨';
};

export default function Header({ onOpenMobileMenu }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-obsidian-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wider uppercase text-[11px] text-slate-400">
            Celestial Ephemeris Synced
          </span>
        </div>
      </div>

      {/* Right: Actions, Theme, Notifications & User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors relative"
            title="Notifications"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-400 rounded-full" />
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-obsidian-900 border border-slate-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Celestial Feed
                </span>
                <span className="text-[10px] text-gold-400 font-semibold">Active Cycle</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                  <p className="font-semibold text-slate-200">✨ Solar Cycle Ingress</p>
                  <p className="text-slate-400 text-[11px]">
                    Planetary transitions are updated according to Western Tropical Ephemeris.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 pl-2 pr-1.5 py-1.5 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-gold-500 to-amber-400 p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded-[10px] bg-obsidian-900 flex items-center justify-center text-gold-400 text-xs font-bold font-cinzel overflow-hidden">
                {isImageUrl(user?.profileImage) ? (
                  <img
                    src={user.profileImage}
                    alt={user?.firstName || 'User'}
                    className="w-full h-full object-cover rounded-[10px]"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span>{getAvatarSymbol(user?.profileImage, user?.firstName)}</span>
                )}
              </div>
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate leading-tight">
                {user?.name || user?.firstName || 'Explorer'}
              </span>
              <span className="text-[10px] text-gold-400 font-medium capitalize">
                {user?.role === 'admin' ? 'Admin' : 'SaaS Member'}
              </span>
            </div>

            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-obsidian-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-slate-800/80">
              <div className="px-4 py-3">
                <p className="text-xs font-semibold text-slate-100 truncate">
                  {user?.name || user?.firstName || 'Astrology Explorer'}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
              </div>

              <div className="py-1.5">
                <Link
                  to="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <User size={15} /> My Profile
                </Link>

                <Link
                  to="/cosmic-life-map"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <Sparkles size={15} className="text-gold-400" /> Cosmic Life Map™
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <Settings size={15} /> Account Settings
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-colors"
                  >
                    <Shield size={15} /> Admin Console
                  </Link>
                )}
              </div>

              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
