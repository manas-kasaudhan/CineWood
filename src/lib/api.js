import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BACKEND_URL,
});

// ── Auth Token Interceptor ────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cw_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Movies ─────────────────────────────────────────
export const getTrendingMovies = () =>
  api.get(`/movies/trending`).then(r => r.data);

export const searchMoviesApi = (query, page = 1) =>
  api.get(`/movies/search/${query}`, { params: { page } }).then(r => r.data);

export const getMovieDetailsApi = (id) =>
  api.get(`/movies/details/${id}`).then(r => r.data);

export const getSimilarMovies = (id) =>
  api.get(`/movies/similar/${id}`).then(r => r.data);

// ML-powered Recommendation Route
export const getRecommendations = (movieName) =>
  api.get(`/movies/recommend/${movieName}`).then(r => r.data);

// ── AI Assistant ─────────────────────────────────────
export const aiRecommend = (prompt) =>
  api.post(`/ai/recommend`, { prompt }).then(r => r.data);

// ── Auth ─────────────────────────────────────────────
export const authSignup = (data) =>
  api.post(`/auth/signup`, data).then(r => r.data);

export const authLogin = (data) =>
  api.post(`/auth/login`, data).then(r => r.data);

export const getMe = () =>
  api.get(`/auth/me`).then(r => r.data);

// ── User Data ────────────────────────────────────────
export const fetchUserData = () =>
  api.get(`/user/data`).then(r => r.data);

export const apiGetWatchlist = () =>
  api.get(`/user/watchlist`).then(r => r.data);

export const apiAddToWatchlist = (movie) =>
  api.post(`/user/watchlist`, movie).then(r => r.data);

export const apiRemoveFromWatchlist = (movieId) =>
  api.delete(`/user/watchlist/${movieId}`).then(r => r.data);

export const apiGetFavorites = () =>
  api.get(`/user/favorites`).then(r => r.data);

export const apiToggleFavorite = (movie) =>
  api.post(`/user/favorites`, movie).then(r => r.data);

export const apiRemoveFavorite = (movieId) =>
  api.delete(`/user/favorites/${movieId}`).then(r => r.data);

export const apiGetHistory = () =>
  api.get(`/user/history`).then(r => r.data);

export const apiAddToHistory = (movie) =>
  api.post(`/user/history`, movie).then(r => r.data);

export const apiGetMoods = () =>
  api.get(`/user/moods`).then(r => r.data);

export const apiAddMood = (entry) =>
  api.post(`/user/moods`, entry).then(r => r.data);
