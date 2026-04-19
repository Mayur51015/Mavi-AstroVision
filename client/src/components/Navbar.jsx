import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Star, Menu, X, User, LogOut, LayoutDashboard, BookOpen, Map, MessageCircle, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const zodiacEmoji = { aries:'♈',taurus:'♉',gemini:'♊',cancer:'♋',leo:'♌',virgo:'♍',libra:'♎',scorpio:'♏',sagittarius:'♐',capricorn:'♑',aquarius:'♒',pisces:'♓' };

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setProfileOpen(false); }, [location]);

  const navLinks = user ? [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/horoscope', label: 'Horoscope', icon: <BookOpen size={16} /> },
    { to: '/birth-chart', label: 'Birth Chart', icon: <Map size={16} /> },
    { to: '/chatbot', label: 'AI Chat', icon: <MessageCircle size={16} /> },
    ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: <Settings size={16} /> }] : []),
  ] : [];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? isDark 
          ? 'bg-cosmic-950/90 backdrop-blur-xl border-b border-white/10 shadow-cosmic' 
          : 'bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 text-gold-500"
            >
              <Star fill="currentColor" size={32} />
            </motion.div>
            <span className="font-cinzel text-xl font-bold text-gradient-gold">
              Mavi-AstroVision
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                      : isDark
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              id="theme-toggle"
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDark ? 'bg-white/10 text-gold-400 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={18} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  id="profile-menu-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                    isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-gold-400 to-aurora-purple rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`hidden sm:block text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    {user.name?.split(' ')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl border overflow-hidden ${
                        isDark ? 'bg-cosmic-900 border-white/10' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className={`px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                        <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-400'}`}>{user.email}</p>
                      </div>
                      <Link to="/profile" className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <User size={14} /> Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 transition-colors">
                        <LogOut size={14} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isDark ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  Login
                </Link>
                <Link to="/register" className="btn-gold text-sm py-2">Get Started</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-full ${isDark ? 'text-white/70 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}
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
            className={`md:hidden border-t ${isDark ? 'bg-cosmic-950/95 border-white/10' : 'bg-white border-slate-200'}`}
          >
            <div className="px-4 py-4 space-y-1">
              {user ? (
                <>
                  {navLinks.map(link => (
                    <Link key={link.to} to={link.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === link.to ? 'bg-gold-500/20 text-gold-400' : isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50'
                    }`}>
                      {link.icon} {link.label}
                    </Link>
                  ))}
                  <Link to="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${isDark ? 'text-white/70 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <User size={16} /> Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/10">
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={`block px-4 py-3 rounded-xl text-sm ${isDark ? 'text-white/70 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50'}`}>Login</Link>
                  <Link to="/register" className="block btn-gold text-center text-sm">Get Started</Link>
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
