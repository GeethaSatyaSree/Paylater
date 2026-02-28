from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TransactionCreate(BaseModel):
    user_name: str
    merchant_name: str
    amount: float


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    merchant_id: int
    amount: float
    fee_amount: float
    merchant_payout: float
    status: str
    rejection_reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TransactionStatusResponse(BaseModel):
    status: str
    reason: Optional[str] = None
