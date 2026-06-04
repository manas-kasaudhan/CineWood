import httpx
from app.config import settings

class TMDBService:
    def __init__(self):
        self.base_url = settings.TMDB_BASE_URL
        self.api_key = settings.TMDB_API_KEY

    async def _get(self, endpoint: str, params: dict = None):
        if params is None:
            params = {}
        params['api_key'] = self.api_key
        params['language'] = 'en-US'

        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}{endpoint}", params=params)
            response.raise_for_status()
            return response.json()

    async def get_trending(self, time_window="week"):
        return await self._get(f"/trending/movie/{time_window}")

    async def search_movies(self, query: str, page: int = 1):
        return await self._get("/search/movie", {"query": query, "page": page})

    async def get_movie_details(self, movie_id: int):
        return await self._get(f"/movie/{movie_id}", {"append_to_response": "credits,videos,similar,keywords"})

    async def get_similar_movies(self, movie_id: int):
        return await self._get(f"/movie/{movie_id}/similar")

    async def get_movies_by_keywords_and_genres(self, keywords: str = "", genres: str = ""):
        params = {
            "sort_by": "popularity.desc",
            "vote_count.gte": 100
        }
        if keywords:
            params["with_keywords"] = keywords
        if genres:
            params["with_genres"] = genres
            
        return await self._get("/discover/movie", params)

tmdb_service = TMDBService()
