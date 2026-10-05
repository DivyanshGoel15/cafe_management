from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from database.models.booking_entity import BookingModel, TableModel
from .base import BaseRepository


class BookingRepository(BaseRepository[BookingModel]):
    def __init__(self, session: Session):
        super().__init__(BookingModel, session)

    def get_all_tables(self, is_active: bool = True) -> List[TableModel]:
        return self.session.query(TableModel).filter(TableModel.is_active == is_active).all()

    def get_table_by_id(self, table_id: str) -> Optional[TableModel]:
        return self.session.query(TableModel).filter(TableModel.id == table_id).first()

    def get_bookings_for_date(self, booking_date: str) -> List[BookingModel]:
        return (
            self.session.query(BookingModel)
            .filter(
                BookingModel.booking_date == booking_date,
                BookingModel.status.in_(["confirmed", "modified"]),
            )
            .all()
        )

    def get_bookings_by_customer_phone(self, phone: str) -> List[BookingModel]:
        return (
            self.session.query(BookingModel)
            .filter(BookingModel.customer_phone == phone.strip())
            .order_by(BookingModel.booking_date.desc(), BookingModel.booking_time.desc())
            .all()
        )

    def find_available_tables(
        self,
        booking_date: str,
        booking_time: str,
        party_size: int,
        sitting_minutes: int = 90,
    ) -> List[TableModel]:
        """
        Find tables with sufficient capacity that are NOT booked within `sitting_minutes` window.
        """
        # Parse target time
        try:
            target_dt = datetime.strptime(f"{booking_date} {booking_time}", "%Y-%m-%d %H:%M")
        except ValueError:
            return []

        # Find existing bookings on this date
        date_bookings = self.get_bookings_for_date(booking_date)

        # Identify booked table IDs overlapping with target_dt
        booked_table_ids = set()
        for b in date_bookings:
            try:
                b_dt = datetime.strptime(f"{b.booking_date} {b.booking_time}", "%Y-%m-%d %H:%M")
                delta = abs((target_dt - b_dt).total_seconds())
                # If overlap within sitting duration
                if delta < sitting_minutes * 60:
                    booked_table_ids.add(b.table_id)
            except ValueError:
                continue

        # Tables with capacity >= party_size and not currently booked
        eligible_tables = (
            self.session.query(TableModel)
            .filter(
                TableModel.is_active == True,
                TableModel.capacity >= party_size,
                ~TableModel.id.in_(booked_table_ids) if booked_table_ids else True,
            )
            .order_by(TableModel.capacity.asc())
            .all()
        )
        return eligible_tables
