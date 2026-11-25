import os
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import HTTPException, status
from ..config import settings
from ..database import get_database
from ..schemas.auth import RegisterRequest
from ..schemas.user import UserInDB, UserCreate

ph = PasswordHasher()

def get_password_hash(password: str) -> str:
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return ph.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False
    except Exception:
        return False

def create_access_token(subject: str, audience: str, role: str, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = {
        "sub": subject,
        "aud": audience,
        "role": role,
        "iat": datetime.utcnow(),
    }
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "jti": os.urandom(16).hex()})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

# ---------- Service functions ----------

async def register_user(request: RegisterRequest) -> str:
    """Create a new user and return an access token."""
    db = get_database()
    # Check for existing email
    existing = await db.users.find_one({"email": request.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    hashed = get_password_hash(request.password)
    user_doc = {
        "name": request.name,
        "email": request.email,
        "hashed_password": hashed,
        "audience": request.audience,
        "role": "user",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    token = create_access_token(subject=user_id, audience=request.audience, role="user")
    return token

async def authenticate_user(email: str, password: str) -> str:
    """Validate credentials and return a JWT token."""
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(
        subject=str(user["_id"]),
        audience=user.get("audience", "all"),
        role=user.get("role", "user"),
    )
    return token

async def revoke_token(token: str):
    """Add the token's jti to the revocation list with proper TTL."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"], options={"verify_aud": False})
        jti = payload.get("jti")
        exp = payload.get("exp")
        if not jti or not exp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token payload for revocation",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    db = get_database()
    expire_at = datetime.utcfromtimestamp(exp)
    await db.revoked_tokens.insert_one({"jti": jti, "expireAt": expire_at})
    return True
