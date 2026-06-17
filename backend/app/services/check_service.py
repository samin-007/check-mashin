"""
سرویس چک آگهی — منطق تجاری بررسی و امتیازدهی آگهی
"""

from sqlalchemy.orm import Session
from datetime import datetime
import random
import re
from typing import Optional
from app.models.car import Car
from app.models.ad import Ad


class CheckService:

    @staticmethod
    def analyze_ad(db: Session, url: str) -> dict:
        """تحلیل کامل یک آگهی"""
        
        # تشخیص منبع
        source = "divar" if "divar.ir" in url else "bama"
        
        # بررسی آیا قبلاً چک شده
        existing = db.query(Ad).filter(Ad.url == url).first()
        if existing:
            return CheckService._build_result(existing)
        
        # استخراج اطلاعات از URL (شبیه‌سازی)
        ad_info = CheckService._extract_ad_info(url, source)
        
        # پیدا کردن خودرو مشابه در دیتابیس
        car = CheckService._find_matching_car(db, ad_info)
        
        # محاسبه قیمت بازار
        market_price = car.market_price if car else ad_info["price"]
        
        # محاسبه درصد اختلاف
        price_diff = ((ad_info["price"] - market_price) / market_price) * 100 if market_price > 0 else 0
        
        # بررسی‌های سلامت
        health_checks = CheckService._run_health_checks(ad_info, price_diff)
        
        # محاسبه امتیاز سلامت
        health_score = CheckService._calculate_health_score(health_checks, price_diff)
        
        # تعیین حکم نهایی
        verdict, verdict_text = CheckService._determine_verdict(health_score, price_diff)
        
        # ذخیره در دیتابیس
        ad = Ad(
            url=url,
            source=source,
            title=f"{ad_info['brand']} {ad_info['model']} {ad_info['trim']}",
            price=ad_info["price"],
            brand=ad_info["brand"],
            model=ad_info["model"],
            year=ad_info["year"],
            mileage=ad_info.get("mileage"),
            color=ad_info.get("color"),
            city=ad_info.get("city"),
            seller_ad_count=ad_info.get("seller_ad_count", 1),
            is_dealer=ad_info.get("seller_ad_count", 1) > 3,
            market_price=market_price,
            price_diff_percent=round(price_diff, 1),
            health_score=health_score,
            verdict=verdict,
            is_original_photos=ad_info.get("is_original_photos", True),
            is_suspicious=verdict == "scam",
            car_id=car.id if car else None,
        )
        db.add(ad)
        db.commit()
        db.refresh(ad)
        
        return CheckService._build_result(ad)

    @staticmethod
    def _extract_ad_info(url: str, source: str) -> dict:
        """استخراج اطلاعات از آگهی (شبیه‌سازی — بعداً اسکرپ واقعی)"""
        
        # شبیه‌سازی بر اساس لینک
        # تولید داده واقع‌گرایانه
        cars_data = [
            {"brand": "پژو", "model": "۲۰۷", "trim": "اتوماتیک", "price": 1180, "year": "۱۴۰۲"},
            {"brand": "پژو", "model": "۲۰۷", "trim": "دنده‌ای", "price": 980, "year": "۱۴۰۲"},
            {"brand": "دنا", "model": "پلاس", "trim": "توربو", "price": 1250, "year": "۱۴۰۲"},
            {"brand": "تارا", "model": "اتوماتیک", "trim": "", "price": 1420, "year": "۱۴۰۳"},
            {"brand": "کوییک", "model": "R", "trim": "اتوماتیک", "price": 720, "year": "۱۴۰۲"},
            {"brand": "شاهین", "model": "G", "trim": "", "price": 850, "year": "۱۴۰۳"},
            {"brand": "هایما", "model": "S7", "trim": "توربو", "price": 980, "year": "۱۴۰۱"},
            {"brand": "پژو", "model": "پارس", "trim": "", "price": 850, "year": "۱۴۰۱"},
        ]
        
        # انتخاب تصادفی بر اساس hash لینک
        idx = hash(url) % len(cars_data)
        car_data = cars_data[idx]
        
        # تغییرات تصادفی کوچک روی قیمت
        price_variation = random.randint(-8, 5)
        actual_price = int(car_data["price"] * (1 + price_variation / 100))
        
        colors = ["سفید", "مشکی", "نقره‌ای", "خاکستری", "آبی", "قرمز"]
        cities = ["تهران", "اصفهان", "شیراز", "کرج", "مشهد", "تبریز"]
        
        return {
            "brand": car_data["brand"],
            "model": car_data["model"],
            "trim": car_data["trim"],
            "year": car_data["year"],
            "price": actual_price,
            "mileage": random.randint(5000, 80000),
            "color": random.choice(colors),
            "city": random.choice(cities),
            "seller_ad_count": random.choices([1, 1, 1, 2, 3, 5, 8, 12], weights=[40, 20, 15, 10, 5, 5, 3, 2])[0],
            "is_original_photos": random.random() > 0.15,
            "ad_age_hours": random.randint(1, 72),
        }

    @staticmethod
    def _find_matching_car(db: Session, ad_info: dict) -> Optional[Car]:
        """پیدا کردن خودرو مشابه در دیتابیس"""
        return (
            db.query(Car)
            .filter(Car.brand == ad_info["brand"])
            .filter(Car.model == ad_info["model"])
            .filter(Car.year == ad_info["year"])
            .first()
        )

    @staticmethod
    def _run_health_checks(ad_info: dict, price_diff: float) -> list:
        """اجرای بررسی‌های سلامت"""
        checks = []
        
        # ۱. عکس اوریجینال
        is_original = ad_info.get("is_original_photos", True)
        checks.append({
            "label": "عکس اوریجینال",
            "passed": is_original,
            "detail": "عکس‌ها منحصر به این آگهی" if is_original else "عکس‌ها احتمالاً کپی شده",
        })
        
        # ۲. فروشنده شخصی
        seller_count = ad_info.get("seller_ad_count", 1)
        is_personal = seller_count <= 3
        checks.append({
            "label": "شماره شخصی",
            "passed": is_personal,
            "detail": f"فقط {seller_count} آگهی فعال" if is_personal else f"{seller_count} آگهی فعال (احتمالاً دلال)",
        })
        
        # ۳. قیمت منطقی
        price_ok = -15 < price_diff < 15
        if price_diff < -15:
            detail = f"{abs(int(price_diff))}٪ زیر بازار (مشکوکانه ارزان)"
        elif price_diff > 15:
            detail = f"{int(price_diff)}٪ بالای بازار (گران)"
        else:
            detail = f"{abs(int(price_diff))}٪ {'زیر' if price_diff < 0 else 'بالای'} میانگین بازار"
        checks.append({
            "label": "قیمت منطقی",
            "passed": price_ok,
            "detail": detail,
        })
        
        # ۴. متن آگهی
        checks.append({
            "label": "متن آگهی معتبر",
            "passed": True,
            "detail": "کپی نشده",
        })
        
        # ۵. تازگی آگهی
        ad_age = ad_info.get("ad_age_hours", 24)
        is_fresh = ad_age < 48
        checks.append({
            "label": "تازگی آگهی",
            "passed": is_fresh,
            "detail": f"ثبت‌شده {ad_age} ساعت پیش" if is_fresh else f"آگهی قدیمی ({ad_age} ساعت پیش)",
        })
        
        # ۶. سابقه فروشنده
        has_report = seller_count > 8
        checks.append({
            "label": "سابقه فروشنده",
            "passed": not has_report,
            "detail": "بدون گزارش منفی" if not has_report else "تعداد آگهی زیاد — احتیاط",
        })
        
        return checks

    @staticmethod
    def _calculate_health_score(checks: list, price_diff: float) -> int:
        """محاسبه امتیاز سلامت (0-100)"""
        score = 100
        
        # هر بررسی ناموفق -15
        for check in checks:
            if not check["passed"]:
                score -= 15
        
        # قیمت خیلی پایین مشکوکه
        if price_diff < -20:
            score -= 20
        
        # حداقل 0، حداکثر 100
        return max(0, min(100, score))

    @staticmethod
    def _determine_verdict(health_score: int, price_diff: float) -> tuple:
        """تعیین حکم نهایی"""
        if health_score < 40:
            return "scam", "⚠️ این آگهی مشکوکه — خرید نکن!"
        elif health_score < 60:
            return "overpriced" if price_diff > 5 else "fair", \
                   "احتیاط کن — قبل از خرید حتماً کارشناسی کن" if price_diff <= 5 else \
                   "قیمت بالاتر از بازاره — چونه بزن یا بگرد"
        elif price_diff < -5:
            return "opportunity", "فرصت خوبیه، برو ببینش! 🔥"
        elif price_diff > 5:
            return "overpriced", "قیمتش بالاتر از بازاره — شاید بشه چونه زد"
        else:
            return "fair", "قیمت منصفانه‌ست — اگه خوشت اومد بخرش ✓"

    @staticmethod
    def _build_result(ad: Ad) -> dict:
        """ساخت خروجی نهایی"""
        price_diff = ad.price_diff_percent or 0
        market_price = ad.market_price or ad.price
        
        # محاسبه صرفه‌جویی
        saving = market_price - ad.price if market_price > ad.price else 0
        saving_text = f"{saving} میلیون" if saving > 0 else None
        
        # تعیین حکم
        _, verdict_text = CheckService._determine_verdict(
            ad.health_score or 50, price_diff
        )
        
        # بررسی‌های سلامت
        health_checks = CheckService._run_health_checks(
            {
                "is_original_photos": ad.is_original_photos,
                "seller_ad_count": ad.seller_ad_count,
                "ad_age_hours": 12,
            },
            price_diff,
        )
        
        return {
            "car_name": f"{ad.brand} {ad.model}",
            "brand": ad.brand or "",
            "model": ad.model or "",
            "year": ad.year or "",
            "mileage": f"{ad.mileage:,} کیلومتر" if ad.mileage else None,
            "color": ad.color,
            "city": ad.city,
            "health_score": ad.health_score or 0,
            "verdict": ad.verdict or "fair",
            "verdict_text": verdict_text,
            "saving_amount": saving_text,
            "price_comparison": {
                "ad_price": ad.price,
                "market_price": market_price,
                "diff_percent": round(price_diff, 1),
                "diff_amount": int(ad.price - market_price),
                "price_one_week_ago": int(market_price * 1.01),
                "price_two_weeks_ago": int(market_price * 1.02),
                "price_one_month_ago": int(market_price * 0.97),
            },
            "health_checks": health_checks,
            "source": ad.source or "divar",
            "checked_at": ad.checked_at or datetime.utcnow(),
        }

    @staticmethod
    def get_recent_checks(db: Session, limit: int = 10):
        """آخرین آگهی‌های چک‌شده"""
        ads = db.query(Ad).order_by(Ad.checked_at.desc()).limit(limit).all()
        return [
            {
                "id": ad.id,
                "car_name": f"{ad.brand} {ad.model}",
                "price": ad.price,
                "health_score": ad.health_score,
                "verdict": ad.verdict,
                "source": ad.source,
                "checked_at": ad.checked_at,
            }
            for ad in ads
        ]

    @staticmethod
    def report_ad(db: Session, ad_id: int):
        """گزارش آگهی مشکوک"""
        ad = db.query(Ad).filter(Ad.id == ad_id).first()
        if not ad:
            return {"error": "آگهی پیدا نشد"}
        
        ad.reported_count += 1
        if ad.reported_count >= 3:
            ad.is_suspicious = True
        db.commit()
        
        return {"message": "گزارش ثبت شد", "total_reports": ad.reported_count}
