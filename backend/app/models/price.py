"""
مدل قیمت — ذخیره تاریخچه قیمت هر خودرو
"""

from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class PriceRecord(Base):
    __tablename__ = "price_records"

    id = Column(Integer, primary_key=True, index=True)
    car_id = Column(Integer, ForeignKey("cars.id"), index=True)
    
    # قیمت
    price = Column(Integer)                     # قیمت (میلیون تومان)
    min_price = Column(Integer, nullable=True)  # کمترین قیمت مشاهده‌شده
    max_price = Column(Integer, nullable=True)  # بیشترین قیمت مشاهده‌شده
    avg_price = Column(Integer, nullable=True)  # میانگین قیمت
    
    # متادیتا
    source = Column(String, nullable=True)      # منبع: divar, bama, telegram, user
    sample_count = Column(Integer, default=1)   # تعداد نمونه بررسی‌شده
    date = Column(DateTime, default=datetime.utcnow, index=True)  # تاریخ ثبت
    
    # رابطه
    car = relationship("Car", back_populates="prices")

    def __repr__(self):
        return f"<PriceRecord car_id={self.car_id} price={self.price} date={self.date}>"
