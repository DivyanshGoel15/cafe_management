/**
 * Cafe Aroma - Core Data Models & Seed Data
 * Production-ready mock data matching the cafe operations ecosystem
 */

export const CAFE_INFO = {
  id: "cafe_aroma_01",
  name: "Cafe Aroma",
  tagline: "Artisanal Brews & Fresh Bites",
  subTagline: "Single-origin roasts, 36-hour sourdough, and warm hospitality in the heart of Connaught Place.",
  foundedYear: 2018,
  address: {
    street: "12 Heritage Lane, Inner Circle",
    locality: "Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    country: "India",
    full: "12 Heritage Lane, Connaught Place, New Delhi 110001",
    mapCoordinates: { lat: 28.6328, lng: 77.2197 },
    googleMapsUrl: "https://maps.google.com/?q=Connaught+Place+New+Delhi"
  },
  contact: {
    phone: "+91 98765 43210",
    phoneDisplay: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    whatsappLink: "https://wa.me/919876543210?text=Hello%20Cafe%20Aroma%20team!",
    email: "hello@cafearoma.com",
    reservationsEmail: "reservations@cafearoma.com",
    pressEmail: "press@cafearoma.com"
  },
  social: {
    instagram: "https://instagram.com/cafearomadelhi",
    facebook: "https://facebook.com/cafearomadelhi",
    twitter: "https://twitter.com/cafearoma",
    youtube: "https://youtube.com/cafearoma"
  },
  currency: "₹",
  currencyCode: "INR",
  taxRate: 0.05, // 5% GST
  rating: 4.9,
  reviewsCount: 528,
  amenities: [
    { icon: "wifi", name: "High-Speed 300Mbps WiFi", desc: "Dedicated work stations with power plugs" },
    { icon: "coffee", name: "In-House Micro Roastery", desc: "Single-origin beans roasted weekly" },
    { icon: "paw", name: "Pet Friendly Courtyard", desc: "Water bowls & treats for furry friends" },
    { icon: "car", name: "Valet & Dedicated Parking", desc: "Safe parking at Inner Circle entrance" },
    { icon: "leaf", name: "100% Organic Dairy & Produce", desc: "Directly sourced from organic valley farms" },
    { icon: "heart", name: "Dietary Inclusive", desc: "Vegan, keto, gluten-friendly & nut-free options" }
  ],
  hours: [
    { day: "Monday", open: "08:00", close: "23:00", display: "8:00 AM – 11:00 PM" },
    { day: "Tuesday", open: "08:00", close: "23:00", display: "8:00 AM – 11:00 PM" },
    { day: "Wednesday", open: "08:00", close: "23:00", display: "8:00 AM – 11:00 PM" },
    { day: "Thursday", open: "08:00", close: "23:00", display: "8:00 AM – 11:00 PM" },
    { day: "Friday", open: "08:00", close: "23:30", display: "8:00 AM – 11:30 PM" },
    { day: "Saturday", open: "07:30", close: "23:30", display: "7:30 AM – 11:30 PM" },
    { day: "Sunday", open: "07:30", close: "23:00", display: "7:30 AM – 11:00 PM" }
  ]
};

export const MENU_CATEGORIES = [
  {
    id: "all",
    name: "All Creations",
    shortName: "All",
    icon: "sparkles",
    count: 26
  },
  {
    id: "cat_starters",
    name: "Starters & Small Bites",
    shortName: "Starters",
    description: "Crispy, flavourful snacks made fresh to order",
    icon: "utensils",
    count: 5
  },
  {
    id: "cat_mains",
    name: "Main Course & Bowls",
    shortName: "Mains",
    description: "Hearty, nourishing plates prepared with seasonal produce",
    icon: "bowl-food",
    count: 5
  },
  {
    id: "cat_pizza_pasta",
    name: "Artisanal Pizza & Pasta",
    shortName: "Pizza & Pasta",
    description: "36-hour fermented sourdough crusts and handmade pasta ribbons",
    icon: "pizza-slice",
    count: 5
  },
  {
    id: "cat_beverages",
    name: "Specialty Coffee & Drinks",
    shortName: "Coffee & Drinks",
    description: "Single-origin pour overs, velvety lattes and botanical refreshers",
    icon: "mug-hot",
    count: 6
  },
  {
    id: "cat_desserts",
    name: "Decadent Desserts & Bakes",
    shortName: "Desserts",
    description: "Artisanal pastries, French single-origin chocolate & warm bakes",
    icon: "cake-slice",
    count: 5
  }
];

export const ADDONS_COLLECTION = {
  cheese: { id: "addon_cheese", name: "Extra Melted Aged Cheese", price: 40 },
  spicy: { id: "addon_spicy", name: "Chef's Peri Peri Seasoning", price: 20 },
  dip: { id: "addon_dip", name: "Roasted Garlic Truffle Aioli", price: 30 },
  gelato: { id: "addon_gelato", name: "Scoop of Tahitian Vanilla Gelato", price: 50 },
  oatmilk: { id: "addon_oatmilk", name: "Substitute Barista Oat Milk", price: 35 },
  syrup: { id: "addon_hazelnut", name: "Roasted Hazelnut Syrup Shot", price: 25 },
  egg: { id: "addon_egg", name: "Organic Poached Egg", price: 35 },
  avocado: { id: "addon_avocado", name: "Hass Avocado Slices", price: 60 }
};

export const MENU_ITEMS = [
  // STARTERS
  {
    id: "item_paneer_tikka",
    categoryId: "cat_starters",
    name: "Tandoori Paneer Tikka",
    description: "Fresh cottage cheese marinated in Kashmiri spices and Greek yogurt, charred to smoky perfection in our clay oven with bell peppers.",
    price: 299,
    isVeg: true,
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 142,
    prepTime: "15-18 mins",
    calories: "340 kcal",
    imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
    tags: ["Bestseller", "Tandoori Special", "Gluten-Free"],
    ingredients: ["Farm Fresh Paneer", "Greek Yogurt", "Kashmiri Chili", "Bell Peppers", "Mint Chutney", "Chaat Masala"],
    allergens: ["Dairy"],
    addons: [ADDONS_COLLECTION.cheese, ADDONS_COLLECTION.dip, ADDONS_COLLECTION.spicy]
  },
  {
    id: "item_peri_peri_fries",
    categoryId: "cat_starters",
    name: "Crispy Peri Peri Fries",
    description: "Hand-cut Idaho potato fries tossed in fiery African bird's eye chili seasoning, served with roasted garlic aioli dip.",
    price: 189,
    isVeg: true,
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 205,
    prepTime: "10-12 mins",
    calories: "280 kcal",
    imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
    tags: ["Staff Pick", "Crispy", "Vegan Option"],
    ingredients: ["Potatoes", "Peri Peri Spices", "Garlic Powder", "Sea Salt", "Parsley"],
    allergens: [],
    addons: [ADDONS_COLLECTION.cheese, ADDONS_COLLECTION.dip]
  },
  {
    id: "item_chicken_wings",
    categoryId: "cat_starters",
    name: "Smoky BBQ Chicken Wings",
    description: "Tender chicken wings glazed in house hickory-smoked artisanal barbecue sauce, garnished with toasted sesame and scallions.",
    price: 349,
    isVeg: false,
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 178,
    prepTime: "15-20 mins",
    calories: "450 kcal",
    imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    tags: ["Bestseller", "Signature Glaze"],
    ingredients: ["Prime Chicken Wings", "Hickory Wood BBQ Sauce", "Wild Honey", "Toasted Sesame", "Spring Onions"],
    allergens: ["Sesame"],
    addons: [ADDONS_COLLECTION.dip, ADDONS_COLLECTION.spicy]
  },
  {
    id: "item_garlic_bread",
    categoryId: "cat_starters",
    name: "Herbed Sourdough Garlic Bread",
    description: "House sourdough baguette toasted with garlic butter, fresh rosemary, thyme, cracked sea salt, and aged parmesan.",
    price: 169,
    isVeg: true,
    isAvailable: true,
    rating: 4.7,
    reviewsCount: 96,
    prepTime: "8-10 mins",
    calories: "220 kcal",
    imageUrl: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=800&q=80",
    tags: ["Wood-Fired", "Artisanal Sourdough"],
    ingredients: ["36-hr Fermented Sourdough", "Roasted Garlic Butter", "Fresh Herbs", "Parmigiano-Reggiano"],
    allergens: ["Gluten", "Dairy"],
    addons: [ADDONS_COLLECTION.cheese, ADDONS_COLLECTION.spicy]
  },
  {
    id: "item_crispy_corn",
    categoryId: "cat_starters",
    name: "Chili Pepper Crispy Corn",
    description: "Golden sweet corn kernels wok-tossed with spring onions, crushed black pepper, bird's eye chili, and tangy lime zest.",
    price: 219,
    isVeg: true,
    isAvailable: false, // Intentionally marked unavailable to test UX states
    rating: 4.6,
    reviewsCount: 84,
    prepTime: "12 mins",
    calories: "260 kcal",
    imageUrl: "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=800&q=80",
    tags: ["Sold Out Today", "Spicy Delight"],
    ingredients: ["American Sweet Corn", "Capsicum", "Cracked Pepper", "Scallions", "Kaffir Lime"],
    allergens: [],
    addons: [ADDONS_COLLECTION.spicy]
  },

  // MAINS
  {
    id: "item_cottage_cheese_steak",
    categoryId: "cat_mains",
    name: "Herb-Crusted Paneer Steak",
    description: "Thick slab of organic cottage cheese seared with rosemary herbs, served atop creamy saffron polenta, grilled asparagus, and paprika velouté.",
    price: 389,
    isVeg: true,
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 112,
    prepTime: "20-25 mins",
    calories: "480 kcal",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    tags: ["Chef's Special", "High Protein"],
    ingredients: ["Organic Cottage Cheese", "Polenta", "Paprika Coulis", "Asparagus", "Microgreens"],
    allergens: ["Dairy"],
    addons: [ADDONS_COLLECTION.cheese, ADDONS_COLLECTION.avocado]
  },
  {
    id: "item_butter_chicken_tartine",
    categoryId: "cat_mains",
    name: "Old Delhi Butter Chicken Tartine",
    description: "Slow-braised tandoori pulled chicken in velvety tomato-makhani gravy, served open-faced on toasted brioche with pickled baby onions.",
    price: 429,
    isVeg: false,
    isAvailable: true,
    rating: 5.0,
    reviewsCount: 230,
    prepTime: "18-20 mins",
    calories: "540 kcal",
    imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
    tags: ["Signature Dish", "Chef's Masterpiece", "Must Try"],
    ingredients: ["Pulled Chicken", "San Marzano Makhani Gravy", "Toasted Brioche", "Kasuri Methi", "Micro Cilantro"],
    allergens: ["Gluten", "Dairy"],
    addons: [ADDONS_COLLECTION.cheese, ADDONS_COLLECTION.egg]
  },
  {
    id: "item_truffle_mushroom_bowl",
    categoryId: "cat_mains",
    name: "Wild Truffle Mushroom Bowl",
    description: "Pan-roasted porcini, cremini and button mushrooms over garlic brown rice, baby spinach, avocado rose, and black truffle oil drizzle.",
    price: 379,
    isVeg: true,
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 129,
    prepTime: "15-18 mins",
    calories: "390 kcal",
    imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
    tags: ["Plant Forward", "Truffle Aroma", "Healthy"],
    ingredients: ["Wild Porcini & Cremini", "Aromatic Brown Rice", "Hass Avocado", "White Truffle Oil", "Toasted Pine Nuts"],
    allergens: ["Tree Nuts"],
    addons: [ADDONS_COLLECTION.cheese, ADDONS_COLLECTION.avocado]
  },
  {
    id: "item_moroccan_spiced_bowl",
    categoryId: "cat_mains",
    name: "Moroccan Spiced Harissa Chicken",
    description: "Juicy chicken breast marinated in North African harissa, charred and served with herb couscous, roasted bell pepper humous, and pomegranate pearls.",
    price: 439,
    isVeg: false,
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 167,
    prepTime: "20-22 mins",
    calories: "510 kcal",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
    tags: ["Flavourful", "High Protein"],
    ingredients: ["Grilled Chicken Fillet", "Couscous", "Homemade Harissa", "Smoked Hummus", "Pomegranate"],
    allergens: ["Gluten"],
    addons: [ADDONS_COLLECTION.dip, ADDONS_COLLECTION.egg]
  },
  {
    id: "item_pan_seared_salmon",
    categoryId: "cat_mains",
    name: "Norwegian Pan-Seared Salmon",
    description: "Crispy skin Atlantic salmon on roasted baby potatoes, buttered sugar snap peas, and caper dill cream reduction.",
    price: 649,
    isVeg: false,
    isAvailable: false, // Unavailable test item
    rating: 4.9,
    reviewsCount: 78,
    prepTime: "22 mins",
    calories: "560 kcal",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    tags: ["Catch of the Week", "Omega Rich", "Premium"],
    ingredients: ["Atlantic Salmon", "Baby Potatoes", "Dill Caper Sauce", "Snap Peas", "Lemon Thyme"],
    allergens: ["Fish", "Dairy"],
    addons: []
  },

  // PIZZA & PASTA
  {
    id: "item_bufala_margherita",
    categoryId: "cat_pizza_pasta",
    name: "Margherita Con Bufala Pizza",
    description: "Classic Neapolitan 11-inch crust baked at 450°C with San Marzano DOP tomato sauce, fresh buffalo mozzarella, basil leaves, and EVOO.",
    price: 399,
    isVeg: true,
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 310,
    prepTime: "14-16 mins",
    calories: "680 kcal",
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    tags: ["Wood-Fired", "Neapolitan Classic", "Bestseller"],
    ingredients: ["36-hr Sourdough", "San Marzano DOP Tomatoes", "Buffalo Mozzarella", "Fresh Basil", "Extra Virgin Olive Oil"],
    allergens: ["Gluten", "Dairy"],
    addons: [ADDONS_COLLECTION.cheese, ADDONS_COLLECTION.spicy]
  },
  {
    id: "item_truffle_funghi_pizza",
    categoryId: "cat_pizza_pasta",
    name: "Truffle & Forest Funghi Pizza",
    description: "White bianca base with fior di latte, roasted wild mushrooms, caramelized shallots, fresh thyme, and cold-pressed white truffle oil.",
    price: 459,
    isVeg: true,
    isAvailable: true,
    rating: 5.0,
    reviewsCount: 198,
    prepTime: "15-18 mins",
    calories: "720 kcal",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    tags: ["Chef's Pick", "Gourmet Bianca"],
    ingredients: ["White Sourdough", "Fior di Latte", "Wild Mushrooms", "White Truffle Oil", "Thyme"],
    allergens: ["Gluten", "Dairy"],
    addons: [ADDONS_COLLECTION.cheese]
  },
  {
    id: "item_pepperoni_hot_honey",
    categoryId: "cat_pizza_pasta",
    name: "Spicy Pepperoni & Hot Honey",
    description: "Crispy-edged artisanal pepperoni cups, San Marzano tomato sauce, mozzarella, chili flakes, and hot chili-infused honey drizzle.",
    price: 489,
    isVeg: false,
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 224,
    prepTime: "15-18 mins",
    calories: "790 kcal",
    imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    tags: ["Bestseller", "Sweet & Spicy", "Popular"],
    ingredients: ["Slow-ferment Sourdough", "Artisanal Pepperoni", "Hot Honey", "Mozzarella", "Calabrian Chili"],
    allergens: ["Gluten", "Dairy"],
    addons: [ADDONS_COLLECTION.cheese, ADDONS_COLLECTION.dip]
  },
  {
    id: "item_fettuccine_alfredo",
    categoryId: "cat_pizza_pasta",
    name: "Creamy Truffle Fettuccine",
    description: "Fresh hand-rolled pasta ribbons tossed in aged 24-month Parmigiano-Reggiano cream sauce with roasted garlic and toasted crushed black pepper.",
    price: 389,
    isVeg: true,
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 145,
    prepTime: "15-17 mins",
    calories: "620 kcal",
    imageUrl: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80",
    tags: ["Handmade Pasta", "Comfort Food"],
    ingredients: ["Handmade Egg Fettuccine", "Aged Parmigiano", "Heavy Cream", "Black Truffle Essence"],
    allergens: ["Gluten", "Dairy", "Egg"],
    addons: [ADDONS_COLLECTION.cheese, ADDONS_COLLECTION.spicy]
  },
  {
    id: "item_penne_arrabiata",
    categoryId: "cat_pizza_pasta",
    name: "Fiery Penne All'Arrabbiata",
    description: "Al dente artisanal penne in spicy San Marzano tomato sugo, garlic chips, bird's eye chili, kalamata olives, and fresh basil chiffonade.",
    price: 349,
    isVeg: true,
    isAvailable: true,
    rating: 4.7,
    reviewsCount: 110,
    prepTime: "14-16 mins",
    calories: "450 kcal",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3d5d6281781?auto=format&fit=crop&w=800&q=80",
    tags: ["Spicy", "Vegan Friendly"],
    ingredients: ["Artisanal Penne", "San Marzano Sugo", "Garlic", "Bird's Eye Chili", "Kalamata Olives"],
    allergens: ["Gluten"],
    addons: [ADDONS_COLLECTION.cheese]
  },

  // BEVERAGES & SPECIALTY COFFEE
  {
    id: "item_single_origin_pourover",
    categoryId: "cat_beverages",
    name: "Chikmagalur Single-Origin Pour Over",
    description: "Hand-poured using V60 dripper. Estate beans from Chikmagalur hills with notes of candied orange, dark chocolate, and jasmine florality.",
    price: 210,
    isVeg: true,
    isAvailable: true,
    rating: 5.0,
    reviewsCount: 260,
    prepTime: "6-8 mins",
    calories: "5 kcal",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    tags: ["Signature Coffee", "Single Origin", "Specialty SCA 86+"],
    ingredients: ["100% Arabica Chikmagalur Estate Beans", "Filtered Mountain Spring Water"],
    allergens: [],
    addons: [ADDONS_COLLECTION.oatmilk, ADDONS_COLLECTION.syrup]
  },
  {
    id: "item_spanish_iced_latte",
    categoryId: "cat_beverages",
    name: "Velvet Spanish Iced Latte",
    description: "Double ristretto shot pulled over sweetened condensed milk, velvety chilled whole milk, and crushed crystalline ice.",
    price: 240,
    isVeg: true,
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 340,
    prepTime: "5 mins",
    calories: "210 kcal",
    imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
    tags: ["Top Bestseller", "Iced Special", "Creamy"],
    ingredients: ["Espresso Blend", "Condensed Milk", "Fresh Whole Milk", "Ice"],
    allergens: ["Dairy"],
    addons: [ADDONS_COLLECTION.oatmilk, ADDONS_COLLECTION.syrup]
  },
  {
    id: "item_classic_flat_white",
    categoryId: "cat_beverages",
    name: "Artisanal Flat White",
    description: "Silky microfoam poured delicately over a dense double shot of medium-roast house blend with intricate latte art.",
    price: 195,
    isVeg: true,
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 195,
    prepTime: "4-5 mins",
    calories: "120 kcal",
    imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80",
    tags: ["Barista Favorite", "Latte Art"],
    ingredients: ["Double Ristretto", "Steamed Whole Milk"],
    allergens: ["Dairy"],
    addons: [ADDONS_COLLECTION.oatmilk, ADDONS_COLLECTION.syrup]
  },
  {
    id: "item_cold_brew_tonic",
    categoryId: "cat_beverages",
    name: "Citrus Cold Brew Tonic",
    description: "18-hour cold steeped coffee topped with botanical elderflower tonic water, dehydrated grapefruit wheel, and fresh rosemary sprig.",
    price: 230,
    isVeg: true,
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 120,
    prepTime: "4 mins",
    calories: "45 kcal",
    imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
    tags: ["Refreshing", "Botanical", "Summer Tonic"],
    ingredients: ["18-hr Slow Cold Brew", "Indian Tonic Water", "Grapefruit Slice", "Rosemary"],
    allergens: [],
    addons: []
  },
  {
    id: "item_belgian_hot_chocolate",
    categoryId: "cat_beverages",
    name: "70% Belgian Dark Hot Chocolate",
    description: "Melted Callebaut Belgian dark chocolate couverture simmered with creamy milk, topped with toasted marshmallow fluff and cocoa dust.",
    price: 260,
    isVeg: true,
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 280,
    prepTime: "6-8 mins",
    calories: "320 kcal",
    imageUrl: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",
    tags: ["Decadent", "Callebaut 70%", "Cozy Winter Warmth"],
    ingredients: ["70% Callebaut Dark Chocolate", "Full Cream Milk", "Vanilla Extract", "Marshmallows"],
    allergens: ["Dairy"],
    addons: [ADDONS_COLLECTION.gelato, ADDONS_COLLECTION.oatmilk]
  },
  {
    id: "item_hibiscus_berry_tea",
    categoryId: "cat_beverages",
    name: "Wild Hibiscus Berry Iced Tea",
    description: "Organic Egyptian hibiscus flowers steeped with wild blueberries, mint sprigs, raw clover honey, and chilled soda splash.",
    price: 190,
    isVeg: true,
    isAvailable: true,
    rating: 4.7,
    reviewsCount: 88,
    prepTime: "4 mins",
    calories: "60 kcal",
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    tags: ["Caffeine Free", "Antioxidant Rich", "Crisp"],
    ingredients: ["Organic Dried Hibiscus", "Wild Berries", "Raw Honey", "Mint", "Soda"],
    allergens: [],
    addons: []
  },

  // DESSERTS & BAKES
  {
    id: "item_chocolate_fondant",
    categoryId: "cat_desserts",
    name: "Warm Valrhona Molten Fondant",
    description: "Rich French dark chocolate cake with a warm flowing lava center, served with a scoop of Madagascar vanilla bean gelato and berry compote.",
    price: 290,
    isVeg: true,
    isAvailable: true,
    rating: 5.0,
    reviewsCount: 320,
    prepTime: "12-14 mins",
    calories: "480 kcal",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    tags: ["Chef's Signature", "Warm Lava", "Must Have"],
    ingredients: ["Valrhona 72% Chocolate", "Organic Butter", "Madagascar Vanilla Gelato", "Fresh Raspberry Sauce"],
    allergens: ["Dairy", "Gluten", "Egg"],
    addons: [ADDONS_COLLECTION.gelato]
  },
  {
    id: "item_classic_tiramisu",
    categoryId: "cat_desserts",
    name: "Traditional Venetian Tiramisu",
    description: "Italian savoiardi ladyfingers soaked in freshly brewed espresso and amaretto, layered with cloud-like mascarpone zabaglione and Dutch cocoa.",
    price: 275,
    isVeg: true,
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 240,
    prepTime: "Immediate",
    calories: "410 kcal",
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
    tags: ["Italian Classic", "Fresh Daily"],
    ingredients: ["Savoiardi Biscuits", "Espresso", "Mascarpone", "Cocoa Powder", "Vanilla"],
    allergens: ["Dairy", "Gluten", "Egg"],
    addons: [ADDONS_COLLECTION.gelato]
  },
  {
    id: "item_wild_berry_cheesecake",
    categoryId: "cat_desserts",
    name: "New York Wild Berry Cheesecake",
    description: "Velvety baked Philadelphia cream cheese on a buttery graham cracker crust, topped with homemade wild blackberry and raspberry glaze.",
    price: 285,
    isVeg: true,
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 165,
    prepTime: "Immediate",
    calories: "430 kcal",
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    tags: ["Baked In-House", "Creamy Perfection"],
    ingredients: ["Philadelphia Cream Cheese", "Graham Crackers", "Blackberry Compote", "Madagascar Vanilla"],
    allergens: ["Dairy", "Gluten"],
    addons: [ADDONS_COLLECTION.gelato]
  },
  {
    id: "item_cinnamon_brioche_roll",
    categoryId: "cat_desserts",
    name: "Warm Cinnamon Brioche Roll",
    description: "Freshly baked morning brioche swirl infused with Ceylon cinnamon butter, smothered in warm cream cheese frosting and toasted pecans.",
    price: 185,
    isVeg: true,
    isAvailable: true,
    rating: 4.8,
    reviewsCount: 190,
    prepTime: "5 mins (Warmed)",
    calories: "360 kcal",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    tags: ["Morning Bake", "Fresh at 8AM"],
    ingredients: ["Brioche Dough", "Ceylon Cinnamon", "Brown Sugar", "Cream Cheese Glaze", "Pecans"],
    allergens: ["Gluten", "Dairy", "Tree Nuts"],
    addons: [ADDONS_COLLECTION.gelato]
  },
  {
    id: "item_matcha_basque_cheesecake",
    categoryId: "cat_desserts",
    name: "Uji Matcha Basque Burnt Cheesecake",
    description: "Caramelized charred exterior with an oozy matcha green tea center made with ceremonial grade tea imported from Uji, Kyoto.",
    price: 310,
    isVeg: true,
    isAvailable: true,
    rating: 4.9,
    reviewsCount: 140,
    prepTime: "Immediate",
    calories: "390 kcal",
    imageUrl: "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&w=800&q=80",
    tags: ["Ceremonial Matcha", "Gluten-Free Option"],
    ingredients: ["Uji Ceremonial Matcha", "Cream Cheese", "Heavy Cream", "Organic Eggs"],
    allergens: ["Dairy", "Egg"],
    addons: [ADDONS_COLLECTION.gelato]
  }
];

export const OFFERS = [
  {
    id: "offer_morning_brew",
    title: "Morning Roastery Rush",
    tagline: "Start your sunrise with artisanal craft",
    code: "MORNING20",
    discountPercent: 20,
    discountDisplay: "20% OFF",
    validDays: "Mon – Fri",
    validHours: "8:00 AM – 11:00 AM",
    validUntil: "2026-12-31",
    description: "Enjoy a flat 20% discount on all single-origin pour overs, espresso lattes, and fresh bakery pastries every weekday morning.",
    terms: [
      "Valid on dine-in orders placed between 8:00 AM and 11:00 AM",
      "Applicable across Coffee & Desserts categories",
      "Cannot be clubbed with other promotional discount vouchers"
    ],
    isActive: true,
    minSpend: 250,
    badge: "Sunrise Special",
    bgGradient: "linear-gradient(135deg, #1B382B 0%, #0B2018 100%)"
  },
  {
    id: "offer_pizza_duo",
    title: "Artisanal Pizza & Sourdough Fest",
    tagline: "Buy 1 Gourmet Pizza, get 50% off on second",
    code: "PIZZA50",
    discountPercent: 50,
    discountDisplay: "50% OFF 2ND",
    validDays: "All Days",
    validHours: "12:00 PM – 10:30 PM",
    validUntil: "2026-11-30",
    description: "Order any artisanal wood-fired sourdough pizza and get the second pizza at half price! Perfect for pairs and pizza lovers.",
    terms: [
      "Discount applies to the pizza of equal or lesser value",
      "Available for both dine-in and takeaway",
      "Max discount ₹250 per transaction"
    ],
    isActive: true,
    minSpend: 600,
    badge: "Dinner Crowd Favorite",
    bgGradient: "linear-gradient(135deg, #3C2214 0%, #1A0D08 100%)"
  },
  {
    id: "offer_weekend_brunch",
    title: "Connaught Weekend High-Tea & Brunch",
    tagline: "Flat ₹200 off on our signature High-Tea Platter",
    code: "HIGHTEA200",
    discountAmount: 200,
    discountDisplay: "₹200 OFF",
    validDays: "Saturday & Sunday",
    validHours: "3:00 PM – 7:00 PM",
    validUntil: "2026-12-31",
    description: "Indulge in our 3-tier High-Tea tower with savory finger tartines, freshly baked scones with clotted cream, and unlimited pot of premium tea.",
    terms: [
      "Valid exclusively on Saturdays and Sundays between 3:00 PM and 7:00 PM",
      "Prior table reservation recommended",
      "Minimum party of 2 guests"
    ],
    isActive: true,
    minSpend: 850,
    badge: "Weekend Luxury",
    bgGradient: "linear-gradient(135deg, #2D271E 0%, #16120C 100%)"
  },
  {
    id: "offer_work_perk",
    title: "Remote Work & Creator Sanctuary",
    tagline: "Unlimited brewed coffee refills on any sandwich or main",
    code: "WORKBREW",
    discountDisplay: "FREE REFILLS",
    validDays: "Mon – Thu",
    validHours: "10:00 AM – 6:00 PM",
    validUntil: "2026-10-31",
    description: "Work comfortably from our sunlit greenhouse patio with 300Mbps WiFi and power outlets. Order any lunch plate or sandwich and receive unlimited batch brew coffee refills.",
    terms: [
      "Valid on house batch brew and Americano refills",
      "Applies per individual guest ordering a qualifying main plate",
      "Available during weekday work hours"
    ],
    isActive: true,
    minSpend: 350,
    badge: "Co-Work Friendly",
    bgGradient: "linear-gradient(135deg, #1A2820 0%, #0E1612 100%)"
  },
  {
    id: "offer_celebration_dessert",
    title: "Chef's Celebration Sweet Treat",
    tagline: "Complimentary Molten Fondant on bookings of 4+ guests",
    code: "CELEBRATE",
    discountDisplay: "FREE DESSERT",
    validDays: "All Days",
    validHours: "All Day",
    validUntil: "2026-12-31",
    description: "Celebrating a birthday, anniversary, or reunion? Book a table for 4 or more guests, mention your celebration, and get our signature Valrhona Chocolate Fondant on the house!",
    terms: [
      "Requires online table reservation for 4 or more guests",
      "Mention coupon code 'CELEBRATE' in reservation notes",
      "One complimentary dessert per registered table booking"
    ],
    isActive: true,
    minSpend: 1200,
    badge: "Party Perk",
    bgGradient: "linear-gradient(135deg, #2E1B24 0%, #170B11 100%)"
  },
  {
    id: "offer_student_discount",
    title: "Student & Artist Creative Perk",
    tagline: "15% off food and beverage all day",
    code: "CREATIVE15",
    discountPercent: 15,
    discountDisplay: "15% OFF",
    validDays: "All Days",
    validHours: "All Day",
    validUntil: "2026-12-31",
    description: "We love empowering students, researchers, and creative freelancers! Flash any valid student or university identity card and enjoy 15% off your entire bill.",
    terms: [
      "Valid physical or digital student/university ID required at checkout",
      "Maximum discount of ₹180 per visit",
      "Valid for the ID holder's portion"
    ],
    isActive: true,
    minSpend: 200,
    badge: "Student ID Required",
    bgGradient: "linear-gradient(135deg, #24222E 0%, #100F15 100%)"
  }
];

export const REVIEWS = [
  {
    id: "rev_01",
    author: "Rhea Singhania",
    location: "New Delhi",
    rating: 5,
    date: "2 days ago",
    relativeTime: "September 2026",
    avatar: "RS",
    title: "Best pour over and sourdough in Connaught Place!",
    review: "Cafe Aroma is easily the most atmospheric cafe in Delhi. The Chikmagalur pour over has unmistakable orange zest notes, and the Truffle Funghi Pizza was out of this world. Fast WiFi, warm acoustic jazz, and wonderful baristas.",
    verified: true,
    favoriteItem: "Chikmagalur Pour Over & Truffle Funghi Pizza"
  },
  {
    id: "rev_02",
    author: "Arjun Mathur",
    location: "Gurugram",
    rating: 5,
    date: "1 week ago",
    relativeTime: "September 2026",
    avatar: "AM",
    title: "Spectacular butter chicken tartine & cozy corner tables",
    review: "Had a 4-person Sunday brunch here. The Butter Chicken Tartine on toasted brioche is a masterpiece — rich without being heavy. Booking online was effortless and our window table was waiting for us with zero delay. 10/10.",
    verified: true,
    favoriteItem: "Butter Chicken Tartine"
  },
  {
    id: "rev_03",
    author: "Pooja Vashisht",
    location: "Noida",
    rating: 5,
    date: "2 weeks ago",
    relativeTime: "September 2026",
    avatar: "PV",
    title: "A remote worker's dream cafe!",
    review: "I worked here for 5 hours on Tuesday. Power sockets at every wooden desk, smooth 300Mbps internet, quiet background vibe, and the Barista Oat Milk Spanish Iced Latte kept me energized. They even brought water refills without asking.",
    verified: true,
    favoriteItem: "Spanish Iced Latte"
  },
  {
    id: "rev_04",
    author: "Devendra Kulkarni",
    location: "Mumbai (Visiting)",
    rating: 5,
    date: "3 weeks ago",
    relativeTime: "September 2026",
    avatar: "DK",
    title: "Michelin-level attention to detail",
    review: "The Valrhona chocolate molten cake with Tahitian gelato is sheer indulgence. The copper and deep forest green interiors make you feel like you stepped into a chic Milanese cafe. Super friendly staff who genuinely know their coffee origins.",
    verified: true,
    favoriteItem: "Warm Valrhona Molten Fondant"
  },
  {
    id: "rev_05",
    author: "Ananya Deshmukh",
    location: "South Delhi",
    rating: 5,
    date: "1 month ago",
    relativeTime: "August 2026",
    avatar: "AD",
    title: "Flawless anniversary dinner experience",
    review: "Booked a table for our 3rd anniversary. They had placed fresh jasmine flowers on our table and treated us with complimentary dessert! The Neapolitan margherita crust was leopard-spotted and chewy. Thank you team Aroma!",
    verified: true,
    favoriteItem: "Margherita Con Bufala"
  },
  {
    id: "rev_06",
    author: "Kabir Sengupta",
    location: "New Delhi",
    rating: 4,
    date: "1 month ago",
    relativeTime: "August 2026",
    avatar: "KS",
    title: "Top-notch coffee, can get busy on Saturday evenings",
    review: "The cold brew tonic with grapefruit wheel is super crisp and refreshing. Only advice is to book online in advance for weekend evenings because walk-ins can wait up to 25 minutes. Once seated, everything was smooth.",
    verified: true,
    favoriteItem: "Citrus Cold Brew Tonic"
  },
  {
    id: "rev_07",
    author: "Meera Nair",
    location: "Bengaluru",
    rating: 5,
    date: "1 month ago",
    relativeTime: "August 2026",
    avatar: "MN",
    title: "Real specialty coffee finally done right in CP",
    review: "As a coffee roaster from Bangalore, I have high standards. Cafe Aroma's V60 technique, water TDS control, and bean freshness rival the finest third-wave roasters in Tokyo and Melbourne. Essential visit.",
    verified: true,
    favoriteItem: "Single-Origin V60 Pour Over"
  },
  {
    id: "rev_08",
    author: "Tanmay Bansal",
    location: "Faridabad",
    rating: 5,
    date: "2 months ago",
    relativeTime: "July 2026",
    avatar: "TB",
    title: "Crispy Peri Peri fries & Smoky BBQ wings were fire!",
    review: "Came with college buddies. Loved the generous portions and how quickly food arrived. The hot honey pepperoni pizza was a massive hit. Can't wait to return next weekend.",
    verified: true,
    favoriteItem: "Spicy Pepperoni & Hot Honey"
  }
];

export const GALLERY_ITEMS = [
  {
    id: "gal_01",
    category: "coffee",
    title: "Precision V60 Manual Brew",
    description: "Barista extracting single-origin Chikmagalur Arabica at 93°C",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "tall"
  },
  {
    id: "gal_02",
    category: "food",
    title: "Wood-Fired Neapolitan Sourdough",
    description: "Bubbling buffalo mozzarella and San Marzano DOP tomatoes fresh from the oven",
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "wide"
  },
  {
    id: "gal_03",
    category: "ambience",
    title: "Sunlit Botanical Courtyard",
    description: "Our pet-friendly patio greenhouse with natural skylights and lush palms",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "normal"
  },
  {
    id: "gal_04",
    category: "coffee",
    title: "Velvet Swan Latte Art",
    description: "Pouring microfoam over a rich double ristretto blend",
    imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "normal"
  },
  {
    id: "gal_05",
    category: "food",
    title: "Valrhona Molten Fondant & Tahitian Gelato",
    description: "Gooey 72% dark chocolate center dusted with organic cocoa powder",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "tall"
  },
  {
    id: "gal_06",
    category: "ambience",
    title: "The Copper Espresso Bar & Library",
    description: "Custom brass La Marzocco machine set against deep forest emerald tiles",
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "wide"
  },
  {
    id: "gal_07",
    category: "food",
    title: "Old Delhi Makhani Brioche Tartine",
    description: "Tender pulled chicken braised in rich tomato-cream reduction",
    imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "normal"
  },
  {
    id: "gal_08",
    category: "events",
    title: "Friday Acoustic Jazz Evenings",
    description: "Live vinyl & unplugged indie acoustic sessions every Friday at 8PM",
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "normal"
  },
  {
    id: "gal_09",
    category: "coffee",
    title: "Cold Drip Slow Extraction Tower",
    description: "18-hour Dutch cold drip extraction capturing subtle floral aromatics",
    imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "tall"
  },
  {
    id: "gal_10",
    category: "food",
    title: "Truffle & Porcini Sourdough Pizza",
    description: "Wild foraged mushrooms with fior di latte and white truffle oil",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "normal"
  },
  {
    id: "gal_11",
    category: "ambience",
    title: "Quiet Reading & Remote Work Alcove",
    description: "Ergonomic walnut desks, reading lamps, and warm stone interiors",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "wide"
  },
  {
    id: "gal_12",
    category: "food",
    title: "Golden Morning Brioche Swirls",
    description: "Straight from our morning 7AM bake with Ceylon cinnamon",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "normal"
  },
  {
    id: "gal_13",
    category: "coffee",
    title: "Iced Botanical Spanish Latte",
    description: "Condensed milk layers with double ristretto and fresh microfoam",
    imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "tall"
  },
  {
    id: "gal_14",
    category: "events",
    title: "Weekend Barista Cupping Sessions",
    description: "Weekly sensory coffee tasting workshops hosted every Sunday morning",
    imageUrl: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "wide"
  },
  {
    id: "gal_15",
    category: "food",
    title: "Tandoori Paneer Tikka Charcoal Skewer",
    description: "Charred cottage cheese cubes with bell pepper relish",
    imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "normal"
  },
  {
    id: "gal_16",
    category: "ambience",
    title: "Evening Lanterns & Courtyard Lights",
    description: "Warm brass lighting casting golden reflections as night sets in",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",
    aspectRatio: "wide"
  }
];

export const TEAM_MEMBERS = [
  {
    name: "Chef Vikrant Rao",
    role: "Culinary Director & Head Chef",
    bio: "Trained at Le Cordon Bleu Paris and Taj Luxury Hotels. Vikrant reimagines comfort bistro classics with bold Indian spice heritage and 36-hour sourdough mastery.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Elena Sen",
    role: "Master Q-Grader & Roaster",
    bio: "Certified by the Specialty Coffee Association. Elena spends three months every year in Chikmagalur and Coorg estate farms collaborating directly with regenerative coffee growers.",
    image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Kabir Dewan",
    role: "Hospitality Lead & Sommelier",
    bio: "With over a decade across boutique European cafes, Kabir ensures that every guest walking into Cafe Aroma experiences unhurried warmth and genuine personalized care.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  }
];

export const CAFE_FAQS = [
  {
    q: "Do I need to book a table in advance?",
    a: "Walk-ins are always warmly welcomed! However, for Friday evenings, weekends, and holidays, we highly recommend booking a table online to guarantee your preferred seating area without any wait time."
  },
  {
    q: "Is there high-speed Wi-Fi and power outlets for working?",
    a: "Yes! We offer enterprise-grade 300Mbps fiber Wi-Fi throughout the cafe. Our indoor salon and courtyard are equipped with designated power outlets at nearly every table."
  },
  {
    q: "Are pets allowed at Cafe Aroma?",
    a: "Yes! Our outdoor botanical courtyard is 100% pet-friendly. We provide complimentary fresh water bowls and house-baked peanut butter oat treats for our furry friends."
  },
  {
    q: "Do you have vegan, gluten-friendly, and keto options?",
    a: "Absolutely. Over 40% of our menu is vegetarian or vegan-friendly. We offer barista oat milk, almond milk, gluten-free sourdough crusts upon request, and dairy-free desserts clearly labeled on our menu."
  },
  {
    q: "Can I host a private party or corporate workshop at Cafe Aroma?",
    a: "Yes, we host private dining, corporate strategy lunches, cupping workshops, and intimate celebrations. Please fill out our contact form or email us at events@cafearoma.com for custom packages."
  },
  {
    q: "Where can I park my car?",
    a: "We offer complimentary valet parking right in front of 12 Heritage Lane, Inner Circle. In addition, Connaught Place multi-level underground parking is just a 2-minute walk away."
  }
];

export const TABLES = [
  { id: "table_1", number: 1, capacity: 2, area: "Window Alcove", description: "Intimate window nook overlooking Heritage Lane" },
  { id: "table_2", number: 2, capacity: 2, area: "Window Alcove", description: "Sunlit corner for couples and quiet conversations" },
  { id: "table_3", number: 3, capacity: 2, area: "Indoor Salon", description: "Cozy bistro table beside the library bookshelves" },
  { id: "table_4", number: 4, capacity: 2, area: "Indoor Salon", description: "Quiet reading corner with plush leather armchairs" },
  { id: "table_5", number: 5, capacity: 4, area: "Courtyard Patio", description: "Under the botanical glass canopy with garden views" },
  { id: "table_6", number: 6, capacity: 4, area: "Courtyard Patio", description: "Sunlit garden table surrounded by fresh potted herbs" },
  { id: "table_7", number: 7, capacity: 4, area: "Courtyard Patio", description: "Central courtyard table with direct garden breeze" },
  { id: "table_8", number: 8, capacity: 4, area: "Indoor Salon", description: "Spacious booth adjacent to the copper espresso bar" },
  { id: "table_9", number: 9, capacity: 4, area: "Indoor Salon", description: "Warm wooden table perfect for family lunches" },
  { id: "table_10", number: 10, capacity: 4, area: "Window Alcove", description: "Panoramic view of Connaught Place historic colonnade" },
  { id: "table_11", number: 11, capacity: 6, area: "Courtyard Patio", description: "Long rustic teakwood table for friendly gatherings" },
  { id: "table_12", number: 12, capacity: 6, area: "Indoor Salon", description: "Central banquet table under brass pendant fixtures" },
  { id: "table_13", number: 13, capacity: 8, area: "Private Salon", description: "Dedicated private dining salon for celebrations" },
  { id: "table_14", number: 14, capacity: 8, area: "Courtyard Patio", description: "Large outdoor conservatory table for grand brunches" }
];
