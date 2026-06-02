import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
export const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: 'en-US' },
});

export const getImageUrl = (path, size = 'w500') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;

export const getBackdropUrl = (path, size = 'w1280') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;

// ── Trending ─────────────────────────────────────────
export const getTrending = (timeWindow = 'week') =>
  tmdb.get(`/trending/movie/${timeWindow}`).then(r => r.data);

// ── Popular ───────────────────────────────────────────
export const getPopular = (page = 1) =>
  tmdb.get('/movie/popular', { params: { page } }).then(r => r.data);

// ── Top Rated ─────────────────────────────────────────
export const getTopRated = (page = 1) =>
  tmdb.get('/movie/top_rated', { params: { page } }).then(r => r.data);

// ── Now Playing ───────────────────────────────────────
export const getNowPlaying = () =>
  tmdb.get('/movie/now_playing').then(r => r.data);

// ── Search ────────────────────────────────────────────
export const searchMovies = (query, page = 1) =>
  tmdb.get('/search/movie', { params: { query, page } }).then(r => r.data);

// ── Movie Details ─────────────────────────────────────
export const getMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos,similar,keywords' }
  }).then(r => r.data);

// ── Genres ────────────────────────────────────────────
export const getGenres = () =>
  tmdb.get('/genre/movie/list').then(r => r.data);

// ── By Genre ─────────────────────────────────────────
export const getByGenre = (genreId, page = 1) =>
  tmdb.get('/discover/movie', {
    params: { with_genres: genreId, sort_by: 'popularity.desc', page }
  }).then(r => r.data);

// ── By Keywords ──────────────────────────────────────
export const getByKeywords = (keywords, genreIds = '') =>
  tmdb.get('/discover/movie', {
    params: {
      with_keywords: keywords,
      with_genres: genreIds,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 200,
    }
  }).then(r => r.data);

// ── Mood Mappings ─────────────────────────────────────
export const MOOD_MAPPINGS = {
  'mind-bending': { genres: '878,9648', keywords: '9672|180547|162252', label: 'Mind-Bending' },
  'emotional': { genres: '18,10749', keywords: '818|4565|188234', label: 'Emotional' },
  'feel-good': { genres: '35,16,10751', keywords: '10683|9840', label: 'Feel-Good' },
  'thriller': { genres: '53,80', keywords: '9717|208411', label: 'Thriller' },
  'adventure': { genres: '12,14', keywords: '779|1701', label: 'Adventure' },
  'dark': { genres: '27,9648,53', keywords: '9828|155477', label: 'Dark & Psychological' },
  'romantic': { genres: '10749,18', keywords: '9748|818', label: 'Romantic' },
  'sci-fi': { genres: '878', keywords: '4379|9717', label: 'Sci-Fi' },
  'comedy': { genres: '35', keywords: '9672|155477', label: 'Comedy' },
  'documentary': { genres: '99', keywords: '', label: 'Documentary' },
  'animated': { genres: '16', keywords: '', label: 'Animation' },
  'classic': { genres: '18,36', keywords: '283', label: 'Classics' },
};

export const getMoodMovies = async (mood) => {
  const mapping = MOOD_MAPPINGS[mood];
  if (!mapping) return getPopular();
  return getByKeywords(mapping.keywords, mapping.genres);
};

// ── Discover with filters ─────────────────────────────
export const discoverMovies = (params = {}) =>
  tmdb.get('/discover/movie', { params: { sort_by: 'popularity.desc', ...params } }).then(r => r.data);
