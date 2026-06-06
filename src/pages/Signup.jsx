import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  RiFilmLine, RiMailLine, RiLockLine, RiUserLine,
  RiEyeLine, RiEyeOffLine, RiCheckLine, RiArrowRightLine,
  RiGoogleFill
} from 'react-icons/ri';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
    { label: 'Symbol', pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const strength = checks.filter(c => c.pass).length;
  const colors = ['#374151', '#EF4444', '#F97316', '#F5A623', '#3DD598'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-3 space-y-2"
    >
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/8 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: strength >= i ? '100%' : '0%' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              style={{ background: colors[strength] }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {checks.map(c => (
            <span key={c.label} className={`text-xs flex items-center gap-1 ${c.pass ? 'text-accent' : 'text-cream/25'}`}>
              <RiCheckLine className="w-3 h-3" />
              {c.label}
            </span>
          ))}
        </div>
        <span className="text-xs font-semibold" style={{ color: colors[strength] }}>
          {labels[strength]}
        </span>
      </div>
    </motion.div>
  );
};

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (form.username.length < 3) errs.username = 'At least 3 characters';
    if (!form.email.includes('@')) errs.email = 'Enter a valid email';
    if (form.password.length < 8) errs.password = 'At least 8 characters required';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');

    try {
      await signup(form.email, form.username, form.password);
      setSubmitted(true);
      setTimeout(() => navigate('/'), 1800);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Signup failed. Please try again.';
      setApiError(msg);
      setLoading(false);
    }
  };

  const set = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: null }));
    if (apiError) setApiError('');
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="glass-strong rounded-2xl p-8 border border-slate shadow-elevated">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-primary rounded-xl opacity-90" />
              <RiFilmLine className="relative z-10 text-white w-5 h-5 m-2" />
            </div>
            <span className="font-display font-bold text-xl">
              <span className="text-primary">Cine</span>
              <span className="text-cream/85">wood</span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <RiCheckLine className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="font-display text-2xl font-bold text-cream mb-2">Welcome aboard! 🎬</h2>
                <p className="text-cream/45 text-sm">Taking you to your personalized cinema…</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="font-display text-3xl font-bold text-cream mb-1">Create account</h1>
                <p className="text-cream/40 text-sm mb-7">
                  Already have one?{' '}
                  <Link to="/login" className="text-primary hover:text-primary-light transition-colors font-medium">
                    Sign in
                  </Link>
                </p>

                {/* API Error */}
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                  >
                    {apiError}
                  </motion.div>
                )}

                {/* Google */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-slate text-cream/65 hover:text-cream hover:bg-white/3 transition-all duration-300 mb-6 text-sm font-medium"
                >
                  <RiGoogleFill className="w-4 h-4 text-primary" />
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-slate" />
                  <span className="text-cream/25 text-xs">or with email</span>
                  <div className="flex-1 h-px bg-slate" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username */}
                  <div>
                    <div className="relative">
                      <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                      <input
                        id="signup-username"
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={set('username')}
                        className={`auth-input pl-11 ${errors.username ? 'border-red-500/50' : ''}`}
                        autoComplete="username"
                      />
                    </div>
                    {errors.username && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.username}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <div className="relative">
                      <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                      <input
                        id="signup-email"
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={set('email')}
                        className={`auth-input pl-11 ${errors.email ? 'border-red-500/50' : ''}`}
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="relative">
                      <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                      <input
                        id="signup-password"
                        type={showPass ? 'text' : 'password'}
                        placeholder="Create password"
                        value={form.password}
                        onChange={set('password')}
                        className={`auth-input pl-11 pr-12 ${errors.password ? 'border-red-500/50' : ''}`}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(p => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60 transition-colors"
                      >
                        {showPass ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password}</p>}
                    <PasswordStrength password={form.password} />
                  </div>

                  {/* Confirm */}
                  <div>
                    <div className="relative">
                      <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                      <input
                        id="signup-confirm"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={form.confirm}
                        onChange={set('confirm')}
                        className={`auth-input pl-11 pr-12 ${errors.confirm ? 'border-red-500/50' : ''}`}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(p => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60 transition-colors"
                      >
                        {showConfirm ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirm && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.confirm}</p>}
                    {form.confirm && form.password === form.confirm && !errors.confirm && (
                      <p className="text-accent text-xs mt-1.5 ml-1 flex items-center gap-1">
                        <RiCheckLine className="w-3 h-3" /> Passwords match
                      </p>
                    )}
                  </div>

                  {/* Terms */}
                  <p className="text-cream/30 text-xs leading-relaxed">
                    By signing up, you agree to our{' '}
                    <span className="text-primary/60 hover:text-primary cursor-pointer transition-colors">Terms</span>
                    {' '}and{' '}
                    <span className="text-primary/60 hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>.
                  </p>

                  {/* Submit */}
                  <motion.button
                    id="signup-submit"
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.99 }}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary rounded-xl text-white font-semibold text-sm shadow-soft hover:bg-primary-dark transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        Create my account
                        <RiArrowRightLine className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
