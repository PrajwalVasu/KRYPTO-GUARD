from fastapi import APIRouter, Depends, Query, status
from typing import Optional
from ..schemas.progress import (
    LessonCompletionResponse,
    ProgressSummaryResponse,
    QuizAttemptHistoryResponse,
)
from ..services.progress_service import (
    mark_lesson_completed,
    unmark_lesson_completed,
    get_progress_summary,
    get_quiz_history,
)
from ..dependencies.auth import get_current_user
from ..schemas.user import UserInDB

router = APIRouter()


@router.get("/summary", response_model=ProgressSummaryResponse)
async def read_progress_summary(
    current_user: UserInDB = Depends(get_current_user)
):
    """Retrieve full progress summary, reflex score, weak categories, and personalized recommendations."""
    return await get_progress_summary(current_user)


@router.post("/lessons/{category_id}/complete", response_model=LessonCompletionResponse)
async def complete_lesson(
    category_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Idempotently mark a lesson as completed for the authenticated user."""
    return await mark_lesson_completed(
        user_id=current_user.id,
        category_id=category_id
    )


@router.delete("/lessons/{category_id}/complete", response_model=LessonCompletionResponse)
async def uncomplete_lesson(
    category_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Unmark a previously completed lesson for the authenticated user."""
    return await unmark_lesson_completed(
        user_id=current_user.id,
        category_id=category_id
    )


@router.get("/history", response_model=QuizAttemptHistoryResponse)
async def read_quiz_history(
    limit: int = Query(10, ge=1, le=50, description="Max number of quiz attempts to return"),
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    current_user: UserInDB = Depends(get_current_user)
):
    """Retrieve chronological quiz attempt history for the authenticated user."""
    return await get_quiz_history(
        user_id=current_user.id,
        limit=limit,
        skip=skip
    )
