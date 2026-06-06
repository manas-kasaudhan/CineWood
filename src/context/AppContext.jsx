import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  fetchUserData,
  apiAddToWatchlist, apiRemoveFromWatchlist,
  apiToggleFavorite,
  apiAddToHistory,
  apiAddMood,
} from '../lib/api';

const AppContext = createContext(null);

// ── localStorage helpers ────────────────────────────
function loadLocal(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}
function saveLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function AppProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [watchlist, setWatchlist] = useState(() => loadLocal('cw_watchlist'));
  const [favorites, setFavorites] = useState(() => loadLocal('cw_favorites'));
  const [recentlyWatched, setRecentlyWatched] = useState(() => loadLocal('cw_recent'));
  const [moodHistory, setMoodHistory] = useState(() => loadLocal('cw_moods'));
  const [syncing, setSyncing] = useState(false);

  // ── Hydrate from API when authenticated ───────────
  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      setSyncing(true);
      fetchUserData()
        .then(data => {
          // Map API movie_id to id for frontend compatibility
          const mapMovies = (items) => items.map(m => ({
            ...m,
            id: m.movie_id || m.id,
          }));

          setWatchlist(mapMovies(data.watchlist || []));
          setFavorites(mapMovies(data.favorites || []));
          setRecentlyWatched(mapMovies(data.watch_history || []));
          setMoodHistory(data.mood_history || []);
          setSyncing(false);
        })
        .catch(() => setSyncing(false));
    } else {
      // Guest mode — load from localStorage
      setWatchlist(loadLocal('cw_watchlist'));
      setFavorites(loadLocal('cw_favorites'));
      setRecentlyWatched(loadLocal('cw_recent'));
      setMoodHistory(loadLocal('cw_moods'));
    }
  }, [isAuthenticated, authLoading]);

  // ── Persist to localStorage (guest mode backup) ───
  useEffect(() => { saveLocal('cw_watchlist', watchlist); }, [watchlist]);
  useEffect(() => { saveLocal('cw_favorites', favorites); }, [favorites]);
  useEffect(() => { saveLocal('cw_recent', recentlyWatched); }, [recentlyWatched]);
  useEffect(() => { saveLocal('cw_moods', moodHistory); }, [moodHistory]);

  // ── Watchlist ─────────────────────────────────────
  const addToWatchlist = useCallback((movie) => {
    setWatchlist(prev => {
      if (prev.find(m => m.id === movie.id)) return prev;
      return [movie, ...prev];
    });
    if (isAuthenticated) {
      apiAddToWatchlist({
        movie_id: movie.id, title: movie.title,
        poster_path: movie.poster_path, vote_average: movie.vote_average,
        release_date: movie.release_date, genre_ids: movie.genre_ids || [],
      }).catch(console.error);
    }
  }, [isAuthenticated]);

  const removeFromWatchlist = useCallback((id) => {
    setWatchlist(prev => prev.filter(m => m.id !== id));
    if (isAuthenticated) {
      apiRemoveFromWatchlist(id).catch(console.error);
    }
  }, [isAuthenticated]);

  const isInWatchlist = (id) => watchlist.some(m => m.id === id);

  // ── Favorites ─────────────────────────────────────
  const toggleFavorite = useCallback((movie) => {
    setFavorites(prev => {
      if (prev.find(m => m.id === movie.id)) return prev.filter(m => m.id !== movie.id);
      return [movie, ...prev];
    });
    if (isAuthenticated) {
      apiToggleFavorite({
        movie_id: movie.id, title: movie.title,
        poster_path: movie.poster_path, vote_average: movie.vote_average,
        release_date: movie.release_date, genre_ids: movie.genre_ids || [],
      }).catch(console.error);
    }
  }, [isAuthenticated]);

  const isFavorite = (id) => favorites.some(m => m.id === id);

  // ── Watch History ─────────────────────────────────
  const addToRecent = useCallback((movie) => {
    setRecentlyWatched(prev => {
      const filtered = prev.filter(m => m.id !== movie.id);
      return [{ ...movie, watchedAt: Date.now() }, ...filtered].slice(0, 20);
    });
    if (isAuthenticated) {
      apiAddToHistory({
        movie_id: movie.id, title: movie.title,
        poster_path: movie.poster_path, vote_average: movie.vote_average,
        release_date: movie.release_date, genre_ids: movie.genre_ids || [],
      }).catch(console.error);
    }
  }, [isAuthenticated]);

  // ── Mood History ──────────────────────────────────
  const addMoodEntry = useCallback((mood, movies) => {
    const entry = {
      mood,
      movies: movies.slice(0, 4).map(m => ({
        movie_id: m.id, title: m.title,
        poster_path: m.poster_path, vote_average: m.vote_average,
      })),
      timestamp: Date.now(),
    };
    setMoodHistory(prev => [entry, ...prev].slice(0, 10));
    if (isAuthenticated) {
      apiAddMood(entry).catch(console.error);
    }
  }, [isAuthenticated]);

  return (
    <AppContext.Provider value={{
      watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist,
      favorites, toggleFavorite, isFavorite,
      recentlyWatched, addToRecent,
      moodHistory, addMoodEntry,
      syncing,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
