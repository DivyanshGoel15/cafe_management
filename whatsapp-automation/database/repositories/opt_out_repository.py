from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.models.opt_out import OptOutRecord
from database.repositories.base import BaseRepository


class OptOutRepository(BaseRepository[OptOutRecord]):
    def __init__(self, db: Session):
        super().__init__(db, OptOutRecord)

    def get_by_phone(self, cafe_id: str, phone_number: str) -> Optional[OptOutRecord]:
        clean_phone = phone_number.strip()
        return self.db.query(OptOutRecord).filter(
            OptOutRecord.cafe_id == cafe_id,
            OptOutRecord.phone_number == clean_phone
        ).first()

    def is_opted_out(self, cafe_id: str, phone_number: str) -> bool:
        record = self.get_by_phone(cafe_id, phone_number)
        return bool(record and record.is_active)

    def record_opt_out(
        self,
        cafe_id: str,
        phone_number: str,
        customer_id: Optional[str] = None,
        reason: str = "STOP_KEYWORD"
    ) -> OptOutRecord:
        record = self.get_by_phone(cafe_id, phone_number)
        if not record:
            record = OptOutRecord(
                cafe_id=cafe_id,
                customer_id=customer_id,
                phone_number=phone_number.strip(),
                reason=reason,
                is_active=True,
                opted_out_at=datetime.utcnow()
            )
            self.add(record)
        else:
            record.is_active = True
            record.reason = reason
            record.opted_out_at = datetime.utcnow()
            record.opted_in_at = None
            if customer_id and not record.customer_id:
                record.customer_id = customer_id
            self.update(record)
        return record

    def record_opt_in(
        self,
        cafe_id: str,
        phone_number: str,
        customer_id: Optional[str] = None
    ) -> Optional[OptOutRecord]:
        record = self.get_by_phone(cafe_id, phone_number)
        if record:
            record.is_active = False
            record.opted_in_at = datetime.utcnow()
            if customer_id and not record.customer_id:
                record.customer_id = customer_id
            self.update(record)
        return record

    def count_active_opt_outs(self, cafe_id: str) -> int:
        return self.db.query(func.count(OptOutRecord.id)).filter(
            OptOutRecord.cafe_id == cafe_id,
            OptOutRecord.is_active == True
        ).scalar() or 0
