import asyncio
import httpx
import pytest
# import pytest_asyncio
import os
import random

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


@pytest.fixture(scope="function")
async def authenticated_client(default_client: httpx.AsyncClient) -> httpx.AsyncClient:

    email = f"testuser{random.randint(1, 1000)}@example.com"

    signup_response = await default_client.post(
        "/api/user/signup",
        json={"email": email, "password": "testpassword"}
    )
    assert signup_response.status_code == 200

    signin_response = await default_client.post(
        "/api/user/signin",
        data={"username": email, "password": "testpassword"},
    )
    assert signin_response.status_code == 200

    default_client.cookies = signin_response.cookies

    async def send_request(method, url, **kwargs):
        return await default_client.request(method, url, cookies=default_client.cookies, **kwargs)

    default_client.send_request = send_request

    yield default_client, email
