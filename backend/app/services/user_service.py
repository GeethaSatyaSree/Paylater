from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from typing import List

from app.models.user import User
from app.models.transaction import Transaction
from app.models.payback import Payback


def get_user_by_name(db: Session, name: str) -> User:
    user = db.query(User).filter(User.name == name).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{name}' not found")
    return user


def get_user_by_id(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_all_users(db: Session) -> List[User]:
    return db.query(User).all()


def calculate_user_dues(db: Session, user_id: int) -> float:
    total_txn = (
        db.query(func.sum(Transaction.amount))
        .filter(Transaction.user_id == user_id, Transaction.status == "success")
        .scalar()
        or 0.0
    )

    total_paid = (
        db.query(func.sum(Payback.amount)).filter(Payback.user_id == user_id).scalar()
        or 0.0
    )

    return max(0.0, total_txn - total_paid)


def calculate_available_credit(db: Session, user: User) -> float:
    dues = calculate_user_dues(db, user.id)
    return max(0.0, user.credit_limit - dues)


def get_users_at_credit_limit(db: Session) -> List[str]:
    users = db.query(User).all()
    result = []
    for user in users:
        dues = calculate_user_dues(db, user.id)
        if dues >= user.credit_limit:
            result.append(user.name)
    return result


def get_total_dues(db: Session) -> dict:
    users = db.query(User).all()
    details = {}
    for user in users:
        dues = calculate_user_dues(db, user.id)
        if dues > 0:
            details[user.name] = dues
    return {"total": sum(details.values()), "details": details}
