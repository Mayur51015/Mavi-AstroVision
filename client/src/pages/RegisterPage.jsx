import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Star, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import StarsBackground from '../components/StarsBackground';

const RegisterPage = () => {
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('All fields are required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password);
      toast.success(`Welcome to Mavi-AstroVision, ${user.name.split(' ')[0]}! ✨`);
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = isDark
    ? 'bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-gold-500'
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100';

  const labelClass = `block text-sm font-medium mb-2 ${isDark ? 'text-white/70' : 'text-slate-700'}`;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-20 ${isDark ? 'bg-cosmic-950' : 'bg-gradient-to-br from-purple-50 to-indigo-100'}`}>
      {isDark && <StarsBackground />}

      {isDark && (
        <>
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cosmic-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-aurora-purple/20 rounded-full blur-3xl" />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 w-full max-w-md rounded-3xl border p-8 ${
          isDark ? 'bg-white/5 border-white/10 backdrop-blur-xl' : 'bg-white border-slate-200 shadow-2xl'
        }`}
      >
        <div className="text-center mb-8">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="inline-block mb-3">
            <Star className="text-gold-500" size={40} fill="currentColor" />
          </motion.div>
          <h1 className="font-cinzel text-2xl font-bold text-gradient-gold">Begin Your Journey</h1>
          <p className={`text-sm mt-2 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Create your cosmic account</p>
        </div>

        <form id="register-form" onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Full Name</label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-slate-400'}`} size={18} />
              <input
                id="register-name"
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Your full name"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:outline-none ${inputClass}`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-slate-400'}`} size={18} />
              <input
                id="register-email"
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:outline-none ${inputClass}`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-slate-400'}`} size={18} />
              <input
                id="register-password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Min. 6 characters"
                className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all focus:outline-none ${inputClass}`}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40 hover:text-white/70' : 'text-slate-400 hover:text-slate-600'}`}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Confirm Password</label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-slate-400'}`} size={18} />
              <input
                id="register-confirm-password"
                type={showPass ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Repeat password"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:outline-none ${inputClass}`}
              />
            </div>
          </div>

          <motion.button
            id="register-submit-btn"
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
              <><UserPlus size={18} /> Create Account</>
            )}
          </motion.button>
        </form>

        <p className={`text-center text-sm mt-6 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
            Sign in ✨
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
