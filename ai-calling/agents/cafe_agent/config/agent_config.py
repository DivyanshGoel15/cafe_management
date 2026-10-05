from typing import Optional
from pydantic import BaseModel, Field


class AgentPersonalityConfig(BaseModel):
    name: str = "Bella"
    role: str = "Host & Reservation Specialist"
    cafe_name: str = "Bella Vista Bistro"
    tone: str = "natural, concise, professional, friendly"
    language: str = "en-US"
    max_tokens: int = 150
    temperature: float = 0.3
    max_turn_retries: int = 3
    concise_mode: bool = True
