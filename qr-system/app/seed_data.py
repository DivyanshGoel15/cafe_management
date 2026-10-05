from typing import List, Dict
from app.models.schemas import Cafe, Table, MenuCategory, MenuItem, MenuAddon, TableSession
from app.models.enums import TableStatus, TableSessionStatus
from app.config import settings

def get_initial_cafe() -> Cafe:
    return Cafe(
        id=settings.cafe_id,
        name=settings.cafe_name,
        tagline=settings.cafe_tagline,
        address="12 Heritage Lane, Connaught Place, New Delhi",
        phone="+91 98765 43210",
        currency=settings.currency_code,
        currency_symbol=settings.currency,
        tax_rate=settings.tax_rate,
        service_charge_rate=settings.service_charge_rate
    )

def get_initial_tables(base_url: str) -> List[Table]:
    tables = []
    # Create 20 tables with realistic capacities
    for i in range(1, 21):
        capacity = 2 if i in [1, 2, 3, 4] else (6 if i in [17, 18, 19, 20] else 4)
        t_id = f"table_{i}"
        qr_ident = f"qr_table_{i}"
        qr_url = f"{base_url}/table/{t_id}"
        tables.append(
            Table(
                table_id=t_id,
                table_number=i,
                capacity=capacity,
                qr_identifier=qr_ident,
                qr_url=qr_url,
                status=TableStatus.AVAILABLE,
                current_session_id=None
            )
        )
    return tables

def get_initial_menu() -> List[MenuCategory]:
    # Common add-ons
    cheese_addon = MenuAddon(addon_id="addon_cheese", name="Extra Melted Cheese", price=40.0)
    spicy_addon = MenuAddon(addon_id="addon_spicy", name="Chef's Peri Peri Seasoning", price=20.0)
    dip_addon = MenuAddon(addon_id="addon_dip", name="Garlic Herb Aioli Dip", price=30.0)
    icecream_addon = MenuAddon(addon_id="addon_icecream", name="Scoop of Vanilla Gelato", price=50.0)
    oatmilk_addon = MenuAddon(addon_id="addon_oatmilk", name="Substitute Oat Milk", price=35.0)
    syrup_addon = MenuAddon(addon_id="addon_hazelnut", name="Hazelnut Syrup Shot", price=25.0)

    categories = [
        MenuCategory(
            category_id="cat_starters",
            name="Starters & Small Bites",
            description="Crispy, flavourful snacks made fresh to order",
            icon="french-fries",
            sort_order=1,
            is_active=True,
            items=[
                MenuItem(
                    item_id="item_paneer_tikka",
                    category_id="cat_starters",
                    name="Tandoori Paneer Tikka",
                    description="Cottage cheese marinated in Kashmiri spices and yogurt, charred to perfection in clay oven.",
                    price=299.0,
                    is_veg=True,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
                    addons=[cheese_addon, spicy_addon, dip_addon],
                    sort_order=1
                ),
                MenuItem(
                    item_id="item_peri_peri_fries",
                    category_id="cat_starters",
                    name="Crispy Peri Peri Fries",
                    description="Golden crisp potato fries tossed in fiery African bird's eye chili seasoning.",
                    price=189.0,
                    is_veg=True,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
                    addons=[cheese_addon, dip_addon],
                    sort_order=2
                ),
                MenuItem(
                    item_id="item_chicken_wings",
                    category_id="cat_starters",
                    name="Smoky BBQ Chicken Wings",
                    description="Juicy chicken wings glazed in house hickory wood smoked barbecue glaze with spring onions.",
                    price=349.0,
                    is_veg=False,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80",
                    addons=[dip_addon, spicy_addon],
                    sort_order=3
                ),
                MenuItem(
                    item_id="item_garlic_bread",
                    category_id="cat_starters",
                    name="Herbed Garlic Bread",
                    description="French baguette toasted with roasted garlic butter, parsley, and sea salt.",
                    price=169.0,
                    is_veg=True,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80",
                    addons=[cheese_addon, spicy_addon],
                    sort_order=4
                ),
                MenuItem(
                    item_id="item_crispy_corn",
                    category_id="cat_starters",
                    name="Chili Pepper Crispy Corn",
                    description="Sweet corn kernels wok-tossed with capsicum, cracked pepper and scallions.",
                    price=219.0,
                    is_veg=True,
                    is_available=False,  # Initially unavailable for testing dynamic availability
                    image_url="https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=600&q=80",
                    addons=[spicy_addon],
                    sort_order=5
                ),
            ]
        ),
        MenuCategory(
            category_id="cat_mains",
            name="Main Course",
            description="Signature cafe delicacies crafted for hearty appetites",
            icon="pizza",
            sort_order=2,
            is_active=True,
            items=[
                MenuItem(
                    item_id="item_butter_chicken",
                    category_id="cat_mains",
                    name="Old Delhi Butter Chicken",
                    description="Tender chicken pieces simmered in a velvet tomato butter gravy, served with 2 mini garlic naans.",
                    price=449.0,
                    is_veg=False,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80",
                    addons=[cheese_addon],
                    sort_order=1
                ),
                MenuItem(
                    item_id="item_margherita_pizza",
                    category_id="cat_mains",
                    name="Classic Margherita Pizza (10\")",
                    description="San Marzano tomato sauce, fresh buffalo mozzarella, hand-torn basil and extra virgin olive oil.",
                    price=379.0,
                    is_veg=True,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
                    addons=[cheese_addon, spicy_addon],
                    sort_order=2
                ),
                MenuItem(
                    item_id="item_alfredo_pasta",
                    category_id="cat_mains",
                    name="Creamy Alfredo Penne",
                    description="Penne rigate in decadent parmesan cream sauce with sauteed button mushrooms and garlic herbs.",
                    price=359.0,
                    is_veg=True,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
                    addons=[cheese_addon],
                    sort_order=3
                ),
                MenuItem(
                    item_id="item_dal_makhani",
                    category_id="cat_mains",
                    name="Slow-Cooked Dal Makhani",
                    description="Black lentils slow simmered overnight over charcoal embers with white butter and fresh cream.",
                    price=329.0,
                    is_veg=True,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                    addons=[],
                    sort_order=4
                ),
                MenuItem(
                    item_id="item_grilled_chicken",
                    category_id="cat_mains",
                    name="Herb Crusted Grilled Chicken Steak",
                    description="Char-grilled chicken breast with mushroom pepper sauce, mashed potatoes and buttered greens.",
                    price=429.0,
                    is_veg=False,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80",
                    addons=[dip_addon],
                    sort_order=5
                ),
            ]
        ),
        MenuCategory(
            category_id="cat_beverages",
            name="Artisanal Beverages",
            description="Specialty espresso drinks, iced refreshments and authentic chais",
            icon="coffee",
            sort_order=3,
            is_active=True,
            items=[
                MenuItem(
                    item_id="item_cold_coffee",
                    category_id="cat_beverages",
                    name="Signature Iced Cold Coffee",
                    description="Double shot Arabica espresso blended with chilled whole milk, vanilla essence and Belgian chocolate fudge.",
                    price=199.0,
                    is_veg=True,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
                    addons=[icecream_addon, oatmilk_addon, syrup_addon],
                    sort_order=1
                ),
                MenuItem(
                    item_id="item_masala_chai",
                    category_id="cat_beverages",
                    name="Aroma Cutting Masala Chai",
                    description="Handcrafted Assam tea infused with green cardamom, ginger, cloves, and cinnamon.",
                    price=89.0,
                    is_veg=True,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
                    addons=[],
                    sort_order=2
                ),
                MenuItem(
                    item_id="item_mint_mojito",
                    category_id="cat_beverages",
                    name="Virgin Classic Mint Mojito",
                    description="Crushed fresh garden mint, Persian lime chunks, organic cane sugar and sparkling soda.",
                    price=179.0,
                    is_veg=True,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
                    addons=[],
                    sort_order=3
                ),
                MenuItem(
                    item_id="item_hot_chocolate",
                    category_id="cat_beverages",
                    name="Belgian Dark Hot Chocolate",
                    description="Melted 70% Callebaut dark chocolate steamed with velvety milk, topped with mini marshmallows.",
                    price=229.0,
                    is_veg=True,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80",
                    addons=[oatmilk_addon, icecream_addon],
                    sort_order=4
                ),
            ]
        ),
        MenuCategory(
            category_id="cat_desserts",
            name="Handcrafted Desserts",
            description="Sweet indulgences baked fresh daily",
            icon="cake",
            sort_order=4,
            is_active=True,
            items=[
                MenuItem(
                    item_id="item_walnut_brownie",
                    category_id="cat_desserts",
                    name="Sizzling Walnut Brownie",
                    description="Fudgy dark chocolate walnut brownie served warm with chocolate ganache and vanilla ice cream.",
                    price=239.0,
                    is_veg=True,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
                    addons=[icecream_addon],
                    sort_order=1
                ),
                MenuItem(
                    item_id="item_cheesecake",
                    category_id="cat_desserts",
                    name="New York Baked Cheesecake",
                    description="Dense cream cheese over buttery graham cracker crust, topped with blueberry compote.",
                    price=269.0,
                    is_veg=True,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
                    addons=[],
                    sort_order=2
                ),
                MenuItem(
                    item_id="item_tiramisu",
                    category_id="cat_desserts",
                    name="Traditional Italian Tiramisu",
                    description="Espresso-soaked savoiardi sponge layered with mascarpone cream and dusted with raw cocoa.",
                    price=279.0,
                    is_veg=True,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
                    addons=[],
                    sort_order=3
                ),
            ]
        ),
        MenuCategory(
            category_id="cat_specials",
            name="Chef's Specials",
            description="Limited-edition culinary highlights by our Executive Chef",
            icon="sparkles",
            sort_order=5,
            is_active=True,
            items=[
                MenuItem(
                    item_id="item_truffle_risotto",
                    category_id="cat_specials",
                    name="Wild Mushroom Truffle Risotto",
                    description="Arborio rice cooked with porcini broth, shaved black truffles and aged Grana Padano cheese.",
                    price=499.0,
                    is_veg=True,
                    is_available=False,  # Currently unavailable item
                    image_url="https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80",
                    addons=[cheese_addon],
                    sort_order=1
                ),
                MenuItem(
                    item_id="item_bbq_burger",
                    category_id="cat_specials",
                    name="Aroma Smoked Gourmet Burger",
                    description="Double hand-pressed patty with caramelized onions, sharp cheddar, gherkins and barbecue mayo on brioche.",
                    price=389.0,
                    is_veg=False,
                    is_available=True,
                    image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
                    addons=[cheese_addon, spicy_addon, dip_addon],
                    sort_order=2
                ),
            ]
        )
    ]
    return categories
