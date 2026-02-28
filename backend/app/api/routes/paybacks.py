from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.payback import PaybackCreate, PaybackOut
from app.services import payback_service

router = APIRouter(prefix="/paybacks", tags=["Paybacks"])


@router.post("/", response_model=PaybackOut, status_code=201)
def create_payback(
    data: PaybackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Pay back dues (full or partial)."""
    return payback_service.create_payback(db, data)
