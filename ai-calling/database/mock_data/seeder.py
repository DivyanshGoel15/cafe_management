import json
from pathlib import Path
from datetime import datetime, timedelta
from database.connection import SessionLocal, init_db
from database.models.booking_entity import TableModel, BookingModel
from database.models.customer_entity import CustomerModel
from database.models.agent_entity import AgentModel
from database.models.call_entity import CallModel, CallTranscriptModel

DATA_DIR = Path(__file__).parent


def load_json_file(filename: str):
    path = DATA_DIR / filename
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def seed_database():
    """Populate database with initial mock data if empty."""
    init_db()
    db = SessionLocal()
    try:
        # 1. Seed Tables
        if db.query(TableModel).count() == 0:
            tables_data = load_json_file("initial_tables.json")
            for t in tables_data:
                table = TableModel(
                    id=t["id"],
                    name=t["name"],
                    capacity=t["capacity"],
                    location=t.get("location", "indoor"),
                    is_active=t.get("is_active", True),
                )
                db.add(table)
            db.commit()

        # 2. Seed Default Customers
        if db.query(CustomerModel).count() == 0:
            customers = [
                CustomerModel(
                    id="cust-001",
                    name="Sarah Connor",
                    phone="+15551234567",
                    email="sarah.c@example.com",
                    notes="Prefers quiet window tables. Vegan dairy preference.",
                ),
                CustomerModel(
                    id="cust-002",
                    name="David Miller",
                    phone="+15559876543",
                    email="david.m@example.com",
                    notes="Frequent lunch visitor, likes patio seating.",
                ),
                CustomerModel(
                    id="cust-003",
                    name="Emma Watson",
                    phone="+15554567890",
                    email="emma.w@example.com",
                    notes="Celebrating anniversary on next booking.",
                ),
            ]
            for c in customers:
                db.add(c)
            db.commit()

        # 3. Seed Default Agent
        if db.query(AgentModel).count() == 0:
            cafe_info = load_json_file("cafe_info.json")
            default_prompt = (
                f"You are the friendly, professional AI voice reservation host for {cafe_info['name']}. "
                "Your objective is to assist customers with reservations, menu inquiries, hours, location, and cafe policies. "
                "Keep your responses natural, polite, and strictly concise (1-2 sentences per turn), as this is a live phone call. "
                "Always check table availability before confirming any reservation. "
                "Never make up availability or confirm without tool verification. "
                "Collect required details step-by-step: date, time, party size, customer name, and contact phone number. "
                "If a customer asks for a human manager or becomes upset, gracefully transfer the call."
            )
            agent = AgentModel(
                id="agent-bella-01",
                name="Bella - AI Host",
                role="Senior Reservations & Guest Relations Host",
                cafe_name=cafe_info["name"],
                system_prompt=default_prompt,
                tone="natural, polite, concise, professional",
                language="en-US",
                is_active=True,
            )
            db.add(agent)
            db.commit()

        # 4. Seed A Pre-existing Booking for cancellation/modification tests
        if db.query(BookingModel).count() == 0:
            tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
            sample_booking = BookingModel(
                id="BKG-9901",
                customer_id="cust-001",
                customer_name="Sarah Connor",
                customer_phone="+15551234567",
                booking_date=tomorrow,
                booking_time="19:00",
                guests_count=2,
                table_id="T-01",
                special_requests="Window view preferred",
                status="confirmed",
            )
            db.add(sample_booking)
            db.commit()

        # 5. Seed A Sample Call Record for statistics and call history API
        if db.query(CallModel).count() == 0:
            call_id = "call-demo-001"
            sample_call = CallModel(
                id=call_id,
                caller_number="+15551234567",
                customer_id="cust-001",
                agent_id="agent-bella-01",
                start_time=datetime.utcnow() - timedelta(minutes=15),
                end_time=datetime.utcnow() - timedelta(minutes=12),
                duration=180,
                direction="incoming",
                status="Completed",
                purpose="Table Reservation",
                outcome="Booking Created",
                booking_id="BKG-9901",
                ai_summary="Customer booked a window table for 2 tomorrow at 7 PM.",
                escalation_status="None",
            )
            db.add(sample_call)

            t1 = CallTranscriptModel(
                call_id=call_id,
                speaker="customer",
                message="Hi, I'd like to book a table for tomorrow evening.",
                timestamp=datetime.utcnow() - timedelta(minutes=15),
            )
            t2 = CallTranscriptModel(
                call_id=call_id,
                speaker="ai",
                message="Hello! I would be delighted to assist. What time and how many guests?",
                timestamp=datetime.utcnow() - timedelta(minutes=14, seconds=50),
            )
            t3 = CallTranscriptModel(
                call_id=call_id,
                speaker="customer",
                message="7 PM for 2 people please.",
                timestamp=datetime.utcnow() - timedelta(minutes=14, seconds=20),
            )
            t4 = CallTranscriptModel(
                call_id=call_id,
                speaker="ai",
                message="We have a lovely window table available at 7:00 PM for 2. May I confirm this under Sarah Connor?",
                timestamp=datetime.utcnow() - timedelta(minutes=13, seconds=50),
            )
            t5 = CallTranscriptModel(
                call_id=call_id,
                speaker="customer",
                message="Yes, that's perfect. Thank you!",
                timestamp=datetime.utcnow() - timedelta(minutes=13, seconds=20),
            )
            t6 = CallTranscriptModel(
                call_id=call_id,
                speaker="ai",
                message="Your reservation is confirmed! Reference ID is BKG-9901. We look forward to welcoming you!",
                timestamp=datetime.utcnow() - timedelta(minutes=13),
            )
            db.add_all([t1, t2, t3, t4, t5, t6])
            db.commit()

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
    print("Database seeded successfully.")
