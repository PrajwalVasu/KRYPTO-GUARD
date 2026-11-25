from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Literal

class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    audience: Literal['students', 'seniors', 'all']
    role: Literal['user', 'admin'] = 'user'

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserInDB(UserBase):
    id: str
    hashed_password: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    name: str | None = None
    audience: Literal['students', 'seniors', 'all'] | None = None
