"""
API چک آگهی — تحلیل قیمت + امتیاز سلامت + تشخیص کلاهبرداری
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.ad import CheckRequest, CheckResult
from app.services.check_service import CheckService
from app.scraper.checker import AdChecker

router = APIRouter()


@router.post("/analyze", response_model=CheckResult)
async def check_ad(request: CheckRequest, db: Session = Depends(get_db)):
    """
    چک آگهی — لینک بده، نتیجه بگیر
    
    ورودی: لینک آگهی دیوار یا باما
    خروجی: امتیاز سلامت + مقایسه قیمت + حکم نهایی
    
    اول تلاش می‌کنه واقعاً آگهی رو بخونه.
    اگه نشد، از سرویس شبیه‌سازی استفاده می‌کنه.
    """
    if not request.url.strip():
        raise HTTPException(status_code=400, detail="لینک آگهی نمی‌تواند خالی باشد")
    
    # بررسی منبع
    if "divar.ir" not in request.url and "bama.ir" not in request.url:
        raise HTTPException(
            status_code=400,
            detail="فقط لینک‌های دیوار (divar.ir) و باما (bama.ir) پشتیبانی می‌شوند"
        )
    
    # تلاش برای خواندن واقعی آگهی
    try:
        checker = AdChecker()
        real_result = await checker.check(request.url)
        
        if real_result and real_result.get("ad_data", {}).get("price"):
            # موفق شدیم واقعاً بخونیم!
            ad_data = real_result["ad_data"]
            result = CheckService.analyze_ad_with_real_data(db, request.url, ad_data, real_result["health_checks"], real_result["health_score"])
            return result
    except Exception as e:
        print(f"[CheckAd] Real scrape failed: {e}, falling back to simulation")
    
    # Fallback: شبیه‌سازی
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
