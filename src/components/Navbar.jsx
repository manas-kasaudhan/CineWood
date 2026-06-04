import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiFilmLine, RiSearchLine, RiUserLine, RiRobot2Line,
  RiMenuLine, RiCloseLine, RiHeartLine, RiLoginBoxLine
} from 'react-icons/ri';

const navLinks = [
  { to: '/', label: 'Home', icon: RiFilmLine },
  { to: '/recommendations', label: 'Discover', icon: RiSearchLine },
  { to: '/assistant', label: 'AI Cinema', icon: RiRobot2Line },
  { to: '/profile', label: 'Profile', icon: RiUserLine },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-white/10 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-br from-coral to-teal rounded-lg opacity-85 group-hover:opacity-100 transition-opacity" />
              <RiFilmLine className="relative z-10 text-white w-5 h-5 m-1.5" />
            </div>
            <span className="font-display font-semibold text-xl tracking-tight">
              <span className="gradient-text">Cine</span>
              <span className="text-cream/85">wood</span>
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? 'text-coral'
                      : 'text-cream/55 hover:text-cream/90'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-coral/10 rounded-xl border border-coral/20"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink
              to="/profile"
              className="flex items-center gap-1.5 px-3 py-2 glass rounded-xl text-sm text-cream/60 hover:text-cream transition-all hover:border-teal/30 animated-border"
            >
              <RiHeartLine className="w-4 h-4" />
              <span>Watchlist</span>
            </NavLink>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-coral to-coral-light rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-glow-coral transition-all duration-300"
            >
              <RiLoginBoxLine className="w-4 h-4" />
              <span>Sign In</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden glass p-2.5 rounded-xl text-cream/70 hover:text-cream transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <RiCloseLine className="w-5 h-5" /> : <RiMenuLine className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed top-[72px] left-4 right-4 z-40 glass-strong rounded-2xl p-4 border border-white/10"
          >
            {navLinks.map(({ to, label, icon: Icon }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-coral/10 text-coral border border-coral/20'
                        : 'text-cream/60 hover:text-cream hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              </motion.div>
            ))}
            <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
              <button
                onClick={() => { navigate('/login'); setMobileOpen(false); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-coral to-coral-light rounded-xl text-sm font-semibold text-white"
              >
                <RiLoginBoxLine className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={() => { navigate('/signup'); setMobileOpen(false); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/15 rounded-xl text-sm text-cream/70 hover:text-cream transition-colors"
              >
                Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
