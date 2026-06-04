import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BACKEND_URL,
});

// ── Movies ─────────────────────────────────────────
export const getTrending = () =>
  api.get(`/movies/trending`).then(r => r.data);

export const searchMovies = (query, page = 1) =>
  api.get(`/movies/search/${query}`, { params: { page } }).then(r => r.data);

export const getMovieDetails = (id) =>
  api.get(`/movies/details/${id}`).then(r => r.data);

export const getSimilarMovies = (id) =>
  api.get(`/movies/similar/${id}`).then(r => r.data);

// ML-powered Recommendation Route
export const getRecommendations = (movieName) =>
  api.get(`/movies/recommend/${movieName}`).then(r => r.data);

// ── AI Assistant ─────────────────────────────────────
export const aiRecommend = (prompt) =>
  api.post(`/ai/recommend`, { prompt }).then(r => r.data);
