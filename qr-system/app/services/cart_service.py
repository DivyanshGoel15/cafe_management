import uuid
from typing import List, Optional
from datetime import datetime
from app.models.schemas import Cart, CartItem, SelectedAddon
from app.repositories import (
    cart_repo, menu_repo, cafe_repo, session_repo,
    BaseCartRepository, BaseMenuRepository, BaseCafeRepository, BaseSessionRepository
)

class CartService:
    def __init__(
        self,
        c_repo: BaseCartRepository = cart_repo,
        m_repo: BaseMenuRepository = menu_repo,
        cafe_r: BaseCafeRepository = cafe_repo,
        s_repo: BaseSessionRepository = session_repo
    ):
        self.cart_repo = c_repo
        self.menu_repo = m_repo
        self.cafe_repo = cafe_repo
        self.session_repo = session_repo

    def get_or_create_cart(self, customer_id: str, table_id: str, session_id: str = "") -> Cart:
        cart = self.cart_repo.get_cart_by_customer_id(customer_id)
        if cart:
            return cart

        cart_id = f"cart_{uuid.uuid4().hex[:8]}"
        cart = Cart(
            cart_id=cart_id,
            customer_id=customer_id,
            table_id=table_id,
            session_id=session_id,
            items=[],
            subtotal=0.0,
            tax_amount=0.0,
            service_charge=0.0,
            final_total=0.0,
            updated_at=datetime.utcnow()
        )
        return self.cart_repo.save_cart(cart)

    def _recalculate_cart(self, cart: Cart) -> Cart:
        cafe = self.cafe_repo.get_cafe()
        subtotal = round(sum(item.item_total for item in cart.items), 2)
        tax_amount = round(subtotal * cafe.tax_rate, 2)
        service_charge = round(subtotal * cafe.service_charge_rate, 2)
        final_total = round(subtotal + tax_amount + service_charge, 2)

        updated_cart = cart.model_copy(
            update={
                "subtotal": subtotal,
                "tax_amount": tax_amount,
                "service_charge": service_charge,
                "final_total": final_total,
                "updated_at": datetime.utcnow()
            }
        )
        return self.cart_repo.save_cart(updated_cart)

    def add_item_to_cart(
        self,
        customer_id: str,
        table_id: str,
        item_id: str,
        quantity: int = 1,
        addon_ids: Optional[List[str]] = None,
        notes: Optional[str] = None
    ) -> Cart:
        if quantity <= 0:
            raise ValueError("Quantity must be greater than 0")

        # 1. Fetch item from authoritative database (NEVER trust frontend price)
        item = self.menu_repo.get_item_by_id(item_id)
        if not item:
            raise ValueError(f"Menu item '{item_id}' not found")

        # 2. Check item availability
        if not item.is_available:
            raise ValueError(f"'{item.name}' is currently unavailable and cannot be added to cart")

        # 3. Resolve selected addons and validate prices from DB
        selected_addons: List[SelectedAddon] = []
        addon_ids = addon_ids or []
        available_addons_map = {a.addon_id: a for a in item.addons}

        for a_id in addon_ids:
            if a_id not in available_addons_map:
                raise ValueError(f"Addon '{a_id}' is not valid for item '{item.name}'")
            addon_obj = available_addons_map[a_id]
            if not addon_obj.is_available:
                raise ValueError(f"Addon '{addon_obj.name}' is currently unavailable")
            selected_addons.append(
                SelectedAddon(
                    addon_id=addon_obj.addon_id,
                    name=addon_obj.name,
                    price=addon_obj.price
                )
            )

        # 4. Calculate unit and total price strictly on server
        unit_price = item.price
        addons_unit_sum = sum(a.price for a in selected_addons)
        item_total = round((unit_price + addons_unit_sum) * quantity, 2)

        # 5. Retrieve or create cart
        cart = self.get_or_create_cart(customer_id, table_id)

        # 6. Check if an identical item configuration already exists in the cart
        existing_index = -1
        target_addon_ids = sorted([a.addon_id for a in selected_addons])
        for idx, ci in enumerate(cart.items):
            ci_addon_ids = sorted([a.addon_id for a in ci.selected_addons])
            if ci.item_id == item_id and ci_addon_ids == target_addon_ids and (ci.notes or "") == (notes or ""):
                existing_index = idx
                break

        updated_items = list(cart.items)
        if existing_index >= 0:
            # Increment existing
            existing_ci = updated_items[existing_index]
            new_qty = existing_ci.quantity + quantity
            new_total = round((unit_price + addons_unit_sum) * new_qty, 2)
            updated_items[existing_index] = existing_ci.model_copy(
                update={"quantity": new_qty, "item_total": new_total}
            )
        else:
            cart_item_id = f"ci_{uuid.uuid4().hex[:8]}"
            new_cart_item = CartItem(
                cart_item_id=cart_item_id,
                item_id=item_id,
                item_name=item.name,
                unit_price=unit_price,
                quantity=quantity,
                selected_addons=selected_addons,
                item_total=item_total,
                notes=notes
            )
            updated_items.append(new_cart_item)

        cart = cart.model_copy(update={"items": updated_items})
        return self._recalculate_cart(cart)

    def update_cart_item(
        self,
        customer_id: str,
        cart_item_id: str,
        quantity: int,
        addon_ids: Optional[List[str]] = None,
        notes: Optional[str] = None
    ) -> Cart:
        cart = self.cart_repo.get_cart_by_customer_id(customer_id)
        if not cart:
            raise ValueError(f"Cart for customer {customer_id} not found")

        item_index = -1
        for idx, ci in enumerate(cart.items):
            if ci.cart_item_id == cart_item_id:
                item_index = idx
                break

        if item_index == -1:
            raise ValueError(f"Cart item {cart_item_id} not found in cart")

        if quantity <= 0:
            # Remove item
            return self.remove_cart_item(customer_id, cart_item_id)

        target_item = cart.items[item_index]
        item = self.menu_repo.get_item_by_id(target_item.item_id)
        if not item or not item.is_available:
            raise ValueError("Item is currently unavailable")

        # If addons passed, re-verify addons
        if addon_ids is not None:
            available_addons_map = {a.addon_id: a for a in item.addons}
            selected_addons: List[SelectedAddon] = []
            for a_id in addon_ids:
                if a_id in available_addons_map and available_addons_map[a_id].is_available:
                    addon_obj = available_addons_map[a_id]
                    selected_addons.append(
                        SelectedAddon(
                            addon_id=addon_obj.addon_id,
                            name=addon_obj.name,
                            price=addon_obj.price
                        )
                    )
        else:
            selected_addons = target_item.selected_addons

        addons_unit_sum = sum(a.price for a in selected_addons)
        new_total = round((item.price + addons_unit_sum) * quantity, 2)

        updated_items = list(cart.items)
        updated_items[item_index] = target_item.model_copy(
            update={
                "quantity": quantity,
                "selected_addons": selected_addons,
                "item_total": new_total,
                "notes": notes if notes is not None else target_item.notes
            }
        )

        cart = cart.model_copy(update={"items": updated_items})
        return self._recalculate_cart(cart)

    def remove_cart_item(self, customer_id: str, cart_item_id: str) -> Cart:
        cart = self.cart_repo.get_cart_by_customer_id(customer_id)
        if not cart:
            raise ValueError(f"Cart for customer {customer_id} not found")

        updated_items = [ci for ci in cart.items if ci.cart_item_id != cart_item_id]
        cart = cart.model_copy(update={"items": updated_items})
        return self._recalculate_cart(cart)

    def get_cart(self, customer_id: str) -> Optional[Cart]:
        return self.cart_repo.get_cart_by_customer_id(customer_id)

    def clear_cart(self, customer_id: str) -> bool:
        return self.cart_repo.delete_cart(customer_id)
