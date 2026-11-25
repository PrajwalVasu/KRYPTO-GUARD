import sys
import os
import json
import asyncio
import httpx

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.main import app
from backend.app.database import connect_to_mongo, close_mongo_connection, get_database

async def run_learning_tests():
    print("=== TESTING LEARNING & SCAM KNOWLEDGE BASE MODULE ===")
    await connect_to_mongo()

    try:
        db = get_database()

        # Test 12: Verify Database Seeding & No Duplicates on repeated seed
        cat_count = await db.scam_categories.count_documents({})
        tip_count = await db.daily_tips.count_documents({})
        jargon_count = await db.jargon_terms.count_documents({})
        print(f"Database counts after startup seeding:")
        print(f"  Categories in DB: {cat_count} (Expected: 8)")
        print(f"  Daily Tips in DB: {tip_count} (Expected: 7)")
        print(f"  Jargon Terms in DB: {jargon_count} (Expected: 6)")
        assert cat_count == 8, f"Expected 8 categories, got {cat_count}"
        assert tip_count == 7, f"Expected 7 tips, got {tip_count}"
        assert jargon_count == 6, f"Expected 6 jargon terms, got {jargon_count}"

        # Re-run seeder to verify idempotence
        from backend.app.services.learning_service import init_learning_indexes_and_seed
        await init_learning_indexes_and_seed()
        cat_count_2 = await db.scam_categories.count_documents({})
        tip_count_2 = await db.daily_tips.count_documents({})
        jargon_count_2 = await db.jargon_terms.count_documents({})
        assert cat_count_2 == 8, f"Repeated seed created duplicate categories: {cat_count_2}"
        assert tip_count_2 == 7, f"Repeated seed created duplicate tips: {tip_count_2}"
        assert jargon_count_2 == 6, f"Repeated seed created duplicate jargon: {jargon_count_2}"
        print("  -> Idempotent seeding verified: No duplicates on repeated runs.")

        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            # Test 10: Public endpoints work WITHOUT authentication
            # Test 1: All 8 existing scam categories are returned
            res = await client.get("/api/v1/learning/categories")
            print(f"\n1. GET /api/v1/learning/categories -> Status {res.status_code}")
            assert res.status_code == 200, f"Error: {res.text}"
            categories = res.json()
            assert len(categories) == 8, f"Expected 8 categories, got {len(categories)}"
            cat_ids = [c["id"] for c in categories]
            print(f"   Categories retrieved ({len(categories)}): {cat_ids}")
            expected_ids = [
                "banking-upi-fraud",
                "phishing-fake-links",
                "social-media-impersonation",
                "job-internship-fraud",
                "shopping-marketplace-fraud",
                "identity-theft-sim-swap",
                "investment-lottery-scams",
                "otp-remote-access-scams",
            ]
            for eid in expected_ids:
                assert eid in cat_ids, f"Missing category: {eid}"
            print("   -> All 8 expected categories verified.")

            # Test 4: Category audience filtering
            res_students = await client.get("/api/v1/learning/categories?audience=students")
            students_cats = res_students.json()
            # students should receive students (2) + all (4) = 6
            print(f"\n4a. GET /api/v1/learning/categories?audience=students -> {len(students_cats)} categories")
            assert len(students_cats) == 6, f"Expected 6 categories for students, got {len(students_cats)}"

            res_seniors = await client.get("/api/v1/learning/categories?audience=seniors")
            seniors_cats = res_seniors.json()
            # seniors should receive seniors (2) + all (4) = 6
            print(f"4b. GET /api/v1/learning/categories?audience=seniors -> {len(seniors_cats)} categories")
            assert len(seniors_cats) == 6, f"Expected 6 categories for seniors, got {len(seniors_cats)}"

            # Test 5: Category search
            res_search = await client.get("/api/v1/learning/categories?search=anydesk")
            search_results = res_search.json()
            print(f"\n5. GET /api/v1/learning/categories?search=anydesk -> {len(search_results)} result(s)")
            assert len(search_results) >= 1
            assert search_results[0]["id"] == "otp-remote-access-scams"
            print("   -> Search verified.")

            # Test 6: Category detail returns complete data
            res_detail = await client.get("/api/v1/learning/categories/banking-upi-fraud")
            print(f"\n6. GET /api/v1/learning/categories/banking-upi-fraud -> Status {res_detail.status_code}")
            assert res_detail.status_code == 200
            detail = res_detail.json()
            assert detail["id"] == "banking-upi-fraud"
            assert "howItHappens" in detail and len(detail["howItHappens"]) == 3
            assert "realLifeScenario" in detail
            assert "warningSigns" in detail and len(detail["warningSigns"]) > 0
            assert "shieldRules" in detail and len(detail["shieldRules"]) > 0
            assert "whatToDoIfAffected" in detail and len(detail["whatToDoIfAffected"]) > 0
            assert "commonKeywords" in detail and len(detail["commonKeywords"]) > 0
            print("   -> Complete detail verified (steps, realLifeScenario, warningSigns, shieldRules).")

            # Test 7: Invalid category ID returns 404
            res_invalid = await client.get("/api/v1/learning/categories/non-existent-scam-xyz")
            print(f"\n7. GET /api/v1/learning/categories/non-existent-scam-xyz -> Status {res_invalid.status_code}")
            assert res_invalid.status_code == 404, f"Expected 404, got {res_invalid.status_code}"
            print("   -> 404 response verified.")

            # Test 2: All 7 daily tips
            res_tips = await client.get("/api/v1/learning/tips")
            print(f"\n2. GET /api/v1/learning/tips -> Status {res_tips.status_code}")
            assert res_tips.status_code == 200
            tips = res_tips.json()
            print(f"   Tips retrieved: {len(tips)} (Expected: 7)")
            assert len(tips) == 7, f"Expected 7 tips, got {len(tips)}"

            # Test 8: Deterministic daily tip
            res_daily_1 = await client.get("/api/v1/learning/daily-tip")
            res_daily_2 = await client.get("/api/v1/learning/daily-tip")
            print(f"\n8. GET /api/v1/learning/daily-tip -> Status {res_daily_1.status_code}")
            assert res_daily_1.status_code == 200
            tip_1 = res_daily_1.json()
            tip_2 = res_daily_2.json()
            assert tip_1["id"] == tip_2["id"], "Daily tip is not deterministic for same date!"
            print(f"   Daily Tip for today: #{tip_1['id']} - {tip_1['category']}: \"{tip_1['tip']}\"")
            print("   -> Deterministic daily tip verified.")

            # Test 3 & 9: All 6 jargon terms and search
            res_jargon = await client.get("/api/v1/learning/jargon")
            print(f"\n3. GET /api/v1/learning/jargon -> Status {res_jargon.status_code}")
            assert res_jargon.status_code == 200
            jargon_list = res_jargon.json()
            print(f"   Jargon terms retrieved: {len(jargon_list)} (Expected: 6)")
            assert len(jargon_list) == 6, f"Expected 6 jargon terms, got {len(jargon_list)}"

            res_jargon_search = await client.get("/api/v1/learning/jargon?search=ओटीपी")
            print(f"9. GET /api/v1/learning/jargon?search=ओटीपी -> Status {res_jargon_search.status_code}")
            assert res_jargon_search.status_code == 200
            j_results = res_jargon_search.json()
            assert len(j_results) == 1
            assert "OTP" in j_results[0]["term"]
            print(f"   -> Jargon Hindi search verified: Found '{j_results[0]['term']}'")

            # Test 11: Verify existing authentication & user endpoints still work intact
            print("\n11. Verifying existing authentication & profile routes...")
            # Form login with existing test account or register new
            import uuid
            test_email = f"learn_test_{uuid.uuid4().hex[:6]}@kryptoguard.dev"
            reg_res = await client.post(
                "/api/v1/auth/register",
                json={
                    "name": "Learning Tester",
                    "email": test_email,
                    "password": "Password123!",
                    "audience": "students"
                }
            )
            assert reg_res.status_code == 200, f"Register failed: {reg_res.text}"
            token = reg_res.json()["access_token"]

            # Form login
            login_res = await client.post(
                "/api/v1/auth/login",
                data={"username": test_email, "password": "Password123!"}
            )
            assert login_res.status_code == 200, f"Login failed: {login_res.text}"

            # Profile get
            profile_res = await client.get(
                "/api/v1/users/me",
                headers={"Authorization": f"Bearer {token}"}
            )
            assert profile_res.status_code == 200, f"Profile retrieval failed: {profile_res.text}"
            assert profile_res.json()["email"] == test_email
            assert "hashed_password" not in profile_res.json()
            print("   -> Existing authentication and user profile routes confirmed intact and passing!")

        print("\n=== ALL 13 TEST CHECKLIST ITEMS PASSED SUCCESSFULLY! ===")
    finally:
        await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(run_learning_tests())
