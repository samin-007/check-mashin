"""
اسکیما‌های آگهی — ورودی/خروجی API چک آگهی
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CheckRequest(BaseModel):
    """ورودی — لینک آگهی"""
    url: str


class HealthCheck(BaseModel):
    """نتیجه هر بررسی سلامت"""
    label: str
    passed: bool
    detail: Optional[str] = None


class PriceComparison(BaseModel):
    """مقایسه قیمت"""
    ad_price: int
    market_price: int
    diff_percent: float
    diff_amount: int
    price_one_week_ago: Optional[int] = None
    price_two_weeks_ago: Optional[int] = None
    price_one_month_ago: Optional[int] = None


class CheckResult(BaseModel):
    """خروجی — نتیجه چک آگهی"""
    # اطلاعات خودرو
    car_name: str
    brand: str
    model: str
    year: str
    mileage: Optional[str] = None
    color: Optional[str] = None
    city: Optional[str] = None

    # تحلیل
    health_score: int                    # 0-100
    verdict: str                         # opportunity, fair, overpriced, scam
    verdict_text: str                    # متن حکم فارسی
    saving_amount: Optional[str] = None  # مقدار صرفه‌جویی

    # مقایسه قیمت
    price_comparison: PriceComparison

    # چک‌لیست سلامت
    health_checks: List[HealthCheck]

    # متادیتا
    source: str                          # divar, bama
    checked_at: datetime


class OpportunityItem(BaseModel):
    """فرصت خرید"""
    id: int
    car_name: str
    year: str
    city: str
    price: int
    market_price: int
    health_score: int
    discount: int
    time_ago: str
    source: str
    url: Optional[str] = None
