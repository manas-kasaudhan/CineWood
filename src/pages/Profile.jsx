import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import MovieCard from '../components/MovieCard';
import { MOOD_MAPPINGS } from '../lib/tmdb';
import {
  RiUserLine, RiHeartLine, RiBookmarkLine, RiHistoryLine,
  RiEmotionLine, RiFilmLine, RiTimeLine, RiStarLine,
  RiDeleteBinLine
} from 'react-icons/ri';

const TABS = [
  { id: 'watchlist', label: 'Watchlist', icon: RiBookmarkLine, color: 'lavender' },
  { id: 'favorites', label: 'Favorites', icon: RiHeartLine, color: 'dusty' },
  { id: 'recent', label: 'Recently Watched', icon: RiHistoryLine, color: 'peach' },
  { id: 'moods', label: 'Mood History', icon: RiEmotionLine, color: 'mist' },
];

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    lavender: 'text-lavender border-lavender/20 bg-lavender/5',
    dusty: 'text-dusty border-dusty/20 bg-dusty/5',
    peach: 'text-peach border-peach/20 bg-peach/5',
    mist: 'text-mist border-mist/20 bg-mist/5',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className={`stat-card p-6 border ${colors[color] || colors.lavender}`}
    >
      <Icon className="w-5 h-5 mb-3 opacity-70" />
      <div className="text-2xl font-display font-semibold text-cream mb-1">{value}</div>
      <div className="text-cream/40 text-xs font-medium">{label}</div>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="py-24 text-center">
      <Icon className="w-12 h-12 text-cream/10 mx-auto mb-4" />
      <p className="text-cream/30 text-sm">{message}</p>
    </div>
  );
}

function MovieGrid({ movies, emptyIcon, emptyMessage }) {
  if (!movies?.length) return <EmptyState icon={emptyIcon} message={emptyMessage} />;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
    </div>
  );
}

export default function Profile() {
  const { watchlist, favorites, recentlyWatched, moodHistory, removeFromWatchlist } = useApp();
  const [activeTab, setActiveTab] = useState('watchlist');

  // Stats
  const totalWatched = recentlyWatched.length;
  const totalFaves = favorites.length;
  const totalWatchlist = watchlist.length;
  const totalMoods = moodHistory.length;

  const stats = [
    { icon: RiFilmLine, label: 'Films Logged', value: totalWatched, color: 'lavender' },
    { icon: RiHeartLine, label: 'Favorites', value: totalFaves, color: 'dusty' },
    { icon: RiBookmarkLine, label: 'Watchlist', value: totalWatchlist, color: 'peach' },
    { icon: RiEmotionLine, label: 'Mood Sessions', value: totalMoods, color: 'mist' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'watchlist':
        return (
          <div>
            {watchlist.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-cream/40 text-sm">{watchlist.length} film{watchlist.length !== 1 ? 's' : ''} saved</p>
              </div>
            )}
            <MovieGrid movies={watchlist} emptyIcon={RiBookmarkLine} emptyMessage="Your watchlist is empty. Start adding films you want to watch!" />
          </div>
        );
      case 'favorites':
        return <MovieGrid movies={favorites} emptyIcon={RiHeartLine} emptyMessage="No favorites yet. Heart your favorite films to save them here." />;
      case 'recent':
        return (
          <div>
            {recentlyWatched.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-cream/40 text-sm">{recentlyWatched.length} film{recentlyWatched.length !== 1 ? 's' : ''} visited</p>
              </div>
            )}
            <MovieGrid movies={recentlyWatched} emptyIcon={RiHistoryLine} emptyMessage="Films you visit will appear here automatically." />
          </div>
        );
      case 'moods':
        if (!moodHistory.length) return <EmptyState icon={RiEmotionLine} emptyMessage="No mood sessions yet. Use the AI Cinema Guide to get personalized picks!" />;
        return (
          <div className="space-y-8">
            {moodHistory.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="glass w-8 h-8 rounded-xl flex items-center justify-center border border-lavender/20">
                    <RiEmotionLine className="w-4 h-4 text-lavender" />
                  </div>
                  <div>
                    <p className="text-cream/80 text-sm font-medium capitalize">
                      {MOOD_MAPPINGS[entry.mood]?.label || entry.mood} Mood
                    </p>
                    <p className="text-cream/30 text-xs">
                      {new Date(entry.timestamp).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                {entry.movies?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {entry.movies.map((m, mi) => (
                      <MovieCard key={m.id} movie={m} index={mi} />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-noir pt-24 pb-20">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-32 right-1/4 w-72 h-72 ambient-orb bg-lavender/10 animate-float" />
        <div className="absolute bottom-1/2 left-1/6 w-48 h-48 ambient-orb bg-dusty/8 animate-float-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="flex items-center gap-5 mb-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lavender/30 to-dusty/20 flex items-center justify-center border border-lavender/20 animate-pulse-glow">
                <RiUserLine className="w-8 h-8 text-lavender" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-lavender rounded-full border-2 border-noir" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-cream">My Cinema</h1>
              <p className="text-cream/40 text-sm mt-1">Your personal film universe</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              >
                <StatCard {...stat} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-1 glass p-1.5 rounded-2xl border border-white/8 w-fit overflow-x-auto hide-scrollbar">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const activeColors = {
                lavender: 'bg-lavender/15 text-lavender border-lavender/25',
                dusty: 'bg-dusty/15 text-dusty border-dusty/25',
                peach: 'bg-peach/15 text-peach border-peach/25',
                mist: 'bg-mist/15 text-mist border-mist/25',
              };
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? `border ${activeColors[tab.color]}`
                      : 'text-cream/40 hover:text-cream/70 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-bg"
                      className={`absolute inset-0 rounded-xl border ${activeColors[tab.color]}`}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
