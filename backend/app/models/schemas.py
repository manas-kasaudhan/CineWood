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

class AIRecommendRequest(BaseModel):
    prompt: str

class AIRecommendResponse(BaseModel):
    mood: str
    message: str
    movies: List[MovieBasic]
