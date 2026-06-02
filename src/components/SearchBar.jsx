import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSearchLine, RiCloseLine, RiLoader4Line } from 'react-icons/ri';
import { searchMovies } from '../lib/tmdb';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ onResults, placeholder = 'Search films, directors, moods…', fullWidth = false }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      onResults?.([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchMovies(val);
        onResults?.(data.results || []);
      } catch {
        onResults?.([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/recommendations?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const clear = () => {
    setQuery('');
    onResults?.([]);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      animate={{
        boxShadow: focused
          ? '0 0 0 2px rgba(196,181,253,0.4), 0 8px 40px rgba(196,181,253,0.15)'
          : '0 4px 24px rgba(0,0,0,0.3)',
      }}
      transition={{ duration: 0.3 }}
      className={`relative flex items-center glass rounded-2xl overflow-hidden border transition-colors duration-300 ${
        focused ? 'border-lavender/40' : 'border-white/10'
      } ${fullWidth ? 'w-full' : 'max-w-xl'}`}
    >
      <div className="pl-5 pr-3 flex items-center shrink-0">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RiLoader4Line className="w-5 h-5 text-lavender animate-spin" />
            </motion.div>
          ) : (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RiSearchLine className="w-5 h-5 text-cream/40" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent py-4 pr-4 text-cream placeholder-cream/30 text-sm focus:outline-none"
      />

      <AnimatePresence>
        {query && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clear}
            className="pr-5 pl-2 text-cream/30 hover:text-cream/70 transition-colors"
          >
            <RiCloseLine className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
