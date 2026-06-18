# چک‌ماشین — بک‌اند API

> رادار فرصت خرید + تشخیص کلاهبرداری خودرو

---

## 🚀 شروع سریع

```bash
cd backend

# ساخت virtual environment
python -m venv venv
venv\Scripts\activate        # ویندوز
# source venv/bin/activate   # مک/لینوکس

# نصب وابستگی‌ها
pip install -r requirements.txt

# Seed دیتابیس (داده‌های نمونه)
python -m app.db.seed

# اجرا (فقط لوکال)
uvicorn app.main:app --reload --port 8000

# اجرا (برای دسترسی از گوشی — همیشه از این استفاده کن)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

بعد از اجرا: http://localhost:8000/docs → Swagger UI

> ⚠️ **مهم:** اگه می‌خوای اپ روی گوشی به بک‌اند وصل بشه، حتماً `--host 0.0.0.0` رو اضافه کن!

---

## 📡 API Endpoints

### بازار (`/api/market`)

| Method | Endpoint | توضیح |
|--------|----------|--------|
| GET | `/api/market/index` | شاخص کل بازار خودرو |
| GET | `/api/market/cars` | لیست خودروها (فیلتر + مرتب‌سازی) |
| GET | `/api/market/cars/{id}` | جزئیات یک خودرو + تاریخچه |
| GET | `/api/market/cars/{id}/history` | تاریخچه قیمت |
| GET | `/api/market/opportunities` | فرصت‌های خرید (زیر بازار) |
| GET | `/api/market/brands` | لیست برندها |
| GET | `/api/market/compare` | مقایسه با دلار/طلا/بورس |

### چک آگهی (`/api/check`)

| Method | Endpoint | توضیح |
|--------|----------|--------|
| POST | `/api/check/analyze` | چک آگهی (لینک → نتیجه) |
| GET | `/api/check/history` | تاریخچه چک‌ها |
| POST | `/api/check/report/{id}` | گزارش آگهی مشکوک |

---

## 🗄️ دیتابیس

SQLite (فعلاً) → PostgreSQL (بعداً)

### جداول:
- **cars** — اطلاعات پایه خودروها + قیمت فعلی
- **price_records** — تاریخچه قیمت روزانه
- **ads** — آگهی‌های بررسی‌شده

---

## 📂 ساختار

```
backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── api/
│   │   ├── market.py        # API بازار
│   │   └── check_ad.py      # API چک آگهی
│   ├── models/
│   │   ├── car.py           # مدل خودرو
│   │   ├── price.py         # مدل قیمت
│   │   └── ad.py            # مدل آگهی
│   ├── schemas/
│   │   ├── car.py           # Pydantic schemas
│   │   └── ad.py
│   ├── services/
│   │   ├── market_service.py    # منطق بازار
│   │   └── check_service.py     # منطق چک آگهی
│   └── db/
│       ├── database.py      # اتصال دیتابیس
│       └── seed.py          # داده‌های نمونه
└── requirements.txt
```

---

## 🔧 تکنولوژی

- **FastAPI** — فریمورک وب
- **SQLAlchemy** — ORM
- **Pydantic** — اعتبارسنجی داده
- **SQLite** → **PostgreSQL** — دیتابیس
- **Uvicorn** — ASGI server
