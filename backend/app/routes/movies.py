from fastapi import APIRouter, HTTPException
from typing import Any
from app.services.tmdb_service import tmdb_service
from ml.recommender import recommender
import asyncio

router = APIRouter(prefix="/movies", tags=["movies"])

@router.get("/trending")
async def get_trending_movies():
    try:
        data = await tmdb_service.get_trending()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search/{movie_name}")
async def search_movie(movie_name: str, page: int = 1):
    try:
        data = await tmdb_service.search_movies(movie_name, page)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommend/{movie_name}")
async def recommend_movies(movie_name: str):
    """
    Combines ML recommendation with TMDB rich data
    """
    try:
        # Get ML recommendations (returns basic metadata and IDs)
        ml_recommendations = recommender.get_recommendations_by_title(movie_name)
        
        if not ml_recommendations:
            # Fallback to TMDB search and similar if ML fails to find the movie
            search_data = await tmdb_service.search_movies(movie_name)
            if not search_data.get("results"):
                raise HTTPException(status_code=404, detail="Movie not found")
                
            movie_id = search_data["results"][0]["id"]
            similar_data = await tmdb_service.get_similar_movies(movie_id)
            return similar_data.get("results", [])[:6]
            
        # Enrich ML recommendations with full TMDB data concurrently
        tasks = [tmdb_service.get_movie_details(movie['id']) for movie in ml_recommendations]
        enriched_movies = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out any that failed
        valid_movies = [m for m in enriched_movies if not isinstance(m, Exception)]
        
        return valid_movies
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/details/{movie_id}")
async def get_movie_details(movie_id: int):
    try:
        data = await tmdb_service.get_movie_details(movie_id)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/similar/{movie_id}")
async def get_similar_movies(movie_id: int):
    try:
        data = await tmdb_service.get_similar_movies(movie_id)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
