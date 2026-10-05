from services.escalation_service import EscalationService
from services.call_service import CallService


def test_escalation_explicit_request(db_session):
    service = EscalationService(db_session)
    res = service.evaluate_escalation_need("I want to speak with a human manager please.")
    assert res["should_escalate"] is True
    assert res["type"] == "explicit_request"


def test_escalation_frustration_detected(db_session):
    service = EscalationService(db_session)
    res = service.evaluate_escalation_need("This is terrible, your service is incompetent!")
    assert res["should_escalate"] is True
    assert res["type"] == "frustration"


def test_escalation_payment_dispute(db_session):
    service = EscalationService(db_session)
    res = service.evaluate_escalation_need("I was charged twice on my credit card and need a refund.")
    assert res["should_escalate"] is True
    assert res["type"] == "payment_dispute"


def test_escalation_repeated_misunderstandings(db_session):
    service = EscalationService(db_session)
    res = service.evaluate_escalation_need("What do you mean?", misunderstanding_count=3)
    assert res["should_escalate"] is True
    assert res["type"] == "repeated_misunderstanding"


def test_transfer_to_human_execution(db_session):
    call_service = CallService(db_session)
    call = call_service.start_call(caller_number="+15551234567")

    escalation_service = EscalationService(db_session)
    transfer_res = escalation_service.transfer_to_human(call.id, reason="Customer requested human staff")

    assert transfer_res["escalated"] is True
    assert "transferring" in transfer_res["message"].lower()

    updated_call = call_service.get_call(call.id)
    assert updated_call.status == "Escalated"
    assert updated_call.escalation_status == "Transferred"
