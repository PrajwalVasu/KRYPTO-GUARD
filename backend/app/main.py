import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import auth, users, learning, quiz, progress

app = FastAPI(title="KRYPTOGUARD Backend", version="0.1.0")

# Database lifecycle
@app.on_event("startup")
async def startup_db_client():
    from .database import connect_to_mongo
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    from .database import close_mongo_connection
    await close_mongo_connection()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with appropriate API prefixes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(learning.router, prefix="/api/v1/learning", tags=["learning"])
app.include_router(quiz.router, prefix="/api/v1/quizzes", tags=["quizzes"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["progress"])

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
