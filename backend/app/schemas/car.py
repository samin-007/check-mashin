"""
اسکیما‌های خودرو — برای API responses
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CarBase(BaseModel):
    brand: str
    model: str
    trim: Optional[str] = None
    year: str
    category: Optional[str] = None


class CarPrice(CarBase):
    id: int
    market_price: int
    factory_price: int
    price_change_weekly: float
    price_change_monthly: float
    ad_count: int

    class Config:
        from_attributes = True


class PriceHistory(BaseModel):
    date: datetime
    price: int
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    avg_price: Optional[int] = None
    sample_count: int = 1

    class Config:
        from_attributes = True


class CarDetail(CarPrice):
    price_history: List[PriceHistory] = []


class MarketIndex(BaseModel):
    index_value: int
    index_change: float
    total_cars: int
    total_ads: int
    top_gainers: List[CarPrice]
    top_losers: List[CarPrice]
