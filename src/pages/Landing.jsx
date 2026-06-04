import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { getTrending, getNowPlaying, getImageUrl, getBackdropUrl, getPopular } from '../lib/tmdb';
import GlowButton from '../components/GlowButton';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { SkeletonCard } from '../components/Skeleton';
import { RiPlayCircleLine, RiArrowRightLine, RiSparklingLine, RiFilmLine } from 'react-icons/ri';

const FloatingPoster = ({ movie, style, delay }) => {
  const posterUrl = getImageUrl(movie?.poster_path, 'w342');
  if (!posterUrl) return null;
  return (
    <motion.div
      className="absolute rounded-2xl overflow-hidden shadow-card opacity-30 hover:opacity-60 transition-opacity duration-500"
      style={style}
      animate={{ y: [0, -18, 0], rotate: [style.rotate, style.rotate + 2, style.rotate] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <img src={posterUrl} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-noir/40 to-transparent" />
    </motion.div>
  );
};

export default function Landing() {
  const [trending, setTrending] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  useEffect(() => {
    Promise.all([getTrending(), getNowPlaying(), getPopular()])
      .then(([trendData, nowData, popData]) => {
        setTrending(trendData.results || []);
        setNowPlaying(nowData.results || []);
        setTopRated(popData.results || []);
        setFeatured(trendData.results?.[0] || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Cycle featured hero movie
  useEffect(() => {
    if (!trending.length) return;
    const id = setInterval(() => {
      setHeroIndex(i => {
        const next = (i + 1) % Math.min(5, trending.length);
        setFeatured(trending[next]);
        return next;
      });
    }, 6000);
    return () => clearInterval(id);
  }, [trending]);

  const heroMovie = featured || trending[0];
  const backdropUrl = getBackdropUrl(heroMovie?.backdrop_path, 'w1280');

  const floatingPosters = trending.slice(1, 8);

  return (
    <div className="min-h-screen bg-noir overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Backdrop */}
        <AnimatePresence mode="wait">
          {backdropUrl && (
            <motion.div
              key={heroMovie?.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <img
                src={backdropUrl}
                alt=""
                className="w-full h-full object-cover scale-105"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/85 to-noir/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-noir/40" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 ambient-orb bg-coral/15 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 ambient-orb bg-teal/12 animate-float-slow" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 ambient-orb bg-sun/10 animate-float-fast" />

        {/* Floating Posters */}
        {!loading && floatingPosters.slice(0, 5).map((m, i) => (
          <FloatingPoster
            key={m.id}
            movie={m}
            delay={i * 0.8}
            style={{
              width: `${100 + i * 20}px`,
              height: `${150 + i * 30}px`,
              right: `${3 + i * 8}%`,
              top: `${15 + i * 12}%`,
              rotate: `${-8 + i * 4}deg`,
              zIndex: 5 - i,
            }}
          />
        ))}

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-cream/60 border border-white/10 mb-8">
              <RiSparklingLine className="w-3.5 h-3.5 text-coral" />
              <span>AI-Powered Cinema Discovery</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight mb-6 max-w-3xl">
              <span className="text-cream">Discover films</span>
              <br />
              <span className="gradient-text text-glow-lavender">that match</span>
              <br />
              <span className="text-cream">your soul.</span>
            </h1>

            <p className="text-cream/50 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light">
              Curated cinema for every mood. From quiet drama to mind-bending sci-fi — your next favorite film is one mood away.
            </p>

            {/* Search Bar */}
            <div className="mb-8 max-w-xl">
              <SearchBar placeholder="Search by title, mood, or director…" />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <GlowButton
                variant="solid"
                size="lg"
                onClick={() => navigate('/recommendations')}
                icon={RiSparklingLine}
              >
                Discover Films
              </GlowButton>
              <GlowButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/assistant')}
                icon={RiFilmLine}
              >
                AI Cinema Guide
              </GlowButton>
            </div>
          </motion.div>

          {/* Hero Movie Label */}
          {heroMovie && (
            <motion.div
              key={heroMovie.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-16 flex items-center gap-4"
            >
              <div className="flex items-center gap-3 glass px-4 py-3 rounded-2xl border border-white/10">
                <RiPlayCircleLine className="w-5 h-5 text-coral" />
                <div>
                  <p className="text-cream/40 text-xs uppercase tracking-widest">Now Trending</p>
                  <p className="text-cream font-medium text-sm mt-0.5">{heroMovie.title}</p>
                </div>
              </div>
              {/* Hero Dots */}
              <div className="flex items-center gap-1.5">
                {trending.slice(0, 5).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setHeroIndex(i); setFeatured(trending[i]); }}
                    className={`rounded-full transition-all duration-300 ${
                      i === heroIndex ? 'w-6 h-1.5 bg-coral' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Scroll Cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/20"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-cream/20" />
          <span className="text-xs tracking-widest uppercase">Scroll</span>
        </motion.div>
      </section>

      {/* ── Trending Carousel ─────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-coral text-sm font-medium tracking-widest uppercase mb-2">This Week</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream">Trending Now</h2>
          </div>
          <GlowButton variant="ghost" size="sm" onClick={() => navigate('/recommendations')} icon={RiArrowRightLine}>
            See All
          </GlowButton>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-10"
          >
            {trending.map((movie, i) => (
              <SwiperSlide key={movie.id}>
                <MovieCard movie={movie} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* ── Now Playing ───────────────────────────────── */}
      <section className="py-16 bg-gradient-to-b from-transparent via-noir-light/30 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-teal text-sm font-medium tracking-widest uppercase mb-2">In Theaters</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-cream">Now Playing</h2>
            </div>
            <GlowButton variant="ghost" size="sm" onClick={() => navigate('/recommendations')} icon={RiArrowRightLine}>
              See All
            </GlowButton>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {nowPlaying.slice(0, 10).map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Mood CTA ─────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl p-12 md:p-20 text-center"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-navy-light/50 to-teal/8" />
          <div className="absolute inset-0 border border-white/8 rounded-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ambient-orb bg-coral/15 animate-float" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <RiSparklingLine className="w-10 h-10 text-sun mx-auto mb-6" />
              <h2 className="font-display text-4xl md:text-5xl text-cream mb-4">
                Let the AI guide your next{' '}
                <span className="gradient-text">cinematic journey.</span>
              </h2>
              <p className="text-cream/50 text-lg max-w-xl mx-auto mb-10">
                Tell us how you're feeling. Our AI Cinema Guide finds the perfect film for every mood, moment, and emotion.
              </p>
              <GlowButton variant="solid" size="lg" onClick={() => navigate('/assistant')} icon={RiArrowRightLine}>
                Launch AI Cinema Guide
              </GlowButton>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Popular Now ───────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-sun text-sm font-medium tracking-widest uppercase mb-2">Highly Rated</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cream">Popular Films</h2>
          </div>
          <GlowButton variant="ghost" size="sm" onClick={() => navigate('/recommendations')} icon={RiArrowRightLine}>
            Explore More
          </GlowButton>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {topRated.slice(0, 12).map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
