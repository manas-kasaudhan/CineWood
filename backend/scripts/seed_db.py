"""
Seed the MongoDB 'movies' collection from the CSV dataset.
Run this once to migrate the ML data into MongoDB:

    cd backend
    python -m scripts.seed_db
"""
import asyncio
import pandas as pd
import os
import sys

# Add the parent directory to sys.path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "cinewood")
CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dataset", "movies.csv")


async def seed():
    print(f"Connecting to MongoDB: {MONGODB_URI}")
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[MONGODB_DB_NAME]

    # Check if CSV exists
    if not os.path.exists(CSV_PATH):
        print(f"✗ CSV not found at {CSV_PATH}")
        print("  Run 'python dataset/generate_sample.py' first.")
        return

    # Read CSV
    df = pd.read_csv(CSV_PATH)
    print(f"Read {len(df)} movies from CSV")

    # Convert to list of dicts
    records = df.to_dict("records")

    # Clean up NaN values
    for record in records:
        for key, value in record.items():
            if pd.isna(value):
                record[key] = ""

    # Drop existing movies collection and re-insert
    await db.movies.drop()
    print("Dropped existing movies collection")

    if records:
        await db.movies.insert_many(records)
        print(f"✓ Inserted {len(records)} movies into MongoDB")

    # Create indexes
    await db.movies.create_index("id", unique=True)
    await db.movies.create_index("title")
    print("✓ Indexes created on 'id' and 'title'")

    # Verify
    count = await db.movies.count_documents({})
    print(f"✓ Verification: {count} movies in collection")

    client.close()
    print("✓ Done!")


if __name__ == "__main__":
    asyncio.run(seed())
