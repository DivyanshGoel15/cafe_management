import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models.schemas import TableRequest, BillRequest
from app.models.enums import RequestType, RequestStatus, BillRequestStatus
from app.repositories import (
    request_repo, table_repo, session_repo,
    BaseRequestRepository, BaseTableRepository, BaseSessionRepository
)
from app.services.session_service import SessionService

class RequestService:
    def __init__(
        self,
        r_repo: BaseRequestRepository = request_repo,
        t_repo: BaseTableRepository = table_repo,
        s_repo: BaseSessionRepository = session_repo
    ):
        self.request_repo = r_repo
        self.table_repo = t_repo
        self.session_repo = session_repo
        self.session_service = SessionService(s_repo, t_repo)

    def create_table_request(
        self,
        table_id: str,
        session_id: str,
        customer_id: str,
        request_type: RequestType,
        notes: Optional[str] = None
    ) -> TableRequest:
        table = self.table_repo.get_by_id(table_id)
        if not table:
            raise ValueError(f"Table '{table_id}' not found")

        req = TableRequest(
            request_id=f"treq_{uuid.uuid4().hex[:8]}",
            table_id=table.table_id,
            table_number=table.table_number,
            session_id=session_id,
            customer_id=customer_id,
            request_type=request_type,
            status=RequestStatus.PENDING,
            notes=notes,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        return self.request_repo.create_table_request(req)

    def get_table_requests(self, table_id: Optional[str] = None) -> List[TableRequest]:
        return self.request_repo.get_table_requests(table_id)

    def update_table_request_status(self, request_id: str, status: RequestStatus) -> Optional[TableRequest]:
        return self.request_repo.update_table_request_status(request_id, status)

    def create_bill_request(
        self,
        table_id: str,
        session_id: str,
        customer_id: str,
        customer_name: Optional[str] = "Guest"
    ) -> BillRequest:
        table = self.table_repo.get_by_id(table_id)
        if not table:
            raise ValueError(f"Table '{table_id}' not found")

        # Get latest table session details to compute bill total
        session_details = self.session_service.get_table_session_details(session_id)
        total_amount = session_details["session"].total_amount if session_details else 0.0

        bill_req = BillRequest(
            bill_request_id=f"breq_{uuid.uuid4().hex[:8]}",
            table_id=table.table_id,
            table_number=table.table_number,
            session_id=session_id,
            customer_id=customer_id,
            customer_name=customer_name or "Guest",
            total_amount=total_amount,
            status=BillRequestStatus.PENDING,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        return self.request_repo.create_bill_request(bill_req)

    def get_bill_requests(self, table_id: Optional[str] = None) -> List[BillRequest]:
        return self.request_repo.get_bill_requests(table_id)

    def update_bill_request_status(self, request_id: str, status: BillRequestStatus) -> Optional[BillRequest]:
        return self.request_repo.update_bill_request_status(request_id, status)
