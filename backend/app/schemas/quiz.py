from pydantic import BaseModel, ConfigDict
from typing import Literal, Optional, List

TargetAudience = Literal['all', 'students', 'seniors']

class QuizOptionPublic(BaseModel):
    id: str  # 'A', 'B', 'C', 'D'
    text: str

    model_config = ConfigDict(from_attributes=True)

class QuizOptionInDB(QuizOptionPublic):
    isCorrect: bool

class QuizQuestionPublic(BaseModel):
    id: int
    scenario: str
    contextTag: str
    categoryId: Optional[str] = None
    audience: TargetAudience
    question: str
    options: List[QuizOptionPublic]

    model_config = ConfigDict(from_attributes=True)

class CheckAnswerRequest(BaseModel):
    questionId: int
    selectedOptionId: str

class CheckAnswerResponse(BaseModel):
    questionId: int
    selectedOptionId: str
    isCorrect: bool
    correctOptionId: str
    explanation: str
    safetyRule: str

class UserAnswerItem(BaseModel):
    questionId: int
    selectedOptionId: str

class QuizSubmitRequest(BaseModel):
    answers: List[UserAnswerItem]

class QuestionResultFeedback(BaseModel):
    questionId: int
    selectedOptionId: str
    isCorrect: bool
    correctOptionId: str
    explanation: str
    safetyRule: str

class QuizSubmitResponse(BaseModel):
    score: int
    total: int
    percentage: float
    rankTitle: str
    rankDescription: str
    results: List[QuestionResultFeedback]
