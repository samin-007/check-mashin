"""
Seed Data — داده‌های شبیه‌سازی واقعی بازار خودرو ایران
قیمت‌ها نزدیک به واقعیت بازار هستن (میلیون تومان)
"""

from datetime import datetime, timedelta
import random
from app.db.database import SessionLocal, create_tables
from app.models.car import Car
from app.models.price import PriceRecord
from app.models.ad import Ad


# ======= داده‌های خودرو =======
CARS_DATA = [
    # ایران‌خودرو
    {"brand": "پژو", "model": "۲۰۷", "trim": "اتوماتیک", "year": "۱۴۰۲", "category": "هاچبک", "market_price": 1280, "factory_price": 680, "weekly": 2.3, "monthly": 5.1, "ads": 145},
    {"brand": "پژو", "model": "۲۰۷", "trim": "دنده‌ای", "year": "۱۴۰۲", "category": "هاچبک", "market_price": 1050, "factory_price": 560, "weekly": 1.8, "monthly": 4.2, "ads": 98},
    {"brand": "پژو", "model": "۲۰۷", "trim": "اتوماتیک", "year": "۱۴۰۳", "category": "هاچبک", "market_price": 1420, "factory_price": 720, "weekly": 1.5, "monthly": 3.8, "ads": 67},
    {"brand": "دنا", "model": "پلاس", "trim": "توربو", "year": "۱۴۰۲", "category": "سدان", "market_price": 1350, "factory_price": 720, "weekly": 1.8, "monthly": 4.5, "ads": 112},
    {"brand": "دنا", "model": "پلاس", "trim": "اتوماتیک", "year": "۱۴۰۳", "category": "سدان", "market_price": 1480, "factory_price": 780, "weekly": 2.1, "monthly": 5.3, "ads": 89},
    {"brand": "تارا", "model": "اتوماتیک", "trim": "", "year": "۱۴۰۳", "category": "سدان", "market_price": 1530, "factory_price": 820, "weekly": -0.5, "monthly": 2.1, "ads": 78},
    {"brand": "تارا", "model": "دنده‌ای", "trim": "", "year": "۱۴۰۳", "category": "سدان", "market_price": 1280, "factory_price": 690, "weekly": -0.8, "monthly": 1.5, "ads": 56},
    {"brand": "پژو", "model": "پارس", "trim": "", "year": "۱۴۰۱", "category": "سدان", "market_price": 850, "factory_price": 0, "weekly": 3.0, "monthly": 6.2, "ads": 180},
    {"brand": "پژو", "model": "پارس", "trim": "", "year": "۱۴۰۰", "category": "سدان", "market_price": 780, "factory_price": 0, "weekly": 2.5, "monthly": 5.0, "ads": 210},
    {"brand": "هایما", "model": "S7", "trim": "توربو", "year": "۱۴۰۱", "category": "شاسی‌بلند", "market_price": 1080, "factory_price": 0, "weekly": -2.1, "monthly": -1.5, "ads": 45},

    # سایپا
    {"brand": "کوییک", "model": "R", "trim": "اتوماتیک", "year": "۱۴۰۲", "category": "هاچبک", "market_price": 790, "factory_price": 420, "weekly": 4.8, "monthly": 8.5, "ads": 210},
    {"brand": "کوییک", "model": "R", "trim": "دنده‌ای", "year": "۱۴۰۲", "category": "هاچبک", "market_price": 620, "factory_price": 350, "weekly": 3.2, "monthly": 6.8, "ads": 165},
    {"brand": "شاهین", "model": "G", "trim": "", "year": "۱۴۰۳", "category": "سدان", "market_price": 920, "factory_price": 510, "weekly": 1.2, "monthly": 3.5, "ads": 89},
    {"brand": "شاهین", "model": "G", "trim": "", "year": "۱۴۰۲", "category": "سدان", "market_price": 830, "factory_price": 480, "weekly": 1.5, "monthly": 4.0, "ads": 120},
    {"brand": "تیبا", "model": "۲", "trim": "", "year": "۱۴۰۲", "category": "هاچبک", "market_price": 480, "factory_price": 280, "weekly": 2.0, "monthly": 4.5, "ads": 320},
    {"brand": "پراید", "model": "۱۱۱", "trim": "", "year": "۱۳۹۸", "category": "هاچبک", "market_price": 380, "factory_price": 0, "weekly": -2.3, "monthly": -3.8, "ads": 450},
    {"brand": "پراید", "model": "۱۳۱", "trim": "", "year": "۱۳۹۹", "category": "سدان", "market_price": 350, "factory_price": 0, "weekly": -1.8, "monthly": -2.5, "ads": 380},

    # سایر
    {"brand": "ام‌وی‌ام", "model": "X22 پرو", "trim": "اتوماتیک", "year": "۱۴۰۲", "category": "شاسی‌بلند", "market_price": 1150, "factory_price": 650, "weekly": 0.5, "monthly": 2.0, "ads": 55},
    {"brand": "فیدلیتی", "model": "پرایم", "trim": "", "year": "۱۴۰۳", "category": "شاسی‌بلند", "market_price": 1680, "factory_price": 950, "weekly": 1.0, "monthly": 3.2, "ads": 35},
    {"brand": "جک", "model": "J4", "trim": "", "year": "۱۴۰۲", "category": "سدان", "market_price": 950, "factory_price": 550, "weekly": -0.5, "monthly": 1.8, "ads": 42},
]


# ======= داده‌های آگهی فرصت =======
def generate_opportunities(cars):
    """تولید آگهی‌های فرصت (زیر قیمت بازار)"""
    opportunities = []
    cities = ["تهران", "اصفهان", "شیراز", "کرج", "مشهد", "تبریز", "اهواز", "قم"]
    
    for car in cars:
        # ۲-۴ فرصت برای هر خودرو
        for _ in range(random.randint(1, 3)):
            discount = random.randint(5, 12)
            price = int(car.market_price * (1 - discount / 100))
            health_score = random.randint(65, 95)
            
            hours_ago = random.randint(1, 48)
            
            ad = Ad(
                url=f"https://divar.ir/v/{car.brand}-{car.model}-{random.randint(10000, 99999)}",
                source=random.choice(["divar", "bama"]),
                title=f"{car.brand} {car.model} {car.trim}",
                price=price,
                brand=car.brand,
                model=car.model,
                year=car.year,
                mileage=random.randint(5000, 60000),
                color=random.choice(["سفید", "مشکی", "نقره‌ای", "خاکستری"]),
                city=random.choice(cities),
                seller_ad_count=random.randint(1, 3),
                is_dealer=False,
                market_price=car.market_price,
                price_diff_percent=-discount,
                health_score=health_score,
                verdict="opportunity",
                is_original_photos=True,
                is_suspicious=False,
                car_id=car.id,
                checked_at=datetime.utcnow() - timedelta(hours=hours_ago),
            )
            opportunities.append(ad)
    
    return opportunities


def generate_price_history(cars):
    """تولید تاریخچه قیمت ۳۰ روزه"""
    records = []
    
    for car in cars:
        base_price = car.market_price
        
        # ۳۰ روز قبل تا الان
        for days_ago in range(30, -1, -1):
            # شبیه‌سازی نوسان روزانه
            daily_change = random.uniform(-1.5, 1.5)
            noise = random.uniform(-0.5, 0.5)
            
            # ترند کلی بر اساس weekly change
            trend = (car.price_change_weekly / 7) * (30 - days_ago)
            
            price = int(base_price * (1 + (trend + daily_change + noise) / 100))
            min_price = int(price * 0.97)
            max_price = int(price * 1.03)
            
            record = PriceRecord(
                car_id=car.id,
                price=price,
                min_price=min_price,
                max_price=max_price,
                avg_price=price,
                source="aggregated",
                sample_count=random.randint(5, 30),
                date=datetime.utcnow() - timedelta(days=days_ago),
            )
            records.append(record)
    
    return records


def seed_database():
    """پر کردن دیتابیس با داده‌های شبیه‌سازی"""
    print("🚗 شروع seed دیتابیس چک‌ماشین...")
    
    # ساخت جداول
    create_tables()
    
    db = SessionLocal()
    
    try:
        # بررسی اینکه قبلاً seed شده یا نه
        existing = db.query(Car).count()
        if existing > 0:
            print(f"⚠️  دیتابیس قبلاً پر شده ({existing} خودرو). Skip...")
            return
        
        # ۱. اضافه کردن خودروها
        print("  📌 اضافه کردن خودروها...")
        cars = []
        for data in CARS_DATA:
            car = Car(
                brand=data["brand"],
                model=data["model"],
                trim=data["trim"],
                year=data["year"],
                category=data["category"],
                market_price=data["market_price"],
                factory_price=data["factory_price"],
                price_change_weekly=data["weekly"],
                price_change_monthly=data["monthly"],
                ad_count=data["ads"],
            )
            db.add(car)
            cars.append(car)
        
        db.commit()
        for car in cars:
            db.refresh(car)
        
        print(f"  ✅ {len(cars)} خودرو اضافه شد")
        
        # ۲. تاریخچه قیمت
        print("  📈 تولید تاریخچه قیمت ۳۰ روزه...")
        price_records = generate_price_history(cars)
        db.add_all(price_records)
        db.commit()
        print(f"  ✅ {len(price_records)} رکورد قیمت اضافه شد")
        
        # ۳. آگهی‌های فرصت
        print("  🔥 تولید آگهی‌های فرصت...")
        opportunities = generate_opportunities(cars)
        db.add_all(opportunities)
        db.commit()
        print(f"  ✅ {len(opportunities)} فرصت اضافه شد")
        
        print("\n🎉 Seed کامل شد!")
        print(f"   خودروها: {len(cars)}")
        print(f"   رکورد قیمت: {len(price_records)}")
        print(f"   فرصت‌ها: {len(opportunities)}")
        
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
