import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Star, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import StarsBackground from '../components/StarsBackground';

const LoginPage = () => {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! ✨`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-cosmic-950' : 'bg-gradient-to-br from-purple-50 to-indigo-100'}`}>
      {isDark && <StarsBackground />}

      {/* Glow effects */}
      {isDark && (
        <>
          <div className="absolute top-1/3 -left-48 w-96 h-96 bg-cosmic-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-aurora-purple/20 rounded-full blur-3xl" />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 w-full max-w-md rounded-3xl border p-8 ${
          isDark
            ? 'bg-white/5 border-white/10 backdrop-blur-xl'
            : 'bg-white border-slate-200 shadow-2xl'
        }`}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-3"
          >
            <Star className="text-gold-500" size={40} fill="currentColor" />
          </motion.div>
          <h1 className="font-cinzel text-2xl font-bold text-gradient-gold">Welcome Back</h1>
          <p className={`text-sm mt-2 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Sign in to your cosmic portal</p>
        </div>

        <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/70' : 'text-slate-700'}`}>Email</label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-slate-400'}`} size={18} />
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-gold-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                }`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white/70' : 'text-slate-700'}`}>Password</label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-slate-400'}`} size={18} />
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-300 focus:outline-none ${
                  isDark
                    ? 'bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-gold-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40 hover:text-white/70' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full btn-gold flex items-center justify-center gap-2 py-3"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Star size={18} />
              </motion.div>
            ) : (
              <><LogIn size={18} /> Sign In</>
            )}
          </motion.button>
        </form>

        <p className={`text-center text-sm mt-6 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
          Don't have an account?{' '}
          <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
            Create one ✨
          </Link>
        </p>

        {/* Demo credentials hint */}
        <div className={`mt-4 p-3 rounded-xl border text-xs ${isDark ? 'bg-gold-500/5 border-gold-500/20 text-gold-400/70' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
          <strong>Admin Demo:</strong> admin@maviastrovision.com / Admin@1234
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
