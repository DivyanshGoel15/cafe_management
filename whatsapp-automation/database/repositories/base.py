from typing import Type, TypeVar, Generic, Optional, List
from sqlalchemy.orm import Session
from database.models.base import Base

T = TypeVar("T", bound=Base)


class BaseRepository(Generic[T]):
    """Generic repository providing standardized CRUD operations on SQLAlchemy entities."""

    def __init__(self, db: Session, model: Type[T]):
        self.db = db
        self.model = model

    def get_by_id(self, item_id: str) -> Optional[T]:
        return self.db.query(self.model).filter(self.model.id == item_id).first()

    def list_all(self, limit: int = 100, offset: int = 0) -> List[T]:
        return self.db.query(self.model).offset(offset).limit(limit).all()

    def add(self, item: T) -> T:
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update(self, item: T) -> T:
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item_id: str) -> bool:
        item = self.get_by_id(item_id)
        if item:
            self.db.delete(item)
            self.db.commit()
            return True
        return False
