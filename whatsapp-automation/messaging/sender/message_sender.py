import logging
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from backend.config.settings import settings
from database.models.message import Message, MessageStatus, MessageDirection, MessageType
from database.models.template import TemplateCategory
from database.repositories.message_repository import MessageRepository
from database.repositories.customer_repository import CustomerRepository
from database.repositories.opt_out_repository import OptOutRepository
from messaging.providers import get_whatsapp_provider, WhatsAppProvider

logger = logging.getLogger(__name__)


class OptOutRestrictedError(Exception):
    """Raised when an outbound marketing message is blocked by an active opt-out."""
    pass


class DoNotContactError(Exception):
    """Raised when customer is marked as do-not-contact."""
    pass


class MessageSender:
    """
    Coordinates policy checks (opt-outs, rate limits), database persistence,
    and dispatching to the configured WhatsApp provider.
    """

    def __init__(self, db: Session, provider: Optional[WhatsAppProvider] = None):
        self.db = db
        self.message_repo = MessageRepository(db)
        self.customer_repo = CustomerRepository(db)
        self.opt_out_repo = OptOutRepository(db)
        self.provider = provider or get_whatsapp_provider()

    def send_text_message(
        self,
        cafe_id: str,
        phone_number: str,
        content: str,
        customer_id: Optional[str] = None,
        category: str = "GENERAL",
        metadata: Optional[Dict[str, Any]] = None
    ) -> Message:
        """
        Sends a text message after checking opt-out policies and saving message status.
        """
        cafe_id = cafe_id or settings.DEFAULT_CAFE_ID
        phone_number = phone_number.strip()
        metadata = metadata or {}

        # 1. Customer resolution
        if not customer_id:
            customer = self.customer_repo.get_by_phone(cafe_id, phone_number)
            if customer:
                customer_id = customer.id
        else:
            customer = self.customer_repo.get_by_id(customer_id)

        # 2. Check Opt-Out & Do Not Contact policies
        is_marketing = category.upper() == TemplateCategory.MARKETING.value
        if customer and customer.do_not_contact:
            raise DoNotContactError(f"Customer {phone_number} is flagged as Do Not Contact.")

        if is_marketing:
            if self.opt_out_repo.is_opted_out(cafe_id, phone_number) or (customer and customer.is_opted_out):
                raise OptOutRestrictedError(
                    f"Message blocked: Recipient {phone_number} has opted out of marketing communications."
                )

        # 3. Create Message entity in QUEUED status
        msg = Message(
            cafe_id=cafe_id,
            customer_id=customer_id,
            phone_number=phone_number,
            direction=MessageDirection.OUTGOING.value,
            message_type=MessageType.TEXT.value,
            category=category.upper(),
            content=content,
            status=MessageStatus.QUEUED.value,
            created_time=datetime.utcnow()
        )
        msg.set_metadata(metadata)
        self.message_repo.add(msg)

        # 4. Dispatch via WhatsApp Provider
        try:
            res = self.provider.send_message(
                phone_number=phone_number,
                content=content,
                cafe_id=cafe_id,
                metadata=metadata
            )
            if res.success:
                msg.status = res.status
                msg.provider_message_id = res.provider_message_id
                msg.sent_time = datetime.utcnow()
                if res.status in ("DELIVERED", "READ"):
                    msg.delivered_time = datetime.utcnow()
                if res.status == "READ":
                    msg.read_time = datetime.utcnow()
            else:
                msg.status = MessageStatus.FAILED.value
                msg.error_information = res.error_message or "Provider transmission failed"
        except Exception as e:
            logger.error(f"Error during provider dispatch: {e}")
            msg.status = MessageStatus.FAILED.value
            msg.error_information = str(e)

        self.message_repo.update(msg)
        return msg

    def send_template_message(
        self,
        cafe_id: str,
        phone_number: str,
        template_name: str,
        rendered_content: str,
        variables: Dict[str, Any],
        template_id: Optional[str] = None,
        customer_id: Optional[str] = None,
        category: str = "GENERAL",
        language: str = "en",
        metadata: Optional[Dict[str, Any]] = None
    ) -> Message:
        """
        Sends a template message after checking opt-out policies and saving message status.
        """
        cafe_id = cafe_id or settings.DEFAULT_CAFE_ID
        phone_number = phone_number.strip()
        metadata = metadata or {}
        metadata["variables"] = variables

        # 1. Customer resolution
        if not customer_id:
            customer = self.customer_repo.get_by_phone(cafe_id, phone_number)
            if customer:
                customer_id = customer.id
        else:
            customer = self.customer_repo.get_by_id(customer_id)

        # 2. Check Opt-Out & Do Not Contact policies
        is_marketing = category.upper() == TemplateCategory.MARKETING.value
        if customer and customer.do_not_contact:
            raise DoNotContactError(f"Customer {phone_number} is flagged as Do Not Contact.")

        if is_marketing:
            if self.opt_out_repo.is_opted_out(cafe_id, phone_number) or (customer and customer.is_opted_out):
                raise OptOutRestrictedError(
                    f"Message blocked: Recipient {phone_number} has opted out of marketing communications."
                )

        # 3. Create Message entity in QUEUED status
        msg = Message(
            cafe_id=cafe_id,
            customer_id=customer_id,
            phone_number=phone_number,
            direction=MessageDirection.OUTGOING.value,
            message_type=MessageType.TEMPLATE.value,
            category=category.upper(),
            template_name=template_name,
            template_id=template_id,
            content=rendered_content,
            status=MessageStatus.QUEUED.value,
            created_time=datetime.utcnow()
        )
        msg.set_metadata(metadata)
        self.message_repo.add(msg)

        # 4. Dispatch via WhatsApp Provider
        try:
            res = self.provider.send_template(
                phone_number=phone_number,
                template_name=template_name,
                variables=variables,
                language=language,
                cafe_id=cafe_id,
                metadata=metadata
            )
            if res.success:
                msg.status = res.status
                msg.provider_message_id = res.provider_message_id
                msg.sent_time = datetime.utcnow()
                if res.status in ("DELIVERED", "READ"):
                    msg.delivered_time = datetime.utcnow()
                if res.status == "READ":
                    msg.read_time = datetime.utcnow()
            else:
                msg.status = MessageStatus.FAILED.value
                msg.error_information = res.error_message or "Provider transmission failed"
        except Exception as e:
            logger.error(f"Error during provider template dispatch: {e}")
            msg.status = MessageStatus.FAILED.value
            msg.error_information = str(e)

        self.message_repo.update(msg)
        return msg
