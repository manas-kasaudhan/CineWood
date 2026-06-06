import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../lib/tmdb';
import { useApp } from '../context/AppContext';
import { RiHeartLine, RiHeartFill, RiBookmarkLine, RiBookmarkFill, RiStarFill, RiPlayCircleLine } from 'react-icons/ri';

// Genre ID → name map (TMDB standard IDs)
const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western',
};

export default function MovieCard({ movie, index = 0, onSelect }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, addToWatchlist, removeFromWatchlist, isInWatchlist } = useApp();

  const posterUrl = getImageUrl(movie.poster_path, 'w342');
  const rating = movie.vote_average?.toFixed(1);
  const year = movie.release_date?.slice(0, 4);
  const favorite = isFavorite(movie.id);
  const inWatchlist = isInWatchlist(movie.id);

  // Resolve first genre name from IDs, fallback to 'Movie'
  const genreName = movie.genre_ids?.[0]
    ? (GENRE_MAP[movie.genre_ids[0]] || 'Movie')
    : null;

  const handleClick = () => {
    if (onSelect) {
      onSelect(movie);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  const handleWatchlist = (e) => {
    e.stopPropagation();
    if (inWatchlist) removeFromWatchlist(movie.id);
    else addToWatchlist(movie);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.015 }}
      className="movie-card group cursor-pointer select-none"
      onClick={handleClick}
      style={{ aspectRatio: '2/3' }}
    >
      {/* Poster */}
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-103"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full rounded-xl bg-noir-light flex items-center justify-center">
          <RiPlayCircleLine className="w-12 h-12 text-cream/15" />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="card-overlay rounded-xl" />

      {/* Rating Badge */}
      {rating && (
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-noir/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate">
          <RiStarFill className="w-3 h-3 text-amber" />
          <span className="text-xs font-semibold text-cream">{rating}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavorite}
          className="w-8 h-8 glass rounded-full flex items-center justify-center border border-slate hover:border-primary/40 transition-all"
        >
          {favorite
            ? <RiHeartFill className="w-4 h-4 text-primary" />
            : <RiHeartLine className="w-4 h-4 text-cream/70" />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWatchlist}
          className="w-8 h-8 glass rounded-full flex items-center justify-center border border-slate hover:border-accent/40 transition-all"
        >
          {inWatchlist
            ? <RiBookmarkFill className="w-4 h-4 text-accent" />
            : <RiBookmarkLine className="w-4 h-4 text-cream/70" />}
        </motion.button>
      </div>

      {/* Info Panel */}
      <div className="card-info">
        <h3 className="font-semibold text-cream text-sm leading-tight line-clamp-2 mb-1">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-cream/45">
          {year && <span>{year}</span>}
          {genreName && (
            <>
              <span className="w-0.5 h-0.5 rounded-full bg-cream/25" />
              <span className="text-muted">{genreName}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
