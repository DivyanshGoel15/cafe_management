import pytest
from services.booking_service import BookingService


def test_check_availability_success(db_session):
    service = BookingService(db_session)
    res = service.check_availability(
        booking_date="2026-10-10",
        booking_time="19:00",
        party_size=4,
    )
    assert res["is_available"] is True
    assert len(res["available_tables"]) > 0
    assert any(t["capacity"] >= 4 for t in res["available_tables"])


def test_check_availability_party_size_exceeded(db_session):
    service = BookingService(db_session)
    res = service.check_availability(
        booking_date="2026-10-10",
        booking_time="19:00",
        party_size=15,  # Max allowed online is 10
    )
    assert res["is_available"] is False
    assert res.get("requires_escalation") is True


def test_check_availability_outside_hours(db_session):
    service = BookingService(db_session)
    res = service.check_availability(
        booking_date="2026-10-10",
        booking_time="03:00",  # 3:00 AM is closed
        party_size=2,
    )
    assert res["is_available"] is False
    assert "closed" in res["message"].lower()


def test_create_booking_success(db_session):
    service = BookingService(db_session)
    res = service.create_booking(
        customer_name="Alex Turner",
        customer_phone="+15552223333",
        booking_date="2026-10-12",
        booking_time="18:30",
        guests_count=4,
        special_requests="Corner table preferred",
    )
    assert res["success"] is True
    assert res["booking_id"].startswith("BKG-")
    assert res["status"] == "confirmed"

    # Verify saved in database
    booking = service.get_booking(res["booking_id"])
    assert booking is not None
    assert booking.customer_name == "Alex Turner"
    assert booking.guests_count == 4


def test_cannot_double_book_same_table(db_session):
    service = BookingService(db_session)
    # T-01 is booked at 2026-09-30 19:00 for 2 guests in conftest
    # Let's try to book for 2 guests at the same time
    # Check availability
    res = service.check_availability("2026-09-30", "19:00", party_size=2)
    assert res["is_available"] is True
    # T-01 should NOT be in available tables because it is booked
    available_ids = [t["id"] for t in res["available_tables"]]
    assert "T-01" not in available_ids


def test_modify_booking_success(db_session):
    service = BookingService(db_session)
    res = service.modify_booking(
        booking_id="BKG-9901",
        new_date="2026-10-05",
        new_time="20:00",
        new_guests_count=4,
    )
    assert res["success"] is True
    assert res["booking_date"] == "2026-10-05"
    assert res["booking_time"] == "20:00"
    assert res["guests_count"] == 4
    assert res["status"] == "modified"


def test_modify_booking_not_found(db_session):
    service = BookingService(db_session)
    res = service.modify_booking(booking_id="BKG-NONEXISTENT", new_time="20:00")
    assert res["success"] is False
    assert "No booking found" in res["message"]


def test_cancel_booking(db_session):
    service = BookingService(db_session)
    res = service.cancel_booking(booking_id="BKG-9901", reason="Change of plans")
    assert res["success"] is True
    assert res["status"] == "cancelled"

    # Verify status in database
    bkg = service.get_booking("BKG-9901")
    assert bkg.status == "cancelled"
    assert bkg.cancellation_reason == "Change of plans"
