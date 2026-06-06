from fastapi import APIRouter, HTTPException, status
from app.database import get_db
from app.models.user import UserLogin, UserResponse, TokenResponse
from app.services.auth_service import hash_password, verify_password, create_access_token, get_current_user
from datetime import datetime, timezone
from fastapi import Depends

router = APIRouter(prefix="/auth", tags=["auth"])





@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")

    user = await db.users.find_one({"email": data.email.lower()})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id = str(user["_id"])
    token = create_access_token(user_id)

    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user_id,
            email=user["email"],
            username=user["username"],
            created_at=user.get("created_at"),
        )
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user=Depends(get_current_user)):
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        username=current_user["username"],
        created_at=current_user.get("created_at"),
    )
