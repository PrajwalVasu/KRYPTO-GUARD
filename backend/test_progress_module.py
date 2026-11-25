import sys
import os
import asyncio
import uuid
import httpx

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.main import app
from backend.app.database import connect_to_mongo, close_mongo_connection, get_database

async def run_progress_tests():
    print("=== TESTING USER PROGRESS & REFLEX SCORE MODULE ===")
    await connect_to_mongo()

    try:
        db = get_database()

        # Test 1: Verify database indexes for user_progress and quiz_attempts
        progress_indexes = await db.user_progress.index_information()
        print(f"1. user_progress indexes: {list(progress_indexes.keys())}")
        assert "user_id_1" in progress_indexes, "user_id_1 unique index missing from user_progress!"
        assert progress_indexes["user_id_1"].get("unique") is True, "user_id index is not unique!"

        quiz_attempt_indexes = await db.quiz_attempts.index_information()
        print(f"   quiz_attempts indexes: {list(quiz_attempt_indexes.keys())}")
        assert any("user_id" in k and "created_at" in k for k in quiz_attempt_indexes), "Compound index missing on quiz_attempts!"

        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            # Test 2: Anonymous access to progress endpoints returns 401
            res_anon_summary = await client.get("/api/v1/progress/summary")
            assert res_anon_summary.status_code == 401, f"Expected 401 for anon summary, got {res_anon_summary.status_code}"

            res_anon_complete = await client.post("/api/v1/progress/lessons/banking-upi-fraud/complete")
            assert res_anon_complete.status_code == 401, f"Expected 401 for anon lesson complete, got {res_anon_complete.status_code}"

            res_anon_uncomplete = await client.delete("/api/v1/progress/lessons/banking-upi-fraud/complete")
            assert res_anon_uncomplete.status_code == 401, f"Expected 401 for anon lesson delete, got {res_anon_uncomplete.status_code}"

            res_anon_history = await client.get("/api/v1/progress/history")
            assert res_anon_history.status_code == 401, f"Expected 401 for anon history, got {res_anon_history.status_code}"
            print("2. SUCCESS: All 4 progress endpoints reject anonymous access with 401 Unauthorized.")

            # Create User A
            email_a = f"progress_user_a_{uuid.uuid4().hex[:6]}@kryptoguard.dev"
            reg_a = await client.post("/api/v1/auth/register", json={
                "name": "User Alpha",
                "email": email_a,
                "password": "Password123!",
                "audience": "students"
            })
            assert reg_a.status_code == 200
            token_a = reg_a.json()["access_token"]
            headers_a = {"Authorization": f"Bearer {token_a}"}

            # Create User B (for user isolation test)
            email_b = f"progress_user_b_{uuid.uuid4().hex[:6]}@kryptoguard.dev"
            reg_b = await client.post("/api/v1/auth/register", json={
                "name": "User Beta",
                "email": email_b,
                "password": "Password123!",
                "audience": "seniors"
            })
            assert reg_b.status_code == 200
            token_b = reg_b.json()["access_token"]
            headers_b = {"Authorization": f"Bearer {token_b}"}

            # Test 3: New user with empty progress and zero quiz attempts
            res_empty_summary = await client.get("/api/v1/progress/summary", headers=headers_a)
            assert res_empty_summary.status_code == 200
            summary_empty = res_empty_summary.json()
            print(f"3. Empty progress summary for fresh user:")
            print(f"   Lessons: {summary_empty['lessons']['completed']}/{summary_empty['lessons']['total']} ({summary_empty['lessons']['completionPercentage']}%)")
            print(f"   Reflex Score: {summary_empty['reflexScore']['score']} (Calibrated: {summary_empty['reflexScore']['isCalibrated']})")
            assert summary_empty["lessons"]["completed"] == 0
            assert summary_empty["lessons"]["total"] == 8
            assert summary_empty["lessons"]["completionPercentage"] == 0.0
            assert summary_empty["quizzes"]["totalAttempts"] == 0
            assert summary_empty["quizzes"]["latestScore"] is None
            assert summary_empty["reflexScore"]["score"] == 0
            assert summary_empty["reflexScore"]["isCalibrated"] is False
            assert "provisional" in summary_empty["reflexScore"]["explanation"].lower()

            # Test 4: Marking invalid category returns 404
            res_bad_cat = await client.post("/api/v1/progress/lessons/invalid-non-existent-cat/complete", headers=headers_a)
            print(f"4. Invalid category completion -> Status {res_bad_cat.status_code}")
            assert res_bad_cat.status_code == 404

            # Test 5: Valid lesson completion
            res_comp1 = await client.post("/api/v1/progress/lessons/banking-upi-fraud/complete", headers=headers_a)
            assert res_comp1.status_code == 200
            comp1_data = res_comp1.json()
            print(f"5. Lesson 1 completed: {comp1_data['categoryId']} -> {comp1_data['completedLessonsCount']}/{comp1_data['totalLessonsCount']} ({comp1_data['completionPercentage']}%)")
            assert comp1_data["isCompleted"] is True
            assert comp1_data["completedLessonsCount"] == 1
            assert comp1_data["completionPercentage"] == 12.5
            assert comp1_data["completedAt"] is not None

            # Test 6: Repeated lesson completion is strictly idempotent (no duplicates)
            res_repeat = await client.post("/api/v1/progress/lessons/banking-upi-fraud/complete", headers=headers_a)
            assert res_repeat.status_code == 200
            repeat_data = res_repeat.json()
            print(f"6. Repeated completion count: {repeat_data['completedLessonsCount']} (Expected: 1)")
            assert repeat_data["completedLessonsCount"] == 1
            assert repeat_data["completionPercentage"] == 12.5

            # Complete a second lesson
            res_comp2 = await client.post("/api/v1/progress/lessons/phishing-fake-links/complete", headers=headers_a)
            assert res_comp2.status_code == 200
            assert res_comp2.json()["completedLessonsCount"] == 2
            assert res_comp2.json()["completionPercentage"] == 25.0

            # Test 7: Reflex Score with 2 lessons and 0 quiz attempts (provisional capped at 40)
            # L = (2 / 8) * 100 = 25.0%. Provisional = round(0.40 * 25.0) = 10
            res_prov_summary = await client.get("/api/v1/progress/summary", headers=headers_a)
            assert res_prov_summary.status_code == 200
            prov_summary = res_prov_summary.json()
            print(f"7. Provisional Reflex Score (2 lessons, 0 quizzes): {prov_summary['reflexScore']['score']}/40 (Expected: 10)")
            assert prov_summary["reflexScore"]["score"] == 10
            assert prov_summary["reflexScore"]["isCalibrated"] is False
            assert prov_summary["reflexScore"]["lessonComponent"] == 25.0
            assert prov_summary["reflexScore"]["quizComponent"] is None

            # Test 8: Lesson unmarking
            res_unmark = await client.delete("/api/v1/progress/lessons/phishing-fake-links/complete", headers=headers_a)
            assert res_unmark.status_code == 200
            unmark_data = res_unmark.json()
            print(f"8. Lesson unmarked: isCompleted={unmark_data['isCompleted']}, remaining count={unmark_data['completedLessonsCount']}")
            assert unmark_data["isCompleted"] is False
            assert unmark_data["completedLessonsCount"] == 1
            assert unmark_data["completionPercentage"] == 12.5

            # Re-complete phishing lesson for scoring tests
            await client.post("/api/v1/progress/lessons/phishing-fake-links/complete", headers=headers_a)

            # Test 9: Authenticated Quiz Submissions and Score Tracking
            # Quiz Attempt 1: 8 correct, 2 wrong.
            # Q1 (banking): B (correct)
            # Q2 (seniors pension): C (correct)
            # Q3 (students job): B (correct)
            # Q4 (shopping): B (correct)
            # Q5 (gaming): B (correct)
            # Q6 (lottery): A (correct)
            # Q7 (sim-swap): A (wrong - correct is B) -> generates weak category for identity-theft-sim-swap!
            # Q8 (remote access): B (correct)
            # Q9 (digital arrest): A (correct)
            # Q10 (malware): A (wrong - correct is C) -> generates weak category for phishing-fake-links!
            attempt1_answers = [
                {"questionId": 1, "selectedOptionId": "B"},
                {"questionId": 2, "selectedOptionId": "C"},
                {"questionId": 3, "selectedOptionId": "B"},
                {"questionId": 4, "selectedOptionId": "B"},
                {"questionId": 5, "selectedOptionId": "B"},
                {"questionId": 6, "selectedOptionId": "A"},
                {"questionId": 7, "selectedOptionId": "A"}, # Incorrect (Correct is B, cat: identity-theft-sim-swap)
                {"questionId": 8, "selectedOptionId": "B"},
                {"questionId": 9, "selectedOptionId": "A"},
                {"questionId": 10, "selectedOptionId": "A"}, # Incorrect (Correct is C, cat: phishing-fake-links)
            ]
            res_q1 = await client.post("/api/v1/quizzes/submit", headers=headers_a, json={"answers": attempt1_answers})
            assert res_q1.status_code == 200
            assert res_q1.json()["score"] == 8
            assert res_q1.json()["percentage"] == 80.0

            # Quiz Attempt 2: 10/10 (100%)
            attempt2_answers = [
                {"questionId": 1, "selectedOptionId": "B"},
                {"questionId": 2, "selectedOptionId": "C"},
                {"questionId": 3, "selectedOptionId": "B"},
                {"questionId": 4, "selectedOptionId": "B"},
                {"questionId": 5, "selectedOptionId": "B"},
                {"questionId": 6, "selectedOptionId": "A"},
                {"questionId": 7, "selectedOptionId": "B"},
                {"questionId": 8, "selectedOptionId": "B"},
                {"questionId": 9, "selectedOptionId": "A"},
                {"questionId": 10, "selectedOptionId": "C"},
            ]
            res_q2 = await client.post("/api/v1/quizzes/submit", headers=headers_a, json={"answers": attempt2_answers})
            assert res_q2.status_code == 200
            assert res_q2.json()["score"] == 10
            assert res_q2.json()["percentage"] == 100.0

            # Test 10: Quiz history endpoint
            res_hist = await client.get("/api/v1/progress/history", headers=headers_a)
            assert res_hist.status_code == 200
            hist_data = res_hist.json()
            print(f"10. Quiz History: {hist_data['total']} attempts recorded.")
            assert hist_data["total"] == 2
            # Check sorting: attempt 2 (100%) should be first
            assert hist_data["attempts"][0]["percentage"] == 100.0
            assert hist_data["attempts"][1]["percentage"] == 80.0

            # Test 11: Reflex Score Calculation with Calibrated Quiz Performance
            # State:
            # Lessons: 2 completed (banking-upi-fraud, phishing-fake-links) out of 8 -> L = 25.0%
            # Quizzes: Attempt 1 = 80.0%, Attempt 2 = 100.0%
            # Latest = 100.0%, Average = (80.0 + 100.0) / 2 = 90.0%
            # Q = 0.60 * 100.0 + 0.40 * 90.0 = 60.0 + 36.0 = 96.0%
            # R = round(0.40 * L + 0.60 * Q) = round(0.40 * 25.0 + 0.60 * 96.0) = round(10.0 + 57.6) = round(67.6) = 68
            res_cal_summary = await client.get("/api/v1/progress/summary", headers=headers_a)
            assert res_cal_summary.status_code == 200
            cal_summary = res_cal_summary.json()
            print(f"11. Calibrated Reflex Score: {cal_summary['reflexScore']['score']} (Expected: 68)")
            assert cal_summary["reflexScore"]["isCalibrated"] is True
            assert cal_summary["reflexScore"]["lessonComponent"] == 25.0
            assert cal_summary["reflexScore"]["quizComponent"] == 96.0
            assert cal_summary["reflexScore"]["score"] == 68
            assert cal_summary["reflexScore"]["rankTitle"] == "Vigilant Defender ⚔️"
            assert cal_summary["quizzes"]["totalAttempts"] == 2
            assert cal_summary["quizzes"]["latestScore"]["percentage"] == 100.0
            assert cal_summary["quizzes"]["highestPercentage"] == 100.0
            assert cal_summary["quizzes"]["averagePercentage"] == 90.0

            # Test 12: Weak Category Analysis
            # User A had 1 wrong on identity-theft-sim-swap and 1 wrong on phishing-fake-links in attempt 1
            weak_cats = cal_summary["weakCategories"]
            print(f"12. Weak categories identified: {[w['categoryId'] for w in weak_cats]}")
            weak_ids = [w["categoryId"] for w in weak_cats]
            assert "identity-theft-sim-swap" in weak_ids
            assert "phishing-fake-links" in weak_ids

            # Test 13: Learning Recommendations Generation
            # identity-theft-sim-swap is weak and uncompleted -> High priority
            # phishing-fake-links is weak but completed -> Medium priority review
            recs = cal_summary["recommendations"]
            print(f"13. Generated {len(recs)} personalized recommendations:")
            for r in recs[:3]:
                print(f"    [{r['priority'].upper()}] {r['title']}: {r['reason']}")

            high_rec = next((r for r in recs if r["categoryId"] == "identity-theft-sim-swap"), None)
            assert high_rec is not None, "Missing high-priority recommendation for uncompleted weak category!"
            assert high_rec["priority"] == "high"

            med_rec = next((r for r in recs if r["categoryId"] == "phishing-fake-links"), None)
            assert med_rec is not None, "Missing medium-priority recommendation for completed weak category!"
            assert med_rec["priority"] == "medium"

            # Test 14: Strict User Isolation (User B cannot see User A's progress or history)
            res_b_summary = await client.get("/api/v1/progress/summary", headers=headers_b)
            assert res_b_summary.status_code == 200
            b_summary = res_b_summary.json()
            assert b_summary["userId"] != cal_summary["userId"]
            assert b_summary["lessons"]["completed"] == 0
            assert b_summary["quizzes"]["totalAttempts"] == 0
            assert b_summary["reflexScore"]["score"] == 0

            res_b_history = await client.get("/api/v1/progress/history", headers=headers_b)
            assert res_b_history.status_code == 200
            assert res_b_history.json()["total"] == 0, "User B saw User A's quiz history!"
            print("14. SUCCESS: Strict multi-tenant isolation verified between User A and User B.")

        print("\n=== ALL 14 USER PROGRESS MODULE TESTS PASSED WITH 100% SUCCESS! ===")
    finally:
        await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(run_progress_tests())
