from typing import List, Optional, Dict, Any
from app.models.schemas import MenuCategory, MenuItem
from app.repositories import menu_repo, cafe_repo, BaseMenuRepository, BaseCafeRepository

class MenuService:
    def __init__(self, m_repo: BaseMenuRepository = menu_repo, c_repo: BaseCafeRepository = cafe_repo):
        self.menu_repo = m_repo
        self.cafe_repo = c_repo

    def get_menu(self) -> List[MenuCategory]:
        return self.menu_repo.get_categories()

    def get_menu_for_table(self, table_id: str) -> Dict[str, Any]:
        cafe = self.cafe_repo.get_cafe()
        categories = self.menu_repo.get_categories()
        return {
            "cafe": cafe,
            "table_id": table_id,
            "categories": categories
        }

    def get_item(self, item_id: str) -> Optional[MenuItem]:
        return self.menu_repo.get_item_by_id(item_id)

    def update_item_availability(self, item_id: str, is_available: bool) -> Optional[MenuItem]:
        return self.menu_repo.update_item_availability(item_id, is_available)
