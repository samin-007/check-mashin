"""
API بازار — قیمت روز، روند، شاخص، فرصت‌ها
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.car import Car
from app.models.price import PriceRecord
from app.schemas.car import CarPrice, CarDetail, PriceHistory, MarketIndex
from app.schemas.ad import OpportunityItem
from app.services.market_service import MarketService

router = APIRouter()


@router.get("/index", response_model=MarketIndex)
async def get_market_index(db: Session = Depends(get_db)):
    """شاخص کل بازار خودرو + بیشترین رشد/ریزش"""
    return MarketService.get_market_index(db)


@router.get("/cars", response_model=List[CarPrice])
async def get_cars(
    brand: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: str = Query(default="price_change_weekly", enum=["market_price", "price_change_weekly", "price_change_monthly", "ad_count"]),
    order: str = Query(default="desc", enum=["asc", "desc"]),
    limit: int = Query(default=20, le=100),
    db: Session = Depends(get_db),
):
    """لیست خودروها با فیلتر و مرتب‌سازی"""
    return MarketService.get_cars(db, brand=brand, category=category, sort_by=sort_by, order=order, limit=limit)


@router.get("/cars/{car_id}", response_model=CarDetail)
async def get_car_detail(car_id: int, db: Session = Depends(get_db)):
    """جزئیات یک خودرو + تاریخچه قیمت"""
    return MarketService.get_car_detail(db, car_id)


@router.get("/cars/{car_id}/history", response_model=List[PriceHistory])
async def get_price_history(
    car_id: int,
    days: int = Query(default=30, le=365),
    db: Session = Depends(get_db),
):
    """تاریخچه قیمت یک خودرو"""
    return MarketService.get_price_history(db, car_id, days)


@router.get("/opportunities", response_model=List[OpportunityItem])
async def get_opportunities(
    city: Optional[str] = None,
    min_discount: int = Query(default=5, ge=1, le=50),
    limit: int = Query(default=20, le=50),
    db: Session = Depends(get_db),
):
    """فرصت‌های خرید — آگهی‌های زیر قیمت بازار"""
    return MarketService.get_opportunities(db, city=city, min_discount=min_discount, limit=limit)


@router.get("/brands")
async def get_brands(db: Session = Depends(get_db)):
    """لیست برندها"""
    brands = db.query(Car.brand).distinct().all()
    return [b[0] for b in brands]


@router.get("/compare")
async def compare_markets():
    """مقایسه بازار خودرو با دلار، طلا، بورس (3 ماه اخیر)"""
    # فعلاً داده ثابت — بعداً به API‌های واقعی وصل می‌شه
    return {
        "period": "3_months",
        "markets": [
            {"name": "خودرو", "icon": "🚗", "change": 12.0},
            {"name": "دلار", "icon": "💵", "change": 8.0},
            {"name": "طلا", "icon": "🪙", "change": 15.0},
            {"name": "بورس", "icon": "📊", "change": 3.0},
        ],
    }
