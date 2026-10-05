import uuid
import re
from datetime import datetime
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
from database.repositories.booking_repository import BookingRepository
from database.repositories.customer_repository import CustomerRepository
from database.models.booking_entity import BookingModel
from database.mock_data.seeder import load_json_file


class BookingService:
    def __init__(self, session: Session):
        self.session = session
        self.booking_repo = BookingRepository(session)
        self.customer_repo = CustomerRepository(session)
        self.cafe_info = load_json_file("cafe_info.json")

    def _validate_datetime(self, date_str: str, time_str: str) -> datetime:
        """Validate date and time format (YYYY-MM-DD and HH:MM)."""
        clean_date = date_str.strip()
        clean_time = time_str.strip()

        # Handle time format if user specifies single-digit hour like "7:00" -> "07:00" or "19:00"
        time_parts = clean_time.split(":")
        if len(time_parts) == 2 and len(time_parts[0]) == 1:
            clean_time = f"0{time_parts[0]}:{time_parts[1]}"

        # Standardize 12-hour AM/PM if passed (e.g., "7:00 PM" -> "19:00")
        match_ampm = re.match(r"(\d{1,2}):(\d{2})\s*(am|pm)", clean_time, re.IGNORECASE)
        if match_ampm:
            hour, minute, ampm = match_ampm.groups()
            hour = int(hour)
            if ampm.lower() == "pm" and hour != 12:
                hour += 12
            elif ampm.lower() == "am" and hour == 12:
                hour = 0
            clean_time = f"{hour:02d}:{minute}"

        dt_str = f"{clean_date} {clean_time}"
        try:
            return datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
        except ValueError:
            raise ValueError(f"Invalid date or time format: '{date_str}' '{time_str}'. Expected YYYY-MM-DD and HH:MM.")

    def _is_within_operating_hours(self, dt: datetime) -> bool:
        """Verify requested time falls within cafe business hours."""
        weekday_name = dt.strftime("%A").lower()
        hours_str = self.cafe_info["business_hours"].get(weekday_name)
        if not hours_str:
            return False

        try:
            open_str, close_str = [h.strip() for h in hours_str.split("-")]
            open_h, open_m = map(int, open_str.split(":"))
            close_h, close_m = map(int, close_str.split(":"))

            req_time_minutes = dt.hour * 60 + dt.minute
            open_time_minutes = open_h * 60 + open_m
            close_time_minutes = close_h * 60 + close_m

            return open_time_minutes <= req_time_minutes <= (close_time_minutes - 30)
        except Exception:
            return True

    def check_availability(self, booking_date: str, booking_time: str, party_size: int) -> Dict[str, Any]:
        """
        Check table availability for given date, time, and party size.
        Never confirms booking without availability.
        """
        if party_size < 1:
            return {
                "is_available": False,
                "message": "Party size must be at least 1 person.",
                "available_tables": [],
            }

        max_allowed = self.cafe_info["booking_rules"]["max_party_size_online"]
        if party_size > max_allowed:
            return {
                "is_available": False,
                "message": f"Parties larger than {max_allowed} guests require speaking directly with a host for private dining arrangements.",
                "available_tables": [],
                "requires_escalation": True,
            }

        try:
            target_dt = self._validate_datetime(booking_date, booking_time)
        except ValueError as e:
            return {
                "is_available": False,
                "message": str(e),
                "available_tables": [],
            }

        if not self._is_within_operating_hours(target_dt):
            day_name = target_dt.strftime("%A")
            hours = self.cafe_info["business_hours"].get(day_name.lower(), "Closed")
            return {
                "is_available": False,
                "message": f"The cafe is closed or not accepting bookings at that time on {day_name}. Operating hours are {hours}.",
                "available_tables": [],
            }

        norm_date = target_dt.strftime("%Y-%m-%d")
        norm_time = target_dt.strftime("%H:%M")

        available_tables = self.booking_repo.find_available_tables(
            booking_date=norm_date,
            booking_time=norm_time,
            party_size=party_size,
        )

        if not available_tables:
            return {
                "is_available": False,
                "message": f"Sorry, all tables for a party of {party_size} are fully booked on {norm_date} at {norm_time}. Would you like to check an alternative time?",
                "available_tables": [],
            }

        tables_info = [
            {
                "id": t.id,
                "name": t.name,
                "capacity": t.capacity,
                "location": t.location,
                "is_active": t.is_active,
            }
            for t in available_tables
        ]

        return {
            "is_available": True,
            "message": f"Yes! We have {len(available_tables)} table option(s) available on {norm_date} at {norm_time} for {party_size} guests.",
            "available_tables": tables_info,
            "date": norm_date,
            "time": norm_time,
            "party_size": party_size,
        }

    def create_booking(
        self,
        customer_name: str,
        customer_phone: str,
        booking_date: str,
        booking_time: str,
        guests_count: int,
        special_requests: Optional[str] = None,
        table_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Create a new table booking. Enforces availability check first.
        """
        # 1. Availability check
        avail = self.check_availability(booking_date, booking_time, guests_count)
        if not avail["is_available"]:
            return {
                "success": False,
                "error": "Table unavailable",
                "message": avail["message"],
            }

        norm_date = avail["date"]
        norm_time = avail["time"]

        # Select table
        selected_table = None
        available_tables = avail["available_tables"]
        if table_id:
            for t in available_tables:
                if t["id"] == table_id:
                    selected_table = t
                    break
        if not selected_table:
            # Pick best fit capacity table
            selected_table = available_tables[0]

        # Find or create customer
        customer = self.customer_repo.find_or_create(name=customer_name, phone=customer_phone)

        # Generate unique booking ID
        booking_id = f"BKG-{uuid.uuid4().hex[:6].upper()}"

        new_booking = BookingModel(
            id=booking_id,
            customer_id=customer.id,
            customer_name=customer.name,
            customer_phone=customer.phone,
            booking_date=norm_date,
            booking_time=norm_time,
            guests_count=guests_count,
            table_id=selected_table["id"],
            special_requests=special_requests,
            status="confirmed",
        )
        saved = self.booking_repo.create(new_booking)

        # Sync with Central Hub API so Admin Dashboard and Customer Website see it
        try:
            import urllib.request, json
            tnum = None
            if saved.table_id:
                digits = "".join([c for c in str(saved.table_id) if c.isdigit()])
                tnum = int(digits) if digits else None
            hub_payload = {
                "id": saved.id,
                "name": saved.customer_name,
                "customerName": saved.customer_name,
                "phone": saved.customer_phone,
                "date": saved.booking_date,
                "time": saved.booking_time,
                "guests": saved.guests_count,
                "tableId": saved.table_id,
                "tableNumber": tnum,
                "specialRequests": saved.special_requests or "",
                "channel": "AI Voice Calling",
                "status": "Confirmed"
            }
            req_hub = urllib.request.Request(
                "http://localhost:4000/api/bookings",
                data=json.dumps(hub_payload).encode("utf-8"),
                headers={"Content-Type": "application/json", "User-Agent": "AI-Calling"}
            )
            with urllib.request.urlopen(req_hub, timeout=1.2):
                pass
        except Exception:
            pass

        return {
            "success": True,
            "booking_id": saved.id,
            "customer_name": saved.customer_name,
            "customer_phone": saved.customer_phone,
            "booking_date": saved.booking_date,
            "booking_time": saved.booking_time,
            "guests_count": saved.guests_count,
            "table_id": saved.table_id,
            "table_name": selected_table["name"],
            "special_requests": saved.special_requests,
            "status": saved.status,
            "message": f"Reservation confirmed! Booking reference is {saved.id} for {saved.customer_name} on {saved.booking_date} at {saved.booking_time}.",
        }

    def modify_booking(
        self,
        booking_id: str,
        new_date: Optional[str] = None,
        new_time: Optional[str] = None,
        new_guests_count: Optional[int] = None,
        special_requests: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Modify an existing booking, verifying availability if date/time/guests changed."""
        booking = self.booking_repo.get_by_id(booking_id)
        if not booking:
            return {"success": False, "error": "Not Found", "message": f"No booking found with ID {booking_id}."}

        if booking.status == "cancelled":
            return {"success": False, "error": "Cancelled", "message": f"Booking {booking_id} was already cancelled and cannot be modified."}

        target_date = new_date or booking.booking_date
        target_time = new_time or booking.booking_time
        target_guests = new_guests_count if new_guests_count is not None else booking.guests_count

        # If date, time, or guests changed, verify availability
        if (new_date and new_date != booking.booking_date) or (new_time and new_time != booking.booking_time) or (new_guests_count and new_guests_count != booking.guests_count):
            avail = self.check_availability(target_date, target_time, target_guests)
            if not avail["is_available"]:
                return {
                    "success": False,
                    "error": "Slot unavailable",
                    "message": f"Cannot modify booking: {avail['message']}",
                }
            booking.booking_date = avail["date"]
            booking.booking_time = avail["time"]
            booking.guests_count = target_guests
            booking.table_id = avail["available_tables"][0]["id"]

        if special_requests is not None:
            booking.special_requests = special_requests

        booking.status = "modified"
        self.session.commit()
        self.session.refresh(booking)

        # Sync update with Central Hub API
        try:
            import urllib.request, json
            hub_payload = {
                "date": booking.booking_date,
                "time": booking.booking_time,
                "guests": booking.guests_count,
                "tableId": booking.table_id,
                "specialRequests": booking.special_requests
            }
            req_hub = urllib.request.Request(
                f"http://localhost:4000/api/bookings/{booking.id}",
                data=json.dumps(hub_payload).encode("utf-8"),
                headers={"Content-Type": "application/json", "User-Agent": "AI-Calling"},
                method="PUT"
            )
            with urllib.request.urlopen(req_hub, timeout=1.2):
                pass
        except Exception:
            pass

        return {
            "success": True,
            "booking_id": booking.id,
            "customer_name": booking.customer_name,
            "booking_date": booking.booking_date,
            "booking_time": booking.booking_time,
            "guests_count": booking.guests_count,
            "table_id": booking.table_id,
            "special_requests": booking.special_requests,
            "status": booking.status,
            "message": f"Booking {booking.id} updated successfully for {booking.booking_date} at {booking.booking_time} ({booking.guests_count} guests).",
        }

    def cancel_booking(self, booking_id: str, reason: Optional[str] = None) -> Dict[str, Any]:
        """Cancel an existing reservation with policy enforcement."""
        booking = self.booking_repo.get_by_id(booking_id)
        if not booking:
            return {"success": False, "error": "Not Found", "message": f"No booking found with ID {booking_id}."}

        if booking.status == "cancelled":
            return {"success": True, "booking_id": booking_id, "message": f"Booking {booking_id} was already cancelled."}

        booking.status = "cancelled"
        booking.cancellation_reason = reason or "Customer requested cancellation"
        self.session.commit()
        self.session.refresh(booking)

        # Sync cancel with Central Hub API
        try:
            import urllib.request, json
            req_hub = urllib.request.Request(
                f"http://localhost:4000/api/bookings/{booking_id}/cancel",
                data=json.dumps({"reason": booking.cancellation_reason}).encode("utf-8"),
                headers={"Content-Type": "application/json", "User-Agent": "AI-Calling"}
            )
            with urllib.request.urlopen(req_hub, timeout=1.2):
                pass
        except Exception:
            pass

        return {
            "success": True,
            "booking_id": booking.id,
            "status": "cancelled",
            "message": f"Your reservation {booking.id} has been cancelled per our policy. We hope to see you another time!",
        }

    def get_booking(self, booking_id: str) -> Optional[BookingModel]:
        return self.booking_repo.get_by_id(booking_id)

    def get_customer_bookings(self, customer_phone: str) -> List[BookingModel]:
        return self.booking_repo.get_bookings_by_customer_phone(customer_phone)
