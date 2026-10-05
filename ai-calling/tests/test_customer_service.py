from services.customer_service import CustomerService


def test_customer_creation_and_history(db_session):
    service = CustomerService(db_session)

    # 1. Create or update customer
    cust = service.create_or_update_customer(
        name="James Bond",
        phone="+15550070007",
        email="jb@example.com",
        notes="Martini shaken not stirred",
    )
    assert cust.id.startswith("cust-")
    assert cust.name == "James Bond"
    assert cust.phone == "+15550070007"

    # 2. Retrieve history for customer
    history = service.get_customer_history("+15550070007")
    assert history["customer_found"] is True
    assert history["name"] == "James Bond"
    assert history["total_bookings"] == 0


def test_existing_customer_history(db_session):
    service = CustomerService(db_session)
    # Sarah Connor (+15551234567) seeded with 1 booking in conftest
    history = service.get_customer_history("+15551234567")
    assert history["customer_found"] is True
    assert history["name"] == "Sarah Connor"
    assert history["total_bookings"] >= 1
    assert len(history["recent_bookings"]) >= 1
