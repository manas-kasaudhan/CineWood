<div align="center">
  <h1>🎬 Cinewood</h1>
  <p><strong>Curated cinema for every mood.</strong></p>
  <p>A premium AI-powered cinematic movie recommendation platform built with React, Tailwind CSS & Framer Motion.</p>

  ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
  ![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)
  ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?style=flat-square&logo=framer)
  ![TMDB](https://img.shields.io/badge/TMDB-API-01B4E4?style=flat-square)
</div>

---

## ✨ Features

- **🎥 Cinematic Landing Page** — Auto-cycling hero backdrop, floating movie posters, trending Swiper carousel
- **🔍 Discovery Engine** — Search, genre filters, sort modes, animated responsive grid
- **🎬 Movie Details** — Full cinematic backdrop, cast strip, YouTube trailer modal, similar movies
- **🤖 AI Cinema Guide** — Mood-based chat UI, typing animations, real movie recommendations
- **👤 Profile Dashboard** — Watchlist, favorites, recently watched, mood history — all persisted locally
- **🌌 Premium Aesthetics** — Film grain, glassmorphism, ambient orbs, gradient text, Framer Motion transitions

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 + custom design tokens |
| Animation | Framer Motion |
| Slider | Swiper.js |
| Icons | React Icons |
| Data | TMDB API |
| Routing | React Router v6 |
| State | Context API + localStorage |

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/cinewood.git
cd cinewood
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your TMDB API Key

Get a free API key from [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

Create a `.env` file in the root:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎬

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx         # Frosted glass navbar
│   ├── MovieCard.jsx      # Cinematic hover card
│   ├── GlowButton.jsx     # Multi-variant glow button
│   ├── SearchBar.jsx      # Debounced search
│   ├── GenreChip.jsx      # Filter chips
│   ├── Skeleton.jsx       # Shimmer loading states
│   ├── Modal.jsx          # Glassmorphism modal
│   └── FilmGrain.jsx      # Film grain overlay
├── pages/
│   ├── Landing.jsx        # Hero + trending + AI CTA
│   ├── Recommendations.jsx # Search + genre + grid
│   ├── MovieDetails.jsx   # Details + trailer + cast
│   ├── Assistant.jsx      # AI mood chat
│   └── Profile.jsx        # User dashboard
├── context/
│   └── AppContext.jsx     # Global state
└── lib/
    └── tmdb.js            # TMDB API helper
```

## 🎨 Design System

**Color Palette:**

| Token | Color |
|---|---|
| `lavender` | `#C4B5FD` |
| `peach` | `#FECBA1` |
| `dusty` | `#E8A0BF` |
| `mist` | `#BAD0E8` |
| `muted` | `#9B8EC4` |
| `noir` | `#0D0D0F` |

## 📄 License

MIT — build something beautiful.

---

<div align="center">
  <p>Built with 🎬 by <a href="https://github.com/YOUR_USERNAME">@YOUR_USERNAME</a></p>
  <p><em>Inspired by Letterboxd, A24, Apple, and the love of cinema.</em></p>
</div>
