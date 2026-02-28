from pydantic import BaseModel
from datetime import datetime


class MerchantCreate(BaseModel):
    name: str
    fee_percentage: float


class MerchantUpdate(BaseModel):
    fee_percentage: float


class MerchantResponse(BaseModel):
    id: int
    name: str
    fee_percentage: float
    created_at: datetime

    class Config:
        from_attributes = True


class MerchantOut(BaseModel):
    name: str
    fee_percentage: float

    class Config:
        from_attributes = True
