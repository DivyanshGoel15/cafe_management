import os
from typing import Optional
from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "Cafe Aroma QR Dine-In Ordering"
    cafe_id: str = os.getenv("CAFE_ID", "cafe_aroma_01")
    cafe_name: str = os.getenv("CAFE_NAME", "Cafe Aroma")
    cafe_tagline: str = os.getenv("CAFE_TAGLINE", "Artisanal Brews & Fresh Bites")
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    base_url: str = os.getenv("BASE_URL", "http://localhost:8000")
    tax_rate: float = float(os.getenv("TAX_RATE", "0.05"))  # 5% GST
    service_charge_rate: float = float(os.getenv("SERVICE_CHARGE_RATE", "0.0"))
    currency: str = "₹"
    currency_code: str = "INR"
    api_staff_key: str = os.getenv("API_STAFF_KEY", "staff_default_token_placeholder")
    environment: str = os.getenv("ENVIRONMENT", "development")

settings = Settings()
