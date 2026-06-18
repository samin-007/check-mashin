"""
اسکرپر باما — خواندن اطلاعات آگهی از bama.ir
"""

import httpx
import random
import asyncio
import re
from typing import Optional, Dict, List

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
]


class BamaScraper:
    """اسکرپر باما — خواندن قیمت و آگهی"""

    def __init__(self):
        self.headers = {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "application/json, text/html",
            "Accept-Language": "fa-IR,fa;q=0.9",
        }

    async def get_ad_details(self, url: str) -> Optional[Dict]:
        """دریافت اطلاعات آگهی از لینک باما"""
        try:
            await asyncio.sleep(random.uniform(2, 5))

            async with httpx.AsyncClient(timeout=15) as client:
                self.headers["User-Agent"] = random.choice(USER_AGENTS)
                response = await client.get(url, headers=self.headers, follow_redirects=True)

                if response.status_code != 200:
                    return None

                return self._parse_html(response.text, url)

        except Exception as e:
            print(f"[BamaScraper] Error: {e}")
            return None

    async def get_price_list(self) -> List[Dict]:
        """دریافت لیست قیمت روز"""
        try:
            await asyncio.sleep(random.uniform(3, 7))

            async with httpx.AsyncClient(timeout=15) as client:
                self.headers["User-Agent"] = random.choice(USER_AGENTS)
                response = await client.get(
                    "https://bama.ir/car/price-list",
                    headers=self.headers,
                    follow_redirects=True,
                )

                if response.status_code == 200:
                    return self._parse_price_list(response.text)

        except Exception as e:
            print(f"[BamaScraper] Price list error: {e}")
        return []

    def _parse_html(self, html: str, url: str) -> Optional[Dict]:
        """پارس HTML آگهی باما"""
        result = {
            "url": url,
            "source": "bama",
            "title": "",
            "price": None,
            "brand": None,
            "model": None,
            "year": None,
            "mileage": None,
            "color": None,
            "city": None,
            "image_count": 0,
        }

        # عنوان
        title_match = re.search(r'<title>([^<]+)</title>', html)
        if title_match:
            result["title"] = title_match.group(1).strip()

        # قیمت
        for pattern in [r'"price"\s*:\s*"?(\d+)"?', r'قیمت.*?(\d[\d,]+)', r'price.*?(\d[\d,]+)']:
            match = re.search(pattern, html, re.IGNORECASE)
            if match:
                result["price"] = self._parse_price(match.group(1))
                break

        # سال
        year_match = re.search(r'(1[34]\d{2})', html)
        if year_match:
            result["year"] = year_match.group(1)

        # کارکرد
        mileage_match = re.search(r'کارکرد.*?(\d[\d,]+)', html)
        if mileage_match:
            result["mileage"] = int(re.sub(r'[^\d]', '', mileage_match.group(1)))

        # رنگ
        for color in ["سفید", "مشکی", "نقره‌ای", "خاکستری", "آبی", "قرمز"]:
            if color in html:
                result["color"] = color
                break

        # تعداد عکس
        result["image_count"] = len(re.findall(r'<img[^>]+src="[^"]*car', html))

        return result

    def _parse_price_list(self, html: str) -> List[Dict]:
        """پارس لیست قیمت"""
        results = []
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
        for row in rows:
            cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
            if len(cells) >= 2:
                name = re.sub(r'<[^>]+>', '', cells[0]).strip()
                price_text = re.sub(r'<[^>]+>', '', cells[-1]).strip()
                if name and price_text:
                    price = self._parse_price(price_text)
                    if price:
                        results.append({"name": name, "price": price})
        return results

    def _parse_price(self, text: str) -> Optional[int]:
        """تبدیل به میلیون تومان"""
        if not text:
            return None
        nums = re.sub(r'[^\d]', '', text)
        if nums:
            price = int(nums)
            if price > 1000000000: return price // 10000000
            elif price > 1000000: return price // 1000000
            elif price > 100: return price
        return None
