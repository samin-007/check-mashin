"""
چک‌ماشین — بک‌اند API
رادار فرصت خرید + تشخیص کلاهبرداری خودرو
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import market, check_ad
from app.db.database import create_tables

app = FastAPI(
    title="چک‌ماشین API",
    description="رادار فرصت خرید + تشخیص کلاهبرداری خودرو",
    version="1.0.0",
)

# CORS — اجازه دسترسی از اپ موبایل
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    create_tables()


@app.get("/")
async def root():
    return {
        "name": "چک‌ماشین API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "market": "/api/market",
            "check": "/api/check",
        },
    }


# روت‌ها
app.include_router(market.router, prefix="/api/market", tags=["بازار"])
app.include_router(check_ad.router, prefix="/api/check", tags=["چک آگهی"])
