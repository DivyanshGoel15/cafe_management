from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from database.repositories.customer_repository import CustomerRepository
from database.repositories.opt_out_repository import OptOutRepository
from database.models.customer import Customer


class CustomerService:
    """Service providing customer management, opt-out controls, and segmentation."""

    def __init__(self, db: Session):
        self.db = db
        self.customer_repo = CustomerRepository(db)
        self.opt_out_repo = OptOutRepository(db)

    def get_customer(self, customer_id: str) -> Optional[Customer]:
        return self.customer_repo.get_by_id(customer_id)

    def get_by_phone(self, cafe_id: str, phone: str) -> Optional[Customer]:
        return self.customer_repo.get_by_phone(cafe_id, phone)

    def create_or_update_customer(
        self,
        cafe_id: str,
        phone: str,
        name: Optional[str] = None,
        email: Optional[str] = None
    ) -> Customer:
        return self.customer_repo.get_or_create(cafe_id, phone, name, email)

    def list_customers(self, cafe_id: str, limit: int = 100, offset: int = 0) -> List[Customer]:
        return self.customer_repo.list_customers(cafe_id, limit, offset)

    def opt_out_customer(self, cafe_id: str, phone: str, reason: str = "MANUAL") -> Dict[str, Any]:
        customer = self.customer_repo.get_by_phone(cafe_id, phone)
        customer_id = customer.id if customer else None
        record = self.opt_out_repo.record_opt_out(cafe_id, phone, customer_id, reason)
        if customer:
            self.customer_repo.update_opt_out(customer.id, is_opted_out=True)
        return {"phone": phone, "opted_out": True, "record_id": record.id}

    def opt_in_customer(self, cafe_id: str, phone: str) -> Dict[str, Any]:
        customer = self.customer_repo.get_by_phone(cafe_id, phone)
        customer_id = customer.id if customer else None
        record = self.opt_out_repo.record_opt_in(cafe_id, phone, customer_id)
        if customer:
            self.customer_repo.update_opt_out(customer.id, is_opted_out=False)
        return {"phone": phone, "opted_out": False, "record_id": record.id if record else None}

    def get_segmented_audience(self, cafe_id: str, filter_type: str, criteria: Optional[dict] = None) -> List[Customer]:
        return self.customer_repo.get_audience_for_filter(cafe_id, filter_type, criteria)
