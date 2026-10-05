import json
import logging
from typing import List, Optional, Dict, Any
from .base import LLMProvider, LLMMessage, ToolDefinition, LLMResponse, ToolCall
from .mock_llm import MockLLMProvider
from backend.config.settings import get_settings

logger = logging.getLogger("openai_llm")


class OpenAILLMProvider(LLMProvider):
    """
    OpenAI LLM provider using Chat Completions API with Function / Tool calling.
    Falls back gracefully to MockLLMProvider when API key is missing or invalid.
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        settings = get_settings()
        self.api_key = api_key or settings.openai_api_key
        self.model = model or settings.openai_model
        self.fallback_mock = MockLLMProvider()

        self.client = None
        if self.api_key and not settings.mock_mode:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize OpenAI client, using fallback: {e}")

    def generate(
        self,
        messages: List[LLMMessage],
        tools: Optional[List[ToolDefinition]] = None,
        temperature: float = 0.3,
    ) -> LLMResponse:
        if not self.client:
            return self.fallback_mock.generate(messages, tools, temperature)

        # Format messages for OpenAI API
        formatted_messages = []
        for m in messages:
            msg_dict: Dict[str, Any] = {"role": m.role, "content": m.content or ""}
            if m.name:
                msg_dict["name"] = m.name
            if m.tool_call_id:
                msg_dict["tool_call_id"] = m.tool_call_id
            if m.tool_calls:
                msg_dict["tool_calls"] = [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.name,
                            "arguments": json.dumps(tc.arguments),
                        },
                    }
                    for tc in m.tool_calls
                ]
            formatted_messages.append(msg_dict)

        # Format tools schema
        formatted_tools = None
        if tools:
            formatted_tools = [
                {
                    "type": "function",
                    "function": {
                        "name": t.name,
                        "description": t.description,
                        "parameters": t.parameters,
                    },
                }
                for t in tools
            ]

        try:
            kwargs = {
                "model": self.model,
                "messages": formatted_messages,
                "temperature": temperature,
            }
            if formatted_tools:
                kwargs["tools"] = formatted_tools
                kwargs["tool_choice"] = "auto"

            res = self.client.chat.completions.create(**kwargs)
            choice = res.choices[0]
            message = choice.message

            tool_calls_result = None
            if message.tool_calls:
                tool_calls_result = []
                for tc in message.tool_calls:
                    try:
                        args = json.loads(tc.function.arguments)
                    except Exception:
                        args = {}
                    tool_calls_result.append(
                        ToolCall(id=tc.id, name=tc.function.name, arguments=args)
                    )

            return LLMResponse(
                content=message.content,
                tool_calls=tool_calls_result,
                finish_reason=choice.finish_reason,
            )

        except Exception as e:
            logger.error(f"OpenAI completion failed: {e}. Falling back to MockLLMProvider.")
            return self.fallback_mock.generate(messages, tools, temperature)
