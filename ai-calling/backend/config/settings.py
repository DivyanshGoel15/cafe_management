import os
from functools import lru_cache
from typing import Optional
from dotenv import load_dotenv
from pydantic import BaseModel, Field, ConfigDict

# Load .env if present
load_dotenv()


class Settings(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    # App Information
    app_name: str = "Cafe AI Calling Service"
    app_version: str = "1.0.0"
    environment: str = Field(default_factory=lambda: os.getenv("ENVIRONMENT", "development"))
    debug: bool = Field(default_factory=lambda: os.getenv("DEBUG", "true").lower() in ("true", "1", "yes"))
    port: int = Field(default_factory=lambda: int(os.getenv("PORT", "8000")))
    host: str = Field(default_factory=lambda: os.getenv("HOST", "0.0.0.0"))

    # Mock Mode
    mock_mode: bool = Field(default_factory=lambda: os.getenv("MOCK_MODE", "true").lower() in ("true", "1", "yes"))

    # Security
    api_key: str = Field(default_factory=lambda: os.getenv("API_KEY", "dev-secret-key-change-in-production"))
    enable_api_auth: bool = Field(default_factory=lambda: os.getenv("ENABLE_API_AUTH", "false").lower() in ("true", "1", "yes"))
    rate_limit_per_minute: int = Field(default_factory=lambda: int(os.getenv("RATE_LIMIT_PER_MINUTE", "60")))

    # Provider Options: mock | openai | twilio | elevenlabs | whisper
    provider_telephony: str = Field(default_factory=lambda: os.getenv("PROVIDER_TELEPHONY", "mock").lower())
    provider_stt: str = Field(default_factory=lambda: os.getenv("PROVIDER_STT", "mock").lower())
    provider_tts: str = Field(default_factory=lambda: os.getenv("PROVIDER_TTS", "mock").lower())
    provider_llm: str = Field(default_factory=lambda: os.getenv("PROVIDER_LLM", "mock").lower())

    # Database
    database_url: str = Field(default_factory=lambda: os.getenv("DATABASE_URL", "sqlite:///./ai_calling.db"))

    # Cafe Configuration & API Integration (Supports Vercel Service Binding QR_SYSTEM_URL)
    cafe_id: str = Field(default_factory=lambda: os.getenv("CAFE_ID", "cafe-bella-vista"))
    cafe_api_base_url: str = Field(default_factory=lambda: os.getenv("CAFE_API_BASE_URL") or os.getenv("QR_SYSTEM_URL") or "http://localhost:5000/api")
    use_mock_cafe_api: bool = Field(default_factory=lambda: os.getenv("USE_MOCK_CAFE_API", "true").lower() in ("true", "1", "yes"))

    # Twilio Telephony Settings
    twilio_account_sid: Optional[str] = Field(default_factory=lambda: os.getenv("TWILIO_ACCOUNT_SID"))
    twilio_auth_token: Optional[str] = Field(default_factory=lambda: os.getenv("TWILIO_AUTH_TOKEN"))
    twilio_phone_number: str = Field(default_factory=lambda: os.getenv("TWILIO_PHONE_NUMBER", "+15550001111"))

    # OpenAI Settings
    openai_api_key: Optional[str] = Field(default_factory=lambda: os.getenv("OPENAI_API_KEY"))
    openai_model: str = Field(default_factory=lambda: os.getenv("OPENAI_MODEL", "gpt-4o-mini"))
    openai_tts_voice: str = Field(default_factory=lambda: os.getenv("OPENAI_TTS_VOICE", "alloy"))

    # ElevenLabs Settings
    elevenlabs_api_key: Optional[str] = Field(default_factory=lambda: os.getenv("ELEVENLABS_API_KEY"))
    elevenlabs_voice_id: str = Field(default_factory=lambda: os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM"))

    # Human Escalation Settings
    human_agent_phone: str = Field(default_factory=lambda: os.getenv("HUMAN_AGENT_PHONE", "+15551234567"))
    escalation_email: str = Field(default_factory=lambda: os.getenv("ESCALATION_EMAIL", "manager@bellavista.cafe"))
    max_misunderstandings_before_escalation: int = Field(
        default_factory=lambda: int(os.getenv("MAX_MISUNDERSTANDINGS_BEFORE_ESCALATION", "3"))
    )


@lru_cache()
def get_settings() -> Settings:
    """Return cached singleton instance of application settings."""
    return Settings()
