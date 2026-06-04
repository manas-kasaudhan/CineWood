import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME = "Cinewood API"
    TMDB_API_KEY = os.getenv("TMDB_API_KEY")
    TMDB_BASE_URL = os.getenv("TMDB_BASE_URL", "https://api.themoviedb.org/3")
    TMDB_IMAGE_BASE = os.getenv("TMDB_IMAGE_BASE", "https://image.tmdb.org/t/p")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

settings = Settings()
