import pytest
from messaging.templates.renderer import TemplateRenderer, TemplateRenderError
from services.template_service import TemplateService


def test_extract_variables():
    content = "Hi {{customer_name}}, your table at {{cafe_name}} is confirmed for {{date}} at {{time}}."
    vars_list = TemplateRenderer.extract_variables(content)
    assert vars_list == ["customer_name", "cafe_name", "date", "time"]


def test_render_variables_success():
    content = "Hello {{customer_name}}, party of {{guests}}!"
    rendered = TemplateRenderer.render(content, {"customer_name": "Alice", "guests": 3})
    assert rendered == "Hello Alice, party of 3!"


def test_validate_variables():
    content = "Hi {{customer_name}}, order #{{order_id}} is {{status}}."
    is_valid, missing = TemplateRenderer.validate_variables(content, {"customer_name": "Bob", "order_id": 101})
    assert is_valid is False
    assert "status" in missing

    is_valid, missing = TemplateRenderer.validate_variables(content, {"customer_name": "Bob", "order_id": 101, "status": "Ready"})
    assert is_valid is True
    assert missing == []


def test_render_strict_mode():
    content = "Hi {{name}}, your balance is {{balance}}."
    with pytest.raises(TemplateRenderError):
        TemplateRenderer.render(content, {"name": "Bob"}, strict=True)


def test_template_service_crud(db_session):
    service = TemplateService(db_session)
    # Create
    tmpl = service.create_template(
        cafe_id="test_cafe_001",
        name="test_lunch_promo",
        content="Enjoy {{discount}} off lunch at {{cafe_name}}!",
        category="MARKETING",
        description="Lunch special"
    )
    assert tmpl.name == "test_lunch_promo"
    assert "discount" in tmpl.get_variables()

    # Get
    fetched = service.get_by_name("test_cafe_001", "test_lunch_promo")
    assert fetched is not None
    assert fetched.id == tmpl.id

    # Update
    updated = service.update_template(tmpl.id, description="Updated lunch special")
    assert updated.description == "Updated lunch special"

    # Preview
    preview = service.preview_template(tmpl.content, {"discount": "20%", "cafe_name": "Bean Cafe"})
    assert preview["is_valid"] is True
    assert "Enjoy 20% off lunch at Bean Cafe!" in preview["preview_text"]

    # Delete
    deleted = service.delete_template(tmpl.id)
    assert deleted is True
    assert service.get_template(tmpl.id) is None
