import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test():
    try:
        client = AsyncIOMotorClient("mongodb://localhost:27017", serverSelectionTimeoutMS=3000)
        await client.admin.command("ping")
        print("SUCCESS: MongoDB is running and reachable!")
        client.close()
    except Exception as e:
        print(f"FAILED: MongoDB not reachable - {e}")

asyncio.run(test())
