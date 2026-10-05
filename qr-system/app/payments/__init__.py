from app.payments.provider import PaymentProvider
from app.payments.mock_provider import MockPaymentProvider
from app.repositories import payment_repo

default_payment_provider = MockPaymentProvider(payment_repo)

__all__ = ["PaymentProvider", "MockPaymentProvider", "default_payment_provider"]
