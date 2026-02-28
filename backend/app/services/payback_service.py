from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List

from app.models.payback import Payback
from app.schemas.payback import PaybackCreate, PaybackOut
from app.services.user_service import get_user_by_name, calculate_user_dues


def create_payback(db: Session, data: PaybackCreate) -> PaybackOut:
    user = get_user_by_name(db, data.user_name)
    current_dues = calculate_user_dues(db, user.id)

    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Payback amount must be positive")

    if current_dues <= 0:
        raise HTTPException(status_code=400, detail="No outstanding dues")

    actual_amount = min(data.amount, current_dues)

    payback = Payback(user_id=user.id, amount=actual_amount)
    db.add(payback)
    db.commit()

    remaining = calculate_user_dues(db, user.id)
    return PaybackOut(user_name=user.name, remaining_dues=remaining)


def get_user_paybacks(db: Session, user_id: int) -> List[Payback]:
    return (
        db.query(Payback)
        .filter(Payback.user_id == user_id)
        .order_by(Payback.created_at.desc())
        .all()
    )
