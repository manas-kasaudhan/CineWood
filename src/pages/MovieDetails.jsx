import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { getMovieDetails, getImageUrl, getBackdropUrl } from '../lib/tmdb';
import { useApp } from '../context/AppContext';
import MovieCard from '../components/MovieCard';
import GlowButton from '../components/GlowButton';
import Modal from '../components/Modal';
import { SkeletonDetails } from '../components/Skeleton';
import {
  RiArrowLeftLine, RiStarFill, RiHeartLine, RiHeartFill,
  RiBookmarkLine, RiBookmarkFill, RiPlayCircleLine,
  RiTimeLine, RiCalendarLine, RiGlobalLine
} from 'react-icons/ri';

const TMDB_VIDEO_BASE = 'https://www.youtube.com/embed/';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite, addToWatchlist, removeFromWatchlist, isInWatchlist, addToRecent } = useApp();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setImgError(false);
    getMovieDetails(id)
      .then(data => {
        setMovie(data);
        addToRecent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-noir pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="w-full h-80 skeleton rounded-3xl mb-8" />
        <SkeletonDetails />
      </div>
    </div>
  );

  if (!movie) return (
    <div className="min-h-screen bg-noir flex items-center justify-center">
      <div className="text-center">
        <p className="text-cream/30 text-5xl mb-4">🎬</p>
        <p className="text-cream/50">Movie not found.</p>
        <GlowButton onClick={() => navigate(-1)} className="mt-6" icon={RiArrowLeftLine}>Go Back</GlowButton>
      </div>
    </div>
  );

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const rating = movie.vote_average?.toFixed(1);
  const year = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime;
  const hours = Math.floor(runtime / 60);
  const mins = runtime % 60;
  const favorite = isFavorite(movie.id);
  const inWatchlist = isInWatchlist(movie.id);

  const trailer = movie.videos?.results?.find(v =>
    v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const similar = movie.similar?.results?.filter(m => m.poster_path)?.slice(0, 10) || [];
  const genres = movie.genres || [];

  return (
    <div className="min-h-screen bg-noir overflow-x-hidden">
      {/* ── Hero Backdrop ────────────────────────────── */}
      <div className="relative h-[65vh] md:h-[75vh] overflow-hidden">
        {backdropUrl && !imgError ? (
          <motion.img
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-noir-light to-noir" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-noir/20" />

        {/* Back Button */}
        <div className="absolute top-24 left-6 z-20">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl border border-white/10 text-cream/60 hover:text-cream transition-all text-sm"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            Back
          </motion.button>
        </div>

        {/* Rating Badge */}
        {rating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="absolute bottom-8 right-8 rating-badge px-5 py-3 rounded-2xl text-center"
          >
            <RiStarFill className="w-5 h-5 text-peach mx-auto mb-1" />
            <div className="text-2xl font-bold text-cream font-display">{rating}</div>
            <div className="text-cream/40 text-xs">{movie.vote_count?.toLocaleString()} votes</div>
          </motion.div>
        )}
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10 pb-24">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="shrink-0 w-40 md:w-56"
          >
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full rounded-2xl shadow-card-hover border border-white/10"
              />
            ) : (
              <div className="w-full aspect-[2/3] rounded-2xl bg-noir-light border border-white/10 flex items-center justify-center">
                <RiPlayCircleLine className="w-10 h-10 text-cream/20" />
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="flex-1 pt-4"
          >
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.map(g => (
                <span key={g.id} className="genre-chip text-xs active text-lavender bg-lavender/10 border-lavender/25 px-3 py-1">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-5xl text-cream font-semibold leading-tight mb-3">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-cream/40 italic text-base mb-5 font-light">"{movie.tagline}"</p>
            )}

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-cream/50 mb-8">
              {year && (
                <span className="flex items-center gap-1.5">
                  <RiCalendarLine className="w-4 h-4" />
                  {year}
                </span>
              )}
              {runtime > 0 && (
                <span className="flex items-center gap-1.5">
                  <RiTimeLine className="w-4 h-4" />
                  {hours > 0 ? `${hours}h ` : ''}{mins}m
                </span>
              )}
              {movie.original_language && (
                <span className="flex items-center gap-1.5">
                  <RiGlobalLine className="w-4 h-4" />
                  {movie.original_language.toUpperCase()}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-8">
              {trailer && (
                <GlowButton
                  variant="solid"
                  size="md"
                  onClick={() => setTrailerOpen(true)}
                  icon={RiPlayCircleLine}
                >
                  Watch Trailer
                </GlowButton>
              )}
              <GlowButton
                variant={inWatchlist ? 'peach' : 'primary'}
                size="md"
                onClick={() => inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                icon={inWatchlist ? RiBookmarkFill : RiBookmarkLine}
              >
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </GlowButton>
              <GlowButton
                variant={favorite ? 'danger' : 'ghost'}
                size="md"
                onClick={() => toggleFavorite(movie)}
                icon={favorite ? RiHeartFill : RiHeartLine}
              >
                {favorite ? 'Favorited' : 'Favorite'}
              </GlowButton>
            </div>

            {/* Overview */}
            {movie.overview && (
              <div>
                <h2 className="text-cream/40 text-xs uppercase tracking-widest mb-3">Overview</h2>
                <p className="text-cream/75 leading-relaxed text-base font-light max-w-2xl">
                  {movie.overview}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Cast ───────────────────────────────────── */}
        {cast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-16"
          >
            <h2 className="font-display text-2xl text-cream mb-6">Cast</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {cast.map((person, i) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.5 }}
                  className="shrink-0 w-24 text-center group"
                >
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 border-2 border-white/10 group-hover:border-lavender/40 transition-colors">
                    {person.profile_path ? (
                      <img
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-noir-light flex items-center justify-center text-cream/20 text-xl font-display">
                        {person.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-cream/80 text-xs font-medium leading-tight">{person.name}</p>
                  <p className="text-cream/30 text-xs mt-0.5 line-clamp-1">{person.character}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Similar Movies ──────────────────────────── */}
        {similar.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-16"
          >
            <h2 className="font-display text-2xl text-cream mb-6">You Might Also Like</h2>
            <Swiper
              modules={[Navigation, FreeMode]}
              spaceBetween={16}
              slidesPerView={2}
              freeMode
              breakpoints={{
                480: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
              }}
              className="pb-4"
            >
              {similar.map((m, i) => (
                <SwiperSlide key={m.id}>
                  <MovieCard movie={m} index={i} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </div>

      {/* ── Trailer Modal ────────────────────────────── */}
      <Modal isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} size="xl">
        {trailer && (
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={`${TMDB_VIDEO_BASE}${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
