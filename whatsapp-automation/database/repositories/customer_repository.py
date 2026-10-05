from datetime import datetime, timedelta
from typing import Optional, List
from sqlalchemy.orm import Session
from database.models.customer import Customer
from database.repositories.base import BaseRepository


class CustomerRepository(BaseRepository[Customer]):
    def __init__(self, db: Session):
        super().__init__(db, Customer)

    def get_by_phone(self, cafe_id: str, phone: str) -> Optional[Customer]:
        # Normalize phone comparison
        clean_phone = phone.strip()
        return self.db.query(Customer).filter(
            Customer.cafe_id == cafe_id,
            Customer.phone == clean_phone
        ).first()

    def get_or_create(
        self,
        cafe_id: str,
        phone: Optional[str] = None,
        name: Optional[str] = None,
        email: Optional[str] = None,
        phone_number: Optional[str] = None
    ) -> Customer:
        actual_phone = (phone or phone_number or "").strip()
        customer = self.get_by_phone(cafe_id, actual_phone)
        if not customer:
            customer = Customer(
                cafe_id=cafe_id,
                phone=actual_phone,
                name=name.strip() if name else f"Guest ({actual_phone[-4:] if len(actual_phone) >= 4 else '0000'})",
                email=email,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            self.add(customer)
        else:
            changed = False
            if name and (customer.name.startswith("Guest") or not customer.name):
                customer.name = name.strip()
                changed = True
            if email and not customer.email:
                customer.email = email.strip()
                changed = True
            if changed:
                self.update(customer)
        return customer

    def list_customers(self, cafe_id: str, limit: int = 100, offset: int = 0) -> List[Customer]:
        return self.db.query(Customer).filter(Customer.cafe_id == cafe_id).offset(offset).limit(limit).all()

    def update_opt_out(self, customer_id: str, is_opted_out: bool) -> Optional[Customer]:
        customer = self.get_by_id(customer_id)
        if customer:
            customer.is_opted_out = is_opted_out
            self.update(customer)
        return customer

    def get_audience_for_filter(
        self,
        cafe_id: str,
        filter_type: str,
        criteria: Optional[dict] = None,
        include_opted_out: bool = True
    ) -> List[Customer]:
        """Returns customers matching the specified audience filter."""
        criteria = criteria or {}
        query = self.db.query(Customer).filter(Customer.cafe_id == cafe_id)
        if not include_opted_out:
            query = query.filter(Customer.is_opted_out == False, Customer.do_not_contact == False)

        filter_type = filter_type.upper()
        if filter_type == "NEW":
            query = query.filter(Customer.total_orders <= 1)
        elif filter_type == "RETURNING":
            query = query.filter(Customer.total_orders > 1)
        elif filter_type == "INACTIVE":
            days = criteria.get("days_inactive", 30)
            cutoff = datetime.utcnow() - timedelta(days=days)
            query = query.filter(
                (Customer.last_visit_at == None) | (Customer.last_visit_at < cutoff)
            )
        elif filter_type == "HIGH_VALUE":
            min_spent = criteria.get("min_spent", 100.0)
            query = query.filter(Customer.total_spent >= min_spent)
        elif filter_type == "CUSTOM":
            tag = criteria.get("tag")
            if tag:
                query = query.filter(Customer.tags.contains(tag))

        return query.all()
