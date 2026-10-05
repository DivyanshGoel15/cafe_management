from typing import List, Optional
from app.models.schemas import Table, QRCode
from app.models.enums import TableStatus
from app.repositories import table_repo, BaseTableRepository

class TableService:
    def __init__(self, repo: BaseTableRepository = table_repo):
        self.repo = repo

    def get_all_tables(self) -> List[Table]:
        return self.repo.get_all()

    def get_table(self, table_id: str) -> Optional[Table]:
        return self.repo.get_by_id(table_id)

    def get_table_by_qr(self, qr_identifier: str) -> Optional[Table]:
        return self.repo.get_by_qr_identifier(qr_identifier)

    def update_table_status(self, table_id: str, status: TableStatus) -> Optional[Table]:
        tbl = self.repo.get_by_id(table_id)
        if not tbl:
            return None
        updated = tbl.model_copy(update={"status": status})
        return self.repo.update_table(updated)

    def set_table_session(self, table_id: str, session_id: Optional[str]) -> Optional[Table]:
        tbl = self.repo.get_by_id(table_id)
        if not tbl:
            return None
        status = TableStatus.OCCUPIED if session_id else TableStatus.AVAILABLE
        updated = tbl.model_copy(update={"current_session_id": session_id, "status": status})
        return self.repo.update_table(updated)
