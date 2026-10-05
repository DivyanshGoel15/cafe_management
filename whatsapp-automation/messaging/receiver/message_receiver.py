import logging
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.config.settings import settings
from database.models.message import Message, MessageDirection, MessageStatus, MessageType
from database.repositories.customer_repository import CustomerRepository
from database.repositories.message_repository import MessageRepository
from database.repositories.opt_out_repository import OptOutRepository
from messaging.providers import get_whatsapp_provider, WhatsAppProvider, IncomingMessagePayload
from messaging.sender.message_sender import MessageSender

logger = logging.getLogger(__name__)

OPTOUT_KEYWORDS = {"STOP", "UNSUBSCRIBE", "CANCEL PROMO", "OPTOUT", "QUIT", "END"}
OPTIN_KEYWORDS = {"START", "UNSTOP", "RESUBSCRIBE", "OPTIN", "JOIN"}


class MessageReceiver:
    """
    Handles incoming messages from WhatsApp:
    1. Parses raw webhook payload into standardized format
    2. Identifies or registers customer
    3. Records message in conversation history
    4. Evaluates compliance keywords (STOP/START)
    5. Dispatches contextual automated replies or routes to AI/workflow
    """

    def __init__(self, db: Session, provider: Optional[WhatsAppProvider] = None, event_engine: Optional[Any] = None):
        self.db = db
        self.provider = provider or get_whatsapp_provider()
        self.customer_repo = CustomerRepository(db)
        self.message_repo = MessageRepository(db)
        self.opt_out_repo = OptOutRepository(db)
        self.sender = MessageSender(db, self.provider)
        self.event_engine = event_engine

    def process_incoming_payload(self, raw_payload: Dict[str, Any], cafe_id: Optional[str] = None) -> Dict[str, Any]:
        """Entry point for incoming webhook requests."""
        cafe_id = cafe_id or raw_payload.get("cafe_id") or settings.DEFAULT_CAFE_ID
        parsed: Optional[IncomingMessagePayload] = self.provider.parse_incoming_webhook(raw_payload)

        if not parsed or not parsed.phone_number:
            logger.warning(f"Unable to parse incoming webhook payload: {raw_payload}")
            return {"status": "ignored", "reason": "No valid message found in payload"}

        return self.handle_customer_message(
            cafe_id=cafe_id,
            phone_number=parsed.phone_number,
            content=parsed.message_content,
            provider_message_id=parsed.provider_message_id
        )

    def handle_customer_message(
        self,
        cafe_id: str,
        phone_number: str,
        content: str,
        provider_message_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Processes an incoming customer message."""
        clean_content = content.strip()
        upper_text = clean_content.upper()

        # 1. Identify or create customer
        customer = self.customer_repo.get_or_create(cafe_id=cafe_id, phone_number=phone_number)

        # 2. Record incoming message in DB
        incoming_msg = Message(
            cafe_id=cafe_id,
            customer_id=customer.id,
            phone_number=phone_number,
            direction=MessageDirection.INCOMING.value,
            message_type=MessageType.TEXT.value,
            content=clean_content,
            status=MessageStatus.DELIVERED.value,
            provider_message_id=provider_message_id,
            created_time=datetime.utcnow(),
            delivered_time=datetime.utcnow(),
            read_time=datetime.utcnow()
        )
        self.message_repo.add(incoming_msg)

        # 3. Check Opt-Out keyword (STOP, UNSUBSCRIBE, etc.)
        if upper_text in OPTOUT_KEYWORDS:
            self.opt_out_repo.record_opt_out(
                cafe_id=cafe_id,
                phone_number=phone_number,
                customer_id=customer.id,
                reason=f"KEYWORD_{upper_text}"
            )
            self.customer_repo.update_opt_out(customer.id, is_opted_out=True)

            # Send opt-out confirmation
            cafe_name = settings.DEFAULT_CAFE_NAME
            reply_text = (
                f"You have been successfully unsubscribed from {cafe_name} marketing updates. "
                "You will still receive important reservation and order alerts. Reply START to resubscribe."
            )
            out_msg = self.sender.send_text_message(
                cafe_id=cafe_id,
                phone_number=phone_number,
                content=reply_text,
                customer_id=customer.id,
                category="CUSTOMER"
            )
            return {
                "status": "opted_out",
                "customer_id": customer.id,
                "reply_message_id": out_msg.id,
                "action": "opt_out"
            }

        # 4. Check Opt-In keyword (START, UNSTOP, etc.)
        if upper_text in OPTIN_KEYWORDS:
            self.opt_out_repo.record_opt_in(
                cafe_id=cafe_id,
                phone_number=phone_number,
                customer_id=customer.id
            )
            self.customer_repo.update_opt_out(customer.id, is_opted_out=False)

            cafe_name = settings.DEFAULT_CAFE_NAME
            reply_text = f"Welcome back! You are now subscribed to receive promotions and updates from {cafe_name}."
            out_msg = self.sender.send_text_message(
                cafe_id=cafe_id,
                phone_number=phone_number,
                content=reply_text,
                customer_id=customer.id,
                category="CUSTOMER"
            )
            return {
                "status": "opted_in",
                "customer_id": customer.id,
                "reply_message_id": out_msg.id,
                "action": "opt_in"
            }

        # 5. Check CANCEL (for active reservations)
        if upper_text.startswith("CANCEL"):
            if self.event_engine:
                # Dispatch booking cancellation attempt
                self.event_engine.publish_event(
                    event_type="booking.cancellation_requested",
                    payload={"phone": phone_number, "customer_id": customer.id, "cafe_id": cafe_id},
                    cafe_id=cafe_id
                )
            reply_text = (
                f"We received your cancellation request for {settings.DEFAULT_CAFE_NAME}. "
                "If you have an active table reservation, it has been cancelled."
            )
            out_msg = self.sender.send_text_message(
                cafe_id=cafe_id,
                phone_number=phone_number,
                content=reply_text,
                customer_id=customer.id,
                category="BOOKING"
            )
            return {
                "status": "cancellation_processed",
                "customer_id": customer.id,
                "reply_message_id": out_msg.id,
                "action": "cancel_booking"
            }

        # 6. Intent Routing / AI agent hook
        intent_reply = self._generate_bot_reply(clean_content)
        out_msg = self.sender.send_text_message(
            cafe_id=cafe_id,
            phone_number=phone_number,
            content=intent_reply,
            customer_id=customer.id,
            category="CUSTOMER"
        )

        return {
            "status": "processed",
            "customer_id": customer.id,
            "incoming_id": incoming_msg.id,
            "reply_message_id": out_msg.id,
            "action": "auto_reply"
        }

    def _generate_bot_reply(self, message: str) -> str:
        """
        Mock response and routing system.
        Can easily be swapped or extended with an AI agent.
        """
        low = message.lower()
        cafe_name = settings.DEFAULT_CAFE_NAME

        if any(w in low for w in ["book", "reserve", "table", "reservation"]):
            return (
                f"Hello! To reserve a table at {cafe_name}, please reply with your date, time, and party size, "
                "or visit our online booking link: http://localhost:3000/reservations"
            )
        elif any(w in low for w in ["menu", "food", "drinks", "coffee", "price"]):
            return (
                f"You can view our complete food and artisanal coffee menu at: "
                f"http://localhost:3000/menu. We feature freshly brewed roasts, pastries, and lunch specials!"
            )
        elif any(w in low for w in ["hour", "time", "open", "close"]):
            return f"{cafe_name} is open Monday to Sunday from 7:00 AM to 10:00 PM. We hope to see you soon!"
        elif any(w in low for w in ["order", "delivery", "takeout", "pickup"]):
            return f"To place an online order for pickup or delivery, please visit: http://localhost:3000/order"
        elif any(w in low for w in ["hi", "hello", "hey"]):
            return f"Hi there! Welcome to {cafe_name}. How can we assist you today? You can ask about our menu, hours, or table reservations."
        else:
            return (
                f"Thank you for contacting {cafe_name}! A member of our team will review your message shortly. "
                "For urgent assistance, feel free to give us a call."
            )
