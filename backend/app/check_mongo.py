import asyncio
import sys
sys.path.append('C:/Users/Monee/OneDrive/Desktop/comproj')
from backend.app.database import connect_to_mongo, get_database, close_mongo_connection

async def main():
    try:
        await connect_to_mongo()
        db = get_database()
        # Ping the server
        await db.command({"ping": 1})
        # Verify database name
        db_name = db.name
        # Check if users collection exists (or list collections)
        collections = await db.list_collection_names()
        has_users = "users" in collections
        print("MongoDB connection successful")
        print(f"Database name: {db_name}")
        print(f"Users collection present: {has_users}")
    except Exception as e:
        print("MongoDB connection failed")
        print(f"Error: {e}")
    finally:
        # Ensure the client is closed
        try:
            await close_mongo_connection()
        except Exception:
            pass

if __name__ == "__main__":
    asyncio.run(main())

async def main():
    try:
        await connect_to_mongo()
        db = get_database()
        # Ping the server
        await db.command({"ping": 1})
        # Verify database name
        db_name = db.name
        # Check if users collection exists (or list collections)
        collections = await db.list_collection_names()
        has_users = "users" in collections
        print("MongoDB connection successful")
        print(f"Database name: {db_name}")
        print(f"Users collection present: {has_users}")
    except Exception as e:
        print("MongoDB connection failed")
        print(f"Error: {e}")
    finally:
        # Ensure the client is closed
        try:
            await close_mongo_connection()
        except Exception:
            pass

if __name__ == "__main__":
    asyncio.run(main())
