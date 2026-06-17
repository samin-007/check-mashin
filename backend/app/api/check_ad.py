"""
API چک آگهی — تحلیل قیمت + امتیاز سلامت + تشخیص کلاهبرداری
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.ad import CheckRequest, CheckResult
from app.services.check_service import CheckService

router = APIRouter()


@router.post("/analyze", response_model=CheckResult)
async def check_ad(request: CheckRequest, db: Session = Depends(get_db)):
    """
    چک آگهی — لینک بده، نتیجه بگیر
    
    ورودی: لینک آگهی دیوار یا باما
    خروجی: امتیاز سلامت + مقایسه قیمت + حکم نهایی
    """
    if not request.url.strip():
        raise HTTPException(status_code=400, detail="لینک آگهی نمی‌تواند خالی باشد")
    
    # بررسی منبع
    if "divar.ir" not in request.url and "bama.ir" not in request.url:
        raise HTTPException(
            status_code=400,
            detail="فقط لینک‌های دیوار (divar.ir) و باما (bama.ir) پشتیبانی می‌شوند"
        )
    
    result = CheckService.analyze_ad(db, request.url)
    return result


@router.get("/history")
async def get_check_history(
    limit: int = 10,
    db: Session = Depends(get_db),
):
    """تاریخچه آگهی‌های چک‌شده"""
    return CheckService.get_recent_checks(db, limit)


@router.post("/report/{ad_id}")
async def report_ad(ad_id: int, db: Session = Depends(get_db)):
    """گزارش آگهی مشکوک"""
    return CheckService.report_ad(db, ad_id)
