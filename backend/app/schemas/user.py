from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    credit_limit: float = 0.0


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    credit_limit: float
    created_at: datetime

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    name: str
    credit_limit: float

    class Config:
        from_attributes = True
