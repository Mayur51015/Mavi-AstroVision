import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Compass,
  Star,
  Clock,
  Heart,
  FileText,
  Bot,
  Bookmark,
  Shield,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ collapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      to: '/cosmic-life-map',
      label: 'Cosmic Life Map™',
      icon: Sparkles,
      featured: true,
      badge: 'Core',
    },
    { to: '/birth-chart', label: 'Natal Chart', icon: Compass },
    { to: '/horoscope', label: 'Daily Guidance', icon: Star },
    { to: '/cosmic-timeline', label: 'Timeline', icon: Clock },
    { to: '/compatibility', label: 'Compatibility', icon: Heart },
    { to: '/reports', label: 'Reports Vault', icon: FileText },
    { to: '/ai-astrology', label: 'AI Oracle', icon: Bot },
    { to: '/favorites', label: 'Saved Library', icon: Bookmark },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: '/admin', label: 'Admin Console', icon: Shield, admin: true });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-obsidian-950 border-r border-slate-800/80 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 shrink-0">
        <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-gold-500 to-amber-400 p-0.5 shrink-0 flex items-center justify-center shadow-gold">
            <div className="w-full h-full rounded-[10px] bg-obsidian-950 flex items-center justify-center text-gold-400">
              <Sparkles size={18} />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-cinzel text-base font-bold tracking-wider text-slate-100 group-hover:text-gold-400 transition-colors">
                MAVI<span className="text-gold-400">ASTRO</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">
                Intelligence Platform
              </span>
            </div>
          )}
        </NavLink>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Celestial Suite
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-slate-800/90 text-gold-400 border border-slate-700/80 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`
              }
            >
              <Icon
                size={18}
                className={`shrink-0 transition-colors ${
                  item.featured ? 'text-gold-400' : 'group-hover:text-slate-200'
                }`}
              />

              {!collapsed && (
                <div className="flex items-center justify-between flex-1 overflow-hidden">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gold-500/15 text-gold-400 border border-gold-500/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User & Settings Footer */}
      <div className="p-3 border-t border-slate-800/80 space-y-1.5 shrink-0">
        <NavLink
          to="/profile"
          onClick={onCloseMobile}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-slate-800/90 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`
          }
        >
          <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-gold-400 shrink-0 text-xs font-semibold">
            {user?.firstName ? user.firstName.charAt(0) : '✨'}
          </div>
          {!collapsed && (
            <div className="flex-1 truncate text-left">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {user?.name || user?.firstName || 'Astrology Seeker'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          )}
        </NavLink>

        <div className="flex items-center gap-1">
          <NavLink
            to="/settings"
            onClick={onCloseMobile}
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"
          >
            <Settings size={15} />
            {!collapsed && <span>Settings</span>}
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Log out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className={`fixed top-0 bottom-0 left-0 ${collapsed ? 'w-20' : 'w-64'}`}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
