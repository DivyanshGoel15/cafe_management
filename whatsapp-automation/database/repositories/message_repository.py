from datetime import datetime
from typing import Optional, List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.models.message import Message, MessageStatus, MessageDirection
from database.repositories.base import BaseRepository


class MessageRepository(BaseRepository[Message]):
    def __init__(self, db: Session):
        super().__init__(db, Message)

    def list_messages(
        self,
        cafe_id: str,
        status: Optional[str] = None,
        phone: Optional[str] = None,
        customer_id: Optional[str] = None,
        direction: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Message]:
        query = self.db.query(Message).filter(Message.cafe_id == cafe_id)

        if status:
            query = query.filter(Message.status == status.upper())
        if phone:
            query = query.filter(Message.phone_number == phone.strip())
        if customer_id:
            query = query.filter(Message.customer_id == customer_id)
        if direction:
            query = query.filter(Message.direction == direction.upper())

        return query.order_by(Message.created_time.desc()).offset(offset).limit(limit).all()

    def update_status(
        self,
        message_id: str,
        status: MessageStatus | str,
        error_info: Optional[str] = None,
        provider_message_id: Optional[str] = None,
        sent_time: Optional[datetime] = None,
        delivered_time: Optional[datetime] = None,
        read_time: Optional[datetime] = None
    ) -> Optional[Message]:
        message = self.get_by_id(message_id)
        if not message:
            return None

        status_str = status.value if hasattr(status, "value") else str(status)
        message.status = status_str

        if error_info:
            message.error_information = error_info
        if provider_message_id:
            message.provider_message_id = provider_message_id
        if sent_time:
            message.sent_time = sent_time
        if delivered_time:
            message.delivered_time = delivered_time
        if read_time:
            message.read_time = read_time

        self.update(message)
        return message

    def get_failed_messages_for_retry(self, cafe_id: str, max_retries: int = 3) -> List[Message]:
        return self.db.query(Message).filter(
            Message.cafe_id == cafe_id,
            Message.status == MessageStatus.FAILED.value,
            Message.retry_count < max_retries
        ).all()

    def count_by_status(self, cafe_id: str) -> Dict[str, int]:
        rows = self.db.query(
            Message.status,
            func.count(Message.id)
        ).filter(Message.cafe_id == cafe_id).group_by(Message.status).all()

        counts = {status.value: 0 for status in MessageStatus}
        for status_val, count in rows:
            counts[status_val] = count
        return counts

    def count_replies(self, cafe_id: str) -> int:
        return self.db.query(func.count(Message.id)).filter(
            Message.cafe_id == cafe_id,
            Message.direction == MessageDirection.INCOMING.value
        ).scalar() or 0
