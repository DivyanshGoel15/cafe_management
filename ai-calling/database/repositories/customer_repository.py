from typing import Optional
from sqlalchemy.orm import Session
from database.models.customer_entity import CustomerModel
from .base import BaseRepository


class CustomerRepository(BaseRepository[CustomerModel]):
    def __init__(self, session: Session):
        super().__init__(CustomerModel, session)

    def get_by_phone(self, phone: str) -> Optional[CustomerModel]:
        # Normalize phone number if needed
        clean_phone = phone.strip()
        return self.session.query(CustomerModel).filter(CustomerModel.phone == clean_phone).first()

    def find_or_create(self, name: str, phone: str, email: Optional[str] = None) -> CustomerModel:
        clean_phone = phone.strip()
        customer = self.get_by_phone(clean_phone)
        if customer:
            if name and not customer.name:
                customer.name = name
                self.session.commit()
                self.session.refresh(customer)
            return customer

        import uuid
        new_customer = CustomerModel(
            id=f"cust-{uuid.uuid4().hex[:8]}",
            name=name or "Valued Guest",
            phone=clean_phone,
            email=email,
        )
        return self.create(new_customer)
