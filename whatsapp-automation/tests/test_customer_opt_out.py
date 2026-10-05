import pytest
from services.customer_service import CustomerService
from messaging.sender import MessageSender, OptOutRestrictedError


def test_customer_opt_out_and_opt_in_lifecycle(db_session, mock_provider):
    cust_service = CustomerService(db_session)
    sender = MessageSender(db_session)
    phone = "+15559998877"

    # Create customer
    cust = cust_service.create_or_update_customer(
        cafe_id="test_cafe_001",
        phone=phone,
        name="Test OptOut User"
    )
    assert cust.is_opted_out is False

    # 1. Marketing message succeeds initially
    msg1 = sender.send_text_message(
        cafe_id="test_cafe_001",
        phone_number=phone,
        content="Get 10% off coffee today!",
        category="MARKETING"
    )
    assert msg1.status in ("SENT", "DELIVERED", "READ")

    # 2. Opt out customer
    cust_service.opt_out_customer("test_cafe_001", phone, reason="USER_REQUEST")

    # 3. Next marketing message MUST be blocked
    with pytest.raises(OptOutRestrictedError):
        sender.send_text_message(
            cafe_id="test_cafe_001",
            phone_number=phone,
            content="Exclusive weekend deal!",
            category="MARKETING"
        )

    # 4. Transactional messages (bookings/orders) must STILL be permitted!
    booking_msg = sender.send_text_message(
        cafe_id="test_cafe_001",
        phone_number=phone,
        content="Your table reservation is confirmed.",
        category="BOOKING"
    )
    assert booking_msg.status in ("SENT", "DELIVERED", "READ")

    # 5. Customer opts back in
    cust_service.opt_in_customer("test_cafe_001", phone)

    # 6. Marketing message succeeds again
    msg2 = sender.send_text_message(
        cafe_id="test_cafe_001",
        phone_number=phone,
        content="Welcome back to our promotions!",
        category="MARKETING"
    )
    assert msg2.status in ("SENT", "DELIVERED", "READ")
