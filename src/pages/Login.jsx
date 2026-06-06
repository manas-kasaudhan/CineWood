import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  RiFilmLine, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine,
  RiArrowRightLine, RiGoogleFill
} from 'react-icons/ri';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email.includes('@')) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please try again.';
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

          <h1 className="font-display text-3xl font-bold text-cream mb-1">Welcome back</h1>
          <p className="text-cream/40 text-sm mb-7">
            Please enter your details to sign in.
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
            {/* Email */}
            <div>
              <div className="relative">
                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                <input
                  id="login-email"
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
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={set('password')}
                  className={`auth-input pl-11 pr-12 ${errors.password ? 'border-red-500/50' : ''}`}
                  autoComplete="current-password"
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
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <span className="text-primary/60 hover:text-primary text-xs cursor-pointer transition-colors">
                Forgot password?
              </span>
            </div>

            {/* Submit */}
            <motion.button
              id="login-submit"
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary rounded-xl text-white font-semibold text-sm shadow-soft transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-primary-dark"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  Sign in to CineWood
                  <RiArrowRightLine className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
