import sys
import os
import json
import asyncio
import httpx

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.main import app
from backend.app.database import connect_to_mongo, close_mongo_connection

async def run_tests():
    print("=== 1. Inspecting OpenAPI Specification ===")
    openapi = app.openapi()

    # 1. Check Security Schemes
    security_schemes = openapi.get("components", {}).get("securitySchemes", {})
    print("Security Schemes:", json.dumps(security_schemes, indent=2))
    oauth2 = security_schemes.get("OAuth2PasswordBearer", {})
    token_url = oauth2.get("flows", {}).get("password", {}).get("tokenUrl")
    print(f"Detected tokenUrl: {token_url}")
    assert token_url == "/api/v1/auth/login", f"Expected /api/v1/auth/login, got {token_url}"

    # 2. Check Registered Paths
    paths = list(openapi.get("paths", {}).keys())
    print("\nRegistered Paths:")
    for p in paths:
        methods = list(openapi["paths"][p].keys())
        print(f"  {methods} {p}")

    assert "/api/v1/auth/login" in paths, "Missing /api/v1/auth/login"
    assert "/api/v1/auth/register" in paths, "Missing /api/v1/auth/register"
    assert "/api/v1/users/me" in paths, "Missing /api/v1/users/me"

    # 3. Check UserResponse schema doesn't expose hashed_password
    user_response_schema = openapi.get("components", {}).get("schemas", {}).get("UserResponse", {})
    properties = list(user_response_schema.get("properties", {}).keys())
    print(f"\nUserResponse properties in OpenAPI: {properties}")
    assert "hashed_password" not in properties, "SECURITY ERROR: hashed_password is in UserResponse schema!"
    print("SUCCESS: UserResponse schema does not expose hashed_password.")

    # 4. Functional Testing via AsyncClient
    print("\n=== 2. Functional Testing with AsyncClient ===")
    # Connect to MongoDB for tests
    await connect_to_mongo()

    try:
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            # Test A: Unauthenticated GET /api/v1/users/me
            res = await client.get("/api/v1/users/me")
            print(f"A. Unauthenticated GET /api/v1/users/me -> status {res.status_code}")
            assert res.status_code == 401, f"Expected 401, got {res.status_code}"

            # Test B: Invalid token GET /api/v1/users/me
            res = await client.get("/api/v1/users/me", headers={"Authorization": "Bearer invalid_token_123"})
            print(f"B. Invalid Token GET /api/v1/users/me -> status {res.status_code}")
            assert res.status_code == 401, f"Expected 401, got {res.status_code}"

            # Test C: Register a test user
            import uuid
            test_email = f"test_{uuid.uuid4().hex[:8]}@kryptoguard.dev"
            test_password = "SecurePassword123!"
            reg_payload = {
                "name": "Swagger Test User",
                "email": test_email,
                "password": test_password,
                "audience": "students"
            }
            res = await client.post("/api/v1/auth/register", json=reg_payload)
            print(f"C. POST /api/v1/auth/register -> status {res.status_code}")
            assert res.status_code == 200, f"Registration error: {res.text}"
            reg_token = res.json().get("access_token")
            print("   Registration successful, token received.")

            # Test D: Swagger OAuth2 Password Form Login (Form Data)
            form_data = {
                "username": test_email,
                "password": test_password
            }
            res = await client.post("/api/v1/auth/login", data=form_data)
            print(f"D. POST /api/v1/auth/login (Swagger Form Data) -> status {res.status_code}")
            assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
            token_data = res.json()
            access_token = token_data.get("access_token")
            assert access_token, "No access_token returned"
            assert token_data.get("token_type") == "bearer", "Expected token_type bearer"
            print("   Swagger OAuth2 Login successful!")

            # Test E: JSON Login (Frontend Contract)
            json_payload = {
                "email": test_email,
                "password": test_password
            }
            res = await client.post("/api/v1/auth/login/json", json=json_payload)
            print(f"E. POST /api/v1/auth/login/json (Frontend JSON) -> status {res.status_code}")
            assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
            print("   JSON Login successful!")

            # Test F: Invalid Password Login
            bad_form = {"username": test_email, "password": "WrongPassword!"}
            res = await client.post("/api/v1/auth/login", data=bad_form)
            print(f"F. POST /api/v1/auth/login (Bad Password) -> status {res.status_code}")
            assert res.status_code == 401, f"Expected 401, got {res.status_code}"

            # Test G: Authenticated GET /api/v1/users/me
            res = await client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {access_token}"})
            print(f"G. GET /api/v1/users/me -> status {res.status_code}")
            assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
            user_profile = res.json()
            print("   Returned Profile:", json.dumps(user_profile, indent=2))
            assert user_profile.get("email") == test_email
            assert user_profile.get("name") == "Swagger Test User"
            assert "hashed_password" not in user_profile, "CRITICAL: hashed_password was returned in user profile!"
            print("   Profile verified: hashed_password is NOT exposed.")

            # Test H: Authenticated PUT /api/v1/users/me
            res = await client.put(
                "/api/v1/users/me",
                headers={"Authorization": f"Bearer {access_token}"},
                json={"name": "Updated Swagger User"}
            )
            print(f"H. PUT /api/v1/users/me -> status {res.status_code}")
            assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
            assert res.json().get("name") == "Updated Swagger User"
            assert "hashed_password" not in res.json(), "CRITICAL: hashed_password exposed in PUT response!"
            print("   Profile updated successfully.")

            # Test I: Logout / Token Revocation
            res = await client.post("/api/v1/auth/logout", headers={"Authorization": f"Bearer {access_token}"})
            print(f"I. POST /api/v1/auth/logout -> status {res.status_code}")
            assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"

            # Test J: Reuse Revoked Token
            res = await client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {access_token}"})
            print(f"J. GET /api/v1/users/me (With Revoked Token) -> status {res.status_code}")
            assert res.status_code == 401, f"Expected 401, got {res.status_code}"
            print("   Revoked token successfully rejected with 401 Unauthorized.")

        print("\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!")
    finally:
        await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(run_tests())
