from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from database.repositories.customer_repository import CustomerRepository
from database.repositories.booking_repository import BookingRepository
from database.models.customer_entity import CustomerModel


class CustomerService:
    def __init__(self, session: Session):
        self.session = session
        self.customer_repo = CustomerRepository(session)
        self.booking_repo = BookingRepository(session)

    def get_by_phone(self, phone: str) -> Optional[CustomerModel]:
        return self.customer_repo.get_by_phone(phone)

    def create_or_update_customer(self, name: str, phone: str, email: Optional[str] = None, notes: Optional[str] = None) -> CustomerModel:
        customer = self.customer_repo.find_or_create(name=name, phone=phone, email=email)
        if notes:
            customer.notes = f"{customer.notes}\n{notes}" if customer.notes else notes
            self.session.commit()
            self.session.refresh(customer)
        return customer

    def get_customer_history(self, phone: str) -> Dict[str, Any]:
        customer = self.customer_repo.get_by_phone(phone)
        bookings = self.booking_repo.get_bookings_by_customer_phone(phone)

        booking_summaries = [
            {
                "id": b.id,
                "date": b.booking_date,
                "time": b.booking_time,
                "guests": b.guests_count,
                "status": b.status,
                "special_requests": b.special_requests,
            }
            for b in bookings
        ]

        return {
            "customer_found": customer is not None,
            "name": customer.name if customer else None,
            "phone": phone,
            "notes": customer.notes if customer else None,
            "total_bookings": len(bookings),
            "recent_bookings": booking_summaries[:5],
        }
