# Cinewood FastAPI Backend

This is the production-ready Python backend for the Cinewood movie recommendation platform.

## Architecture
- **Framework**: FastAPI + Uvicorn
- **ML Pipeline**: Scikit-learn, Pandas, NumPy (Content-based filtering using TF-IDF and Cosine Similarity)
- **External API**: TMDB (async via HTTPX)
- **Validation**: Pydantic

## Folder Structure
```
backend/
├── app/                  # FastAPI Application
│   ├── main.py           # Entry point
│   ├── config.py         # Env config
│   ├── models/           # Pydantic schemas
│   ├── routes/           # API Endpoints
│   └── services/         # TMDB Integration
├── ml/                   # Machine Learning Models
│   └── recommender.py    # TF-IDF Engine
├── dataset/              # Data
│   ├── generate_sample.py# Script to build CSV from TMDB
│   └── movies.csv        # Feature dataset
├── requirements.txt
└── .env                  # Environment Variables
```

## Setup & Running

1. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # On Windows
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**
   Create a `.env` file in the `backend/` directory based on your TMDB API keys:
   ```env
   TMDB_API_KEY=your_key_here
   TMDB_BASE_URL=https://api.themoviedb.org/3
   TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
   FRONTEND_URL=http://localhost:5173
   ```

4. **Generate ML Dataset**
   Before running the app, you need a dataset for the recommendation engine:
   ```bash
   python dataset/generate_sample.py
   ```

5. **Start the Server**
   ```bash
   uvicorn app.main:app --reload
   ```

The API docs will be available at `http://localhost:8000/docs`.

## API Endpoints
- `GET /movies/trending` - Trending movies
- `GET /movies/search/{movie_name}` - Search TMDB
- `GET /movies/recommend/{movie_name}` - Get similar movies using the ML engine
- `GET /movies/details/{movie_id}` - Fetch rich TMDB details
- `POST /ai/recommend` - NLP recommendation engine (e.g., "Suggest mind-bending thrillers")
