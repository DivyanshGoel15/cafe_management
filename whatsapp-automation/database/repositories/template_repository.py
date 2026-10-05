from typing import Optional, List
from sqlalchemy.orm import Session
from database.models.template import MessageTemplate
from database.repositories.base import BaseRepository


class TemplateRepository(BaseRepository[MessageTemplate]):
    def __init__(self, db: Session):
        super().__init__(db, MessageTemplate)

    def get_by_name(self, cafe_id: str, name: str) -> Optional[MessageTemplate]:
        return self.db.query(MessageTemplate).filter(
            MessageTemplate.cafe_id == cafe_id,
            MessageTemplate.name == name.strip()
        ).first()

    def list_templates(
        self,
        cafe_id: str,
        category: Optional[str] = None,
        is_enabled: Optional[bool] = None
    ) -> List[MessageTemplate]:
        query = self.db.query(MessageTemplate).filter(MessageTemplate.cafe_id == cafe_id)

        if category:
            query = query.filter(MessageTemplate.category == category.upper())
        if is_enabled is not None:
            query = query.filter(MessageTemplate.is_enabled == is_enabled)

        return query.order_by(MessageTemplate.category, MessageTemplate.name).all()

    def create_or_update(
        self,
        cafe_id: str,
        name: str,
        content: str,
        category: str = "GENERAL",
        variables: Optional[List[str]] = None,
        language: str = "en",
        description: Optional[str] = None
    ) -> MessageTemplate:
        template = self.get_by_name(cafe_id, name)
        if not template:
            template = MessageTemplate(
                cafe_id=cafe_id,
                name=name.strip(),
                category=category.upper(),
                content=content.strip(),
                language=language,
                description=description
            )
            template.set_variables(variables or [])
            self.add(template)
        else:
            template.content = content.strip()
            template.category = category.upper()
            template.language = language
            if description is not None:
                template.description = description
            if variables is not None:
                template.set_variables(variables)
            self.update(template)
        return template
