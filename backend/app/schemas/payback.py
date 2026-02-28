from pydantic import BaseModel
from datetime import datetime


class PaybackCreate(BaseModel):
    user_name: str
    amount: float


class PaybackResponse(BaseModel):
    id: int
    user_id: int
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True


class PaybackOut(BaseModel):
    user_name: str
    remaining_dues: float
