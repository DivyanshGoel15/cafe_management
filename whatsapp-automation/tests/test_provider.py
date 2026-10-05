from messaging.providers import get_whatsapp_provider, MockWhatsAppProvider, WhatsAppProvider


def test_provider_singleton_and_abstraction():
    provider = get_whatsapp_provider()
    assert isinstance(provider, WhatsAppProvider)
    assert isinstance(provider, MockWhatsAppProvider)


def test_mock_send_text_and_delivery(mock_provider):
    res = mock_provider.send_message(
        phone_number="+15551234567",
        content="Test Message Content",
        cafe_id="test_cafe"
    )
    assert res.success is True
    assert res.provider_message_id is not None
    assert res.status in ("SENT", "DELIVERED", "READ")
    assert len(mock_provider.sent_messages) == 1
    assert mock_provider.sent_messages[0]["content"] == "Test Message Content"


def test_mock_send_template(mock_provider):
    res = mock_provider.send_template(
        phone_number="+15551234567",
        template_name="booking_confirmation",
        variables={"customer_name": "Alice", "cafe_name": "Bean Cafe"},
        cafe_id="test_cafe"
    )
    assert res.success is True
    assert len(mock_provider.sent_messages) == 1
    assert mock_provider.sent_messages[0]["template_name"] == "booking_confirmation"


def test_mock_simulate_failure(mock_provider):
    mock_provider.set_force_fail(True, reason="Simulated network timeout")
    res = mock_provider.send_message(
        phone_number="+15551234567",
        content="This should fail"
    )
    assert res.success is False
    assert res.status == "FAILED"
    assert "Simulated network timeout" in res.error_message

    # Reset
    mock_provider.set_force_fail(False)
    res2 = mock_provider.send_message(phone_number="+15551234567", content="This works")
    assert res2.success is True


def test_parse_incoming_webhook(mock_provider):
    # Format 1: simple mock payload
    payload1 = {"phone_number": "+15559876543", "message": "Can I reserve a table?"}
    parsed1 = mock_provider.parse_incoming_webhook(payload1)
    assert parsed1 is not None
    assert parsed1.phone_number == "+15559876543"
    assert parsed1.message_content == "Can I reserve a table?"

    # Format 2: Meta Cloud API format
    meta_payload = {
        "object": "whatsapp_business_account",
        "entry": [
            {
                "id": "123456",
                "changes": [
                    {
                        "value": {
                            "messaging_product": "whatsapp",
                            "messages": [
                                {
                                    "from": "15553334444",
                                    "id": "wamid.123",
                                    "type": "text",
                                    "text": {"body": "STOP"}
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }
    parsed2 = mock_provider.parse_incoming_webhook(meta_payload)
    assert parsed2 is not None
    assert parsed2.phone_number == "15553334444"
    assert parsed2.message_content == "STOP"
