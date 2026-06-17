"""
دیتابیس — اتصال و مدیریت SQLite (بعداً PostgreSQL)
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "sqlite:///./check_mashin.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def create_tables():
    """ساخت جداول دیتابیس"""
    from app.models.car import Car  # noqa
    from app.models.price import PriceRecord  # noqa
    from app.models.ad import Ad  # noqa
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency — دسترسی به session دیتابیس"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
