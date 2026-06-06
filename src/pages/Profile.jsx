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
  { id: 'watchlist', label: 'Watchlist', icon: RiBookmarkLine, color: 'primary' },
  { id: 'favorites', label: 'Favorites', icon: RiHeartLine, color: 'primary' },
  { id: 'recent', label: 'Recently Watched', icon: RiHistoryLine, color: 'amber' },
  { id: 'moods', label: 'Mood History', icon: RiEmotionLine, color: 'accent' },
];

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    primary: 'text-primary border-primary/15 bg-primary/5',
    amber: 'text-amber border-amber/15 bg-amber/5',
    accent: 'text-accent border-accent/15 bg-accent/5',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className={`stat-card p-6 border ${colors[color] || colors.primary}`}
    >
      <Icon className="w-5 h-5 mb-3 opacity-60" />
      <div className="text-2xl font-display font-semibold text-cream mb-1">{value}</div>
      <div className="text-cream/35 text-xs font-medium">{label}</div>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="py-24 text-center">
      <Icon className="w-12 h-12 text-cream/8 mx-auto mb-4" />
      <p className="text-cream/25 text-sm">{message}</p>
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
    { icon: RiFilmLine, label: 'Films Logged', value: totalWatched, color: 'primary' },
    { icon: RiHeartLine, label: 'Favorites', value: totalFaves, color: 'primary' },
    { icon: RiBookmarkLine, label: 'Watchlist', value: totalWatchlist, color: 'amber' },
    { icon: RiEmotionLine, label: 'Mood Sessions', value: totalMoods, color: 'accent' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'watchlist':
        return (
          <div>
            {watchlist.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-cream/35 text-sm">{watchlist.length} film{watchlist.length !== 1 ? 's' : ''} saved</p>
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
                <p className="text-cream/35 text-sm">{recentlyWatched.length} film{recentlyWatched.length !== 1 ? 's' : ''} visited</p>
              </div>
            )}
            <MovieGrid movies={recentlyWatched} emptyIcon={RiHistoryLine} emptyMessage="Films you visit will appear here automatically." />
          </div>
        );
      case 'moods':
        if (!moodHistory.length) return <EmptyState icon={RiEmotionLine} emptyMessage="No mood sessions yet. Use the Film Assistant to get personalized picks!" />;
        return (
          <div className="space-y-8">
            {moodHistory.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="glass w-8 h-8 rounded-xl flex items-center justify-center border border-primary/15">
                    <RiEmotionLine className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-cream/70 text-sm font-medium capitalize">
                      {MOOD_MAPPINGS[entry.mood]?.label || entry.mood} Mood
                    </p>
                    <p className="text-cream/25 text-xs">
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
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-5 mb-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/15">
                <RiUserLine className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-noir" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-cream">My Cinema</h1>
              <p className="text-cream/35 text-sm mt-1">Your personal film universe</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
              >
                <StatCard {...stat} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-1 glass p-1.5 rounded-xl border border-slate w-fit overflow-x-auto hide-scrollbar">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const activeColors = {
                primary: 'bg-primary/10 text-primary border-primary/20',
                amber: 'bg-amber/10 text-amber border-amber/20',
                accent: 'bg-accent/10 text-accent border-accent/20',
              };
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? `border ${activeColors[tab.color]}`
                      : 'text-cream/35 hover:text-cream/60 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-bg"
                      className={`absolute inset-0 rounded-lg border ${activeColors[tab.color]}`}
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
