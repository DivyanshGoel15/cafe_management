from datetime import datetime, timedelta
from services.notification_service import NotificationService
from database.models.message import MessageStatus, MessageDirection


def test_send_text_message(db_session, mock_provider):
    service = NotificationService(db_session)
    msg = service.send_message(
        cafe_id="test_cafe_001",
        phone_number="+15551234567",
        content="Hello from our cafe automation!",
        category="GENERAL"
    )
    assert msg.id is not None
    assert msg.phone_number == "+15551234567"
    assert msg.direction == MessageDirection.OUTGOING.value
    assert msg.status in (MessageStatus.SENT.value, MessageStatus.DELIVERED.value, MessageStatus.READ.value)
    assert len(mock_provider.sent_messages) == 1


def test_send_template_message(db_session, mock_provider):
    service = NotificationService(db_session)
    msg = service.send_template(
        cafe_id="test_cafe_001",
        phone_number="+15551234567",
        template_name="booking_confirmation",
        variables={
            "customer_name": "Alice",
            "cafe_name": "The Roasted Bean Cafe",
            "date": "2026-10-05",
            "time": "18:30",
            "guests": 2
        }
    )
    assert msg.id is not None
    assert msg.template_name == "booking_confirmation"
    assert "Alice" in msg.content
    assert "18:30" in msg.content


def test_schedule_and_cancel_message(db_session):
    service = NotificationService(db_session)
    future_time = datetime.utcnow() + timedelta(hours=2)

    msg = service.schedule_message(
        cafe_id="test_cafe_001",
        phone_number="+15551234567",
        content="Scheduled special notice",
        scheduled_time=future_time
    )
    assert msg.status == MessageStatus.SCHEDULED.value

    # Cancel scheduled message
    success = service.cancel_message(msg.id)
    assert success is True

    cancelled_msg = service.get_message(msg.id)
    assert cancelled_msg.status == MessageStatus.CANCELLED.value
