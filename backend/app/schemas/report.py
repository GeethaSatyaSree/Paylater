from pydantic import BaseModel
from typing import Dict


class FeeReport(BaseModel):
    fee_collected: float


class DuesReport(BaseModel):
    dues: float


class TotalDuesReport(BaseModel):
    total: float
    details: Dict[str, float]
