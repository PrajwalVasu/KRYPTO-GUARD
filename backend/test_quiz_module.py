import sys
import os
import asyncio
import uuid
import httpx

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.main import app
from backend.app.database import connect_to_mongo, close_mongo_connection, get_database

async def run_quiz_tests():
    print("=== TESTING QUIZ MODULE ===")
    await connect_to_mongo()

    try:
        db = get_database()

        # Test 1: Verify all 10 original questions are seeded
        q_count = await db.quiz_questions.count_documents({})
        print(f"1. Seeded quiz questions count: {q_count} (Expected: 10)")
        assert q_count == 10, f"Expected 10 questions, got {q_count}"

        # Test 16: Repeated seeding does not create duplicates
        from backend.app.services.quiz_service import init_quiz_indexes_and_seed
        await init_quiz_indexes_and_seed()
        q_count_repeat = await db.quiz_questions.count_documents({})
        print(f"16. After repeated seed run: {q_count_repeat} (Expected: 10)")
        assert q_count_repeat == 10, "Repeated seeding created duplicate questions!"

        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            # Test 4: All audience returns all 10 questions
            res_all = await client.get("/api/v1/quizzes/questions")
            assert res_all.status_code == 200, f"Failed: {res_all.text}"
            all_questions = res_all.json()
            print(f"4. GET /api/v1/quizzes/questions (all) -> {len(all_questions)} questions (Expected: 10)")
            assert len(all_questions) == 10, f"Expected 10, got {len(all_questions)}"

            # Test 5: Public question endpoints never expose isCorrect
            for q in all_questions:
                for opt in q["options"]:
                    assert "isCorrect" not in opt, f"SECURITY ERROR: isCorrect exposed in question {q['id']}, option {opt['id']}"
            print("5. SUCCESS: Verified that 'isCorrect' is NEVER exposed in question options.")

            # Test 2: Student audience returns correct 6 questions (IDs 1, 3, 5, 7, 8, 10)
            res_students = await client.get("/api/v1/quizzes/questions?audience=students")
            assert res_students.status_code == 200
            student_questions = res_students.json()
            student_ids = [q["id"] for q in student_questions]
            print(f"2. GET /api/v1/quizzes/questions?audience=students -> {len(student_questions)} questions: {student_ids}")
            assert len(student_questions) == 6, f"Expected 6 for students, got {len(student_questions)}"
            assert set(student_ids) == {1, 3, 5, 7, 8, 10}, f"Unexpected student question IDs: {student_ids}"

            # Test 3: Senior audience returns correct 6 questions (IDs 1, 2, 4, 6, 8, 9)
            res_seniors = await client.get("/api/v1/quizzes/questions?audience=seniors")
            assert res_seniors.status_code == 200
            senior_questions = res_seniors.json()
            senior_ids = [q["id"] for q in senior_questions]
            print(f"3. GET /api/v1/quizzes/questions?audience=seniors -> {len(senior_questions)} questions: {senior_ids}")
            assert len(senior_questions) == 6, f"Expected 6 for seniors, got {len(senior_questions)}"
            assert set(senior_ids) == {1, 2, 4, 6, 8, 9}, f"Unexpected senior question IDs: {senior_ids}"

            # Test 6: Category filtering returns correct questions
            res_cat = await client.get("/api/v1/quizzes/categories/banking-upi-fraud/questions")
            assert res_cat.status_code == 200
            cat_questions = res_cat.json()
            print(f"6. GET /api/v1/quizzes/categories/banking-upi-fraud/questions -> {len(cat_questions)} questions")
            assert len(cat_questions) >= 1
            for q in cat_questions:
                assert q["categoryId"] == "banking-upi-fraud"
                for opt in q["options"]:
                    assert "isCorrect" not in opt

            # Test 7: Invalid category returns 404
            res_invalid_cat = await client.get("/api/v1/quizzes/categories/non-existent-cat/questions")
            print(f"7. GET /api/v1/quizzes/categories/non-existent-cat/questions -> Status {res_invalid_cat.status_code}")
            assert res_invalid_cat.status_code == 404, f"Expected 404, got {res_invalid_cat.status_code}"

            # Test 8: Correct answer validation works
            res_check_correct = await client.post(
                "/api/v1/quizzes/check-answer",
                json={"questionId": 1, "selectedOptionId": "B"}
            )
            assert res_check_correct.status_code == 200
            ans_data = res_check_correct.json()
            print(f"8. POST /api/v1/quizzes/check-answer (Q1 option B): isCorrect={ans_data['isCorrect']}")
            assert ans_data["isCorrect"] is True
            assert ans_data["correctOptionId"] == "B"
            assert "explanation" in ans_data and len(ans_data["explanation"]) > 0
            assert "safetyRule" in ans_data and len(ans_data["safetyRule"]) > 0

            # Test 9: Incorrect answer validation works
            res_check_incorrect = await client.post(
                "/api/v1/quizzes/check-answer",
                json={"questionId": 1, "selectedOptionId": "A"}
            )
            assert res_check_incorrect.status_code == 200
            ans_incorrect = res_check_incorrect.json()
            print(f"9. POST /api/v1/quizzes/check-answer (Q1 option A): isCorrect={ans_incorrect['isCorrect']}")
            assert ans_incorrect["isCorrect"] is False
            assert ans_incorrect["correctOptionId"] == "B"

            # Test 10: Invalid option IDs are rejected
            res_invalid_opt = await client.post(
                "/api/v1/quizzes/check-answer",
                json={"questionId": 1, "selectedOptionId": "Z"}
            )
            print(f"10. POST /api/v1/quizzes/check-answer with option 'Z' -> Status {res_invalid_opt.status_code}")
            assert res_invalid_opt.status_code == 400

            # Test 11 & 12: Full quiz scoring and rank thresholds
            # Submit answers for all 10 questions: 9 correct, 1 wrong (90% -> Cyber Shield Master)
            # Question correct answers from quizData:
            # Q1: B, Q2: C, Q3: B, Q4: B, Q5: B, Q6: A, Q7: B, Q8: B, Q9: A, Q10: C
            submission_answers = [
                {"questionId": 1, "selectedOptionId": "B"}, # Correct
                {"questionId": 2, "selectedOptionId": "C"}, # Correct
                {"questionId": 3, "selectedOptionId": "B"}, # Correct
                {"questionId": 4, "selectedOptionId": "B"}, # Correct
                {"questionId": 5, "selectedOptionId": "B"}, # Correct
                {"questionId": 6, "selectedOptionId": "A"}, # Correct
                {"questionId": 7, "selectedOptionId": "B"}, # Correct
                {"questionId": 8, "selectedOptionId": "B"}, # Correct
                {"questionId": 9, "selectedOptionId": "A"}, # Correct
                {"questionId": 10, "selectedOptionId": "A"}, # Incorrect (Correct is C)
            ]

            # Test 13: Anonymous submission works without storing user-linked attempts
            attempts_before = await db.quiz_attempts.count_documents({})
            res_submit_anon = await client.post(
                "/api/v1/quizzes/submit",
                json={"answers": submission_answers}
            )
            assert res_submit_anon.status_code == 200
            result_anon = res_submit_anon.json()
            print(f"11. POST /api/v1/quizzes/submit (Anonymous): Score={result_anon['score']}/10 ({result_anon['percentage']}%)")
            assert result_anon["score"] == 9
            assert result_anon["total"] == 10
            assert result_anon["percentage"] == 90.0
            print(f"12. Rank: '{result_anon['rankTitle']}' - '{result_anon['rankDescription']}'")
            assert result_anon["rankTitle"] == "Cyber Shield Master 🛡️"
            assert "Outstanding" in result_anon["rankDescription"]
            assert len(result_anon["results"]) == 10

            attempts_after_anon = await db.quiz_attempts.count_documents({})
            assert attempts_after_anon == attempts_before, "Anonymous submission incorrectly saved attempt in database!"
            print("13. SUCCESS: Anonymous submission did not store user-linked attempt in DB.")

            # Test 14: Authenticated submission is associated with actual logged-in user
            # Create a test user and obtain JWT token
            test_email = f"quiz_user_{uuid.uuid4().hex[:6]}@kryptoguard.dev"
            reg_res = await client.post(
                "/api/v1/auth/register",
                json={
                    "name": "Quiz Master User",
                    "email": test_email,
                    "password": "Password123!",
                    "audience": "students"
                }
            )
            assert reg_res.status_code == 200
            auth_token = reg_res.json()["access_token"]

            # Submit quiz with Authorization header
            res_submit_auth = await client.post(
                "/api/v1/quizzes/submit",
                headers={"Authorization": f"Bearer {auth_token}"},
                json={"answers": submission_answers}
            )
            assert res_submit_auth.status_code == 200
            result_auth = res_submit_auth.json()
            assert result_auth["score"] == 9

            # Check that attempt was saved in database associated with this user
            user_in_db = await db.users.find_one({"email": test_email})
            user_id = str(user_in_db["_id"])
            saved_attempt = await db.quiz_attempts.find_one({"user_id": user_id})
            assert saved_attempt is not None, "Authenticated attempt was NOT saved in database!"
            assert saved_attempt["score"] == 9
            assert saved_attempt["total"] == 10
            print(f"14. SUCCESS: Authenticated attempt saved with user_id={user_id}, score={saved_attempt['score']}/10.")

            # Test 15: Invalid JWT is rejected with 401
            res_submit_bad_jwt = await client.post(
                "/api/v1/quizzes/submit",
                headers={"Authorization": "Bearer bad.token.here"},
                json={"answers": submission_answers}
            )
            print(f"15. POST /api/v1/quizzes/submit with bad JWT -> Status {res_submit_bad_jwt.status_code}")
            assert res_submit_bad_jwt.status_code == 401, f"Expected 401, got {res_submit_bad_jwt.status_code}"

            # Test 19: Duplicate question IDs are rejected with 400 Bad Request
            duplicate_answers = [
                {"questionId": 1, "selectedOptionId": "B"},
                {"questionId": 2, "selectedOptionId": "C"},
                {"questionId": 1, "selectedOptionId": "A"},  # Duplicate question 1
            ]
            user_attempts_count_before = await db.quiz_attempts.count_documents({"user_id": user_id})
            res_duplicate = await client.post(
                "/api/v1/quizzes/submit",
                headers={"Authorization": f"Bearer {auth_token}"},
                json={"answers": duplicate_answers}
            )
            print(f"19. POST /api/v1/quizzes/submit with duplicate questionId -> Status {res_duplicate.status_code}")
            assert res_duplicate.status_code == 400, f"Expected 400, got {res_duplicate.status_code}"
            assert "Duplicate questionId 1" in res_duplicate.json().get("detail", "")

            # Test 20: Rejected duplicate submission does NOT create a quiz attempt in DB
            user_attempts_count_after = await db.quiz_attempts.count_documents({"user_id": user_id})
            assert user_attempts_count_after == user_attempts_count_before, "Duplicate submission created an attempt record in database!"
            print(f"20. SUCCESS: Rejected duplicate submission did not create any quiz attempt (count remained {user_attempts_count_after}).")

            # Test 21: Subsequent normal submission with unique question IDs continues to succeed
            normal_valid_answers = [
                {"questionId": 1, "selectedOptionId": "B"},
                {"questionId": 2, "selectedOptionId": "C"},
            ]
            res_subsequent_valid = await client.post(
                "/api/v1/quizzes/submit",
                headers={"Authorization": f"Bearer {auth_token}"},
                json={"answers": normal_valid_answers}
            )
            assert res_subsequent_valid.status_code == 200
            assert res_subsequent_valid.json()["total"] == 2
            print("21. SUCCESS: Normal submission with unique question IDs succeeds.")

            # Test 17: Existing authentication routes still pass
            res_me = await client.get(
                "/api/v1/users/me",
                headers={"Authorization": f"Bearer {auth_token}"}
            )
            assert res_me.status_code == 200
            assert res_me.json()["email"] == test_email
            print("17. Existing authentication and profile routes intact and passing.")

            # Test 18: Existing learning routes still pass
            res_learn = await client.get("/api/v1/learning/categories")
            assert res_learn.status_code == 200
            assert len(res_learn.json()) == 8
            res_tip = await client.get("/api/v1/learning/daily-tip")
            assert res_tip.status_code == 200
            print("18. Existing learning categories and daily-tip routes intact and passing.")

        print("\n=== ALL 21 QUIZ MODULE TESTS PASSED WITH 100% SUCCESS! ===")
    finally:
        await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(run_quiz_tests())
