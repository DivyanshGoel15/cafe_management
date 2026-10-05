from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy.orm import Session

from backend.config.settings import settings
from database.models.template import MessageTemplate, TemplateCategory
from database.repositories.template_repository import TemplateRepository
from messaging.templates.renderer import TemplateRenderer, TemplateRenderError


class TemplateService:
    """Service for managing message templates, variable validation, and preview rendering."""

    def __init__(self, db: Session):
        self.db = db
        self.repo = TemplateRepository(db)

    def create_template(
        self,
        cafe_id: str,
        name: str,
        content: str,
        category: str = "GENERAL",
        language: str = "en",
        description: Optional[str] = None
    ) -> MessageTemplate:
        cafe_id = cafe_id or settings.DEFAULT_CAFE_ID
        variables = TemplateRenderer.extract_variables(content)
        return self.repo.create_or_update(
            cafe_id=cafe_id,
            name=name,
            content=content,
            category=category,
            variables=variables,
            language=language,
            description=description
        )

    def get_template(self, template_id: str) -> Optional[MessageTemplate]:
        return self.repo.get_by_id(template_id)

    def get_by_name(self, cafe_id: str, name: str) -> Optional[MessageTemplate]:
        return self.repo.get_by_name(cafe_id, name)

    def list_templates(
        self,
        cafe_id: str,
        category: Optional[str] = None,
        is_enabled: Optional[bool] = None
    ) -> List[MessageTemplate]:
        return self.repo.list_templates(cafe_id, category, is_enabled)

    def update_template(
        self,
        template_id: str,
        name: Optional[str] = None,
        content: Optional[str] = None,
        category: Optional[str] = None,
        is_enabled: Optional[bool] = None,
        description: Optional[str] = None
    ) -> Optional[MessageTemplate]:
        tmpl = self.repo.get_by_id(template_id)
        if not tmpl:
            return None

        if name:
            tmpl.name = name.strip()
        if content:
            tmpl.content = content.strip()
            tmpl.set_variables(TemplateRenderer.extract_variables(content))
        if category:
            tmpl.category = category.upper()
        if is_enabled is not None:
            tmpl.is_enabled = is_enabled
        if description is not None:
            tmpl.description = description

        self.repo.update(tmpl)
        return tmpl

    def delete_template(self, template_id: str) -> bool:
        return self.repo.delete(template_id)

    def validate_variables(self, template_content: str, variables: Dict[str, Any]) -> Tuple[bool, List[str]]:
        return TemplateRenderer.validate_variables(template_content, variables)

    def preview_template(self, template_content: str, sample_variables: Dict[str, Any]) -> Dict[str, Any]:
        """Validates variables and renders a preview of the template."""
        required = TemplateRenderer.extract_variables(template_content)
        is_valid, missing = TemplateRenderer.validate_variables(template_content, sample_variables)
        rendered = TemplateRenderer.render(template_content, sample_variables, strict=False)
        return {
            "required_variables": required,
            "missing_variables": missing,
            "is_valid": is_valid,
            "preview_text": rendered
        }
