from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.config.settings import settings
from backend.models.template import (
    TemplateCreateRequest,
    TemplateUpdateRequest,
    TemplatePreviewRequest,
    TemplateResponse,
)
from backend.api.dependencies import get_template_svc
from services.template_service import TemplateService

router = APIRouter(prefix="/templates", tags=["Templates"])


@router.get("", response_model=List[TemplateResponse])
def list_templates(
    cafe_id: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    is_enabled: Optional[bool] = Query(None),
    service: TemplateService = Depends(get_template_svc)
):
    """Retrieve templates by cafe and category."""
    target_cafe = cafe_id or settings.DEFAULT_CAFE_ID
    templates = service.list_templates(target_cafe, category, is_enabled)
    return [t.to_dict() for t in templates]


@router.post("", response_model=TemplateResponse, status_code=status.HTTP_201_CREATED)
def create_template(req: TemplateCreateRequest, service: TemplateService = Depends(get_template_svc)):
    """Create or overwrite a message template."""
    target_cafe = req.cafe_id or settings.DEFAULT_CAFE_ID
    tmpl = service.create_template(
        cafe_id=target_cafe,
        name=req.name,
        content=req.content,
        category=req.category,
        language=req.language,
        description=req.description
    )
    return tmpl.to_dict()


@router.get("/{id}", response_model=TemplateResponse)
def get_template(id: str, service: TemplateService = Depends(get_template_svc)):
    """Retrieve a template by its ID."""
    tmpl = service.get_template(id)
    if not tmpl:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    return tmpl.to_dict()


@router.put("/{id}", response_model=TemplateResponse)
def update_template(id: str, req: TemplateUpdateRequest, service: TemplateService = Depends(get_template_svc)):
    """Update template content, category, or enabled flag."""
    tmpl = service.update_template(
        template_id=id,
        name=req.name,
        content=req.content,
        category=req.category,
        is_enabled=req.is_enabled,
        description=req.description
    )
    if not tmpl:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    return tmpl.to_dict()


@router.delete("/{id}")
def delete_template(id: str, service: TemplateService = Depends(get_template_svc)):
    """Delete a template by ID."""
    success = service.delete_template(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    return {"status": "success", "template_id": id, "deleted": True}


@router.post("/preview")
def preview_template(req: TemplatePreviewRequest, service: TemplateService = Depends(get_template_svc)):
    """Preview rendered template with variable substitutions and validate missing variables."""
    return service.preview_template(req.content, req.variables)
