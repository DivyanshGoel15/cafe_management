from typing import Optional
from backend.config.settings import get_settings
from .base import LLMProvider
from .mock_llm import MockLLMProvider
from .openai_llm import OpenAILLMProvider


def get_llm_provider(provider_name: Optional[str] = None) -> LLMProvider:
    """Factory to instantiate LLMProvider based on configuration or argument."""
    settings = get_settings()
    p_name = (provider_name or settings.provider_llm).lower()

    if settings.mock_mode or p_name == "mock":
        return MockLLMProvider()

    if p_name in ("openai", "gpt-4o", "gpt-4o-mini"):
        return OpenAILLMProvider()

    # Default fallback
    return MockLLMProvider()
