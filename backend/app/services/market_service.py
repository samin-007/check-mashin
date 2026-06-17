"""
سرویس بازار — منطق تجاری مربوط به قیمت‌ها و فرصت‌ها
"""

from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from datetime import datetime, timedelta
from typing import Optional, List
from app.models.car import Car
from app.models.price import PriceRecord
from app.models.ad import Ad


class MarketService:

    @staticmethod
    def get_market_index(db: Session):
        """محاسبه شاخص کل بازار"""
        cars = db.query(Car).all()
        total_cars = len(cars)
        
        if total_cars == 0:
            return {
                "index_value": 0,
                "index_change": 0.0,
                "total_cars": 0,
                "total_ads": 0,
                "top_gainers": [],
                "top_losers": [],
            }

        # محاسبه شاخص (میانگین وزنی تغییرات هفتگی)
        total_change = sum(c.price_change_weekly for c in cars)
        index_change = round(total_change / total_cars, 1) if total_cars > 0 else 0
        
        # شاخص ساده (مجموع قیمت‌ها / ۱۰۰)
        index_value = int(sum(c.market_price for c in cars) / 100)
        
        total_ads = sum(c.ad_count for c in cars)

        # بیشترین رشد
        top_gainers = sorted(cars, key=lambda c: c.price_change_weekly, reverse=True)[:3]
        
        # بیشترین ریزش
        top_losers = sorted(cars, key=lambda c: c.price_change_weekly)[:3]

        return {
            "index_value": index_value,
            "index_change": index_change,
            "total_cars": total_cars,
            "total_ads": total_ads,
            "top_gainers": top_gainers,
            "top_losers": top_losers,
        }

    @staticmethod
    def get_cars(
        db: Session,
        brand: Optional[str] = None,
        category: Optional[str] = None,
        sort_by: str = "price_change_weekly",
        order: str = "desc",
        limit: int = 20,
    ):
        """دریافت لیست خودروها با فیلتر"""
        query = db.query(Car)
        
        if brand:
            query = query.filter(Car.brand == brand)
        if category:
            query = query.filter(Car.category == category)
        
        # مرتب‌سازی
        sort_column = getattr(Car, sort_by, Car.price_change_weekly)
        if order == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))
        
        return query.limit(limit).all()

    @staticmethod
    def get_car_detail(db: Session, car_id: int):
        """جزئیات یک خودرو + تاریخچه"""
        car = db.query(Car).filter(Car.id == car_id).first()
        if not car:
            return None
        
        # تاریخچه ۳۰ روز اخیر
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        history = (
            db.query(PriceRecord)
            .filter(PriceRecord.car_id == car_id)
            .filter(PriceRecord.date >= thirty_days_ago)
            .order_by(PriceRecord.date)
            .all()
        )
        
        return {
            **car.__dict__,
            "price_history": history,
        }

    @staticmethod
    def get_price_history(db: Session, car_id: int, days: int = 30):
        """تاریخچه قیمت"""
        start_date = datetime.utcnow() - timedelta(days=days)
        return (
            db.query(PriceRecord)
            .filter(PriceRecord.car_id == car_id)
            .filter(PriceRecord.date >= start_date)
            .order_by(PriceRecord.date)
            .all()
        )

    @staticmethod
    def get_opportunities(
        db: Session,
        city: Optional[str] = None,
        min_discount: int = 5,
        limit: int = 20,
    ):
        """فرصت‌های خرید — آگهی‌های زیر قیمت بازار"""
        query = (
            db.query(Ad)
            .filter(Ad.verdict == "opportunity")
            .filter(Ad.price_diff_percent <= -min_discount)
            .filter(Ad.health_score >= 60)
        )
        
        if city:
            query = query.filter(Ad.city == city)
        
        ads = query.order_by(desc(Ad.checked_at)).limit(limit).all()
        
        results = []
        for ad in ads:
            time_diff = datetime.utcnow() - ad.checked_at
            if time_diff.total_seconds() < 3600:
                time_ago = f"{int(time_diff.total_seconds() / 60)} دقیقه پیش"
            elif time_diff.total_seconds() < 86400:
                time_ago = f"{int(time_diff.total_seconds() / 3600)} ساعت پیش"
            else:
                time_ago = f"{int(time_diff.days)} روز پیش"
            
            results.append({
                "id": ad.id,
                "car_name": f"{ad.brand} {ad.model}",
                "year": ad.year or "",
                "city": ad.city or "",
                "price": ad.price,
                "market_price": ad.market_price or ad.price,
                "health_score": ad.health_score or 0,
                "discount": abs(int(ad.price_diff_percent or 0)),
                "time_ago": time_ago,
                "source": ad.source,
                "url": ad.url,
            })
        
        return results
