import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.schemas import TableSession, CustomerSession, Order
from app.models.enums import TableSessionStatus, TableStatus, OrderStatus
from app.repositories import (
    session_repo, table_repo, order_repo,
    BaseSessionRepository, BaseTableRepository, BaseOrderRepository
)

class SessionService:
    def __init__(
        self,
        s_repo: BaseSessionRepository = session_repo,
        t_repo: BaseTableRepository = table_repo,
        o_repo: BaseOrderRepository = order_repo
    ):
        self.session_repo = s_repo
        self.table_repo = t_repo
        self.order_repo = o_repo

    def get_or_create_table_session(self, table_id: str) -> TableSession:
        table = self.table_repo.get_by_id(table_id)
        if not table:
            raise ValueError(f"Table {table_id} does not exist")

        active_session = self.session_repo.get_active_table_session(table.table_id)
        if active_session:
            return active_session

        # Create fresh table session
        session_id = f"sess_{table.table_id}_{uuid.uuid4().hex[:8]}"
        new_session = TableSession(
            session_id=session_id,
            table_id=table.table_id,
            table_number=table.table_number,
            status=TableSessionStatus.ACTIVE,
            customer_ids=[],
            order_ids=[],
            subtotal=0.0,
            tax_amount=0.0,
            service_charge=0.0,
            total_amount=0.0,
            created_at=datetime.utcnow()
        )
        self.session_repo.save_table_session(new_session)

        # Update table status
        updated_table = table.model_copy(
            update={"current_session_id": session_id, "status": TableStatus.OCCUPIED}
        )
        self.table_repo.update_table(updated_table)

        return new_session

    def join_customer_session(
        self,
        table_id: str,
        customer_name: Optional[str] = "Guest",
        customer_phone: Optional[str] = None,
        customer_id: Optional[str] = None
    ) -> Dict[str, Any]:
        table = self.table_repo.get_by_id(table_id)
        if not table:
            raise ValueError(f"Table {table_id} does not exist")

        table_session = self.get_or_create_table_session(table.table_id)

        c_id = customer_id or f"cust_{uuid.uuid4().hex[:8]}"
        cust_session = CustomerSession(
            customer_id=c_id,
            table_id=table.table_id,
            session_id=table_session.session_id,
            name=customer_name or "Guest",
            phone=customer_phone,
            created_at=datetime.utcnow()
        )
        self.session_repo.save_customer_session(cust_session)

        # Add customer to table session if not present
        if c_id not in table_session.customer_ids:
            updated_customer_ids = list(table_session.customer_ids) + [c_id]
            updated_table_session = table_session.model_copy(
                update={"customer_ids": updated_customer_ids}
            )
            self.session_repo.save_table_session(updated_table_session)
            table_session = updated_table_session

        return {
            "customer_session": cust_session,
            "table_session": table_session,
            "table": table
        }

    def get_table_session_details(self, session_id: str) -> Optional[Dict[str, Any]]:
        session = self.session_repo.get_table_session_by_id(session_id)
        if not session:
            return None

        orders = self.order_repo.get_orders_by_session_id(session_id)
        # Recalculate session totals
        paid_orders = [o for o in orders if o.status not in [OrderStatus.CART, OrderStatus.CANCELLED, OrderStatus.PAYMENT_FAILED]]
        subtotal = sum(o.subtotal for o in paid_orders)
        tax = sum(o.tax_amount for o in paid_orders)
        service = sum(o.service_charge for o in paid_orders)
        total = sum(o.total_amount for o in paid_orders)

        updated_session = session.model_copy(
            update={
                "subtotal": round(subtotal, 2),
                "tax_amount": round(tax, 2),
                "service_charge": round(service, 2),
                "total_amount": round(total, 2),
                "order_ids": [o.order_id for o in orders]
            }
        )
        self.session_repo.save_table_session(updated_session)

        return {
            "session": updated_session,
            "orders": orders,
            "customer_count": len(updated_session.customer_ids)
        }

    def recalculate_totals(self, session_id: str) -> TableSession:
        session = self.session_repo.get_table_session_by_id(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")

        orders = self.order_repo.get_orders_by_session_id(session_id)
        paid_orders = [o for o in orders if o.status not in [OrderStatus.CART, OrderStatus.CANCELLED, OrderStatus.PAYMENT_FAILED]]
        subtotal = sum(o.subtotal for o in paid_orders)
        tax = sum(o.tax_amount for o in paid_orders)
        service = sum(o.service_charge for o in paid_orders)
        total = sum(o.total_amount for o in paid_orders)

        updated_session = session.model_copy(
            update={
                "subtotal": round(subtotal, 2),
                "tax_amount": round(tax, 2),
                "service_charge": round(service, 2),
                "total_amount": round(total, 2),
                "order_ids": [o.order_id for o in orders]
            }
        )
        return self.session_repo.save_table_session(updated_session)
