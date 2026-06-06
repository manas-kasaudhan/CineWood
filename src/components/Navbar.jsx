import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  RiFilmLine, RiSearchLine, RiUserLine, RiChat3Line,
  RiMenuLine, RiCloseLine, RiHeartLine, RiLoginBoxLine,
  RiBarChartBoxLine, RiLogoutBoxLine
} from 'react-icons/ri';

const navLinks = [
  { to: '/', label: 'Home', icon: RiFilmLine },
  { to: '/recommendations', label: 'Discover', icon: RiSearchLine },
  { to: '/assistant', label: 'Assistant', icon: RiChat3Line },
  { to: '/reports', label: 'Reports', icon: RiBarChartBoxLine },
  { to: '/profile', label: 'Profile', icon: RiUserLine },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-slate py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-primary rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" />
              <RiFilmLine className="relative z-10 text-white w-5 h-5 m-1.5" />
            </div>
            <span className="font-display font-semibold text-xl tracking-tight">
              <span className="text-primary">Cine</span>
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
                      ? 'text-primary'
                      : 'text-cream/50 hover:text-cream/80'
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
                        className="absolute inset-0 bg-primary/8 rounded-xl border border-primary/15"
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
            {isAuthenticated ? (
              <>
                {/* User Avatar */}
                <NavLink
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 glass rounded-xl text-sm text-cream/55 hover:text-cream transition-all hover:border-primary/20"
                >
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.username}</span>
                </NavLink>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 glass rounded-xl text-sm text-cream/40 hover:text-red-400 transition-all border border-slate hover:border-red-500/30"
                >
                  <RiLogoutBoxLine className="w-4 h-4" />
                  <span>Sign Out</span>
                </motion.button>
              </>
            ) : (
              <>
                <NavLink
                  to="/profile"
                  className="flex items-center gap-1.5 px-3 py-2 glass rounded-xl text-sm text-cream/50 hover:text-cream transition-all hover:border-primary/20"
                >
                  <RiHeartLine className="w-4 h-4" />
                  <span>Watchlist</span>
                </NavLink>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary rounded-xl text-sm font-semibold text-white shadow-soft hover:bg-primary-dark transition-all duration-300"
                >
                  <RiLoginBoxLine className="w-4 h-4" />
                  <span>Sign In</span>
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden glass p-2.5 rounded-xl text-cream/60 hover:text-cream transition-colors"
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
            className="fixed top-[72px] left-4 right-4 z-40 glass-strong rounded-2xl p-4 border border-slate"
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
                        ? 'bg-primary/8 text-primary border border-primary/15'
                        : 'text-cream/50 hover:text-cream hover:bg-white/3 border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              </motion.div>
            ))}
            <div className="mt-3 pt-3 border-t border-slate flex gap-2">
              {isAuthenticated ? (
                <>
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 glass rounded-xl text-sm text-cream/60">
                    <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="truncate">{user?.username}</span>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="px-4 py-3 border border-red-500/20 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { navigate('/login'); setMobileOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary rounded-xl text-sm font-semibold text-white"
                  >
                    <RiLoginBoxLine className="w-4 h-4" />
                    Sign In
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
