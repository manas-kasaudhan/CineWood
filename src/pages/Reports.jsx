import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { MOOD_MAPPINGS } from '../lib/tmdb';
import {
  RiBarChartBoxLine, RiFilmLine, RiTimeLine, RiHeartLine,
  RiEmotionLine, RiBookmarkLine, RiHistoryLine, RiStarLine,
  RiArrowUpLine, RiArrowDownLine
} from 'react-icons/ri';

// Genre ID → name map (TMDB standard IDs)
const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western',
};

const GENRE_COLORS = {
  Action: '#6C63FF', Adventure: '#3DD598', Animation: '#F5A623', Comedy: '#8B85FF',
  Crime: '#EF4444', Documentary: '#3DD598', Drama: '#6C63FF', Family: '#F5A623',
  Fantasy: '#8B85FF', History: '#F5A623', Horror: '#EF4444', Music: '#3DD598',
  Mystery: '#6C63FF', Romance: '#EF4444', 'Sci-Fi': '#8B85FF', Thriller: '#6C63FF',
  War: '#F5A623', Western: '#F5A623',
};

const PERIOD_OPTIONS = [
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: 'All Time', value: 0 },
];

function StatCard({ icon: Icon, label, value, subtitle, color = 'primary' }) {
  const colorMap = {
    primary: 'text-primary bg-primary/8 border-primary/15',
    accent: 'text-accent bg-accent/8 border-accent/15',
    amber: 'text-amber bg-amber/8 border-amber/15',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`stat-card p-6 border ${colorMap[color]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-display font-bold text-cream mb-1">{value}</div>
      <div className="text-cream/35 text-sm font-medium">{label}</div>
      {subtitle && <div className="text-cream/20 text-xs mt-1">{subtitle}</div>}
    </motion.div>
  );
}

function BarChart({ data, maxValue }) {
  if (!data.length) return null;
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-4"
        >
          <div className="w-24 text-sm text-cream/50 font-medium truncate shrink-0">{item.label}</div>
          <div className="flex-1 report-bar">
            <motion.div
              className="report-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / maxValue) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
              style={{ backgroundColor: item.color || '#6C63FF' }}
            />
          </div>
          <div className="w-8 text-right text-sm font-semibold text-cream/60">{item.value}</div>
        </motion.div>
      ))}
    </div>
  );
}

function RingChart({ value, total, color = '#6C63FF', label }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#262838" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-cream font-display">{Math.round(percentage)}%</span>
        </div>
      </div>
      <span className="text-xs text-cream/40 font-medium">{label}</span>
    </div>
  );
}

function ActivityItem({ icon: Icon, text, time, color = 'primary' }) {
  const colorMap = {
    primary: 'text-primary bg-primary/8 border-primary/15',
    accent: 'text-accent bg-accent/8 border-accent/15',
    amber: 'text-amber bg-amber/8 border-amber/15',
  };

  return (
    <div className="flex items-center gap-4 py-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${colorMap[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-cream/70 text-sm truncate">{text}</p>
      </div>
      <span className="text-cream/25 text-xs shrink-0">{time}</span>
    </div>
  );
}

function formatTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Reports() {
  const { watchlist, favorites, recentlyWatched, moodHistory } = useApp();
  const [period, setPeriod] = useState(0); // 0 = all time

  // Filter data by period
  const filterByPeriod = (items, timestampKey = 'watchedAt') => {
    if (period === 0) return items;
    const cutoff = Date.now() - period * 24 * 60 * 60 * 1000;
    return items.filter(item => (item[timestampKey] || 0) >= cutoff);
  };

  const filteredRecent = filterByPeriod(recentlyWatched);
  const filteredMoods = filterByPeriod(moodHistory, 'timestamp');

  // ── Stat calculations ─────────────────────────────
  const totalWatched = filteredRecent.length;
  const totalFavorites = favorites.length;
  const totalWatchlist = watchlist.length;
  const totalMoods = filteredMoods.length;

  // Estimated hours (avg 2h per movie)
  const estimatedHours = totalWatched * 2;

  // ── Genre breakdown ───────────────────────────────
  const genreData = useMemo(() => {
    const counts = {};
    const allMovies = [...filteredRecent, ...favorites];
    allMovies.forEach(movie => {
      (movie.genre_ids || []).forEach(gid => {
        const name = GENRE_MAP[gid];
        if (name) counts[name] = (counts[name] || 0) + 1;
      });
      // For detailed movies (from movie details page)
      (movie.genres || []).forEach(g => {
        counts[g.name] = (counts[g.name] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value, color: GENRE_COLORS[label] || '#6C63FF' }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [filteredRecent, favorites]);

  const maxGenreCount = Math.max(...genreData.map(d => d.value), 1);

  // ── Unique genres count ───────────────────────────
  const uniqueGenres = useMemo(() => {
    const genres = new Set();
    [...filteredRecent, ...favorites].forEach(movie => {
      (movie.genre_ids || []).forEach(gid => {
        const name = GENRE_MAP[gid];
        if (name) genres.add(name);
      });
      (movie.genres || []).forEach(g => genres.add(g.name));
    });
    return genres.size;
  }, [filteredRecent, favorites]);

  // ── Mood breakdown ────────────────────────────────
  const moodData = useMemo(() => {
    const counts = {};
    filteredMoods.forEach(entry => {
      const label = MOOD_MAPPINGS[entry.mood]?.label || entry.mood;
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value, color: '#3DD598' }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredMoods]);

  const maxMoodCount = Math.max(...moodData.map(d => d.value), 1);

  // ── Activity feed ─────────────────────────────────
  const activityFeed = useMemo(() => {
    const items = [];

    recentlyWatched.slice(0, 5).forEach(movie => {
      items.push({
        icon: RiFilmLine,
        text: `Viewed ${movie.title}`,
        time: movie.watchedAt ? formatTimeAgo(movie.watchedAt) : 'Recently',
        timestamp: movie.watchedAt || 0,
        color: 'primary',
      });
    });

    favorites.slice(0, 3).forEach(movie => {
      items.push({
        icon: RiHeartLine,
        text: `Favorited ${movie.title}`,
        time: 'Recent',
        timestamp: Date.now() - Math.random() * 86400000,
        color: 'primary',
      });
    });

    watchlist.slice(0, 3).forEach(movie => {
      items.push({
        icon: RiBookmarkLine,
        text: `Added ${movie.title} to watchlist`,
        time: 'Recent',
        timestamp: Date.now() - Math.random() * 172800000,
        color: 'amber',
      });
    });

    moodHistory.slice(0, 3).forEach(entry => {
      const label = MOOD_MAPPINGS[entry.mood]?.label || entry.mood;
      items.push({
        icon: RiEmotionLine,
        text: `Explored ${label} mood`,
        time: entry.timestamp ? formatTimeAgo(entry.timestamp) : 'Recently',
        timestamp: entry.timestamp || 0,
        color: 'accent',
      });
    });

    return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  }, [recentlyWatched, favorites, watchlist, moodHistory]);

  // ── Average rating ────────────────────────────────
  const avgRating = useMemo(() => {
    const rated = [...filteredRecent, ...favorites].filter(m => m.vote_average);
    if (!rated.length) return 0;
    return (rated.reduce((sum, m) => sum + m.vote_average, 0) / rated.length).toFixed(1);
  }, [filteredRecent, favorites]);

  return (
    <div className="min-h-screen bg-noir pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Header ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/15">
                <RiBarChartBoxLine className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-cream">Cinema Reports</h1>
            </div>
            <p className="text-cream/35 text-sm">Your viewing analytics and cinema insights</p>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-1 glass p-1 rounded-xl border border-slate">
            {PERIOD_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  period === opt.value
                    ? 'bg-primary/12 text-primary border border-primary/20'
                    : 'text-cream/35 hover:text-cream/60 border border-transparent'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Stat Cards ─────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={RiFilmLine}
            label="Films Watched"
            value={totalWatched}
            subtitle={`~${estimatedHours}h estimated`}
            color="primary"
          />
          <StatCard
            icon={RiHeartLine}
            label="Favorites"
            value={totalFavorites}
            color="primary"
          />
          <StatCard
            icon={RiStarLine}
            label="Avg. Rating"
            value={avgRating || '—'}
            subtitle="of viewed films"
            color="amber"
          />
          <StatCard
            icon={RiEmotionLine}
            label="Mood Sessions"
            value={totalMoods}
            subtitle={`${uniqueGenres} genres explored`}
            color="accent"
          />
        </div>

        {/* ── Main Grid ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Genre Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg text-cream">Genre Breakdown</h3>
              <span className="text-xs text-cream/25">{genreData.length} genres</span>
            </div>
            {genreData.length > 0 ? (
              <BarChart data={genreData} maxValue={maxGenreCount} />
            ) : (
              <div className="py-12 text-center">
                <RiFilmLine className="w-10 h-10 text-cream/8 mx-auto mb-3" />
                <p className="text-cream/25 text-sm">Watch some films to see genre insights</p>
              </div>
            )}
          </motion.div>

          {/* Watchlist vs Watched */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="font-display text-lg text-cream mb-6">Completion Rate</h3>
            <div className="flex justify-center mb-6">
              <RingChart
                value={totalWatched}
                total={totalWatched + totalWatchlist}
                color="#6C63FF"
                label="Films Completed"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-cream/45 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Watched
                </span>
                <span className="text-cream font-medium">{totalWatched}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-cream/45 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate" />
                  In Watchlist
                </span>
                <span className="text-cream font-medium">{totalWatchlist}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom Grid ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mood History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg text-cream">Mood Insights</h3>
              <span className="text-xs text-cream/25">{moodData.length} moods</span>
            </div>
            {moodData.length > 0 ? (
              <BarChart data={moodData} maxValue={maxMoodCount} />
            ) : (
              <div className="py-12 text-center">
                <RiEmotionLine className="w-10 h-10 text-cream/8 mx-auto mb-3" />
                <p className="text-cream/25 text-sm">Use the Film Assistant to build mood history</p>
              </div>
            )}
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="font-display text-lg text-cream mb-4">Recent Activity</h3>
            {activityFeed.length > 0 ? (
              <div className="divide-y divide-slate">
                {activityFeed.map((item, i) => (
                  <ActivityItem key={i} {...item} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <RiHistoryLine className="w-10 h-10 text-cream/8 mx-auto mb-3" />
                <p className="text-cream/25 text-sm">Your activity will appear here as you explore</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
