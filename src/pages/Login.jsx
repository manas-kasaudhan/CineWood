import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiFilmLine, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine,
  RiArrowRightLine, RiGoogleFill, RiSparklingLine
} from 'react-icons/ri';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.includes('@')) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/'); }, 1200);
  };

  const set = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: null }));
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 py-20">
      {/* Background orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 ambient-orb bg-teal/12 animate-float" />
      <div className="absolute bottom-20 left-10 w-64 h-64 ambient-orb bg-coral/12 animate-float-slow" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-md"
      >
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

          <h1 className="font-display text-3xl font-bold text-cream mb-1">Welcome back</h1>
          <p className="text-cream/45 text-sm mb-7">
            New here?{' '}
            <Link to="/signup" className="text-coral hover:text-coral-light transition-colors font-medium">
              Create an account
            </Link>
          </p>

          {/* Google */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/15 text-cream/75 hover:text-cream hover:bg-white/5 transition-all duration-300 mb-6 text-sm font-medium"
          >
            <RiGoogleFill className="w-4 h-4 text-coral" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-cream/30 text-xs">or with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <div className="relative">
                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/35" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={set('email')}
                  className={`auth-input pl-11 ${errors.email ? 'border-red-500/60' : ''}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/35" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={set('password')}
                  className={`auth-input pl-11 pr-12 ${errors.password ? 'border-red-500/60' : ''}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/35 hover:text-cream/70 transition-colors"
                >
                  {showPass ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password}</p>}
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <span className="text-coral/70 hover:text-coral text-xs cursor-pointer transition-colors">
                Forgot password?
              </span>
            </div>

            {/* Submit */}
            <motion.button
              id="login-submit"
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? 'none' : '0 0 30px rgba(255,107,107,0.45)' }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-coral to-coral-light rounded-xl text-white font-semibold text-sm shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <RiSparklingLine className="w-4 h-4" />
                  Sign in to CineWood
                  <RiArrowRightLine className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Decorative badge */}
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-teal to-mint rounded-2xl flex items-center justify-center shadow-lg -rotate-12 pointer-events-none">
          <RiFilmLine className="w-5 h-5 text-white" />
        </div>
      </motion.div>
    </div>
  );
}
