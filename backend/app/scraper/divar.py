"""
اسکرپر دیوار — خواندن اطلاعات آگهی از divar.ir
با رعایت delay برای بلاک نشدن
"""

import httpx
import random
import asyncio
import re
from typing import Optional, Dict

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
]


class DivarScraper:
    """اسکرپر دیوار — خواندن آگهی‌های خودرو"""

    def __init__(self):
        self.headers = {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "application/json, text/html",
            "Accept-Language": "fa-IR,fa;q=0.9",
        }

    async def get_ad_details(self, url: str) -> Optional[Dict]:
        """دریافت اطلاعات آگهی از لینک دیوار"""
        try:
            token = self._extract_token(url)
            if not token:
                print(f"[DivarScraper] No token found in URL")
                return None

            # delay تصادفی (۲ تا ۵ ثانیه)
            await asyncio.sleep(random.uniform(2, 5))

            async with httpx.AsyncClient(timeout=15) as client:
                self.headers["User-Agent"] = random.choice(USER_AGENTS)

                # روش ۱: API دیوار
                api_url = f"https://api.divar.ir/v8/posts-v2/web/{token}"
                print(f"[DivarScraper] Trying API: {api_url}")
                response = await client.get(api_url, headers=self.headers)
                print(f"[DivarScraper] API response: {response.status_code}")

                if response.status_code == 200:
                    data = response.json()
                    return self._parse_api_response(data, url)

                # روش ۲: HTML fallback
                print(f"[DivarScraper] API failed, trying HTML...")
                await asyncio.sleep(random.uniform(1, 3))
                response = await client.get(url, headers=self.headers, follow_redirects=True)
                print(f"[DivarScraper] HTML response: {response.status_code}")
                
                if response.status_code == 200:
                    return self._parse_html(response.text, url)

        except Exception as e:
            print(f"[DivarScraper] Error: {e}")
            return None

    async def search_cars(self, city: str = "tehran", limit: int = 20) -> list:
        """جستجوی آگهی‌های خودرو"""
        try:
            await asyncio.sleep(random.uniform(3, 7))

            payload = {
                "city_ids": [self._get_city_id(city)],
                "search_data": {
                    "form_data": {"data": {"category": {"str": {"value": "light"}}}}
                }
            }

            async with httpx.AsyncClient(timeout=15) as client:
                self.headers["User-Agent"] = random.choice(USER_AGENTS)
                response = await client.post(
                    "https://api.divar.ir/v8/postlist/w/search",
                    json=payload,
                    headers=self.headers,
                )

                if response.status_code == 200:
                    return self._parse_search(response.json(), limit)

        except Exception as e:
            print(f"[DivarScraper] Search error: {e}")
        return []

    def _extract_token(self, url: str) -> Optional[str]:
        """استخراج token از URL"""
        # حذف query string
        url_clean = url.split('?')[0]
        
        patterns = [
            r'divar\.ir/v/[^/]+/([a-zA-Z0-9_-]+)',
            r'divar\.ir/v/([a-zA-Z0-9_-]+)',
        ]
        for pattern in patterns:
            match = re.search(pattern, url_clean)
            if match:
                token = match.group(1)
                print(f"[DivarScraper] Extracted token: {token}")
                return token
        
        print(f"[DivarScraper] Could not extract token from: {url_clean}")
        return None

    def _parse_api_response(self, data: dict, url: str) -> Optional[Dict]:
        """پارس پاسخ API دیوار — ساختار واقعی"""
        try:
            result = {
                "url": url,
                "source": "divar",
                "title": "",
                "price": None,
                "brand": None,
                "model": None,
                "year": None,
                "mileage": None,
                "color": None,
                "city": None,
                "image_count": 0,
                "description": "",
            }

            # شهر
            if "city" in data:
                result["city"] = data["city"].get("name", "")

            # عنوان از share
            if "share" in data:
                result["title"] = data["share"].get("title", "")

            # webengage — قیمت و تعداد عکس
            if "webengage" in data:
                we = data["webengage"]
                price_raw = we.get("price", 0)
                if price_raw and price_raw > 0:
                    # قیمت دیوار به تومان هست — تبدیل به میلیون تومان
                    result["price"] = int(price_raw / 1000000)
                result["image_count"] = we.get("image_count", 0)
                brand_model = we.get("brand_model", "")
                if brand_model:
                    parts = brand_model.split(" ", 1)
                    if len(parts) >= 1:
                        result["brand"] = parts[0]
                    if len(parts) >= 2:
                        result["model"] = parts[1]

            # SEO schema — رنگ و کارکرد
            if "seo" in data and "post_seo_schema" in data["seo"]:
                schema = data["seo"]["post_seo_schema"]
                if "color" in schema:
                    result["color"] = schema["color"]
                if "mileageFromOdometer" in schema:
                    mileage_val = schema["mileageFromOdometer"].get("value", "")
                    if mileage_val:
                        result["mileage"] = int(re.sub(r'[^\d]', '', str(mileage_val)))
                if "brand" in schema and isinstance(schema["brand"], dict):
                    brand_name = schema["brand"].get("name", "")
                    if brand_name:
                        result["brand"] = brand_name

            # Sections — اطلاعات تکمیلی
            for section in data.get("sections", []):
                for widget in section.get("widgets", []):
                    wtype = widget.get("widget_type", "")
                    wdata = widget.get("data", {})

                    if wtype == "GROUP_INFO_ROW":
                        for item in wdata.get("items", []):
                            title = item.get("title", "")
                            value = item.get("value", "")
                            if "کارکرد" in title:
                                result["mileage"] = self._parse_num(value)
                            elif "سال" in title or "مدل" in title:
                                result["year"] = value
                            elif "رنگ" in title:
                                result["color"] = value

                    elif wtype == "UNEXPANDABLE_ROW":
                        title = wdata.get("title", "")
                        value = wdata.get("value", "")
                        if "برند" in title:
                            result["brand"] = value
                        elif "قیمت" in title:
                            result["price"] = self._parse_price(value)

                    elif wtype == "IMAGE_CAROUSEL":
                        items = wdata.get("items", [])
                        result["image_count"] = len(items)

            print(f"[DivarScraper] Parsed: {result['title']} | price={result['price']} | brand={result['brand']}")
            return result

        except Exception as e:
            print(f"[DivarScraper] Parse error: {e}")
            return None

    def _parse_html(self, html: str, url: str) -> Optional[Dict]:
        """Fallback: پارس HTML"""
        result = {
            "url": url,
            "source": "divar",
            "title": "",
            "price": None,
            "brand": None,
            "model": None,
            "year": None,
            "mileage": None,
            "color": None,
            "city": None,
            "image_count": html.count('img') // 3,
        }

        title_match = re.search(r'<title>([^<]+)</title>', html)
        if title_match:
            result["title"] = title_match.group(1).strip()

        price_match = re.search(r'(\d[\d,]+)\s*تومان', html)
        if price_match:
            result["price"] = self._parse_price(price_match.group(1))

        year_match = re.search(r'(1[34]\d{2})', html)
        if year_match:
            result["year"] = year_match.group(1)

        return result

    def _parse_search(self, data: dict, limit: int) -> list:
        """پارس نتایج جستجو"""
        results = []
        for post in data.get("list_widgets", [])[:limit]:
            pdata = post.get("data", {})
            token = pdata.get("action", {}).get("payload", {}).get("token", "")
            if token:
                results.append({
                    "url": f"https://divar.ir/v/{token}",
                    "title": pdata.get("title", ""),
                })
        return results

    def _parse_price(self, text: str) -> Optional[int]:
        """تبدیل متن قیمت به میلیون تومان"""
        if not text:
            return None
        nums = re.sub(r'[^\d]', '', text)
        if nums:
            price = int(nums)
            if price > 1000000000: return price // 10000000
            elif price > 1000000: return price // 1000000
            elif price > 100: return price
        return None

    def _parse_num(self, text: str) -> Optional[int]:
        nums = re.sub(r'[^\d]', '', text)
        return int(nums) if nums else None

    def _get_city_id(self, city: str) -> int:
        cities = {"tehran": 1, "isfahan": 4, "shiraz": 7, "karaj": 301, "mashhad": 3, "tabriz": 2}
        return cities.get(city, 1)
