from services.call_service import CallService


def test_call_lifecycle(db_session):
    service = CallService(db_session)

    # 1. Start incoming call
    call = service.start_call(
        caller_number="+15551234567",
        direction="incoming",
        agent_id="agent-bella-01",
        purpose="Reservation inquiry",
    )
    assert call.id.startswith("call-")
    assert call.status == "Connected"
    assert call.direction == "incoming"

    # 2. Record transcripts
    service.record_transcript(call.id, speaker="customer", message="Hi, I want to book a table.")
    service.record_transcript(call.id, speaker="ai", message="Hello! What date and time?")

    transcripts = service.get_transcripts(call.id)
    assert len(transcripts) == 2
    assert transcripts[0].speaker == "customer"
    assert transcripts[1].speaker == "ai"

    # 3. Link booking
    service.link_booking(call.id, "BKG-TEST-123")
    assert call.booking_id == "BKG-TEST-123"

    # 4. End call
    ended_call = service.end_call(call.id, outcome="Booking Confirmed")
    assert ended_call.status == "Completed"
    assert ended_call.outcome == "Booking Confirmed"
    assert ended_call.ai_summary is not None


def test_call_statistics(db_session):
    service = CallService(db_session)
    call = service.start_call(caller_number="+15559998888")
    service.end_call(call.id, outcome="Completed")

    stats = service.get_statistics()
    assert stats["total_calls"] >= 1
    assert "average_duration_seconds" in stats
    assert "completion_rate_percent" in stats
