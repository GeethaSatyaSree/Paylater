from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.merchant import (
    MerchantCreate,
    MerchantUpdate,
    MerchantResponse,
    MerchantOut,
)
from app.services import merchant_service

router = APIRouter(prefix="/merchants", tags=["Merchants"])


@router.post("/", response_model=MerchantOut, status_code=201)
def create_merchant(
    data: MerchantCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Onboard a new merchant with a fee percentage."""
    merchant = merchant_service.create_merchant(db, data)
    return MerchantOut(name=merchant.name, fee_percentage=merchant.fee_percentage)


@router.patch("/{merchant_name}", response_model=MerchantOut)
def update_merchant_fee(
    merchant_name: str,
    data: MerchantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a merchant's fee percentage."""
    merchant = merchant_service.update_merchant_fee(db, merchant_name, data)
    return MerchantOut(name=merchant.name, fee_percentage=merchant.fee_percentage)


@router.get("/", response_model=List[MerchantResponse])
def list_merchants(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all merchants."""
    return merchant_service.get_all_merchants(db)
