from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from ..schemas.user import UserInDB, UserUpdate, UserResponse
from ..dependencies.auth import get_current_user
from ..database import get_database
from datetime import datetime

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_current_user(current_user: UserInDB = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_current_user(user_update: UserUpdate, current_user: UserInDB = Depends(get_current_user)):
    db = get_database()
    update_data = {k: v for k, v in user_update.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
    update_data["updated_at"] = datetime.utcnow()

    query = {"_id": ObjectId(current_user.id)} if ObjectId.is_valid(current_user.id) else {"_id": current_user.id}
    await db.users.update_one(query, {"$set": update_data})
    user_doc = await db.users.find_one(query)
    if not user_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user_doc["id"] = str(user_doc["_id"]) if "_id" in user_doc else current_user.id
    user_doc.pop("_id", None)
    return UserResponse(**user_doc)
