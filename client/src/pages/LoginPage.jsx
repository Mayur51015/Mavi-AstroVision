import { useState, useEffect } from 'react';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Star, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import StarsBackground from '../components/StarsBackground';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const { login, updateUser } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error(decodeURIComponent(error) || 'Google authentication failed');
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
      setLoading(true);
      localStorage.setItem('maviastro_token', token);
      api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          const userData = res.data.user;
          localStorage.setItem('maviastro_user', JSON.stringify(userData));
          updateUser(userData);
          const firstName = (userData.name || userData.firstName || 'Explorer').split(' ')[0];
          toast.success(`Welcome, ${firstName}! ✨`);
          navigate(userData.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
        })
        .catch((err) => {
          console.error('Google auth profile error:', err);
          localStorage.removeItem('maviastro_token');
          toast.error('Google sign-in could not be completed');
          navigate('/login', { replace: true });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchParams, navigate, updateUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const firstName = (user.name || user.firstName || 'Explorer').split(' ')[0];
      toast.success(`Welcome back, ${firstName}! ✨`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${isDark ? 'bg-obsidian-950 text-slate-100' : 'bg-slate-50 text-slate-900'} relative overflow-hidden`}>
      {isDark && <StarsBackground />}

      {/* Subtle background glow */}
      {isDark && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-iris-500/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`relative z-10 w-full max-w-md rounded-2xl border p-8 ${
          isDark
            ? 'bg-obsidian-900/90 border-obsidian-700/80 backdrop-blur-xl shadow-2xl'
            : 'bg-white border-slate-200 shadow-xl'
        }`}
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 mb-3 shadow-inner">
            <Star size={24} fill="currentColor" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold text-gradient-gold">Welcome Back</h1>
          <p className={`text-xs mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Sign in to access your Cosmic Life Map™ and ephemeris insights
          </p>
        </div>

        <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={16} />
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold-500/40 ${
                  isDark
                    ? 'bg-obsidian-950 border-obsidian-700 text-slate-100 placeholder-slate-500 focus:border-gold-500/60'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-gold-500'
                }`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={16} />
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-gold-500/40 ${
                  isDark
                    ? 'bg-obsidian-950 border-obsidian-700 text-slate-100 placeholder-slate-500 focus:border-gold-500/60'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-gold-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            id="login-submit-btn"
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full mt-2 font-medium"
          >
            <LogIn size={16} /> Sign In
          </Button>
        </form>

        {/* OR Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${isDark ? 'border-obsidian-700' : 'border-slate-200'}`} />
          </div>
          <span className={`relative px-3 text-[11px] font-semibold tracking-wider uppercase ${isDark ? 'bg-obsidian-900 text-slate-500' : 'bg-white text-slate-400'}`}>
            Or continue with
          </span>
        </div>

        <GoogleAuthButton />

        <p className={`text-center text-xs mt-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
