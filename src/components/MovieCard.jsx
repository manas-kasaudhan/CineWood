import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../lib/tmdb';
import { useApp } from '../context/AppContext';
import { RiHeartLine, RiHeartFill, RiBookmarkLine, RiBookmarkFill, RiStarFill, RiPlayCircleLine } from 'react-icons/ri';

export default function MovieCard({ movie, index = 0, onSelect }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, addToWatchlist, removeFromWatchlist, isInWatchlist } = useApp();

  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const rating = movie.vote_average?.toFixed(1);
  const year = movie.release_date?.slice(0, 4);
  const favorite = isFavorite(movie.id);
  const inWatchlist = isInWatchlist(movie.id);

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.02 }}
      className="movie-card group cursor-pointer select-none"
      onClick={handleClick}
      style={{ aspectRatio: '2/3' }}
    >
      {/* Poster */}
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full rounded-2xl bg-noir-light flex items-center justify-center">
          <RiPlayCircleLine className="w-12 h-12 text-cream/20" />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="card-overlay rounded-2xl" />

      {/* Rating Badge */}
      {rating && (
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-noir/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
          <RiStarFill className="w-3 h-3 text-peach" />
          <span className="text-xs font-semibold text-cream">{rating}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavorite}
          className="w-8 h-8 glass rounded-full flex items-center justify-center border border-white/15 hover:border-dusty/50 transition-all"
        >
          {favorite
            ? <RiHeartFill className="w-4 h-4 text-dusty" />
            : <RiHeartLine className="w-4 h-4 text-cream/80" />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWatchlist}
          className="w-8 h-8 glass rounded-full flex items-center justify-center border border-white/15 hover:border-lavender/50 transition-all"
        >
          {inWatchlist
            ? <RiBookmarkFill className="w-4 h-4 text-lavender" />
            : <RiBookmarkLine className="w-4 h-4 text-cream/80" />}
        </motion.button>
      </div>

      {/* Info Panel */}
      <div className="card-info">
        <h3 className="font-semibold text-cream text-sm leading-tight line-clamp-2 mb-1">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-cream/50">
          {year && <span>{year}</span>}
          {movie.genre_ids?.length > 0 && (
            <>
              <span className="w-0.5 h-0.5 rounded-full bg-cream/30" />
              <span className="text-lavender/70">
                {movie.genre_ids.slice(0, 1).join(', ')}
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
