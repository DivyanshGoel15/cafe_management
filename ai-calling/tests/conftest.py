import os
import pytest
from fastapi.testclient import TestClient
from database.connection import engine, SessionLocal, init_db, get_db
from database.models.base import Base
from database.models.booking_entity import TableModel, BookingModel
from database.models.customer_entity import CustomerModel
from database.models.agent_entity import AgentModel
from database.mock_data.seeder import load_json_file
from backend.main import app


@pytest.fixture(scope="function")
def db_session():
    """Ensure clean tables and seeded initial data for every test run."""
    Base.metadata.drop_all(bind=engine)
    init_db()

    session = SessionLocal()

    # Seed tables
    tables = load_json_file("initial_tables.json")
    for t in tables:
        session.add(
            TableModel(
                id=t["id"],
                name=t["name"],
                capacity=t["capacity"],
                location=t.get("location", "indoor"),
                is_active=t.get("is_active", True),
            )
        )

    # Seed test customer
    cust = CustomerModel(
        id="cust-test-01",
        name="Sarah Connor",
        phone="+15551234567",
        email="sarah@example.com",
    )
    session.add(cust)

    # Seed test booking
    bkg = BookingModel(
        id="BKG-9901",
        customer_id="cust-test-01",
        customer_name="Sarah Connor",
        customer_phone="+15551234567",
        booking_date="2026-09-30",
        booking_time="19:00",
        guests_count=2,
        table_id="T-01",
        status="confirmed",
    )
    session.add(bkg)

    # Seed default agent
    agent = AgentModel(
        id="agent-bella-01",
        name="Bella - AI Host",
        role="Host & Reservation Specialist",
        cafe_name="Bella Vista Bistro",
        system_prompt="You are Bella, the AI Voice Host for Bella Vista Bistro.",
        tone="natural, professional, friendly, concise",
        language="en-US",
        is_active=True,
    )
    session.add(agent)
    session.commit()

    yield session

    session.close()


@pytest.fixture(scope="function")
def client(db_session):
    """TestClient that re-uses the active database session."""
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
