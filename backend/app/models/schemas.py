from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class MovieBasic(BaseModel):
    id: int
    title: str
    popularity: Optional[float] = None
    vote_average: Optional[float] = None
    poster_path: Optional[str] = None
    overview: Optional[str] = None
    release_date: Optional[str] = None
    genre_ids: Optional[List[int]] = None


class AIRecommendRequest(BaseModel):
    prompt: str


class AIRecommendResponse(BaseModel):
    mood: str
    message: str
    movies: List[Any]


# ── User Data Schemas ────────────────────────────────

class MovieRef(BaseModel):
    """Lightweight movie reference stored in user documents."""
    movie_id: int
    title: str
    poster_path: Optional[str] = None
    vote_average: Optional[float] = None
    release_date: Optional[str] = None
    genre_ids: Optional[List[int]] = None


class MoodEntry(BaseModel):
    mood: str
    movies: List[MovieRef] = []
