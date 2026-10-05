from backend.config.settings import settings


def test_meta_webhook_verification(client):
    verify_token = settings.WHATSAPP_WEBHOOK_VERIFY_TOKEN
    challenge = "random_challenge_string_12345"

    res = client.get(
        "/webhooks/incoming",
        params={
            "hub.mode": "subscribe",
            "hub.verify_token": verify_token,
            "hub.challenge": challenge
        }
    )
    assert res.status_code == 200
    assert res.text == challenge


def test_meta_webhook_verification_mismatch(client):
    res = client.get(
        "/webhooks/incoming",
        params={
            "hub.mode": "subscribe",
            "hub.verify_token": "wrong_token",
            "hub.challenge": "challenge_abc"
        }
    )
    assert res.status_code == 403


def test_post_incoming_webhook_mock_format(client):
    payload = {
        "phone_number": "+15556667788",
        "message": "Hello, do you have outdoor seating?"
    }
    res = client.post("/webhooks/incoming", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["result"]["status"] == "processed"


def test_cafe_booking_created_webhook(client):
    payload = {
        "booking_id": "bkg_cafe_hook_01",
        "phone": "+15558889900",
        "customer_name": "Oliver Twist",
        "date": "2026-10-15",
        "time": "19:30",
        "guests": 2
    }
    res = client.post("/webhooks/cafe/booking-created", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "received"
    assert "event_id" in data


def test_cafe_order_updated_webhook(client):
    payload = {
        "order_id": "ord_cafe_hook_99",
        "phone": "+15558889900",
        "customer_name": "Oliver Twist",
        "total_amount": "45.00",
        "status": "READY"
    }
    res = client.post("/webhooks/cafe/order-updated", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "received"
    assert data["event_type"] == "order.ready"
