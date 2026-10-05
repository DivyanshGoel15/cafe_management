from typing import List, Dict, Any, Optional
from database.mock_data.seeder import load_json_file


class MenuService:
    def __init__(self):
        self.menu_items: List[Dict[str, Any]] = load_json_file("menu_items.json")

    def get_all_items(self) -> List[Dict[str, Any]]:
        return self.menu_items

    def search_items(
        self,
        query: Optional[str] = None,
        category: Optional[str] = None,
        vegetarian_only: bool = False,
        vegan_only: bool = False,
        gluten_free_only: bool = False,
    ) -> List[Dict[str, Any]]:
        results = self.menu_items

        if vegetarian_only:
            results = [i for i in results if i.get("is_vegetarian") or i.get("is_vegan")]
        if vegan_only:
            results = [i for i in results if i.get("is_vegan")]
        if gluten_free_only:
            results = [i for i in results if i.get("is_gluten_free")]

        if category:
            cat_lower = category.lower()
            results = [i for i in results if cat_lower in i.get("category", "").lower()]

        if query:
            q_lower = query.lower()
            results = [
                i for i in results
                if q_lower in i.get("name", "").lower() or q_lower in i.get("description", "").lower()
            ]

        return results

    def get_concise_menu_summary(
        self,
        query: Optional[str] = None,
        category: Optional[str] = None,
        dietary: Optional[str] = None,
    ) -> str:
        """
        Generate a concise, spoken-friendly summary suited for voice call response.
        """
        veg = dietary and "veg" in dietary.lower() and "non" not in dietary.lower()
        vegan = dietary and "vegan" in dietary.lower()
        gf = dietary and ("gluten" in dietary.lower() or "gf" in dietary.lower())

        matches = self.search_items(
            query=query,
            category=category,
            vegetarian_only=bool(veg),
            vegan_only=bool(vegan),
            gluten_free_only=bool(gf),
        )

        if not matches:
            return "We have a diverse Mediterranean menu. Could you tell me what specific dish or ingredient you are interested in?"

        # Pick top 3-4 items to speak concisely
        sample = matches[:3]
        spoken_items = [f"{item['name']} (${item['price']:.2f})" for item in sample]
        joined = ", ".join(spoken_items)

        if dietary:
            return f"For {dietary} options, we offer: {joined}. Would you like to know more about any of these?"
        elif category:
            return f"Under {category}, popular choices are: {joined}."
        else:
            return f"Some of our favorites include: {joined}."
