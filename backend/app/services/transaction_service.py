from sqlalchemy.orm import Session
from typing import List

from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionStatusResponse
from app.services.user_service import get_user_by_name, calculate_available_credit
from app.services.merchant_service import get_merchant_by_name


def create_transaction(
    db: Session, data: TransactionCreate
) -> TransactionStatusResponse:
    user = get_user_by_name(db, data.user_name)
    merchant = get_merchant_by_name(db, data.merchant_name)

    available = calculate_available_credit(db, user)

    if data.amount > available:
        txn = Transaction(
            user_id=user.id,
            merchant_id=merchant.id,
            amount=data.amount,
            fee_amount=0.0,
            merchant_payout=0.0,
            status="rejected",
            rejection_reason="credit limit",
        )
        db.add(txn)
        db.commit()
        return TransactionStatusResponse(status="rejected", reason="credit limit")

    fee_amount = round((data.amount * merchant.fee_percentage) / 100, 2)
    merchant_payout = round(data.amount - fee_amount, 2)

    txn = Transaction(
        user_id=user.id,
        merchant_id=merchant.id,
        amount=data.amount,
        fee_amount=fee_amount,
        merchant_payout=merchant_payout,
        status="success",
    )
    db.add(txn)
    db.commit()
    return TransactionStatusResponse(status="success")


def get_user_transactions(db: Session, user_id: int) -> List[Transaction]:
    return (
        db.query(Transaction)
        .filter(Transaction.user_id == user_id)
        .order_by(Transaction.created_at.desc())
        .all()
    )


def get_all_transactions(db: Session) -> List[Transaction]:
    return db.query(Transaction).order_by(Transaction.created_at.desc()).all()
