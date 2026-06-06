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
import { RiPlayCircleLine, RiArrowRightLine, RiFilmLine, RiChat3Line } from 'react-icons/ri';

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
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

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
              <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/90 to-noir/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-noir/50" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-cream/50 border border-slate mb-8">
              <RiFilmLine className="w-3.5 h-3.5 text-primary" />
              <span>Cinema Discovery</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight mb-6 max-w-3xl">
              <span className="text-cream">Discover films</span>
              <br />
              <span className="text-primary">that match</span>
              <br />
              <span className="text-cream">your soul.</span>
            </h1>

            <p className="text-cream/40 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light">
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
                icon={RiFilmLine}
              >
                Discover Films
              </GlowButton>
              <GlowButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/assistant')}
                icon={RiChat3Line}
              >
                Film Assistant
              </GlowButton>
            </div>
          </motion.div>

          {/* Hero Movie Label */}
          {heroMovie && (
            <motion.div
              key={heroMovie.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-16 flex items-center gap-4"
            >
              <div className="flex items-center gap-3 glass px-4 py-3 rounded-xl border border-slate">
                <RiPlayCircleLine className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-cream/35 text-xs uppercase tracking-widest">Now Trending</p>
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
                      i === heroIndex ? 'w-6 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-white/15 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Scroll Cue */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/15"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-cream/15" />
          <span className="text-xs tracking-widest uppercase">Scroll</span>
        </motion.div>
      </section>

      {/* ── Trending Carousel ─────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-2">This Week</p>
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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">In Theaters</p>
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

      {/* ── CTA Section ───────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl p-12 md:p-20 text-center"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-noir-light/50 to-accent/4" />
          <div className="absolute inset-0 border border-slate rounded-2xl" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <RiChat3Line className="w-10 h-10 text-primary mx-auto mb-6" />
              <h2 className="font-display text-4xl md:text-5xl text-cream mb-4">
                Your next <span className="text-primary">cinematic journey</span> starts here.
              </h2>
              <p className="text-cream/40 text-lg max-w-xl mx-auto mb-10">
                Tell us how you're feeling. Our Film Assistant finds the perfect film for every mood, moment, and emotion.
              </p>
              <GlowButton variant="solid" size="lg" onClick={() => navigate('/assistant')} icon={RiArrowRightLine}>
                Launch Film Assistant
              </GlowButton>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Popular Now ───────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-amber text-sm font-medium tracking-widest uppercase mb-2">Highly Rated</p>
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
