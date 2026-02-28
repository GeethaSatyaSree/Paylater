from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.report import FeeReport, DuesReport, TotalDuesReport
from app.services import report_service

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/fee/{merchant_name}", response_model=FeeReport)
def merchant_fee_report(
    merchant_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Total fee collected from a specific merchant."""
    return report_service.get_merchant_fee_report(db, merchant_name)


@router.get("/dues/{user_name}", response_model=DuesReport)
def user_dues_report(
    user_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Total outstanding dues for a specific user."""
    return report_service.get_user_dues_report(db, user_name)


@router.get("/users-at-credit-limit", response_model=List[str])
def users_at_credit_limit(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List of users who have reached their credit limit."""
    return report_service.get_users_at_limit_report(db)


@router.get("/total-dues", response_model=TotalDuesReport)
def total_dues_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Total dues across all users with breakdown."""
    return report_service.get_total_dues_report(db)
