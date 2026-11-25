from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Literal, Optional, List, Dict, Any

class LessonCompletionResponse(BaseModel):
    categoryId: str
    isCompleted: bool
    completedAt: Optional[datetime] = None
    completedLessonsCount: int
    totalLessonsCount: int
    completionPercentage: float

    model_config = ConfigDict(from_attributes=True)

class ReflexScoreDetail(BaseModel):
    score: int
    isCalibrated: bool
    rankTitle: str
    lessonComponent: float
    quizComponent: Optional[float] = None
    explanation: str

    model_config = ConfigDict(from_attributes=True)

class LessonProgressSummary(BaseModel):
    completed: int
    total: int
    completionPercentage: float
    completedCategoryIds: List[str]

    model_config = ConfigDict(from_attributes=True)

class LatestQuizScore(BaseModel):
    score: int
    total: int
    percentage: float
    rankTitle: str
    attemptedAt: datetime

    model_config = ConfigDict(from_attributes=True)

class QuizProgressSummary(BaseModel):
    totalAttempts: int
    latestScore: Optional[LatestQuizScore] = None
    highestPercentage: Optional[float] = None
    averagePercentage: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)

class WeakCategoryItem(BaseModel):
    categoryId: str
    categoryTitle: str
    incorrectAnswersCount: int
    isLessonCompleted: bool

    model_config = ConfigDict(from_attributes=True)

class LearningRecommendation(BaseModel):
    categoryId: str
    title: str
    reason: str
    priority: Literal['high', 'medium', 'low']

    model_config = ConfigDict(from_attributes=True)

class ProgressSummaryResponse(BaseModel):
    userId: str
    audience: str
    reflexScore: ReflexScoreDetail
    lessons: LessonProgressSummary
    quizzes: QuizProgressSummary
    weakCategories: List[WeakCategoryItem]
    recommendations: List[LearningRecommendation]

    model_config = ConfigDict(from_attributes=True)

class QuizAttemptHistoryItem(BaseModel):
    id: str
    score: int
    total: int
    percentage: float
    rankTitle: str
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)

class QuizAttemptHistoryResponse(BaseModel):
    total: int
    attempts: List[QuizAttemptHistoryItem]

    model_config = ConfigDict(from_attributes=True)
