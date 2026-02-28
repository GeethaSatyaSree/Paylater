from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    TransactionStatusResponse,
)
from app.services import transaction_service

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/", response_model=TransactionStatusResponse, status_code=201)
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new transaction. Rejected if user exceeds credit limit."""
    return transaction_service.create_transaction(db, data)


@router.get("/my", response_model=List[TransactionResponse])
def my_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all transactions of the currently authenticated user."""
    return transaction_service.get_user_transactions(db, current_user.id)


@router.get("/", response_model=List[TransactionResponse])
def all_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all transactions across all users."""
    return transaction_service.get_all_transactions(db)
