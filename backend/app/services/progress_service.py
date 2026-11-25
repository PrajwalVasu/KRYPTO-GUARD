from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from ..database import get_database
from ..schemas.progress import (
    LessonCompletionResponse,
    ReflexScoreDetail,
    LessonProgressSummary,
    LatestQuizScore,
    QuizProgressSummary,
    WeakCategoryItem,
    LearningRecommendation,
    ProgressSummaryResponse,
    QuizAttemptHistoryItem,
    QuizAttemptHistoryResponse,
)
from ..schemas.user import UserInDB


async def init_progress_indexes():
    """Ensure indexes for the user_progress collection and quiz_attempts compound query."""
    db = get_database()
    await db.user_progress.create_index("user_id", unique=True)
    await db.quiz_attempts.create_index([("user_id", 1), ("created_at", -1)])


def _calculate_rank(score: int) -> str:
    """Return rank title matching the application thresholds."""
    if score >= 80:
        return "Cyber Shield Master 🛡️"
    if score >= 50:
        return "Vigilant Defender ⚔️"
    return "Security Apprentice 🌱"


async def mark_lesson_completed(user_id: str, category_id: str) -> LessonCompletionResponse:
    """Idempotently mark a lesson as completed for an authenticated user."""
    db = get_database()

    # 1. Validate category existence
    category = await db.scam_categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{category_id}' not found"
        )

    now = datetime.utcnow()
    progress = await db.user_progress.find_one({"user_id": user_id})
    completed_ids = progress.get("completed_category_ids", []) if progress else []
    lesson_timestamps = progress.get("lesson_completed_at", {}) if progress else {}

    # If not already completed, record completion timestamp and add to set
    if category_id not in completed_ids:
        await db.user_progress.update_one(
            {"user_id": user_id},
            {
                "$addToSet": {"completed_category_ids": category_id},
                "$set": {
                    f"lesson_completed_at.{category_id}": now,
                    "updated_at": now
                },
                "$setOnInsert": {"created_at": now}
            },
            upsert=True
        )
        completed_ids = list(set(completed_ids + [category_id]))
        completed_at = now
    else:
        # Idempotent call: keep original timestamp
        completed_at = lesson_timestamps.get(category_id, now)

    total_lessons = await db.scam_categories.count_documents({})
    completion_pct = round((len(completed_ids) / total_lessons) * 100.0, 1) if total_lessons > 0 else 0.0

    return LessonCompletionResponse(
        categoryId=category_id,
        isCompleted=True,
        completedAt=completed_at,
        completedLessonsCount=len(completed_ids),
        totalLessonsCount=total_lessons,
        completionPercentage=completion_pct
    )


async def unmark_lesson_completed(user_id: str, category_id: str) -> LessonCompletionResponse:
    """Remove a lesson from completed lessons for an authenticated user."""
    db = get_database()

    # 1. Validate category existence
    category = await db.scam_categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{category_id}' not found"
        )

    now = datetime.utcnow()
    await db.user_progress.update_one(
        {"user_id": user_id},
        {
            "$pull": {"completed_category_ids": category_id},
            "$unset": {f"lesson_completed_at.{category_id}": ""},
            "$set": {"updated_at": now}
        }
    )

    progress = await db.user_progress.find_one({"user_id": user_id})
    completed_ids = progress.get("completed_category_ids", []) if progress else []
    total_lessons = await db.scam_categories.count_documents({})
    completion_pct = round((len(completed_ids) / total_lessons) * 100.0, 1) if total_lessons > 0 else 0.0

    return LessonCompletionResponse(
        categoryId=category_id,
        isCompleted=False,
        completedAt=None,
        completedLessonsCount=len(completed_ids),
        totalLessonsCount=total_lessons,
        completionPercentage=completion_pct
    )


async def get_quiz_history(
    user_id: str,
    limit: int = 10,
    skip: int = 0
) -> QuizAttemptHistoryResponse:
    """Retrieve chronological quiz attempt history for the authenticated user."""
    db = get_database()
    total = await db.quiz_attempts.count_documents({"user_id": user_id})

    cursor = db.quiz_attempts.find({"user_id": user_id}).sort("created_at", -1).skip(skip).limit(limit)
    raw_attempts = []
    if hasattr(cursor, "__aiter__"):
        async for doc in cursor:
            raw_attempts.append(doc)
    else:
        raw_attempts = await cursor.to_list(length=limit)

    items = []
    for att in raw_attempts:
        items.append(QuizAttemptHistoryItem(
            id=str(att["_id"]),
            score=att.get("score", 0),
            total=att.get("total", 0),
            percentage=float(att.get("percentage", 0.0)),
            rankTitle=att.get("rankTitle", "Security Apprentice 🌱"),
            createdAt=att.get("created_at", datetime.utcnow())
        ))

    return QuizAttemptHistoryResponse(
        total=total,
        attempts=items
    )


async def get_progress_summary(current_user: UserInDB) -> ProgressSummaryResponse:
    """Calculate and assemble the comprehensive user progress and Reflex Score."""
    db = get_database()
    user_id = current_user.id

    # 1. Fetch user progress doc
    progress = await db.user_progress.find_one({"user_id": user_id})
    completed_ids: List[str] = progress.get("completed_category_ids", []) if progress else []

    # 2. Fetch all scam categories
    cat_cursor = db.scam_categories.find().sort("id", 1)
    all_categories: List[Dict[str, Any]] = []
    if hasattr(cat_cursor, "__aiter__"):
        async for c in cat_cursor:
            all_categories.append(c)
    else:
        all_categories = await cat_cursor.to_list(length=100)

    total_lessons = len(all_categories)
    completed_count = len(completed_ids)
    lesson_pct = round((completed_count / total_lessons) * 100.0, 1) if total_lessons > 0 else 0.0

    lesson_summary = LessonProgressSummary(
        completed=completed_count,
        total=total_lessons,
        completionPercentage=lesson_pct,
        completedCategoryIds=completed_ids
    )

    # 3. Fetch all quiz attempts for user
    att_cursor = db.quiz_attempts.find({"user_id": user_id}).sort("created_at", -1)
    attempts: List[Dict[str, Any]] = []
    if hasattr(att_cursor, "__aiter__"):
        async for a in att_cursor:
            attempts.append(a)
    else:
        attempts = await att_cursor.to_list(length=500)

    total_attempts = len(attempts)

    # 4. Reflex Score and Quiz Stats
    if total_attempts > 0:
        latest = attempts[0]
        latest_score = LatestQuizScore(
            score=latest.get("score", 0),
            total=latest.get("total", 0),
            percentage=float(latest.get("percentage", 0.0)),
            rankTitle=latest.get("rankTitle", "Security Apprentice 🌱"),
            attemptedAt=latest.get("created_at", datetime.utcnow())
        )
        highest_pct = round(max(float(a.get("percentage", 0.0)) for a in attempts), 1)
        avg_pct = round(sum(float(a.get("percentage", 0.0)) for a in attempts) / total_attempts, 1)

        # Formula: Q = 0.60 * latest + 0.40 * average
        Q = round(0.60 * latest_score.percentage + 0.40 * avg_pct, 1)
        # R = 0.40 * L + 0.60 * Q
        reflex_raw = 0.40 * lesson_pct + 0.60 * Q
        reflex_score_val = round(reflex_raw)

        reflex_detail = ReflexScoreDetail(
            score=reflex_score_val,
            isCalibrated=True,
            rankTitle=_calculate_rank(reflex_score_val),
            lessonComponent=lesson_pct,
            quizComponent=Q,
            explanation=(
                f"Score ({reflex_score_val}) = (40% * {lesson_pct}% lessons completed) + "
                f"(60% * {Q}% quiz accuracy). This is an educational metric and does not represent "
                "real-world fraud immunity."
            )
        )
        quiz_summary = QuizProgressSummary(
            totalAttempts=total_attempts,
            latestScore=latest_score,
            highestPercentage=highest_pct,
            averagePercentage=avg_pct
        )
    else:
        # Zero quiz attempts handling
        # Provisional Reflex Score from lesson component only: capped at 40
        provisional_raw = 0.40 * lesson_pct
        reflex_score_val = round(provisional_raw)

        reflex_detail = ReflexScoreDetail(
            score=reflex_score_val,
            isCalibrated=False,
            rankTitle=_calculate_rank(reflex_score_val),
            lessonComponent=lesson_pct,
            quizComponent=None,
            explanation=(
                f"Reflex score is provisional ({reflex_score_val}/40) based solely on lesson completion "
                f"(40% * {lesson_pct}%). Complete at least one safety quiz to calibrate your score. "
                "This is an educational metric and does not represent real-world fraud immunity."
            )
        )
        quiz_summary = QuizProgressSummary(
            totalAttempts=0,
            latestScore=None,
            highestPercentage=None,
            averagePercentage=None
        )

    # 5. Weak Categories Analysis from incorrect quiz answers
    q_cursor = db.quiz_questions.find()
    all_questions: List[Dict[str, Any]] = []
    if hasattr(q_cursor, "__aiter__"):
        async for q in q_cursor:
            all_questions.append(q)
    else:
        all_questions = await q_cursor.to_list(length=200)

    questions_by_id = {q["id"]: q for q in all_questions}
    categories_by_id = {c["id"]: c for c in all_categories}

    incorrect_counts: Dict[str, int] = {}
    for att in attempts:
        for ans in att.get("answers", []):
            qid = ans.get("questionId")
            sel_opt = ans.get("selectedOptionId")
            if qid in questions_by_id:
                question_doc = questions_by_id[qid]
                chosen = next((o for o in question_doc.get("options", []) if o.get("id") == sel_opt), None)
                if chosen and not chosen.get("isCorrect", False):
                    cat_id = question_doc.get("categoryId")
                    if cat_id:
                        incorrect_counts[cat_id] = incorrect_counts.get(cat_id, 0) + 1

    weak_categories: List[WeakCategoryItem] = []
    for cat_id, count in sorted(incorrect_counts.items(), key=lambda x: x[1], reverse=True):
        cat_doc = categories_by_id.get(cat_id, {})
        weak_categories.append(WeakCategoryItem(
            categoryId=cat_id,
            categoryTitle=cat_doc.get("title", cat_id),
            incorrectAnswersCount=count,
            isLessonCompleted=(cat_id in completed_ids)
        ))

    # 6. Learning Recommendations
    recommendations: List[LearningRecommendation] = []
    weak_cat_ids = set(incorrect_counts.keys())

    # 6a. High priority: Weak categories whose lesson has NOT been completed
    for weak in weak_categories:
        if not weak.isLessonCompleted:
            recommendations.append(LearningRecommendation(
                categoryId=weak.categoryId,
                title=f"Study {weak.categoryTitle}",
                reason="You missed questions on this topic in recent quiz attempts. Completing this lesson is strongly recommended.",
                priority="high"
            ))

    # 6b. Medium priority: Weak categories whose lesson HAS been completed (needs review)
    for weak in weak_categories:
        if weak.isLessonCompleted:
            recommendations.append(LearningRecommendation(
                categoryId=weak.categoryId,
                title=f"Review {weak.categoryTitle} Red Flags",
                reason="You missed questions on this topic despite completing the lesson. Reviewing warning signs and shield rules is recommended.",
                priority="medium"
            ))

    # 6c. Medium priority: Other uncompleted curriculum lessons (not weak)
    for cat in all_categories:
        cid = cat["id"]
        if cid not in completed_ids and cid not in weak_cat_ids:
            recommendations.append(LearningRecommendation(
                categoryId=cid,
                title=f"Learn {cat.get('title', cid)}",
                reason="Uncompleted lesson in your cyber defense curriculum.",
                priority="medium"
            ))

    # 6d. Low priority: If all lessons completed and no weak areas
    if not recommendations:
        recommendations.append(LearningRecommendation(
            categoryId="general-review",
            title="Maintain Cyber Vigilance",
            reason="Outstanding! You have completed all lessons with high accuracy. Review daily tips to stay ahead of new scam variations.",
            priority="low"
        ))

    return ProgressSummaryResponse(
        userId=user_id,
        audience=current_user.audience,
        reflexScore=reflex_detail,
        lessons=lesson_summary,
        quizzes=quiz_summary,
        weakCategories=weak_categories,
        recommendations=recommendations
    )
