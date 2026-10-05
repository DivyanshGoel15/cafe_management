import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


class Settings:
    """Central application settings loaded from environment variables."""

    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "yes")

    # Mock mode flag - when True, all external APIs and WhatsApp calls are simulated
    MOCK_MODE: bool = os.getenv("MOCK_MODE", "true").lower() in ("true", "1", "yes")

    DEFAULT_CAFE_ID: str = os.getenv("DEFAULT_CAFE_ID", "cafe_central_001")
    DEFAULT_CAFE_NAME: str = os.getenv("DEFAULT_CAFE_NAME", "The Roasted Bean Cafe")

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./whatsapp_automation.db")

    # WhatsApp Business Cloud API Settings
    WHATSAPP_PHONE_NUMBER_ID: str = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
    WHATSAPP_BUSINESS_ACCOUNT_ID: str = os.getenv("WHATSAPP_BUSINESS_ACCOUNT_ID", "")
    WHATSAPP_ACCESS_TOKEN: str = os.getenv("WHATSAPP_ACCESS_TOKEN", "")
    WHATSAPP_WEBHOOK_VERIFY_TOKEN: str = os.getenv("WHATSAPP_WEBHOOK_VERIFY_TOKEN", "verify_token_default")

    # Cafe API Settings (Supports Vercel Service Binding QR_SYSTEM_URL)
    CAFE_API_BASE_URL: str = os.getenv("CAFE_API_BASE_URL") or os.getenv("QR_SYSTEM_URL") or "http://localhost:3000/api"
    CAFE_API_KEY: str = os.getenv("CAFE_API_KEY", "")

    # Safeguards & Limits
    MARKETING_HOURLY_RATE_LIMIT: int = int(os.getenv("MARKETING_HOURLY_RATE_LIMIT", "100"))
    MAX_RETRIES_PER_MESSAGE: int = int(os.getenv("MAX_RETRIES_PER_MESSAGE", "3"))
    BOOKING_REMINDER_FIRST_HOURS: int = int(os.getenv("BOOKING_REMINDER_FIRST_HOURS", "24"))
    BOOKING_REMINDER_SECOND_HOURS: int = int(os.getenv("BOOKING_REMINDER_SECOND_HOURS", "2"))

    # Security
    API_KEY_SECRET: str = os.getenv("API_KEY_SECRET", "cafe_automation_secret_key")
    WEBHOOK_SECRET: str = os.getenv("WEBHOOK_SECRET", "cafe_webhook_secret_key")


settings = Settings()
