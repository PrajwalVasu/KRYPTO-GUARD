from pydantic import BaseModel, ConfigDict
from typing import Literal, Optional, List

TargetAudience = Literal['all', 'students', 'seniors']
MessageType = Literal['sms', 'whatsapp', 'call', 'email']

class HowItHappensStep(BaseModel):
    step: int
    title: str
    description: str

class MessagePreview(BaseModel):
    sender: str
    body: str
    timestamp: str
    type: MessageType

class RealLifeScenario(BaseModel):
    victimProfile: str
    story: str
    messagePreview: Optional[MessagePreview] = None

class ScamCategorySummary(BaseModel):
    id: str
    title: str
    shortTitle: str
    audience: TargetAudience
    icon: str
    badge: str
    tagline: str
    description: str

    model_config = ConfigDict(from_attributes=True)

class ScamCategoryDetail(ScamCategorySummary):
    howItHappens: List[HowItHappensStep]
    realLifeScenario: RealLifeScenario
    warningSigns: List[str]
    shieldRules: List[str]
    whatToDoIfAffected: List[str]
    commonKeywords: List[str]

    model_config = ConfigDict(from_attributes=True)

class DailyTipResponse(BaseModel):
    id: int
    category: str
    tip: str
    actionableStep: str
    forAudience: TargetAudience

    model_config = ConfigDict(from_attributes=True)

class JargonTermResponse(BaseModel):
    term: str
    hindiTerm: Optional[str] = None
    meaning: str
    realWorldAnalogy: str
    safetyTakeaway: str

    model_config = ConfigDict(from_attributes=True)
