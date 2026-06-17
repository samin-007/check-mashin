"""
مدل آگهی — ذخیره اطلاعات آگهی‌های بررسی‌شده
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class Ad(Base):
    __tablename__ = "ads"

    id = Column(Integer, primary_key=True, index=True)
    car_id = Column(Integer, ForeignKey("cars.id"), index=True, nullable=True)
    
    # اطلاعات آگهی
    url = Column(String, unique=True, index=True)      # لینک آگهی
    source = Column(String)                             # منبع: divar, bama
    title = Column(String, nullable=True)               # عنوان آگهی
    price = Column(Integer)                             # قیمت آگهی (میلیون تومان)
    
    # اطلاعات خودرو
    brand = Column(String, nullable=True)
    model = Column(String, nullable=True)
    year = Column(String, nullable=True)
    mileage = Column(Integer, nullable=True)            # کارکرد (کیلومتر)
    color = Column(String, nullable=True)
    city = Column(String, nullable=True)
    
    # اطلاعات فروشنده
    seller_phone = Column(String, nullable=True)
    seller_ad_count = Column(Integer, default=1)        # تعداد آگهی فعال فروشنده
    is_dealer = Column(Boolean, default=False)          # دلال هست؟
    
    # تحلیل
    market_price = Column(Integer, nullable=True)       # قیمت بازار
    price_diff_percent = Column(Float, nullable=True)   # درصد اختلاف با بازار
    health_score = Column(Integer, nullable=True)       # امتیاز سلامت (0-100)
    verdict = Column(String, nullable=True)             # حکم: opportunity, fair, overpriced, scam
    
    # وضعیت
    is_original_photos = Column(Boolean, default=True)  # عکس اصل؟
    is_suspicious = Column(Boolean, default=False)      # مشکوک؟
    reported_count = Column(Integer, default=0)         # تعداد ریپورت
    
    # زمان
    ad_date = Column(DateTime, nullable=True)           # تاریخ ثبت آگهی
    checked_at = Column(DateTime, default=datetime.utcnow)  # تاریخ بررسی
    
    # رابطه
    car = relationship("Car", back_populates="ads")

    def __repr__(self):
        return f"<Ad {self.source} {self.brand} {self.model} verdict={self.verdict}>"
