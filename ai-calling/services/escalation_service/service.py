import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from database.repositories.call_repository import CallRepository
from backend.config.settings import get_settings

logger = logging.getLogger("escalation_service")


class EscalationService:
    FRUSTRATION_KEYWORDS = [
        "angry", "mad", "furious", "horrible", "terrible", "ridiculous",
        "worst", "incompetent", "sucks", "hate", "lawsuit", "speak to manager",
        "human", "representative", "real person", "operator", "agent",
        "someone else", "stop talking", "frustrated", "manager", "supervisor"
    ]

    PAYMENT_DISPUTE_KEYWORDS = [
        "refund", "dispute", "overcharged", "double charged", "wrong charge",
        "credit card fraud", "stolen card", "chargeback"
    ]

    def __init__(self, session: Session):
        self.session = session
        self.call_repo = CallRepository(session)
        self.settings = get_settings()

    def evaluate_escalation_need(
        self,
        customer_message: str,
        misunderstanding_count: int = 0,
        ai_confidence: float = 1.0,
    ) -> Dict[str, Any]:
        """
        Evaluate if a conversation step requires escalation to human staff.
        """
        msg_lower = customer_message.lower().strip()

        # 1. Explicit request for human
        human_triggers = ["human", "person", "representative", "operator", "manager", "supervisor", "staff", "agent"]
        if any(h in msg_lower for h in human_triggers):
            return {
                "should_escalate": True,
                "reason": "Customer explicitly requested a human staff member.",
                "type": "explicit_request",
            }

        # 2. Payment or billing dispute
        if any(p in msg_lower for p in self.PAYMENT_DISPUTE_KEYWORDS):
            return {
                "should_escalate": True,
                "reason": "Payment dispute or financial verification requires staff intervention.",
                "type": "payment_dispute",
            }

        # 3. Frustrated/Angry sentiment
        frustration_hits = [f for f in self.FRUSTRATION_KEYWORDS if f in msg_lower]
        if frustration_hits:
            return {
                "should_escalate": True,
                "reason": f"Detected heightened customer frustration keywords: {', '.join(frustration_hits)}.",
                "type": "frustration",
            }

        # 4. Repeated misunderstandings
        if misunderstanding_count >= self.settings.max_misunderstandings_before_escalation:
            return {
                "should_escalate": True,
                "reason": f"Encountered {misunderstanding_count} consecutive misunderstandings.",
                "type": "repeated_misunderstanding",
            }

        # 5. Low AI confidence
        if ai_confidence < 0.4:
            return {
                "should_escalate": True,
                "reason": "AI confidence threshold below acceptable limit.",
                "type": "low_confidence",
            }

        return {
            "should_escalate": False,
            "reason": None,
            "type": None,
        }

    def transfer_to_human(self, call_id: str, reason: str) -> Dict[str, Any]:
        """
        Execute call escalation transfer to human staff.
        In local/mock mode, simulates transfer and updates call record.
        """
        call = self.call_repo.get_by_id(call_id)
        if call:
            call.status = "Escalated"
            call.escalation_status = "Transferred"
            call.outcome = f"Escalated to Staff ({reason})"
            self.session.commit()

        # Log structured escalation event
        logger.warning(
            f"[ESCALATION TRIGGERED] Call ID: {call_id} | Reason: {reason} | Target Phone: {self.settings.human_agent_phone}"
        )

        return {
            "success": True,
            "call_id": call_id,
            "escalated": True,
            "transfer_target": self.settings.human_agent_phone,
            "reason": reason,
            "message": "I completely understand. I am transferring your call right now to our on-duty manager. Please hold on for just a moment.",
        }
