from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from ..schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from ..services.auth_service import register_user, authenticate_user, revoke_token
from ..dependencies.auth import get_current_user, oauth2_scheme
from ..schemas.user import UserInDB

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
async def register(request: RegisterRequest):
    token = await register_user(request)
    return TokenResponse(access_token=token)

@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """OAuth2 password form login used by Swagger UI Authorize flow."""
    token = await authenticate_user(form_data.username, form_data.password)
    return TokenResponse(access_token=token)

@router.post("/login/json", response_model=TokenResponse)
async def login_json(request: LoginRequest):
    """JSON credentials login preserving the frontend API contract."""
    token = await authenticate_user(request.email, request.password)
    return TokenResponse(access_token=token)

@router.post("/logout")
async def logout(current_user: UserInDB = Depends(get_current_user), token: str = Depends(oauth2_scheme)):
    await revoke_token(token)
    return {"msg": "Logged out"}
