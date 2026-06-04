import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiFilmLine, RiMailLine, RiLockLine, RiUserLine,
  RiEyeLine, RiEyeOffLine, RiCheckLine, RiArrowRightLine,
  RiGoogleFill, RiSparklingLine
} from 'react-icons/ri';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
    { label: 'Symbol', pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const strength = checks.filter(c => c.pass).length;
  const colors = ['#374151', '#EF4444', '#F97316', '#FFD93D', '#4ECDC4'];
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
          <div key={i} className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
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
            <span key={c.label} className={`text-xs flex items-center gap-1 ${c.pass ? 'text-teal' : 'text-cream/30'}`}>
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
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (form.username.length < 3) errs.username = 'At least 3 characters';
    if (!form.email.includes('@')) errs.email = 'Enter a valid email';
    if (form.password.length < 8) errs.password = 'At least 8 characters required';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
    setTimeout(() => navigate('/'), 1800);
  };

  const set = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: null }));
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-20">
      {/* Background orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 ambient-orb bg-coral/15 animate-float" />
      <div className="absolute bottom-20 right-10 w-64 h-64 ambient-orb bg-teal/12 animate-float-slow" />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 ambient-orb bg-sun/08 animate-float-fast" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 border border-white/12 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-gradient-to-br from-coral to-teal rounded-xl opacity-90" />
              <RiFilmLine className="relative z-10 text-white w-5 h-5 m-2" />
            </div>
            <span className="font-display font-bold text-xl">
              <span className="gradient-text">Cine</span>
              <span className="text-cream/85">wood</span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 bg-gradient-to-br from-teal to-mint rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <RiCheckLine className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="font-display text-2xl font-bold text-cream mb-2">Welcome aboard! 🎬</h2>
                <p className="text-cream/50 text-sm">Taking you to your personalized cinema…</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="font-display text-3xl font-bold text-cream mb-1">Create account</h1>
                <p className="text-cream/45 text-sm mb-7">
                  Already have one?{' '}
                  <Link to="/login" className="text-coral hover:text-coral-light transition-colors font-medium">
                    Sign in
                  </Link>
                </p>

                {/* Google */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/15 text-cream/75 hover:text-cream hover:bg-white/5 transition-all duration-300 mb-6 text-sm font-medium"
                >
                  <RiGoogleFill className="w-4.5 h-4.5 text-coral" />
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-cream/30 text-xs">or with email</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username */}
                  <div>
                    <div className="relative">
                      <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/35" />
                      <input
                        id="signup-username"
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={set('username')}
                        className={`auth-input pl-11 ${errors.username ? 'border-red-500/60' : ''}`}
                        autoComplete="username"
                      />
                    </div>
                    {errors.username && (
                      <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.username}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <div className="relative">
                      <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/35" />
                      <input
                        id="signup-email"
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={set('email')}
                        className={`auth-input pl-11 ${errors.email ? 'border-red-500/60' : ''}`}
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="relative">
                      <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/35" />
                      <input
                        id="signup-password"
                        type={showPass ? 'text' : 'password'}
                        placeholder="Create password"
                        value={form.password}
                        onChange={set('password')}
                        className={`auth-input pl-11 pr-12 ${errors.password ? 'border-red-500/60' : ''}`}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(p => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/35 hover:text-cream/70 transition-colors"
                      >
                        {showPass ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password}</p>
                    )}
                    <PasswordStrength password={form.password} />
                  </div>

                  {/* Confirm */}
                  <div>
                    <div className="relative">
                      <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/35" />
                      <input
                        id="signup-confirm"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={form.confirm}
                        onChange={set('confirm')}
                        className={`auth-input pl-11 pr-12 ${errors.confirm ? 'border-red-500/60' : ''}`}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(p => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/35 hover:text-cream/70 transition-colors"
                      >
                        {showConfirm ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirm && (
                      <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.confirm}</p>
                    )}
                    {form.confirm && form.password === form.confirm && !errors.confirm && (
                      <p className="text-teal text-xs mt-1.5 ml-1 flex items-center gap-1">
                        <RiCheckLine className="w-3 h-3" /> Passwords match
                      </p>
                    )}
                  </div>

                  {/* Terms */}
                  <p className="text-cream/35 text-xs leading-relaxed">
                    By signing up, you agree to our{' '}
                    <span className="text-coral/70 hover:text-coral cursor-pointer transition-colors">Terms</span>
                    {' '}and{' '}
                    <span className="text-coral/70 hover:text-coral cursor-pointer transition-colors">Privacy Policy</span>.
                  </p>

                  {/* Submit */}
                  <motion.button
                    id="signup-submit"
                    type="submit"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,107,107,0.45)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-coral to-coral-light rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-glow-coral transition-all duration-300 mt-2"
                  >
                    <RiSparklingLine className="w-4 h-4" />
                    Create my account
                    <RiArrowRightLine className="w-4 h-4" />
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative badge */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-sun to-coral rounded-2xl flex items-center justify-center shadow-lg rotate-12 pointer-events-none">
          <RiFilmLine className="w-5 h-5 text-white" />
        </div>
      </motion.div>
    </div>
  );
}
