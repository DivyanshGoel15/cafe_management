from services.menu_service import MenuService


def test_get_all_menu_items():
    service = MenuService()
    items = service.get_all_items()
    assert len(items) >= 10
    assert any("pasta" in i["category"].lower() for i in items)


def test_search_vegetarian_items():
    service = MenuService()
    veg_items = service.search_items(vegetarian_only=True)
    assert len(veg_items) > 0
    assert all(i["is_vegetarian"] or i["is_vegan"] for i in veg_items)


def test_search_gluten_free_items():
    service = MenuService()
    gf_items = service.search_items(gluten_free_only=True)
    assert len(gf_items) > 0
    assert all(i["is_gluten_free"] for i in gf_items)


def test_concise_menu_summary():
    service = MenuService()
    summary = service.get_concise_menu_summary(dietary="vegetarian")
    assert "vegetarian" in summary.lower()
    assert "$" in summary  # contains prices
