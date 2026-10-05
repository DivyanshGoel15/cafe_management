import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from backend.config.settings import settings
from database.models.customer import Customer
from database.models.template import MessageTemplate
from database.repositories.template_repository import TemplateRepository
from database.repositories.customer_repository import CustomerRepository
from messaging.templates.defaults import DEFAULT_TEMPLATES

logger = logging.getLogger(__name__)


def seed_mock_data(db: Session, force: bool = False):
    """Seeds default message templates and sample customers if the database is unpopulated."""
    cafe_id = settings.DEFAULT_CAFE_ID
    tmpl_repo = TemplateRepository(db)
    cust_repo = CustomerRepository(db)

    # 1. Seed Message Templates
    existing_templates = tmpl_repo.list_templates(cafe_id)
    if not existing_templates or force:
        logger.info(f"Seeding {len(DEFAULT_TEMPLATES)} default message templates for cafe '{cafe_id}'...")
        for t_data in DEFAULT_TEMPLATES:
            tmpl_repo.create_or_update(
                cafe_id=cafe_id,
                name=t_data["name"],
                content=t_data["content"],
                category=t_data["category"],
                variables=t_data.get("variables", []),
                description=t_data.get("description", "")
            )

    # 2. Seed Sample Customers
    existing_customers = cust_repo.list_customers(cafe_id)
    if not existing_customers or force:
        logger.info(f"Seeding sample customers for cafe '{cafe_id}'...")
        sample_customers = [
            {
                "name": "Alice Walker",
                "phone": "+15551112233",
                "email": "alice@example.com",
                "tags": "new",
                "total_orders": 1,
                "total_spent": 16.50,
                "last_visit_at": datetime.utcnow() - timedelta(days=2),
                "is_opted_out": False
            },
            {
                "name": "Bob Miller",
                "phone": "+15552223344",
                "email": "bob@example.com",
                "tags": "returning,vip",
                "total_orders": 14,
                "total_spent": 310.00,
                "last_visit_at": datetime.utcnow() - timedelta(days=3),
                "is_opted_out": False
            },
            {
                "name": "Charlie Davis",
                "phone": "+15553334455",
                "email": "charlie@example.com",
                "tags": "inactive",
                "total_orders": 2,
                "total_spent": 42.00,
                "last_visit_at": datetime.utcnow() - timedelta(days=65),
                "is_opted_out": False
            },
            {
                "name": "Diana Prince",
                "phone": "+15554445566",
                "email": "diana@example.com",
                "tags": "high-value,vip",
                "total_orders": 28,
                "total_spent": 780.00,
                "last_visit_at": datetime.utcnow() - timedelta(days=1),
                "is_opted_out": False
            },
            {
                "name": "Evan Wright",
                "phone": "+15555556677",
                "email": "evan@example.com",
                "tags": "regular",
                "total_orders": 5,
                "total_spent": 75.00,
                "last_visit_at": datetime.utcnow() - timedelta(days=10),
                "is_opted_out": False
            }
        ]

        for c_data in sample_customers:
            cust = Customer(
                cafe_id=cafe_id,
                name=c_data["name"],
                phone=c_data["phone"],
                email=c_data["email"],
                tags=c_data["tags"],
                total_orders=c_data["total_orders"],
                total_spent=c_data["total_spent"],
                last_visit_at=c_data["last_visit_at"],
                is_opted_out=c_data["is_opted_out"]
            )
            db.add(cust)
        db.commit()
        logger.info("Mock seeding completed successfully.")
