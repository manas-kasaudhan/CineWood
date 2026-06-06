from fastapi import APIRouter, Depends, HTTPException
from app.services.auth_service import get_current_user
from app.database import get_db
from app.models.schemas import MovieRef, MoodEntry
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter(prefix="/user", tags=["user-data"])


# ── Helpers ──────────────────────────────────────────

def movie_ref_dict(data: dict) -> dict:
    """Convert request body to a clean movie reference dict."""
    return {
        "movie_id": data.get("movie_id") or data.get("id"),
        "title": data.get("title", ""),
        "poster_path": data.get("poster_path"),
        "vote_average": data.get("vote_average"),
        "release_date": data.get("release_date"),
        "genre_ids": data.get("genre_ids", []),
        "added_at": datetime.now(timezone.utc).isoformat(),
    }


# ── Watchlist ────────────────────────────────────────

@router.get("/watchlist")
async def get_watchlist(current_user=Depends(get_current_user)):
    return current_user.get("watchlist", [])


@router.post("/watchlist")
async def add_to_watchlist(movie: dict, current_user=Depends(get_current_user)):
    db = get_db()
    user_id = current_user["_id"]
    movie_id = movie.get("movie_id") or movie.get("id")

    # Check if already in watchlist
    existing = await db.users.find_one(
        {"_id": user_id, "watchlist.movie_id": movie_id}
    )
    if existing:
        return {"message": "Already in watchlist"}

    ref = movie_ref_dict(movie)
    await db.users.update_one(
        {"_id": user_id},
        {"$push": {"watchlist": {"$each": [ref], "$position": 0}}}
    )
    return {"message": "Added to watchlist", "movie": ref}


@router.delete("/watchlist/{movie_id}")
async def remove_from_watchlist(movie_id: int, current_user=Depends(get_current_user)):
    db = get_db()
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$pull": {"watchlist": {"movie_id": movie_id}}}
    )
    return {"message": "Removed from watchlist"}


# ── Favorites ────────────────────────────────────────

@router.get("/favorites")
async def get_favorites(current_user=Depends(get_current_user)):
    return current_user.get("favorites", [])


@router.post("/favorites")
async def toggle_favorite(movie: dict, current_user=Depends(get_current_user)):
    db = get_db()
    user_id = current_user["_id"]
    movie_id = movie.get("movie_id") or movie.get("id")

    # Check if already favorited — toggle off
    existing = await db.users.find_one(
        {"_id": user_id, "favorites.movie_id": movie_id}
    )
    if existing:
        await db.users.update_one(
            {"_id": user_id},
            {"$pull": {"favorites": {"movie_id": movie_id}}}
        )
        return {"message": "Removed from favorites", "action": "removed"}

    # Add to favorites
    ref = movie_ref_dict(movie)
    await db.users.update_one(
        {"_id": user_id},
        {"$push": {"favorites": {"$each": [ref], "$position": 0}}}
    )
    return {"message": "Added to favorites", "action": "added"}


@router.delete("/favorites/{movie_id}")
async def remove_favorite(movie_id: int, current_user=Depends(get_current_user)):
    db = get_db()
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$pull": {"favorites": {"movie_id": movie_id}}}
    )
    return {"message": "Removed from favorites"}


# ── Watch History ────────────────────────────────────

@router.get("/history")
async def get_history(current_user=Depends(get_current_user)):
    return current_user.get("watch_history", [])


@router.post("/history")
async def add_to_history(movie: dict, current_user=Depends(get_current_user)):
    db = get_db()
    user_id = current_user["_id"]
    movie_id = movie.get("movie_id") or movie.get("id")

    # Remove if already exists (re-add at top)
    await db.users.update_one(
        {"_id": user_id},
        {"$pull": {"watch_history": {"movie_id": movie_id}}}
    )

    ref = movie_ref_dict(movie)
    ref["watched_at"] = datetime.now(timezone.utc).isoformat()

    # Push to front and cap at 20 entries
    await db.users.update_one(
        {"_id": user_id},
        {
            "$push": {
                "watch_history": {
                    "$each": [ref],
                    "$position": 0,
                    "$slice": 20,
                }
            }
        }
    )
    return {"message": "Added to history", "movie": ref}


# ── Mood History ─────────────────────────────────────

@router.get("/moods")
async def get_moods(current_user=Depends(get_current_user)):
    return current_user.get("mood_history", [])


@router.post("/moods")
async def add_mood(entry: dict, current_user=Depends(get_current_user)):
    db = get_db()
    user_id = current_user["_id"]

    mood_doc = {
        "mood": entry.get("mood", ""),
        "movies": entry.get("movies", []),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    # Push to front and cap at 10 entries
    await db.users.update_one(
        {"_id": user_id},
        {
            "$push": {
                "mood_history": {
                    "$each": [mood_doc],
                    "$position": 0,
                    "$slice": 10,
                }
            }
        }
    )
    return {"message": "Mood entry added", "entry": mood_doc}


# ── Get All User Data (for initial hydration) ───────

@router.get("/data")
async def get_all_user_data(current_user=Depends(get_current_user)):
    """Returns all user data in a single request for initial load."""
    return {
        "watchlist": current_user.get("watchlist", []),
        "favorites": current_user.get("favorites", []),
        "watch_history": current_user.get("watch_history", []),
        "mood_history": current_user.get("mood_history", []),
    }
