import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles, Compass, Clock, Menu } from 'lucide-react';

export default function MobileNav({ onOpenMenu }) {
  const tabs = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cosmic-life-map', label: 'Life Map', icon: Sparkles, featured: true },
    { to: '/birth-chart', label: 'Chart', icon: Compass },
    { to: '/cosmic-timeline', label: 'Timeline', icon: Clock },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-obsidian-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-semibold transition-all ${
                  isActive
                    ? 'text-gold-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon size={18} className={tab.featured ? 'text-gold-400' : ''} />
              <span className="mt-0.5">{tab.label}</span>
            </NavLink>
          );
        })}

        {/* More Menu Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Menu size={18} />
          <span className="mt-0.5">More</span>
        </button>
      </div>
    </nav>
  );
}
