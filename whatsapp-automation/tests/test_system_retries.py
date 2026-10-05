from services.notification_service import NotificationService
from database.models.message import MessageStatus
from workflows.system.retry_workflows import RetryWorkflow


def test_failed_message_retry(db_session, mock_provider):
    service = NotificationService(db_session)

    # Force failure on first attempt
    mock_provider.set_force_fail(True, reason="Simulated Gateway Timeout")
    msg = service.send_message(
        cafe_id="test_cafe_001",
        phone_number="+15550001122",
        content="Important Alert"
    )
    assert msg.status == MessageStatus.FAILED.value
    assert "Gateway Timeout" in msg.error_information

    # Clear failure condition
    mock_provider.set_force_fail(False)

    # Retry message
    retry_workflow = RetryWorkflow(db_session)
    res = retry_workflow.retry_message(msg.id)
    assert res["status"] in (MessageStatus.SENT.value, MessageStatus.DELIVERED.value, MessageStatus.READ.value)
    assert res["retry_count"] == 1

    # Verify updated status in DB
    refreshed = service.get_message(msg.id)
    assert refreshed.status in ("SENT", "DELIVERED", "READ")
