import os
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings
from pymongo.errors import ServerSelectionTimeoutError

client: AsyncIOMotorClient | None = None

def get_database():
    """Return the MongoDB database object.
    This function can be used as a FastAPI dependency.
    """
    if client is None:
        raise RuntimeError("MongoDB client is not initialized")
    return client[settings.DATABASE_NAME]

async def connect_to_mongo():
    global client
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        # Force a connection to verify server availability
        await client.server_info()
        # Ensure indexes
        db = client[settings.DATABASE_NAME]
        await db.users.create_index("email", unique=True)
        await db.revoked_tokens.create_index("expireAt", expireAfterSeconds=0)  # TTL based on token expiry

        # Initialize learning indexes and seed content idempotently
        from .services.learning_service import init_learning_indexes_and_seed
        await init_learning_indexes_and_seed()

        # Initialize quiz indexes and seed content idempotently
        from .services.quiz_service import init_quiz_indexes_and_seed
        await init_quiz_indexes_and_seed()

        # Initialize progress indexes
        from .services.progress_service import init_progress_indexes
        await init_progress_indexes()
    except ServerSelectionTimeoutError as exc:
        raise RuntimeError(f"Cannot connect to MongoDB: {exc}")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        client = None
