from sqlalchemy.orm import Session

from app.services.merchant_service import get_merchant_by_name, calculate_fee_collected
from app.services.user_service import (
    get_user_by_name,
    calculate_user_dues,
    get_users_at_credit_limit,
    get_total_dues,
)


def get_merchant_fee_report(db: Session, merchant_name: str) -> dict:
    merchant = get_merchant_by_name(db, merchant_name)
    fee = calculate_fee_collected(db, merchant.id)
    return {"fee_collected": fee}


def get_user_dues_report(db: Session, user_name: str) -> dict:
    user = get_user_by_name(db, user_name)
    dues = calculate_user_dues(db, user.id)
    return {"dues": dues}


def get_users_at_limit_report(db: Session):
    return get_users_at_credit_limit(db)


def get_total_dues_report(db: Session) -> dict:
    return get_total_dues(db)
