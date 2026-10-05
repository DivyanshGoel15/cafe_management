import pytest
from voice.gateway import VoiceGateway
from services.call_service import CallService
from services.booking_service import BookingService


@pytest.fixture
def gateway():
    return VoiceGateway()


def test_scenario_1_successful_booking(gateway, db_session):
    """Scenario 1: Customer calls and successfully completes a table booking."""
    call_id = "test-scen-1"
    # Call connects
    gateway.handle_incoming_call(call_id, "+15551234567", "+15550001111", session=db_session)

    # Step 1: Customer asks to book
    turn1 = gateway.process_call_turn(
        call_id=call_id,
        direct_text="Hi, I want to book a table for tomorrow evening.",
        session=db_session,
    )
    assert turn1["ai_response"] is not None

    # Step 2: Customer specifies party and time
    turn2 = gateway.process_call_turn(
        call_id=call_id,
        direct_text="7 PM for 2 people please.",
        session=db_session,
    )
    assert turn2["ai_response"] is not None

    # Step 3: Customer confirms
    turn3 = gateway.process_call_turn(
        call_id=call_id,
        direct_text="Yes, that works! Please confirm it under Sarah Connor.",
        session=db_session,
    )
    assert turn3["booking_id"] is not None
    assert turn3["booking_id"].startswith("BKG-")

    # Verify booking saved in database
    booking_service = BookingService(db_session)
    booking = booking_service.get_booking(turn3["booking_id"])
    assert booking is not None
    assert booking.status == "confirmed"


def test_scenario_2_no_availability(gateway, db_session):
    """Scenario 2: Customer asks for a slot with no availability (party size exceeded or closed hours)."""
    call_id = "test-scen-2"
    gateway.handle_incoming_call(call_id, "+15551234567", "+15550001111", session=db_session)

    # Party size 25 (exceeds online capacity)
    turn = gateway.process_call_turn(
        call_id=call_id,
        direct_text="I want to book a table for 25 people tomorrow at 7 PM.",
        session=db_session,
    )
    # Booking should NOT be confirmed
    assert turn["booking_id"] is None
    # AI response communicates unavailability or host transfer
    assert "require" in turn["ai_response"].lower() or "host" in turn["ai_response"].lower() or "speak" in turn["ai_response"].lower()


def test_scenario_3_booking_cancellation(gateway, db_session):
    """Scenario 3: Customer cancels an existing reservation."""
    call_id = "test-scen-3"
    gateway.handle_incoming_call(call_id, "+15551234567", "+15550001111", session=db_session)

    turn = gateway.process_call_turn(
        call_id=call_id,
        direct_text="I need to cancel my reservation BKG-9901.",
        session=db_session,
    )
    assert "cancelled" in turn["ai_response"].lower()

    # Verify in DB
    booking_service = BookingService(db_session)
    bkg = booking_service.get_booking("BKG-9901")
    assert bkg.status == "cancelled"


def test_scenario_4_booking_modification(gateway, db_session):
    """Scenario 4: Customer modifies an existing reservation."""
    call_id = "test-scen-4"
    gateway.handle_incoming_call(call_id, "+15551234567", "+15550001111", session=db_session)

    turn = gateway.process_call_turn(
        call_id=call_id,
        direct_text="Please modify my booking BKG-9901 to 8:00 PM.",
        session=db_session,
    )
    assert "updated" in turn["ai_response"].lower() or "modified" in turn["ai_response"].lower()

    booking_service = BookingService(db_session)
    bkg = booking_service.get_booking("BKG-9901")
    assert bkg.status == "modified"


def test_scenario_5_customer_asks_faq(gateway, db_session):
    """Scenario 5: Customer asks about opening hours, vegetarian menu, and parking."""
    call_id = "test-scen-5"
    gateway.handle_incoming_call(call_id, "+15551234567", "+15550001111", session=db_session)

    # FAQ 1: Hours
    t1 = gateway.process_call_turn(call_id=call_id, direct_text="What are your opening hours on Friday?", session=db_session)
    assert "open" in t1["ai_response"].lower() or "08:00" in t1["ai_response"] or "23:00" in t1["ai_response"]

    # FAQ 2: Vegetarian menu
    t2 = gateway.process_call_turn(call_id=call_id, direct_text="What vegetarian dishes do you have?", session=db_session)
    assert "vegetarian" in t2["ai_response"].lower() or "pasta" in t2["ai_response"].lower() or "$" in t2["ai_response"]

    # FAQ 3: Parking
    t3 = gateway.process_call_turn(call_id=call_id, direct_text="Where can I park my car?", session=db_session)
    assert "parking" in t3["ai_response"].lower() or "garage" in t3["ai_response"].lower()


def test_scenario_6_customer_asks_for_human(gateway, db_session):
    """Scenario 6: Customer asks to speak with human manager."""
    call_id = "test-scen-6"
    gateway.handle_incoming_call(call_id, "+15551234567", "+15550001111", session=db_session)

    turn = gateway.process_call_turn(
        call_id=call_id,
        direct_text="I want to speak to a real human manager right now.",
        session=db_session,
    )
    assert turn["escalated"] is True
    assert "transferring" in turn["ai_response"].lower()

    call_service = CallService(db_session)
    call = call_service.get_call(call_id)
    assert call.status == "Escalated"


def test_scenario_7_ai_does_not_know_answer(gateway, db_session):
    """Scenario 7: Customer asks an unrelated or unknown question."""
    call_id = "test-scen-7"
    gateway.handle_incoming_call(call_id, "+15551234567", "+15550001111", session=db_session)

    turn = gateway.process_call_turn(
        call_id=call_id,
        direct_text="Can you tell me the weather forecast on Mars tomorrow?",
        session=db_session,
    )
    assert "don't have that information" in turn["ai_response"].lower() or "reservations" in turn["ai_response"].lower()


def test_scenario_8_invalid_datetime_input(gateway, db_session):
    """Scenario 8: Customer provides invalid date format or nonsensical time."""
    booking_service = BookingService(db_session)
    res = booking_service.check_availability("not-a-real-date", "25:99", 2)
    assert res["is_available"] is False
    assert "invalid" in res["message"].lower()


def test_scenario_9_multiple_booking_attempts(gateway, db_session):
    """Scenario 9: Customer checks availability multiple times in the same session."""
    call_id = "test-scen-9"
    gateway.handle_incoming_call(call_id, "+15551234567", "+15550001111", session=db_session)

    # First attempt: 6 PM
    t1 = gateway.process_call_turn(call_id=call_id, direct_text="Can I book for 2 people tomorrow at 6 PM?", session=db_session)
    assert t1["ai_response"] is not None

    # Second attempt: 8 PM
    t2 = gateway.process_call_turn(call_id=call_id, direct_text="Actually, is 8 PM available tomorrow for 4 people?", session=db_session)
    assert t2["ai_response"] is not None

    # Confirm second
    t3 = gateway.process_call_turn(call_id=call_id, direct_text="Yes, confirm the 8 PM reservation under David.", session=db_session)
    assert t3["booking_id"] is not None


def test_scenario_10_call_interruption_and_failure(gateway, db_session):
    """Scenario 10: Call is abruptly interrupted or terminated by carrier webhook."""
    call_id = "test-scen-10"
    gateway.handle_incoming_call(call_id, "+15551234567", "+15550001111", session=db_session)

    # Mid-call disconnect
    call_service = CallService(db_session)
    ended = call_service.end_call(call_id=call_id, status="Failed", outcome="Call Interrupted / Dropped")
    assert ended.status == "Failed"
    assert ended.outcome == "Call Interrupted / Dropped"

    # Verify gateway clean up
    gateway.end_call(call_id, session=db_session)
    assert call_id not in gateway.active_agents
