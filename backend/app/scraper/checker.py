"""
چک واقعی آگهی — خواندن اطلاعات واقعی از لینک
"""

import asyncio
from typing import Optional, Dict
from app.scraper.divar import DivarScraper
from app.scraper.bama import BamaScraper


class AdChecker:
    """بررسی واقعی آگهی"""

    def __init__(self):
        self.divar = DivarScraper()
        self.bama = BamaScraper()

    async def check(self, url: str) -> Optional[Dict]:
        """چک واقعی: لینک بده → اطلاعات + امتیاز سلامت"""

        if "divar.ir" in url:
            ad_data = await self.divar.get_ad_details(url)
        elif "bama.ir" in url:
            ad_data = await self.bama.get_ad_details(url)
        else:
            return None

        if not ad_data:
            return None

        health_checks = self._health_checks(ad_data)
        health_score = self._calc_score(health_checks)

        return {
            "ad_data": ad_data,
            "health_checks": health_checks,
            "health_score": health_score,
        }

    def _health_checks(self, ad: Dict) -> list:
        """بررسی‌های سلامت واقعی"""
        checks = []

        # عکس کافی
        imgs = ad.get("image_count", 0)
        checks.append({
            "label": "عکس‌های کافی",
            "passed": imgs >= 3,
            "detail": f"{imgs} عکس" if imgs >= 3 else "عکس کمه — مشکوکه",
        })

        # قیمت منطقی
        price = ad.get("price")
        if price:
            ok = 50 < price < 10000
            checks.append({
                "label": "قیمت منطقی",
                "passed": ok,
                "detail": f"{price} میلیون" if ok else "قیمت غیرمنطقی",
            })

        # عنوان
        title = ad.get("title", "")
        checks.append({
            "label": "عنوان معتبر",
            "passed": len(title) > 5,
            "detail": title[:40] if title else "عنوان ندارد",
        })

        # اطلاعات کامل
        has_info = ad.get("year") and ad.get("mileage")
        checks.append({
            "label": "اطلاعات کامل",
            "passed": bool(has_info),
            "detail": "سال و کارکرد مشخصه" if has_info else "اطلاعات ناقصه",
        })

        # منبع
        checks.append({
            "label": "منبع معتبر",
            "passed": ad.get("source") in ["divar", "bama"],
            "detail": f"از {ad.get('source', '?')}",
        })

        return checks

    def _calc_score(self, checks: list) -> int:
        if not checks:
            return 50
        passed = sum(1 for c in checks if c["passed"])
        return int((passed / len(checks)) * 100)
