from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.models.schemas import Payment
from app.models.enums import PaymentStatus

class PaymentProvider(ABC):
    """
    Abstract Payment Provider interface.
    Allows easy plug-and-play swapping for Razorpay, Stripe, Paytm, etc. later.
    """
    @abstractmethod
    def create_payment(
        self,
        table_id: str,
        session_id: str,
        customer_id: str,
        amount: float,
        currency: str = "INR",
        metadata: Optional[Dict[str, Any]] = None,
        simulation_result: str = "success"
    ) -> Payment:
        """Create a payment intent / order with the payment provider."""
        pass

    @abstractmethod
    def check_payment_status(self, payment_id: str) -> PaymentStatus:
        """Check status of a payment by its provider or internal transaction ID."""
        pass

    @abstractmethod
    def handle_payment_webhook(self, payload: Dict[str, Any]) -> Payment:
        """Handle incoming webhook notification from payment gateway."""
        pass
