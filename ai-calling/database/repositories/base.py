from typing import Generic, TypeVar, Type, Optional, List
from sqlalchemy.orm import Session

T = TypeVar("T")


class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T], session: Session):
        self.model = model
        self.session = session

    def get_by_id(self, entity_id: str) -> Optional[T]:
        return self.session.query(self.model).filter(self.model.id == entity_id).first()

    def get_all(self, limit: int = 100, offset: int = 0) -> List[T]:
        return self.session.query(self.model).offset(offset).limit(limit).all()

    def create(self, entity: T) -> T:
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def update(self, entity: T) -> T:
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def delete(self, entity: T) -> None:
        self.session.delete(entity)
        self.session.commit()
