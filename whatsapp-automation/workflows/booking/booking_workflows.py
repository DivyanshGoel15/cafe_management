import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from dateutil import parser
from sqlalchemy.orm import Session

from backend.config.settings import settings
from database.models.customer import Customer
from database.repositories.customer_repository import CustomerRepository
from database.repositories.template_repository import TemplateRepository
from messaging.sender import MessageSender
from messaging.templates.renderer import TemplateRenderer
from scheduler import get_scheduler
from workflows.events import AutomationEventSchema

logger = logging.getLogger(__name__)


class BookingWorkflow:
    """
    Automations for table reservations:
    - Booking confirmation (immediate)
    - Automated reminders (24 hours and 2 hours before)
    - Booking modification (with reminder rescheduling)
    - Booking cancellation (with reminder cancellation)
    - No-show follow-up
    """

    def __init__(self, db: Session):
        self.db = db
        self.customer_repo = CustomerRepository(db)
        self.template_repo = TemplateRepository(db)
        self.sender = MessageSender(db)
        self.scheduler = get_scheduler()

    def handle_booking_created(self, event: AutomationEventSchema, db: Session) -> Dict[str, Any]:
        """Triggered upon `booking.created` event."""
        payload = event.payload
        cafe_id = event.cafe_id or settings.DEFAULT_CAFE_ID
        booking_id = payload.get("booking_id", "bkg_unknown")
        customer_name = payload.get("customer_name", "Valued Guest")
        customer_phone = payload.get("customer_phone") or payload.get("phone")
        booking_date = payload.get("date", "Today")
        booking_time = payload.get("time", "7:00 PM")
        guests = payload.get("guests", 2)
        cafe_name = payload.get("cafe_name", settings.DEFAULT_CAFE_NAME)

        if not customer_phone:
            logger.error(f"Cannot process booking {booking_id}: missing customer phone.")
            return {"error": "Missing customer phone"}

        # 1. Ensure customer record exists
        customer = self.customer_repo.get_or_create(cafe_id=cafe_id, phone=customer_phone, name=customer_name)

        # 2. Send immediate Booking Confirmation
        template = self.template_repo.get_by_name(cafe_id, "booking_confirmation")
        template_content = template.content if template else (
            "Hi {{customer_name}}, your table at {{cafe_name}} is confirmed for {{date}} at {{time}} for {{guests}} guests!"
        )

        variables = {
            "customer_name": customer_name,
            "cafe_name": cafe_name,
            "date": booking_date,
            "time": booking_time,
            "guests": guests
        }
        rendered = TemplateRenderer.render(template_content, variables)

        confirmation_msg = self.sender.send_template_message(
            cafe_id=cafe_id,
            phone_number=customer_phone,
            template_name="booking_confirmation",
            rendered_content=rendered,
            variables=variables,
            customer_id=customer.id,
            category="BOOKING",
            metadata={"booking_id": booking_id, "workflow": "booking_confirmation"}
        )

        # 3. Schedule automated reminders (24h and 2h before reservation)
        scheduled_reminders = self._schedule_reminders(
            cafe_id=cafe_id,
            booking_id=booking_id,
            customer_phone=customer_phone,
            customer_name=customer_name,
            cafe_name=cafe_name,
            booking_date=booking_date,
            booking_time=booking_time,
            guests=guests,
            datetime_str=payload.get("reservation_datetime")
        )

        return {
            "booking_id": booking_id,
            "confirmation_message_id": confirmation_msg.id,
            "reminders_scheduled": scheduled_reminders
        }

    def _schedule_reminders(
        self,
        cafe_id: str,
        booking_id: str,
        customer_phone: str,
        customer_name: str,
        cafe_name: str,
        booking_date: str,
        booking_time: str,
        guests: int,
        datetime_str: Optional[str] = None
    ) -> list:
        scheduled = []
        reservation_dt = None

        if datetime_str:
            try:
                reservation_dt = parser.parse(datetime_str)
            except Exception as e:
                logger.warning(f"Could not parse reservation datetime '{datetime_str}': {e}")

        now = datetime.utcnow()

        # If reservation datetime is in the future, schedule real offsets
        if reservation_dt and reservation_dt > now:
            first_offset = timedelta(hours=settings.BOOKING_REMINDER_FIRST_HOURS)
            second_offset = timedelta(hours=settings.BOOKING_REMINDER_SECOND_HOURS)

            time_24h = reservation_dt - first_offset
            time_2h = reservation_dt - second_offset

            base_payload = {
                "cafe_id": cafe_id,
                "booking_id": booking_id,
                "customer_phone": customer_phone,
                "customer_name": customer_name,
                "cafe_name": cafe_name,
                "date": booking_date,
                "time": booking_time,
                "guests": guests
            }

            if time_24h > now:
                job24 = self.scheduler.schedule_job(
                    cafe_id=cafe_id,
                    job_type="send_reminder",
                    run_at=time_24h,
                    payload={**base_payload, "reminder_type": "24h"},
                    target_id=booking_id,
                    db=self.db
                )
                scheduled.append({"type": "24h", "job_id": job24.id, "run_at": time_24h.isoformat()})

            if time_2h > now:
                job2 = self.scheduler.schedule_job(
                    cafe_id=cafe_id,
                    job_type="send_reminder",
                    run_at=time_2h,
                    payload={**base_payload, "reminder_type": "2h"},
                    target_id=booking_id,
                    db=self.db
                )
                scheduled.append({"type": "2h", "job_id": job2.id, "run_at": time_2h.isoformat()})
        else:
            # Fallback mock scheduling for immediate or test reservations
            # Schedule a test reminder job 5 minutes out if not provided
            test_run_at = now + timedelta(minutes=5)
            job = self.scheduler.schedule_job(
                cafe_id=cafe_id,
                job_type="send_reminder",
                run_at=test_run_at,
                payload={
                    "cafe_id": cafe_id,
                    "booking_id": booking_id,
                    "customer_phone": customer_phone,
                    "customer_name": customer_name,
                    "cafe_name": cafe_name,
                    "date": booking_date,
                    "time": booking_time,
                    "guests": guests,
                    "reminder_type": "24h"
                },
                target_id=booking_id,
                db=self.db
            )
            scheduled.append({"type": "24h_mock", "job_id": job.id, "run_at": test_run_at.isoformat()})

        return scheduled

    def handle_booking_updated(self, event: AutomationEventSchema, db: Session) -> Dict[str, Any]:
        """Triggered upon `booking.updated` event."""
        payload = event.payload
        cafe_id = event.cafe_id or settings.DEFAULT_CAFE_ID
        booking_id = payload.get("booking_id")
        customer_phone = payload.get("customer_phone") or payload.get("phone")
        customer_name = payload.get("customer_name", "Valued Guest")
        date_str = payload.get("date", "Updated Date")
        time_str = payload.get("time", "Updated Time")
        guests = payload.get("guests", 2)
        cafe_name = payload.get("cafe_name", settings.DEFAULT_CAFE_NAME)

        # 1. Cancel previous pending reminders for this booking
        cancelled_count = self.scheduler.cancel_jobs_for_target(booking_id, db=self.db)

        # 2. Send booking modification notification
        template = self.template_repo.get_by_name(cafe_id, "booking_modification")
        template_content = template.content if template else (
            "Hi {{customer_name}}, your booking at {{cafe_name}} has been updated: Date: {{date}}, Time: {{time}}, Guests: {{guests}}."
        )

        variables = {
            "customer_name": customer_name,
            "cafe_name": cafe_name,
            "date": date_str,
            "time": time_str,
            "guests": guests
        }
        rendered = TemplateRenderer.render(template_content, variables)

        msg = self.sender.send_template_message(
            cafe_id=cafe_id,
            phone_number=customer_phone,
            template_name="booking_modification",
            rendered_content=rendered,
            variables=variables,
            category="BOOKING",
            metadata={"booking_id": booking_id, "workflow": "booking_modification"}
        )

        # 3. Re-schedule reminders based on new time
        new_reminders = self._schedule_reminders(
            cafe_id=cafe_id,
            booking_id=booking_id,
            customer_phone=customer_phone,
            customer_name=customer_name,
            cafe_name=cafe_name,
            booking_date=date_str,
            booking_time=time_str,
            guests=guests,
            datetime_str=payload.get("reservation_datetime")
        )

        return {
            "booking_id": booking_id,
            "message_id": msg.id,
            "cancelled_reminders_count": cancelled_count,
            "new_reminders": new_reminders
        }

    def handle_booking_cancelled(self, event: AutomationEventSchema, db: Session) -> Dict[str, Any]:
        """Triggered upon `booking.cancelled` event."""
        payload = event.payload
        cafe_id = event.cafe_id or settings.DEFAULT_CAFE_ID
        booking_id = payload.get("booking_id")
        customer_phone = payload.get("customer_phone") or payload.get("phone")
        customer_name = payload.get("customer_name", "Valued Guest")
        date_str = payload.get("date", "your reserved date")
        time_str = payload.get("time", "")
        cafe_name = payload.get("cafe_name", settings.DEFAULT_CAFE_NAME)

        # 1. Cancel all pending reminder jobs for this reservation
        cancelled_count = self.scheduler.cancel_jobs_for_target(booking_id, db=self.db)

        # 2. Send cancellation confirmation message
        template = self.template_repo.get_by_name(cafe_id, "booking_cancellation")
        template_content = template.content if template else (
            "Hi {{customer_name}}, your booking at {{cafe_name}} for {{date}} at {{time}} has been cancelled."
        )

        variables = {
            "customer_name": customer_name,
            "cafe_name": cafe_name,
            "date": date_str,
            "time": time_str
        }
        rendered = TemplateRenderer.render(template_content, variables)

        msg = self.sender.send_template_message(
            cafe_id=cafe_id,
            phone_number=customer_phone,
            template_name="booking_cancellation",
            rendered_content=rendered,
            variables=variables,
            category="BOOKING",
            metadata={"booking_id": booking_id, "workflow": "booking_cancellation"}
        )

        return {
            "booking_id": booking_id,
            "message_id": msg.id,
            "cancelled_jobs_count": cancelled_count
        }

    def handle_booking_noshow(self, event: AutomationEventSchema, db: Session) -> Dict[str, Any]:
        """Triggered when a guest does not show up for their reservation."""
        payload = event.payload
        cafe_id = event.cafe_id or settings.DEFAULT_CAFE_ID
        booking_id = payload.get("booking_id")
        customer_phone = payload.get("customer_phone") or payload.get("phone")
        customer_name = payload.get("customer_name", "Valued Guest")
        cafe_name = payload.get("cafe_name", settings.DEFAULT_CAFE_NAME)

        template = self.template_repo.get_by_name(cafe_id, "booking_noshow_followup")
        template_content = template.content if template else (
            "Hi {{customer_name}}, we missed you at {{cafe_name}} today! Would you like to reschedule?"
        )

        variables = {"customer_name": customer_name, "cafe_name": cafe_name}
        rendered = TemplateRenderer.render(template_content, variables)

        msg = self.sender.send_template_message(
            cafe_id=cafe_id,
            phone_number=customer_phone,
            template_name="booking_noshow_followup",
            rendered_content=rendered,
            variables=variables,
            category="BOOKING",
            metadata={"booking_id": booking_id, "workflow": "booking_noshow"}
        )

        return {"booking_id": booking_id, "message_id": msg.id}

    def execute_reminder(self, booking_id: str, reminder_type: str, payload: dict) -> Dict[str, Any]:
        """Executes the actual scheduled reminder message."""
        cafe_id = payload.get("cafe_id", settings.DEFAULT_CAFE_ID)
        customer_phone = payload.get("customer_phone")
        customer_name = payload.get("customer_name", "Valued Guest")
        cafe_name = payload.get("cafe_name", settings.DEFAULT_CAFE_NAME)
        time_str = payload.get("time", "")
        guests = payload.get("guests", 2)

        template_name = "booking_reminder_24h" if reminder_type == "24h" else "booking_reminder_2h"
        template = self.template_repo.get_by_name(cafe_id, template_name)
        template_content = template.content if template else f"Reminder: Your table at {cafe_name} is reserved for {time_str}."

        variables = {
            "customer_name": customer_name,
            "cafe_name": cafe_name,
            "time": time_str,
            "guests": guests
        }
        rendered = TemplateRenderer.render(template_content, variables)

        msg = self.sender.send_template_message(
            cafe_id=cafe_id,
            phone_number=customer_phone,
            template_name=template_name,
            rendered_content=rendered,
            variables=variables,
            category="BOOKING",
            metadata={"booking_id": booking_id, "reminder_type": reminder_type}
        )

        return {"booking_id": booking_id, "reminder_type": reminder_type, "message_id": msg.id}
