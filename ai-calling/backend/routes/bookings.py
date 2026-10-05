from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.connection import get_db
from services.booking_service import BookingService
from backend.models.booking import (
    AvailabilityRequest,
    AvailabilityResponse,
    BookingCreateRequest,
    BookingUpdateRequest,
    BookingCancelRequest,
    BookingResponse,
    TableResponse,
)

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("/check-availability", response_model=AvailabilityResponse)
def check_availability_endpoint(payload: AvailabilityRequest, db: Session = Depends(get_db)):
    """Check table availability for date, time, and party size."""
    service = BookingService(db)
    res = service.check_availability(
        booking_date=payload.date,
        booking_time=payload.time,
        party_size=payload.party_size,
    )
    return AvailabilityResponse(
        is_available=res["is_available"],
        date=res.get("date", payload.date),
        time=res.get("time", payload.time),
        party_size=payload.party_size,
        available_tables=[TableResponse(**t) for t in res.get("available_tables", [])],
        message=res["message"],
    )


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking_endpoint(payload: BookingCreateRequest, db: Session = Depends(get_db)):
    """Create a new confirmed table reservation."""
    service = BookingService(db)
    phone = payload.customer_phone or payload.phone_number or "+91 99999 88888"
    b_date = payload.booking_date
    b_time = payload.booking_time
    if payload.reservation_time:
        parts = payload.reservation_time.split("T")
        b_date = b_date or parts[0]
        if len(parts) > 1:
            b_time = b_time or parts[1][:5]
    b_date = b_date or "Tomorrow"
    b_time = b_time or "20:00"
    guests = payload.guests_count or payload.party_size or 4

    res = service.create_booking(
        customer_name=payload.customer_name,
        customer_phone=phone,
        booking_date=b_date,
        booking_time=b_time,
        guests_count=guests,
        special_requests=payload.special_requests,
        table_id=payload.table_id,
    )
    if not res.get("success"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=res.get("message", "Unable to create booking."))

    # Sync with Central Hub API so Admin Dashboard and Customer Website see it
    try:
        import urllib.request, json
        hub_payload = {
            "id": res["booking_id"],
            "name": res["customer_name"],
            "phone": res["customer_phone"],
            "date": res["booking_date"],
            "time": res["booking_time"],
            "guests": res["guests_count"],
            "tableId": res.get("table_id"),
            "specialRequests": res.get("special_requests", ""),
            "channel": "AI Voice Calling",
            "status": "Confirmed"
        }
        req_hub = urllib.request.Request(
            "http://localhost:4000/api/bookings",
            data=json.dumps(hub_payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "User-Agent": "AI-Calling"}
        )
        with urllib.request.urlopen(req_hub, timeout=1.5):
            pass
    except Exception:
        pass

    return BookingResponse(
        id=res["booking_id"],
        customer_name=res["customer_name"],
        customer_phone=res["customer_phone"],
        booking_date=res["booking_date"],
        booking_time=res["booking_time"],
        guests_count=res["guests_count"],
        table_id=res["table_id"],
        table_name=res["table_name"],
        special_requests=res["special_requests"],
        status=res["status"],
    )


@router.put("/{booking_id}", response_model=BookingResponse)
def modify_booking_endpoint(booking_id: str, payload: BookingUpdateRequest, db: Session = Depends(get_db)):
    """Modify reservation date, time, party size, or special requests."""
    service = BookingService(db)
    res = service.modify_booking(
        booking_id=booking_id,
        new_date=payload.new_date,
        new_time=payload.new_time,
        new_guests_count=payload.new_guests_count,
        special_requests=payload.special_requests,
    )
    if not res.get("success"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=res.get("message", "Modification failed."))

    try:
        import urllib.request, json
        hub_payload = {
            "date": res["booking_date"],
            "time": res["booking_time"],
            "guests": res["guests_count"],
            "specialRequests": res.get("special_requests", "")
        }
        req_hub = urllib.request.Request(
            f"http://localhost:4000/api/bookings/{booking_id}",
            data=json.dumps(hub_payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "User-Agent": "AI-Calling"},
            method="PUT"
        )
        with urllib.request.urlopen(req_hub, timeout=1.5):
            pass
    except Exception:
        pass

    return BookingResponse(
        id=res["booking_id"],
        customer_name=res["customer_name"],
        customer_phone=res.get("customer_phone", ""),
        booking_date=res["booking_date"],
        booking_time=res["booking_time"],
        guests_count=res["guests_count"],
        table_id=res.get("table_id"),
        special_requests=res.get("special_requests"),
        status=res["status"],
    )


@router.delete("/{booking_id}", response_model=BookingResponse)
def cancel_booking_endpoint(booking_id: str, db: Session = Depends(get_db)):
    """Cancel a reservation per cafe cancellation policy."""
    service = BookingService(db)
    res = service.cancel_booking(booking_id=booking_id)
    if not res.get("success"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=res.get("message", "Cancellation failed."))

    try:
        import urllib.request, json
        req_hub = urllib.request.Request(
            f"http://localhost:4000/api/bookings/{booking_id}/cancel",
            data=json.dumps({"reason": "Cancelled via AI Voice Calling"}).encode("utf-8"),
            headers={"Content-Type": "application/json", "User-Agent": "AI-Calling"}
        )
        with urllib.request.urlopen(req_hub, timeout=1.5):
            pass
    except Exception:
        pass

    booking = service.get_booking(booking_id)
    return BookingResponse(
        id=booking.id,
        customer_name=booking.customer_name,
        customer_phone=booking.customer_phone,
        booking_date=booking.booking_date,
        booking_time=booking.booking_time,
        guests_count=booking.guests_count,
        table_id=booking.table_id,
        special_requests=booking.special_requests,
        status=booking.status,
    )

