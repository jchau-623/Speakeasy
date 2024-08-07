import httpx
import pytest


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
        "/user/signup",
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

    response = await default_client.post("/user/signin", data=payload, headers=headers)

    assert response.status_code == 200
    assert "set-cookie" in response.headers

    cookies = response.headers["set-cookie"]
    assert "access_token=" in cookies

    cookie_value = cookies.split(';')[0]
    assert "access_token=" in cookie_value
