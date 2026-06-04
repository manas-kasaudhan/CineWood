from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import movies, ai
import uvicorn

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Cinewood movie recommendation platform",
    version="1.0.0"
)

# Setup CORS to allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "https://cine-wood.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(movies.router)
app.include_router(ai.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Cinewood API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
