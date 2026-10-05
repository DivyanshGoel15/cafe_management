def test_health_endpoint(client):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "mock_mode" in data
    assert "providers" in data


def test_list_calls_endpoint(client):
    res = client.get("/calls")
    assert res.status_code == 200
    data = res.json()
    assert "calls" in data
    assert "total" in data


def test_call_statistics_endpoint(client):
    res = client.get("/call-statistics")
    assert res.status_code == 200
    data = res.json()
    assert "total_calls" in data
    assert "average_duration_seconds" in data
    assert "completion_rate_percent" in data


def test_outbound_call_endpoint(client):
    payload = {
        "phone_number": "+15559876543",
        "agent_id": "agent-bella-01",
        "purpose": "Reservation Reminder",
        "customer_name": "David Miller",
    }
    res = client.post("/calls/outbound", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["phone_number"] == "+15559876543"
    assert "call_id" in data


def test_telephony_webhook(client):
    payload = {
        "call_sid": "mock-webhook-sid-001",
        "from_number": "+15551234567",
        "to_number": "+15550001111",
    }
    res = client.post("/webhooks/telephony", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "connected"
    assert data["call_id"] == "mock-webhook-sid-001"
    assert "greeting" in data


def test_call_status_webhook(client):
    payload = {
        "call_sid": "mock-webhook-sid-001",
        "call_status": "completed",
        "duration": 45,
    }
    res = client.post("/webhooks/call-status", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["updated_status"] == "Completed"


def test_agents_endpoints(client):
    # 1. GET /agents
    res = client.get("/agents")
    assert res.status_code == 200
    agents = res.json()
    assert len(agents) >= 1
    agent_id = agents[0]["id"]

    # 2. PUT /agents/{id}
    res_update = client.put(f"/agents/{agent_id}", json={"tone": "warm and friendly"})
    assert res_update.status_code == 200
    assert res_update.json()["tone"] == "warm and friendly"


def test_simulation_endpoints_flow(client):
    # 1. Start call
    res_start = client.post("/simulation/call/start", json={"caller_number": "+15551234567", "direction": "incoming"})
    assert res_start.status_code == 200
    call_id = res_start.json()["call_id"]
    assert "greeting" in res_start.json()

    # 2. Step dialogue turn
    res_step = client.post("/simulation/call/step", json={"call_id": call_id, "customer_message": "What time are you open on Saturday?"})
    assert res_step.status_code == 200
    step_data = res_step.json()
    assert "ai_response" in step_data

    # 3. End call
    res_end = client.post("/simulation/call/end", json={"call_id": call_id})
    assert res_end.status_code == 200
    assert res_end.json()["status"] == "Completed"


def test_bookings_api_crud(client):
    # 1. Check availability
    res_avail = client.post(
        "/bookings/check-availability",
        json={"date": "2026-10-20", "time": "19:00", "party_size": 2},
    )
    assert res_avail.status_code == 200
    assert res_avail.json()["is_available"] is True

    # 2. Create booking
    res_bkg = client.post(
        "/bookings",
        json={
            "customer_name": "John Wick",
            "customer_phone": "+15550009999",
            "booking_date": "2026-10-20",
            "booking_time": "19:00",
            "guests_count": 2,
        },
    )
    assert res_bkg.status_code == 201
    bkg_id = res_bkg.json()["id"]

    # 3. Modify booking
    res_mod = client.put(
        f"/bookings/{bkg_id}",
        json={"new_guests_count": 4},
    )
    assert res_mod.status_code == 200
    assert res_mod.json()["guests_count"] == 4

    # 4. Cancel booking
    res_del = client.delete(f"/bookings/{bkg_id}")
    assert res_del.status_code == 200
    assert res_del.json()["status"] == "cancelled"
