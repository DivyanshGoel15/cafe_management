import logging
from typing import Dict, Any
from sqlalchemy.orm import Session

from backend.config.settings import settings
from database.repositories.customer_repository import CustomerRepository
from database.repositories.template_repository import TemplateRepository
from messaging.sender import MessageSender
from messaging.templates.renderer import TemplateRenderer
from workflows.events import AutomationEventSchema

logger = logging.getLogger(__name__)


class OrderWorkflow:
    """
    Automations for food & beverage orders:
    - Order received
    - Order confirmed
    - Order preparing
    - Order ready
    - Order completed
    - Order cancelled
    """

    def __init__(self, db: Session):
        self.db = db
        self.customer_repo = CustomerRepository(db)
        self.template_repo = TemplateRepository(db)
        self.sender = MessageSender(db)

    def handle_order_event(self, event: AutomationEventSchema, db: Session) -> Dict[str, Any]:
        """Generic dispatcher for all order status lifecycle events."""
        payload = event.payload
        cafe_id = event.cafe_id or settings.DEFAULT_CAFE_ID
        order_id = payload.get("order_id", "ORD-000")
        customer_phone = payload.get("customer_phone") or payload.get("phone")
        customer_name = payload.get("customer_name", "Valued Customer")
        cafe_name = payload.get("cafe_name", settings.DEFAULT_CAFE_NAME)
        total_amount = payload.get("total_amount", "0.00")

        if not customer_phone:
            logger.error(f"Cannot process order {order_id}: missing customer phone.")
            return {"error": "Missing customer phone"}

        customer = self.customer_repo.get_or_create(cafe_id=cafe_id, phone=customer_phone, name=customer_name)

        # Map event type to template name
        event_type = event.event_type
        template_map = {
            "order.created": "order_received",
            "order.confirmed": "order_confirmed",
            "order.preparing": "order_preparing",
            "order.ready": "order_ready",
            "order.completed": "order_completed",
            "order.cancelled": "order_cancelled",
        }

        template_name = template_map.get(event_type, "order_received")
        template = self.template_repo.get_by_name(cafe_id, template_name)

        fallback_texts = {
            "order_received": f"Hi {customer_name}, we received your order #{order_id} at {cafe_name}. Total: ${total_amount}.",
            "order_confirmed": f"Good news {customer_name}! Your order #{order_id} has been confirmed at {cafe_name}.",
            "order_preparing": f"Your delicious order #{order_id} is now being prepared at {cafe_name}.",
            "order_ready": f"Hi {customer_name}, your order #{order_id} is READY for pickup at {cafe_name}!",
            "order_completed": f"Thank you for dining with {cafe_name}! Your order #{order_id} is completed.",
            "order_cancelled": f"Hi {customer_name}, your order #{order_id} at {cafe_name} has been cancelled.",
        }

        template_content = template.content if template else fallback_texts.get(template_name, "")
        variables = {
            "customer_name": customer_name,
            "order_id": order_id,
            "cafe_name": cafe_name,
            "total_amount": total_amount
        }
        rendered = TemplateRenderer.render(template_content, variables)

        msg = self.sender.send_template_message(
            cafe_id=cafe_id,
            phone_number=customer_phone,
            template_name=template_name,
            rendered_content=rendered,
            variables=variables,
            customer_id=customer.id,
            category="ORDERS",
            metadata={"order_id": order_id, "event_type": event_type}
        )

        # Update customer stats if completed
        if event_type == "order.completed":
            try:
                customer.total_orders += 1
                customer.total_spent += float(total_amount)
                self.customer_repo.update(customer)
            except Exception as e:
                logger.warning(f"Could not update customer spending metrics: {e}")

        return {
            "order_id": order_id,
            "event_type": event_type,
            "message_id": msg.id,
            "status": msg.status
        }
