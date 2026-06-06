from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    """Connect to MongoDB on application startup."""
    global client, db
    try:
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000,
        )
        # Verify connection
        await client.admin.command("ping")
        db = client[settings.MONGODB_DB_NAME]

        # Create indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("username", unique=True)
        await db.movies.create_index("id", unique=True)
        await db.movies.create_index("title")

        print(f"[OK] Connected to MongoDB: {settings.MONGODB_DB_NAME}")
    except Exception as e:
        print(f"[WARN] MongoDB connection failed: {e}")
        print("  Make sure MongoDB is running: net start MongoDB")
        print("  Or start it via MongoDB Compass -> connect to localhost:27017")
        # Set db to None -- the app will still start but DB features won't work
        db = None


async def close_db():
    """Close MongoDB connection on application shutdown."""
    global client
    if client:
        client.close()
        print("[OK] MongoDB connection closed")


def get_db():
    """Get the database instance. Returns None if not connected."""
    return db
