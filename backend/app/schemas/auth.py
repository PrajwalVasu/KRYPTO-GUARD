from pydantic import BaseModel, EmailStr, Field
from typing import Literal
from datetime import datetime

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    audience: Literal['students', 'seniors', 'all']

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
