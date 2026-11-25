from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional, List
from ..schemas.quiz import (
    QuizQuestionPublic,
    CheckAnswerRequest,
    CheckAnswerResponse,
    QuizSubmitRequest,
    QuizSubmitResponse,
    TargetAudience,
)
from ..services.quiz_service import (
    get_questions,
    get_questions_by_category,
    check_single_answer,
    submit_quiz,
)
from ..dependencies.auth import get_optional_current_user
from ..schemas.user import UserInDB

router = APIRouter()

@router.get("/questions", response_model=List[QuizQuestionPublic])
async def list_quiz_questions(
    audience: Optional[TargetAudience] = Query(None, description="Filter questions by audience ('all', 'students', 'seniors')")
):
    """Retrieve quiz questions with answers omitted, optionally filtered by audience."""
    questions = await get_questions(audience=audience)
    return questions


@router.get("/categories/{category_id}/questions", response_model=List[QuizQuestionPublic])
async def list_questions_for_category(category_id: str):
    """Retrieve quiz scenarios directly associated with a specific scam category."""
    questions = await get_questions_by_category(category_id=category_id)
    return questions


@router.post("/check-answer", response_model=CheckAnswerResponse)
async def check_answer(request: CheckAnswerRequest):
    """Validate a single question answer in real time and return immediate explanation & shield rule."""
    result = await check_single_answer(
        question_id=request.questionId,
        selected_option_id=request.selectedOptionId
    )
    return result


@router.post("/submit", response_model=QuizSubmitResponse)
async def submit_full_quiz(
    request: QuizSubmitRequest,
    current_user: Optional[UserInDB] = Depends(get_optional_current_user)
):
    """Submit complete quiz answers, calculate score and rank on the backend, and store attempt if authenticated."""
    result = await submit_quiz(
        answers=request.answers,
        current_user=current_user
    )
    return result
