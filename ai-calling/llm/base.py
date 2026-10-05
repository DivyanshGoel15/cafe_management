from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ToolCall(BaseModel):
    id: str
    name: str
    arguments: Dict[str, Any]


class LLMMessage(BaseModel):
    role: str  # system, user, assistant, tool
    content: Optional[str] = None
    name: Optional[str] = None
    tool_call_id: Optional[str] = None
    tool_calls: Optional[List[ToolCall]] = None


class ToolDefinition(BaseModel):
    name: str
    description: str
    parameters: Dict[str, Any] = Field(default_factory=dict)


class LLMResponse(BaseModel):
    content: Optional[str] = None
    tool_calls: Optional[List[ToolCall]] = None
    finish_reason: Optional[str] = "stop"  # stop, tool_calls, error
    metadata: Dict[str, Any] = Field(default_factory=dict)


class LLMProvider(ABC):
    """Abstract interface for LLM providers (Mock, OpenAI, Anthropic, Gemini, etc.)."""

    @abstractmethod
    def generate(
        self,
        messages: List[LLMMessage],
        tools: Optional[List[ToolDefinition]] = None,
        temperature: float = 0.3,
    ) -> LLMResponse:
        """Synchronous chat completion with optional tool/function calling."""
        pass

    async def generate_async(
        self,
        messages: List[LLMMessage],
        tools: Optional[List[ToolDefinition]] = None,
        temperature: float = 0.3,
    ) -> LLMResponse:
        """Asynchronous chat completion."""
        return self.generate(messages, tools, temperature)
