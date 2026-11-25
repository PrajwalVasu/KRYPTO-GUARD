import sys
sys.path.append('C:/Users/Monee/OneDrive/Desktop/comproj')
import asyncio, json, os
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database import get_database

# Ensure a clean test DB (drop collections)
async def clean_db():
    db = get_database()
    await db.users.delete_many({})
    await db.revoked_tokens.delete_many({})

asyncio.run(clean_db())

client = TestClient(app)

def register(name, email, password, audience):
    return client.post("/api/v1/auth/register", json={"name": name, "email": email, "password": password, "audience": audience})

def login(email, password):
    return client.post("/api/v1/auth/login", json={"email": email, "password": password})

def get_profile(token):
    return client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})

def update_profile(token, data):
    return client.put("/api/v1/users/me", json=data, headers={"Authorization": f"Bearer {token}"})

def logout(token):
    return client.post("/api/v1/auth/logout", headers={"Authorization": f"Bearer {token}"})

results = []
# A. Register student
resp = register("Student One", "student1@example.com", "Password123!", "students")
results.append({"case": "A_register_student", "status": resp.status_code, "json": resp.json()})
student_token = resp.json().get("access_token")

# B. Register senior
resp = register("Senior One", "senior1@example.com", "Password123!", "seniors")
results.append({"case": "B_register_senior", "status": resp.status_code, "json": resp.json()})
senior_token = resp.json().get("access_token")

# C. Register general
resp = register("General User", "general@example.com", "Password123!", "all")
results.append({"case": "C_register_general", "status": resp.status_code, "json": resp.json()})
general_token = resp.json().get("access_token")

# D. Duplicate registration (student email again)
resp = register("Dup Student", "student1@example.com", "Password123!", "students")
results.append({"case": "D_duplicate", "status": resp.status_code, "json": resp.json()})

# E. Login correct credentials (student)
resp = login("student1@example.com", "Password123!")
results.append({"case": "E_login_success", "status": resp.status_code, "json": resp.json()})
login_token = resp.json().get("access_token")

# F. Login incorrect password
resp = login("student1@example.com", "WrongPass")
results.append({"case": "F_login_wrong", "status": resp.status_code, "json": resp.json()})

# G. Retrieve profile with JWT (student)
resp = get_profile(student_token)
results.append({"case": "G_get_profile", "status": resp.status_code, "json": resp.json()})

# H. Update profile (change name)
resp = update_profile(student_token, {"name": "Student Updated"})
results.append({"case": "H_update_profile", "status": resp.status_code, "json": resp.json()})

# I. Logout (student)
resp = logout(student_token)
results.append({"case": "I_logout", "status": resp.status_code, "json": resp.json()})

# J. Attempt to reuse revoked token
resp = get_profile(student_token)
results.append({"case": "J_revoked_token", "status": resp.status_code, "json": resp.json()})

print(json.dumps(results, indent=2))
