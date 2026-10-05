from messaging.receiver import MessageReceiver
from database.repositories.customer_repository import CustomerRepository
from database.repositories.opt_out_repository import OptOutRepository
from database.repositories.message_repository import MessageRepository
from database.models.message import MessageDirection


def test_customer_replies_stop_keyword(db_session, mock_provider):
    receiver = MessageReceiver(db_session)
    cust_repo = CustomerRepository(db_session)
    opt_repo = OptOutRepository(db_session)
    phone = "+15557778899"

    # Customer sends "STOP"
    res = receiver.handle_customer_message(
        cafe_id="test_cafe_001",
        phone_number=phone,
        content="STOP"
    )
    assert res["status"] == "opted_out"
    assert res["action"] == "opt_out"

    # Verify customer is marked opted out
    assert opt_repo.is_opted_out("test_cafe_001", phone) is True
    cust = cust_repo.get_by_phone("test_cafe_001", phone)
    assert cust.is_opted_out is True


def test_customer_replies_start_keyword(db_session, mock_provider):
    receiver = MessageReceiver(db_session)
    opt_repo = OptOutRepository(db_session)
    phone = "+15557778899"

    # Customer sends "START"
    res = receiver.handle_customer_message(
        cafe_id="test_cafe_001",
        phone_number=phone,
        content="START"
    )
    assert res["status"] == "opted_in"
    assert opt_repo.is_opted_out("test_cafe_001", phone) is False


def test_customer_inquiry_and_conversation_history(db_session, mock_provider):
    receiver = MessageReceiver(db_session)
    msg_repo = MessageRepository(db_session)
    phone = "+15554321098"

    res = receiver.handle_customer_message(
        cafe_id="test_cafe_001",
        phone_number=phone,
        content="Can I see the food and coffee menu?"
    )
    assert res["status"] == "processed"
    assert res["action"] == "auto_reply"

    # Verify incoming message was logged
    incoming = msg_repo.list_messages("test_cafe_001", phone=phone, direction=MessageDirection.INCOMING.value)
    assert len(incoming) >= 1
    assert "menu" in incoming[0].content

    # Verify outgoing reply was sent
    outgoing = msg_repo.list_messages("test_cafe_001", phone=phone, direction=MessageDirection.OUTGOING.value)
    assert len(outgoing) >= 1
    assert "menu" in outgoing[0].content
