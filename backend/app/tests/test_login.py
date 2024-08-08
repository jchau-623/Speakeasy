import httpx
import pytest
from typing import Tuple


@pytest.mark.asyncio
async def test_sign_new_user(default_client: httpx.AsyncClient) -> None:

    payload = {
        "id": "5eb7cf5a86d9755df3a6c593",
        "email": "testuser@example.com",
        "password": "testpassword",
    }
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json"
    }
    test_response = {
        "id": "5eb7cf5a86d9755df3a6c593",
        "email": "testuser@example.com",
        "favorite": []
    }

    response = await default_client.post(
        "/api/user/signup",
        json=payload,
        headers=headers
    )

    assert response.status_code == 200
    assert response.json() == test_response

    assert "set-cookie" in response.headers

    cookies = response.headers["set-cookie"]
    assert "access_token=" in cookies

    cookie_value = cookies.split(';')[0]
    assert "access_token=" in cookie_value


@pytest.mark.asyncio
async def test_sign_user_in(default_client: httpx.AsyncClient) -> None:
    payload = {
        "username": "testuser@example.com",
        "password": "testpassword"
    }

    headers = {
        "accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = await default_client.post("/api/user/signin", data=payload, headers=headers)

    assert response.status_code == 200
    assert "set-cookie" in response.headers

    cookies = response.headers["set-cookie"]
    assert "access_token=" in cookies

    cookie_value = cookies.split(';')[0]
    assert "access_token=" in cookie_value



@pytest.mark.asyncio
async def test_get_user(authenticated_client: Tuple[httpx.AsyncClient, str]) -> None:
    # print("Cookies:", authenticated_client.cookies)
    client, email = authenticated_client
    token = f"access_token={client.cookies['access_token']}"
    response = await client.get("/api/user/", headers={"Cookie": token})
    # print("Request headers:", response.request.headers)
    # print("Response status code:", response.status_code)

    assert response.status_code == 200

    response_json = response.json()
    assert response_json["email"] == email

    assert "Cookie" in response.request.headers
    assert "access_token=" in response.request.headers["Cookie"]



@pytest.mark.asyncio
async def test_logout_user(authenticated_client: httpx.AsyncClient) -> None:
    # Get the token before logging out
    client, email = authenticated_client
    token = f"access_token={client.cookies['access_token']}"

    # Logout
    response = await client.post("/api/user/logout", headers={"Cookie": token})
    assert response.status_code == 200

    # Try to access a protected endpoint with the same token
    response = await client.get("/api/user/", headers={"Cookie": token})
    assert response.status_code == 401  # Token should be blacklisted


@pytest.mark.asyncio
async def test_delete_user(authenticated_client: httpx.AsyncClient) -> None:
    client, email = authenticated_client
    token = f"access_token={client.cookies['access_token']}"

    response = await client.delete("/api/user/", headers={"Cookie": token})
    assert response.status_code == 200

    # Try deleting the user again (should fail)
    response = await client.delete("/api/user/", headers={"Cookie": token})
    assert response.status_code == 404  # User not found
