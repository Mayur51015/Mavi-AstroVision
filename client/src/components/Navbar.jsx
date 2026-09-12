import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon,
  Sun,
  Star,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Map,
  MessageCircle,
  Settings,
  Compass,
  Heart,
  Calendar,
  FileText,
  Sparkles,
  Bookmark,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false);
  }, [location]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  // Desktop nav — streamlined with signature Cosmic Life Map™ featured
  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
        {
          to: '/cosmic-life-map',
          label: 'Life Map™',
          icon: <Sparkles size={16} className="text-gold-400" />,
          featured: true,
        },
        { to: '/birth-chart', label: 'Birth Chart', icon: <Compass size={16} /> },
        { to: '/horoscope', label: 'Horoscope', icon: <Star size={16} /> },
        { to: '/cosmic-timeline', label: 'Timeline', icon: <Clock size={16} /> },
        { to: '/compatibility', label: 'Compatibility', icon: <Heart size={16} /> },
        { to: '/reports', label: 'Reports', icon: <FileText size={16} /> },
      ]
    : [
        { to: '/cosmic-timeline', label: 'Timeline', icon: <Clock size={16} /> },
        { to: '/zodiac', label: 'Zodiac', icon: <Compass size={16} /> },
        { to: '/compatibility', label: 'Compatibility', icon: <Heart size={16} /> },
        { to: '/calendar', label: 'Calendar', icon: <Calendar size={16} /> },
        { to: '/ai-astrology', label: 'AI Oracle', icon: <MessageCircle size={16} /> },
      ];

  // Mobile nav — full hierarchy
  const mobileLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
        {
          to: '/cosmic-life-map',
          label: 'Cosmic Life Map™',
          icon: <Sparkles size={16} className="text-gold-400" />,
          featured: true,
        },
        { to: '/birth-chart', label: 'Birth Chart', icon: <Compass size={16} /> },
        { to: '/horoscope', label: 'Daily Horoscope', icon: <Star size={16} /> },
        { to: '/cosmic-timeline', label: 'Cosmic Timeline', icon: <Clock size={16} /> },
        { to: '/compatibility', label: 'Compatibility', icon: <Heart size={16} /> },
        { to: '/ai-astrology', label: 'AI Astrological Oracle', icon: <MessageCircle size={16} /> },
        { to: '/reports', label: 'PDF Reports', icon: <FileText size={16} /> },
        { to: '/favorites', label: 'Saved Favorites', icon: <Bookmark size={16} /> },
        { to: '/zodiac', label: 'Zodiac Explorer', icon: <Map size={16} /> },
        { to: '/articles', label: 'Celestial Learning', icon: <BookOpen size={16} /> },
        ...(user.role === 'admin'
          ? [{ to: '/admin', label: 'Admin Panel', icon: <Settings size={16} /> }]
          : []),
      ]
    : [
        { to: '/cosmic-timeline', label: 'Cosmic Timeline', icon: <Clock size={16} /> },
        { to: '/zodiac', label: 'Zodiac Signs', icon: <Compass size={16} /> },
        { to: '/compatibility', label: 'Compatibility', icon: <Heart size={16} /> },
        { to: '/calendar', label: 'Calendar', icon: <Calendar size={16} /> },
        { to: '/ai-astrology', label: 'AI Astrological Oracle', icon: <MessageCircle size={16} /> },
        { to: '/articles', label: 'Celestial Learning', icon: <BookOpen size={16} /> },
      ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cosmic-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-cosmic-950/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 text-gold-500">
              <Star fill="currentColor" size={32} />
            </div>
            <span className="font-cinzel text-lg font-bold text-gradient-gold hidden sm:block">
              Mavi-AstroVision
            </span>
            <span className="font-cinzel text-lg font-bold text-gradient-gold sm:hidden">
              Mavi
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  link.featured && !isActive(link.to)
                    ? 'text-gold-300 bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/20'
                    : isActive(link.to)
                    ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-white/50 hover:text-gold-400 hover:bg-white/5 transition-all duration-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  id="profile-menu-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-200"
                  aria-label="User menu"
                  aria-expanded={profileOpen}
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-gold-400 to-aurora-purple rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-white/80">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-cosmic-900 border border-white/10 shadow-2xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/40 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/cosmic-life-map"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gold-300 hover:text-gold-200 hover:bg-gold-500/10 transition-colors"
                        >
                          <Sparkles size={15} /> Cosmic Life Map™
                        </Link>
                        <Link
                          to="/favorites"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Bookmark size={15} /> Saved & Favorites
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <User size={15} /> Birth Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Settings size={15} /> Settings
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Settings size={15} /> Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-white/10 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-gold text-sm !py-2 !px-5">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-white/60 hover:bg-white/5 transition-all"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-white/10 bg-cosmic-950/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {user ? (
                <>
                  {mobileLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        link.featured && !isActive(link.to)
                          ? 'bg-gold-500/10 text-gold-300 border border-gold-500/20'
                          : isActive(link.to)
                          ? 'bg-gold-500/15 text-gold-400'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.icon} {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5"
                    >
                      <Settings size={16} /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/10"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {mobileLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive(link.to)
                          ? 'bg-gold-500/15 text-gold-400'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.icon} {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-white/10 mt-2 pt-2 space-y-1">
                    <Link
                      to="/login"
                      className="block px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5"
                    >
                      Sign In
                    </Link>
                    <Link to="/register" className="block btn-gold text-center text-sm">
                      Get Started
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
