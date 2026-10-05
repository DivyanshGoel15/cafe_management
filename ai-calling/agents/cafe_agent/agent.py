import json
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from llm.base import LLMProvider, LLMMessage
from llm.factory import get_llm_provider
from .prompts.system_prompt import build_system_prompt
from .tools.registry import ToolRegistry
from .config.agent_config import AgentPersonalityConfig
from services.escalation_service import EscalationService

logger = logging.getLogger("cafe_voice_agent")


class AgentTurnResult:
    def __init__(
        self,
        spoken_response: str,
        escalated: bool = False,
        escalation_reason: Optional[str] = None,
        booking_id: Optional[str] = None,
        tool_executions: Optional[List[Dict[str, Any]]] = None,
    ):
        self.spoken_response = spoken_response
        self.escalated = escalated
        self.escalation_reason = escalation_reason
        self.booking_id = booking_id
        self.tool_executions = tool_executions or []


class CafeVoiceAgent:
    """
    Core conversational voice agent for the cafe.
    Coordinates between customer utterances, prompt policies, LLM generation,
    and business tool executions without harboring business rules directly.
    """

    def __init__(
        self,
        session: Session,
        call_id: str,
        llm_provider: Optional[LLMProvider] = None,
        config: Optional[AgentPersonalityConfig] = None,
        custom_system_prompt: Optional[str] = None,
    ):
        self.session = session
        self.call_id = call_id
        self.config = config or AgentPersonalityConfig()
        self.llm = llm_provider or get_llm_provider()
        self.tool_registry = ToolRegistry(session=session, call_id=call_id)
        self.escalation_service = EscalationService(session=session)

        # Build initial system prompt
        self.system_prompt = custom_system_prompt or build_system_prompt(
            custom_tone=self.config.tone,
            agent_name=self.config.name,
        )

        self.messages: List[LLMMessage] = [
            LLMMessage(role="system", content=self.system_prompt)
        ]
        self.misunderstanding_count = 0
        self.latest_booking_id: Optional[str] = None
        self.is_escalated: bool = False

    def process_utterance(self, customer_text: str) -> AgentTurnResult:
        """
        Process a single customer dialogue turn.
        Returns spoken response for TTS and execution metadata.
        """
        cleaned_text = customer_text.strip()
        logger.info(f"[CALL {self.call_id}] Customer utterance: '{cleaned_text}'")

        # 1. Pre-LLM Escalation evaluation (for high anger/frustration/explicit staff requests)
        escalation_check = self.escalation_service.evaluate_escalation_need(
            customer_message=cleaned_text,
            misunderstanding_count=self.misunderstanding_count,
        )
        if escalation_check["should_escalate"]:
            reason = escalation_check["reason"]
            transfer_res = self.escalation_service.transfer_to_human(self.call_id, reason)
            self.is_escalated = True
            return AgentTurnResult(
                spoken_response=transfer_res["message"],
                escalated=True,
                escalation_reason=reason,
                tool_executions=[{"tool": "transfer_to_human", "result": transfer_res}],
            )

        # 2. Add customer message to conversation history
        self.messages.append(LLMMessage(role="user", content=cleaned_text))

        # 3. Call LLM with tool definitions
        tools_def = self.tool_registry.get_definitions()
        llm_response = self.llm.generate(
            messages=self.messages,
            tools=tools_def,
            temperature=self.config.temperature,
        )

        tool_executions_record: List[Dict[str, Any]] = []

        # 4. Handle Tool Calls if emitted by LLM
        if llm_response.tool_calls:
            # Append assistant message with requested tool calls
            self.messages.append(
                LLMMessage(
                    role="assistant",
                    content=llm_response.content or "",
                    tool_calls=llm_response.tool_calls,
                )
            )

            for tc in llm_response.tool_calls:
                logger.info(f"[CALL {self.call_id}] Executing tool '{tc.name}' with args {tc.arguments}")
                result = self.tool_registry.execute_tool(tc.name, tc.arguments)
                tool_executions_record.append({"tool": tc.name, "arguments": tc.arguments, "result": result})

                # Check if tool created or confirmed a booking
                if tc.name == "create_booking" and isinstance(result, dict) and result.get("booking_id"):
                    self.latest_booking_id = result["booking_id"]

                # Check if tool triggered escalation
                if tc.name == "transfer_to_human":
                    self.is_escalated = True

                # Append tool result back to message history
                self.messages.append(
                    LLMMessage(
                        role="tool",
                        name=tc.name,
                        tool_call_id=tc.id,
                        content=json.dumps(result),
                    )
                )

            # Generate final spoken response following tool execution
            final_response = self.llm.generate(
                messages=self.messages,
                tools=tools_def,
                temperature=self.config.temperature,
            )
            spoken_text = final_response.content or "Your request has been processed. Is there anything else I can help you with?"
            self.messages.append(LLMMessage(role="assistant", content=spoken_text))

            return AgentTurnResult(
                spoken_response=spoken_text,
                escalated=self.is_escalated,
                escalation_reason="Human escalation tool triggered" if self.is_escalated else None,
                booking_id=self.latest_booking_id,
                tool_executions=tool_executions_record,
            )

        # 5. Natural speech response without tool call
        spoken_text = llm_response.content or "Thank you. How else may I assist you today?"
        self.messages.append(LLMMessage(role="assistant", content=spoken_text))

        # Check for misunderstanding indicators
        if "i don't have that information" in spoken_text.lower() or "sorry" in spoken_text.lower():
            self.misunderstanding_count += 1
        else:
            self.misunderstanding_count = 0

        return AgentTurnResult(
            spoken_response=spoken_text,
            escalated=self.is_escalated,
            booking_id=self.latest_booking_id,
            tool_executions=tool_executions_record,
        )
