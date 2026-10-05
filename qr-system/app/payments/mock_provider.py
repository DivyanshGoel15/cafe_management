import uuid
from typing import Dict, Any, Optional
from datetime import datetime
from app.models.schemas import Payment
from app.models.enums import PaymentStatus
from app.payments.provider import PaymentProvider
from app.repositories import payment_repo, BasePaymentRepository

class MockPaymentProvider(PaymentProvider):
    """
    Mock payment gateway provider simulating realistic gateway workflows.
    Supports instant success, simulated failure, and pending states.
    Never stores any sensitive card or credential details.
    """
    def __init__(self, repo: BasePaymentRepository = payment_repo):
        self.repo = repo

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
        payment_id = f"pay_{uuid.uuid4().hex[:12]}"
        tx_id = f"tx_mock_{uuid.uuid4().hex[:8]}"

        status_mapping = {
            "success": PaymentStatus.SUCCESS,
            "failed": PaymentStatus.FAILED,
            "pending": PaymentStatus.PENDING
        }
        status = status_mapping.get(simulation_result.lower(), PaymentStatus.SUCCESS)

        payment = Payment(
            payment_id=payment_id,
            order_id=None,
            table_id=table_id,
            session_id=session_id,
            customer_id=customer_id,
            amount=round(amount, 2),
            currency=currency,
            status=status,
            provider="mock_gateway",
            provider_transaction_id=tx_id,
            metadata=metadata or {},
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.repo.save_payment(payment)
        return payment

    def check_payment_status(self, payment_id: str) -> PaymentStatus:
        payment = self.repo.get_payment_by_id(payment_id)
        if not payment:
            return PaymentStatus.FAILED
        return payment.status

    def handle_payment_webhook(self, payload: Dict[str, Any]) -> Payment:
        payment_id = payload.get("payment_id")
        if not payment_id:
            raise ValueError("payment_id missing in webhook payload")

        payment = self.repo.get_payment_by_id(payment_id)
        if not payment:
            raise ValueError(f"Payment with ID {payment_id} not found")

        status_str = payload.get("status", "").lower()
        if status_str in ["success", "paid", "captured"]:
            new_status = PaymentStatus.SUCCESS
        elif status_str in ["failed", "declined", "cancelled"]:
            new_status = PaymentStatus.FAILED
        elif status_str == "refunded":
            new_status = PaymentStatus.REFUNDED
        else:
            new_status = PaymentStatus.PENDING

        updated_payment = payment.model_copy(
            update={
                "status": new_status,
                "provider_transaction_id": payload.get("provider_transaction_id", payment.provider_transaction_id),
                "updated_at": datetime.utcnow()
            }
        )
        self.repo.save_payment(updated_payment)
        return updated_payment
