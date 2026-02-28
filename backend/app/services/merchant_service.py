from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from typing import List

from app.models.merchant import Merchant
from app.models.transaction import Transaction
from app.schemas.merchant import MerchantCreate, MerchantUpdate


def create_merchant(db: Session, data: MerchantCreate) -> Merchant:
    if db.query(Merchant).filter(Merchant.name == data.name).first():
        raise HTTPException(
            status_code=400, detail=f"Merchant '{data.name}' already exists"
        )

    merchant = Merchant(name=data.name, fee_percentage=data.fee_percentage)
    db.add(merchant)
    db.commit()
    db.refresh(merchant)
    return merchant


def get_merchant_by_name(db: Session, name: str) -> Merchant:
    merchant = db.query(Merchant).filter(Merchant.name == name).first()
    if not merchant:
        raise HTTPException(status_code=404, detail=f"Merchant '{name}' not found")
    return merchant


def update_merchant_fee(db: Session, name: str, data: MerchantUpdate) -> Merchant:
    merchant = get_merchant_by_name(db, name)
    merchant.fee_percentage = data.fee_percentage
    db.commit()
    db.refresh(merchant)
    return merchant


def get_all_merchants(db: Session) -> List[Merchant]:
    return db.query(Merchant).all()


def calculate_fee_collected(db: Session, merchant_id: int) -> float:
    total = (
        db.query(func.sum(Transaction.fee_amount))
        .filter(Transaction.merchant_id == merchant_id, Transaction.status == "success")
        .scalar()
        or 0.0
    )
    return total
