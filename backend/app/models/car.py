"""
مدل خودرو — اطلاعات پایه هر مدل خودرو
"""

from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.db.database import Base


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, index=True)           # برند: ایران‌خودرو، سایپا، ...
    model = Column(String, index=True)           # مدل: پژو ۲۰۷، دنا، تارا، ...
    trim = Column(String, nullable=True)         # تیپ: اتوماتیک، دنده‌ای، توربو
    year = Column(String, index=True)            # سال تولید: ۱۴۰۲
    category = Column(String, nullable=True)     # دسته: سدان، هاچبک، شاسی‌بلند
    
    # قیمت‌های فعلی
    market_price = Column(Integer, default=0)    # قیمت بازار (میلیون تومان)
    factory_price = Column(Integer, default=0)   # قیمت کارخانه (میلیون تومان)
    
    # آمار
    price_change_weekly = Column(Float, default=0.0)   # تغییر هفتگی (درصد)
    price_change_monthly = Column(Float, default=0.0)  # تغییر ماهانه (درصد)
    ad_count = Column(Integer, default=0)              # تعداد آگهی فعال
    
    # رابطه‌ها
    prices = relationship("PriceRecord", back_populates="car")
    ads = relationship("Ad", back_populates="car")

    def __repr__(self):
        return f"<Car {self.brand} {self.model} {self.trim} ({self.year})>"
