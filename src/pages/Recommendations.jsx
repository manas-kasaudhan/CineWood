import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  getTrending, getPopular, getByGenre, searchMovies, getGenres, discoverMovies
} from '../lib/tmdb';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import GenreChip from '../components/GenreChip';
import { SkeletonRow } from '../components/Skeleton';
import { RiFilter3Line, RiGridLine, RiFilmLine } from 'react-icons/ri';

const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity.desc' },
  { label: 'Rating', value: 'vote_average.desc' },
  { label: 'Newest', value: 'release_date.desc' },
  { label: 'Oldest', value: 'release_date.asc' },
];

const CHIP_COLORS = ['lavender', 'peach', 'dusty', 'mist', 'muted'];

export default function Recommendations() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(!!initialQuery);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load genres
  useEffect(() => {
    getGenres().then(d => setGenres(d.genres || []));
  }, []);

  // Load initial movies or genre/sort filtered
  useEffect(() => {
    if (isSearching && query) return;
    setLoading(true);
    const fn = activeGenre
      ? getByGenre(activeGenre, page)
      : discoverMovies({ sort_by: sortBy, page });

    fn.then(data => {
      setMovies(prev => page === 1 ? (data.results || []) : [...prev, ...(data.results || [])]);
      setTotalPages(data.total_pages || 1);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeGenre, sortBy, page, isSearching, query]);

  // Handle initial URL query
  useEffect(() => {
    if (!initialQuery) return;
    setIsSearching(true);
    setQuery(initialQuery);
    searchMovies(initialQuery).then(d => {
      setSearchResults(d.results || []);
      setLoading(false);
    });
  }, [initialQuery]);

  const handleSearchResults = (results) => {
    if (results.length > 0) {
      setIsSearching(true);
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleGenre = (id) => {
    setActiveGenre(prev => prev === id ? null : id);
    setPage(1);
    setIsSearching(false);
    setSearchResults([]);
  };

  const handleSort = (val) => {
    setSortBy(val);
    setPage(1);
  };

  const displayMovies = isSearching ? searchResults : movies;

  return (
    <div className="min-h-screen bg-noir pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-12"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-2 flex items-center gap-2">
            <RiFilmLine className="w-3.5 h-3.5" />
            Discover
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-cream mb-2">Find Your Film</h1>
          <p className="text-cream/35 text-base">
            {isSearching ? `Results for "${query}"` : 'Browse by genre, mood, or trending'}
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <SearchBar
            onResults={handleSearchResults}
            placeholder="Search by title, director, mood…"
            fullWidth
          />
        </motion.div>

        {/* Filters Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-4 mb-12"
        >
          {/* Genre Chips */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 flex-1">
            <RiFilter3Line className="w-4 h-4 text-cream/25 shrink-0" />
            <GenreChip
              label="All"
              active={!activeGenre}
              onClick={() => handleGenre(null)}
              color="lavender"
            />
            {genres.slice(0, 15).map((g, i) => (
              <GenreChip
                key={g.id}
                label={g.name}
                active={activeGenre === g.id}
                onClick={() => handleGenre(g.id)}
                color={CHIP_COLORS[i % CHIP_COLORS.length]}
              />
            ))}
          </div>

          {/* Sort Selector */}
          {!isSearching && (
            <div className="flex items-center gap-2 shrink-0">
              <RiGridLine className="w-4 h-4 text-cream/25" />
              <div className="flex items-center gap-1 glass rounded-xl p-1 border border-slate">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleSort(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      sortBy === opt.value
                        ? 'bg-primary/15 text-primary border border-primary/25'
                        : 'text-cream/35 hover:text-cream/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Results Grid */}
        <AnimatePresence mode="wait">
          {loading && page === 1 ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonRow count={12} />
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${activeGenre}-${sortBy}-${isSearching}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {displayMovies.length === 0 ? (
                <div className="py-32 text-center">
                  <p className="text-cream/15 text-6xl mb-4">🎬</p>
                  <p className="text-cream/35 text-lg">No films found. Try a different search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {displayMovies.map((movie, i) => (
                    <MovieCard key={`${movie.id}-${i}`} movie={movie} index={i % 12} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More */}
        {!isSearching && !loading && page < totalPages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() => setPage(p => p + 1)}
              className="glass px-8 py-3 rounded-xl border border-slate text-cream/50 hover:text-cream hover:border-primary/25 transition-all text-sm font-medium"
            >
              Load More Films
            </button>
          </motion.div>
        )}

        {loading && page > 1 && (
          <div className="flex justify-center mt-8">
            <div className="w-6 h-6 border-2 border-primary/25 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
