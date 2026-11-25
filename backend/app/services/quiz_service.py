from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from ..database import get_database
from ..data.quiz_data import QUIZ_QUESTIONS
from ..schemas.quiz import (
    QuizOptionPublic,
    QuizQuestionPublic,
    CheckAnswerResponse,
    UserAnswerItem,
    QuestionResultFeedback,
    QuizSubmitResponse,
)
from ..schemas.user import UserInDB


async def init_quiz_indexes_and_seed():
    """Ensure indexes and perform idempotent seeding of quiz questions."""
    db = get_database()

    # 1. Create indexes
    await db.quiz_questions.create_index("id", unique=True)
    await db.quiz_questions.create_index("audience")
    await db.quiz_questions.create_index("categoryId")
    await db.quiz_attempts.create_index("user_id")
    await db.quiz_attempts.create_index("created_at")

    # 2. Idempotent upsert of questions
    for q in QUIZ_QUESTIONS:
        data = dict(q)
        data.pop("_id", None)
        await db.quiz_questions.update_one(
            {"id": q["id"]},
            {"$set": data},
            upsert=True
        )


def _strip_correct_answers(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Strip isCorrect from question options before sending to public clients."""
    clean = dict(doc)
    clean.pop("_id", None)
    clean_options = []
    for opt in clean.get("options", []):
        clean_options.append({
            "id": opt["id"],
            "text": opt["text"]
        })
    clean["options"] = clean_options
    return clean


async def get_questions(audience: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve quiz questions with answers stripped, filtered by audience."""
    db = get_database()
    query: Dict[str, Any] = {}
    if audience and audience != "all":
        query["$or"] = [{"audience": audience}, {"audience": "all"}]

    cursor = db.quiz_questions.find(query).sort("id", 1)
    questions = []
    if hasattr(cursor, "__aiter__"):
        async for doc in cursor:
            questions.append(_strip_correct_answers(doc))
    else:
        docs = await cursor.to_list(length=100)
        for doc in docs:
            questions.append(_strip_correct_answers(doc))
    return questions


async def get_questions_by_category(category_id: str) -> List[Dict[str, Any]]:
    """Retrieve quiz questions linked to a specific category. Returns 404 if category is unknown."""
    db = get_database()
    # 1. Verify category exists in learning categories
    category = await db.scam_categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{category_id}' not found"
        )

    cursor = db.quiz_questions.find({"categoryId": category_id}).sort("id", 1)
    questions = []
    if hasattr(cursor, "__aiter__"):
        async for doc in cursor:
            questions.append(_strip_correct_answers(doc))
    else:
        docs = await cursor.to_list(length=100)
        for doc in docs:
            questions.append(_strip_correct_answers(doc))
    return questions


async def check_single_answer(question_id: int, selected_option_id: str) -> CheckAnswerResponse:
    """Validate a single question answer and return immediate educational feedback."""
    db = get_database()
    q = await db.quiz_questions.find_one({"id": question_id})
    if not q:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question with ID {question_id} not found"
        )

    valid_options = {opt["id"]: opt for opt in q.get("options", [])}
    if selected_option_id not in valid_options:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid option ID '{selected_option_id}'. Valid options: {list(valid_options.keys())}"
        )

    chosen = valid_options[selected_option_id]
    correct_opt = next((opt for opt in q.get("options", []) if opt.get("isCorrect")), None)
    correct_id = correct_opt["id"] if correct_opt else ""

    return CheckAnswerResponse(
        questionId=question_id,
        selectedOptionId=selected_option_id,
        isCorrect=bool(chosen.get("isCorrect", False)),
        correctOptionId=correct_id,
        explanation=q.get("explanation", ""),
        safetyRule=q.get("safetyRule", "")
    )


def calculate_rank(score: int, total: int) -> tuple[str, str]:
    """Calculate title and description matching the exact frontend thresholds."""
    if total == 0:
        return ("Security Apprentice 🌱", "Take time to study the 8 fraud categories to shield yourself.")
    percentage = (score / total) * 100.0
    if percentage >= 80.0:
        return (
            "Cyber Shield Master 🛡️",
            "Outstanding! You can reliably detect advanced deceptive scams."
        )
    if percentage >= 50.0:
        return (
            "Vigilant Defender ⚔️",
            "Good awareness! A few tricky scenarios need revision."
        )
    return (
        "Security Apprentice 🌱",
        "Take time to study the 8 fraud categories to shield yourself."
    )


async def submit_quiz(
    answers: List[UserAnswerItem],
    current_user: Optional[UserInDB] = None
) -> QuizSubmitResponse:
    """Calculate the official score on the backend and record attempt if authenticated."""
    if not answers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No answers provided"
        )

    # Validate duplicate question IDs
    seen_question_ids = set()
    for item in answers:
        if item.questionId in seen_question_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Duplicate questionId {item.questionId} found in submission. Each question may only be answered once per attempt."
            )
        seen_question_ids.add(item.questionId)

    db = get_database()
    results: List[QuestionResultFeedback] = []
    score = 0
    total = len(answers)

    for item in answers:
        q = await db.quiz_questions.find_one({"id": item.questionId})
        if not q:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Question with ID {item.questionId} not found"
            )

        valid_options = {opt["id"]: opt for opt in q.get("options", [])}
        if item.selectedOptionId not in valid_options:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid option ID '{item.selectedOptionId}' for question {item.questionId}"
            )

        chosen = valid_options[item.selectedOptionId]
        correct_opt = next((opt for opt in q.get("options", []) if opt.get("isCorrect")), None)
        correct_id = correct_opt["id"] if correct_opt else ""
        is_correct = bool(chosen.get("isCorrect", False))
        if is_correct:
            score += 1

        results.append(QuestionResultFeedback(
            questionId=item.questionId,
            selectedOptionId=item.selectedOptionId,
            isCorrect=is_correct,
            correctOptionId=correct_id,
            explanation=q.get("explanation", ""),
            safetyRule=q.get("safetyRule", "")
        ))

    percentage = round((score / total) * 100.0, 1)
    rank_title, rank_desc = calculate_rank(score, total)

    # If user is authenticated, save attempt to MongoDB
    if current_user:
        attempt_doc = {
            "user_id": current_user.id,
            "score": score,
            "total": total,
            "percentage": percentage,
            "rankTitle": rank_title,
            "answers": [ans.model_dump() for ans in answers],
            "created_at": datetime.utcnow()
        }
        await db.quiz_attempts.insert_one(attempt_doc)

    return QuizSubmitResponse(
        score=score,
        total=total,
        percentage=percentage,
        rankTitle=rank_title,
        rankDescription=rank_desc,
        results=results
    )
