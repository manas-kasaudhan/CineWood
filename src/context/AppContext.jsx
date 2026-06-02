import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cw_watchlist')) || []; }
    catch { return []; }
  });

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cw_favorites')) || []; }
    catch { return []; }
  });

  const [recentlyWatched, setRecentlyWatched] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cw_recent')) || []; }
    catch { return []; }
  });

  const [moodHistory, setMoodHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cw_moods')) || []; }
    catch { return []; }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cw_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('cw_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cw_recent', JSON.stringify(recentlyWatched));
  }, [recentlyWatched]);

  useEffect(() => {
    localStorage.setItem('cw_moods', JSON.stringify(moodHistory));
  }, [moodHistory]);

  const addToWatchlist = (movie) => {
    setWatchlist(prev => {
      if (prev.find(m => m.id === movie.id)) return prev;
      return [movie, ...prev];
    });
  };

  const removeFromWatchlist = (id) => {
    setWatchlist(prev => prev.filter(m => m.id !== id));
  };

  const isInWatchlist = (id) => watchlist.some(m => m.id === id);

  const toggleFavorite = (movie) => {
    setFavorites(prev => {
      if (prev.find(m => m.id === movie.id)) return prev.filter(m => m.id !== movie.id);
      return [movie, ...prev];
    });
  };

  const isFavorite = (id) => favorites.some(m => m.id === id);

  const addToRecent = (movie) => {
    setRecentlyWatched(prev => {
      const filtered = prev.filter(m => m.id !== movie.id);
      return [{ ...movie, watchedAt: Date.now() }, ...filtered].slice(0, 20);
    });
  };

  const addMoodEntry = (mood, movies) => {
    setMoodHistory(prev => [
      { mood, movies: movies.slice(0, 4), timestamp: Date.now() },
      ...prev
    ].slice(0, 10));
  };

  return (
    <AppContext.Provider value={{
      watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist,
      favorites, toggleFavorite, isFavorite,
      recentlyWatched, addToRecent,
      moodHistory, addMoodEntry,
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
