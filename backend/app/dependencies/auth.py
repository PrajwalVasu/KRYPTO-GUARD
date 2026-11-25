from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from jose import JWTError, jwt
from bson import ObjectId
from ..config import settings
from ..database import get_database
from ..schemas.user import UserInDB

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"], options={"verify_aud": False})
        user_id: str = payload.get("sub")
        audience: str = payload.get("aud")
        role: str = payload.get("role")
        jti: str = payload.get("jti")
        if not all([user_id, audience, role, jti]):
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    db = get_database()
    # check token revocation
    revoked = await db.revoked_tokens.find_one({"jti": jti})
    if revoked:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token revoked")

    # Safe ObjectId conversion
    user_doc = None
    if ObjectId.is_valid(user_id):
        try:
            user_doc = await db.users.find_one({"_id": ObjectId(user_id)})
        except Exception:
            user_doc = None
    if not user_doc:
        user_doc = await db.users.find_one({"_id": user_id})

    if not user_doc:
        raise credentials_exception
    # Convert MongoDB _id to id field expected by UserInDB schema
    user_doc["id"] = str(user_doc["_id"]) if "_id" in user_doc else user_id
    # Remove _id to avoid unexpected field
    user_doc.pop("_id", None)
    return UserInDB(**user_doc)


async def get_optional_current_user(token: Optional[str] = Depends(oauth2_scheme_optional)) -> Optional[UserInDB]:
    """Extract authenticated user if token is present; return None if unauthenticated; raise 401 if token is invalid."""
    if not token:
        return None
    return await get_current_user(token)
