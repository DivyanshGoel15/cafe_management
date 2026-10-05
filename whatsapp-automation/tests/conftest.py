import pytest
import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

TEST_DB_PATH = Path("./test_automation.db").resolve()
TEST_DB_URL = f"sqlite:///{TEST_DB_PATH}"

os.environ["MOCK_MODE"] = "true"
os.environ["DEFAULT_CAFE_ID"] = "test_cafe_001"
os.environ["DEFAULT_CAFE_NAME"] = "The Roasted Bean Cafe"
os.environ["API_KEY_SECRET"] = "test_secret_key"
os.environ["DATABASE_URL"] = TEST_DB_URL

from backend.config.settings import settings
settings.DATABASE_URL = TEST_DB_URL
settings.DEFAULT_CAFE_ID = "test_cafe_001"

import database.session as db_session_module
from database.models import Base
from database.mock_data import seed_mock_data
from messaging.providers import get_whatsapp_provider, MockWhatsAppProvider
from workflows import get_automation_engine, register_all_workflows
from backend.main import create_app
from database.session import get_db


@pytest.fixture(scope="session")
def engine():
    test_engine = create_engine(
        TEST_DB_URL,
        connect_args={"check_same_thread": False}
    )
    db_session_module.engine = test_engine
    db_session_module.SessionLocal.configure(bind=test_engine, expire_on_commit=False)
    Base.metadata.create_all(bind=test_engine)
    yield test_engine

    # Teardown database file
    test_engine.dispose()
    if TEST_DB_PATH.exists():
        try:
            TEST_DB_PATH.unlink()
        except Exception:
            pass


@pytest.fixture
def db_session(engine):
    """Provides a fresh transactional database session for each test."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = db_session_module.SessionLocal()

    # Seed mock default templates & customers
    seed_mock_data(session)

    yield session
    session.close()


@pytest.fixture
def mock_provider():
    provider = get_whatsapp_provider()
    if isinstance(provider, MockWhatsAppProvider):
        provider.clear()
        provider.auto_deliver = True
        provider.auto_read = True
    return provider


@pytest.fixture
def automation_engine():
    engine = get_automation_engine()
    register_all_workflows(engine)
    return engine


@pytest.fixture
def client(db_session):
    """FastAPI TestClient with overridden database session."""
    app = create_app()

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
