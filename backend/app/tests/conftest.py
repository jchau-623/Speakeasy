import asyncio
import httpx
import pytest
# import pytest_asyncio
import os

from main import app
from databases.connection import Settings
from models.user import User


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop()
    print("Event loop created:", loop)
    yield loop
    print("Running cleanup...")
    loop.run_until_complete(User.find_all().delete())
    print("Cleanup done.")
    print("Event loop closing:", loop)
    loop.close()

async def init_db():
    test_settings = Settings()
    test_settings.DATABASE_URL = "mongodb://localhost:27017/testdb"

    await test_settings.initialize_database()

@pytest.fixture(scope="function")
async def default_client():
    await init_db()
    async with httpx.AsyncClient(app=app, base_url="http://app") as client:
        yield client
