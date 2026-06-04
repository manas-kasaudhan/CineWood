from fastapi import APIRouter, HTTPException
from app.models.schemas import AIRecommendRequest, AIRecommendResponse
from app.services.tmdb_service import tmdb_service
from ml.recommender import recommender
import asyncio

router = APIRouter(prefix="/ai", tags=["ai"])

MOOD_DETECT = [
  { "keywords": ['mind-bending', 'complex', 'deep', 'philosophical', 'confusing', 'twist', 'reality'], "mood": 'mind-bending', "tmdb_genres": '878,9648', "tmdb_keywords": '9672|180547|162252' },
  { "keywords": ['cry', 'emotional', 'sad', 'moving', 'touching', 'heartfelt', 'drama'], "mood": 'emotional', "tmdb_genres": '18,10749', "tmdb_keywords": '818|4565|188234' },
  { "keywords": ['laugh', 'comedy', 'funny', 'humor', 'fun'], "mood": 'feel-good', "tmdb_genres": '35,16,10751', "tmdb_keywords": '10683|9840' },
  { "keywords": ['scared', 'horror', 'thriller', 'suspense', 'mystery', 'dark'], "mood": 'dark', "tmdb_genres": '27,9648,53', "tmdb_keywords": '9828|155477' },
  { "keywords": ['sci-fi', 'science', 'space', 'future', 'technology', 'robot', 'alien'], "mood": 'sci-fi', "tmdb_genres": '878', "tmdb_keywords": '4379|9717' },
  { "keywords": ['adventure', 'action', 'epic', 'hero', 'fantasy', 'quest'], "mood": 'adventure', "tmdb_genres": '12,14', "tmdb_keywords": '779|1701' },
  { "keywords": ['romance', 'love', 'romantic', 'relationship', 'couple'], "mood": 'romantic', "tmdb_genres": '10749,18', "tmdb_keywords": '9748|818' },
]

AI_RESPONSES = {
  'mind-bending': "The matrix of cinema awaits you. These films will unravel the fabric of your reality.",
  'emotional': "Cinema's greatest power is making us feel. These films will reach into your soul.",
  'feel-good': "Sometimes you need film as a warm embrace. These selections radiate joy.",
  'dark': "For those who dare to look into the abyss. These films explore the shadowed corners.",
  'sci-fi': "The cosmos of human imagination, rendered on screen.",
  'adventure': "Your passport to extraordinary worlds.",
  'romantic': "Love, beautifully captured. These films celebrate connection.",
  'popular': "Here are some universally acclaimed films based on what you asked for."
}

def parse_prompt(text: str):
    lower = text.lower()
    for category in MOOD_DETECT:
        if any(k in lower for k in category["keywords"]):
            return category
    return None

@router.post("/recommend", response_model=AIRecommendResponse)
async def ai_recommend(request: AIRecommendRequest):
    try:
        # First, try to use the ML engine for a content-based text search
        ml_recommendations = recommender.get_recommendations_by_text(request.prompt, top_n=6)
        
        valid_movies = []
        if ml_recommendations:
            # Fetch rich details for the ML recommendations
            tasks = [tmdb_service.get_movie_details(movie['id']) for movie in ml_recommendations]
            enriched_movies = await asyncio.gather(*tasks, return_exceptions=True)
            valid_movies = [m for m in enriched_movies if not isinstance(m, Exception) and m.get("poster_path")]
            
        if not valid_movies:
            # Fallback to TMDB based on parsed keywords
            parsed = parse_prompt(request.prompt)
            if parsed:
                data = await tmdb_service.get_movies_by_keywords_and_genres(
                    keywords=parsed["tmdb_keywords"], 
                    genres=parsed["tmdb_genres"]
                )
                mood = parsed["mood"]
            else:
                data = await tmdb_service.get_trending()
                mood = 'popular'
                
            valid_movies = data.get("results", [])[:6]
        else:
            parsed = parse_prompt(request.prompt)
            mood = parsed["mood"] if parsed else 'popular'

        response_msg = AI_RESPONSES.get(mood, AI_RESPONSES['popular'])

        return AIRecommendResponse(
            mood=mood,
            message=response_msg,
            movies=valid_movies
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
