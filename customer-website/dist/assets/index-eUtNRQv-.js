(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function a(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=a(i);fetch(i.href,r)}})();const s={id:"cafe_aroma_01",name:"Cafe Aroma",tagline:"Artisanal Brews & Fresh Bites",subTagline:"Single-origin roasts, 36-hour sourdough, and warm hospitality in the heart of Connaught Place.",foundedYear:2018,address:{street:"12 Heritage Lane, Inner Circle",locality:"Connaught Place",city:"New Delhi",state:"Delhi",pincode:"110001",country:"India",full:"12 Heritage Lane, Connaught Place, New Delhi 110001",mapCoordinates:{lat:28.6328,lng:77.2197},googleMapsUrl:"https://maps.google.com/?q=Connaught+Place+New+Delhi"},contact:{phone:"+91 98765 43210",phoneDisplay:"+91 98765 43210",whatsapp:"+91 98765 43210",whatsappLink:"https://wa.me/919876543210?text=Hello%20Cafe%20Aroma%20team!",email:"hello@cafearoma.com",reservationsEmail:"reservations@cafearoma.com",pressEmail:"press@cafearoma.com"},social:{instagram:"https://instagram.com/cafearomadelhi",facebook:"https://facebook.com/cafearomadelhi",twitter:"https://twitter.com/cafearoma",youtube:"https://youtube.com/cafearoma"},currency:"₹",currencyCode:"INR",taxRate:.05,rating:4.9,reviewsCount:528,amenities:[{icon:"wifi",name:"High-Speed 300Mbps WiFi",desc:"Dedicated work stations with power plugs"},{icon:"coffee",name:"In-House Micro Roastery",desc:"Single-origin beans roasted weekly"},{icon:"paw",name:"Pet Friendly Courtyard",desc:"Water bowls & treats for furry friends"},{icon:"car",name:"Valet & Dedicated Parking",desc:"Safe parking at Inner Circle entrance"},{icon:"leaf",name:"100% Organic Dairy & Produce",desc:"Directly sourced from organic valley farms"},{icon:"heart",name:"Dietary Inclusive",desc:"Vegan, keto, gluten-friendly & nut-free options"}],hours:[{day:"Monday",open:"08:00",close:"23:00",display:"8:00 AM – 11:00 PM"},{day:"Tuesday",open:"08:00",close:"23:00",display:"8:00 AM – 11:00 PM"},{day:"Wednesday",open:"08:00",close:"23:00",display:"8:00 AM – 11:00 PM"},{day:"Thursday",open:"08:00",close:"23:00",display:"8:00 AM – 11:00 PM"},{day:"Friday",open:"08:00",close:"23:30",display:"8:00 AM – 11:30 PM"},{day:"Saturday",open:"07:30",close:"23:30",display:"7:30 AM – 11:30 PM"},{day:"Sunday",open:"07:30",close:"23:00",display:"7:30 AM – 11:00 PM"}]},p={cheese:{id:"addon_cheese",name:"Extra Melted Aged Cheese",price:40},spicy:{id:"addon_spicy",name:"Chef's Peri Peri Seasoning",price:20},dip:{id:"addon_dip",name:"Roasted Garlic Truffle Aioli",price:30},gelato:{id:"addon_gelato",name:"Scoop of Tahitian Vanilla Gelato",price:50},oatmilk:{id:"addon_oatmilk",name:"Substitute Barista Oat Milk",price:35},syrup:{id:"addon_hazelnut",name:"Roasted Hazelnut Syrup Shot",price:25},egg:{id:"addon_egg",name:"Organic Poached Egg",price:35},avocado:{id:"addon_avocado",name:"Hass Avocado Slices",price:60}},le=[{id:"item_paneer_tikka",categoryId:"cat_starters",name:"Tandoori Paneer Tikka",description:"Fresh cottage cheese marinated in Kashmiri spices and Greek yogurt, charred to smoky perfection in our clay oven with bell peppers.",price:299,isVeg:!0,isAvailable:!0,rating:4.9,reviewsCount:142,prepTime:"15-18 mins",calories:"340 kcal",imageUrl:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",tags:["Bestseller","Tandoori Special","Gluten-Free"],ingredients:["Farm Fresh Paneer","Greek Yogurt","Kashmiri Chili","Bell Peppers","Mint Chutney","Chaat Masala"],allergens:["Dairy"],addons:[p.cheese,p.dip,p.spicy]},{id:"item_peri_peri_fries",categoryId:"cat_starters",name:"Crispy Peri Peri Fries",description:"Hand-cut Idaho potato fries tossed in fiery African bird's eye chili seasoning, served with roasted garlic aioli dip.",price:189,isVeg:!0,isAvailable:!0,rating:4.8,reviewsCount:205,prepTime:"10-12 mins",calories:"280 kcal",imageUrl:"https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",tags:["Staff Pick","Crispy","Vegan Option"],ingredients:["Potatoes","Peri Peri Spices","Garlic Powder","Sea Salt","Parsley"],allergens:[],addons:[p.cheese,p.dip]},{id:"item_chicken_wings",categoryId:"cat_starters",name:"Smoky BBQ Chicken Wings",description:"Tender chicken wings glazed in house hickory-smoked artisanal barbecue sauce, garnished with toasted sesame and scallions.",price:349,isVeg:!1,isAvailable:!0,rating:4.9,reviewsCount:178,prepTime:"15-20 mins",calories:"450 kcal",imageUrl:"https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",tags:["Bestseller","Signature Glaze"],ingredients:["Prime Chicken Wings","Hickory Wood BBQ Sauce","Wild Honey","Toasted Sesame","Spring Onions"],allergens:["Sesame"],addons:[p.dip,p.spicy]},{id:"item_garlic_bread",categoryId:"cat_starters",name:"Herbed Sourdough Garlic Bread",description:"House sourdough baguette toasted with garlic butter, fresh rosemary, thyme, cracked sea salt, and aged parmesan.",price:169,isVeg:!0,isAvailable:!0,rating:4.7,reviewsCount:96,prepTime:"8-10 mins",calories:"220 kcal",imageUrl:"https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=800&q=80",tags:["Wood-Fired","Artisanal Sourdough"],ingredients:["36-hr Fermented Sourdough","Roasted Garlic Butter","Fresh Herbs","Parmigiano-Reggiano"],allergens:["Gluten","Dairy"],addons:[p.cheese,p.spicy]},{id:"item_crispy_corn",categoryId:"cat_starters",name:"Chili Pepper Crispy Corn",description:"Golden sweet corn kernels wok-tossed with spring onions, crushed black pepper, bird's eye chili, and tangy lime zest.",price:219,isVeg:!0,isAvailable:!1,rating:4.6,reviewsCount:84,prepTime:"12 mins",calories:"260 kcal",imageUrl:"https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=800&q=80",tags:["Sold Out Today","Spicy Delight"],ingredients:["American Sweet Corn","Capsicum","Cracked Pepper","Scallions","Kaffir Lime"],allergens:[],addons:[p.spicy]},{id:"item_cottage_cheese_steak",categoryId:"cat_mains",name:"Herb-Crusted Paneer Steak",description:"Thick slab of organic cottage cheese seared with rosemary herbs, served atop creamy saffron polenta, grilled asparagus, and paprika velouté.",price:389,isVeg:!0,isAvailable:!0,rating:4.9,reviewsCount:112,prepTime:"20-25 mins",calories:"480 kcal",imageUrl:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",tags:["Chef's Special","High Protein"],ingredients:["Organic Cottage Cheese","Polenta","Paprika Coulis","Asparagus","Microgreens"],allergens:["Dairy"],addons:[p.cheese,p.avocado]},{id:"item_butter_chicken_tartine",categoryId:"cat_mains",name:"Old Delhi Butter Chicken Tartine",description:"Slow-braised tandoori pulled chicken in velvety tomato-makhani gravy, served open-faced on toasted brioche with pickled baby onions.",price:429,isVeg:!1,isAvailable:!0,rating:5,reviewsCount:230,prepTime:"18-20 mins",calories:"540 kcal",imageUrl:"https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",tags:["Signature Dish","Chef's Masterpiece","Must Try"],ingredients:["Pulled Chicken","San Marzano Makhani Gravy","Toasted Brioche","Kasuri Methi","Micro Cilantro"],allergens:["Gluten","Dairy"],addons:[p.cheese,p.egg]},{id:"item_truffle_mushroom_bowl",categoryId:"cat_mains",name:"Wild Truffle Mushroom Bowl",description:"Pan-roasted porcini, cremini and button mushrooms over garlic brown rice, baby spinach, avocado rose, and black truffle oil drizzle.",price:379,isVeg:!0,isAvailable:!0,rating:4.8,reviewsCount:129,prepTime:"15-18 mins",calories:"390 kcal",imageUrl:"https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",tags:["Plant Forward","Truffle Aroma","Healthy"],ingredients:["Wild Porcini & Cremini","Aromatic Brown Rice","Hass Avocado","White Truffle Oil","Toasted Pine Nuts"],allergens:["Tree Nuts"],addons:[p.cheese,p.avocado]},{id:"item_moroccan_spiced_bowl",categoryId:"cat_mains",name:"Moroccan Spiced Harissa Chicken",description:"Juicy chicken breast marinated in North African harissa, charred and served with herb couscous, roasted bell pepper humous, and pomegranate pearls.",price:439,isVeg:!1,isAvailable:!0,rating:4.8,reviewsCount:167,prepTime:"20-22 mins",calories:"510 kcal",imageUrl:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",tags:["Flavourful","High Protein"],ingredients:["Grilled Chicken Fillet","Couscous","Homemade Harissa","Smoked Hummus","Pomegranate"],allergens:["Gluten"],addons:[p.dip,p.egg]},{id:"item_pan_seared_salmon",categoryId:"cat_mains",name:"Norwegian Pan-Seared Salmon",description:"Crispy skin Atlantic salmon on roasted baby potatoes, buttered sugar snap peas, and caper dill cream reduction.",price:649,isVeg:!1,isAvailable:!1,rating:4.9,reviewsCount:78,prepTime:"22 mins",calories:"560 kcal",imageUrl:"https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",tags:["Catch of the Week","Omega Rich","Premium"],ingredients:["Atlantic Salmon","Baby Potatoes","Dill Caper Sauce","Snap Peas","Lemon Thyme"],allergens:["Fish","Dairy"],addons:[]},{id:"item_bufala_margherita",categoryId:"cat_pizza_pasta",name:"Margherita Con Bufala Pizza",description:"Classic Neapolitan 11-inch crust baked at 450°C with San Marzano DOP tomato sauce, fresh buffalo mozzarella, basil leaves, and EVOO.",price:399,isVeg:!0,isAvailable:!0,rating:4.9,reviewsCount:310,prepTime:"14-16 mins",calories:"680 kcal",imageUrl:"https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",tags:["Wood-Fired","Neapolitan Classic","Bestseller"],ingredients:["36-hr Sourdough","San Marzano DOP Tomatoes","Buffalo Mozzarella","Fresh Basil","Extra Virgin Olive Oil"],allergens:["Gluten","Dairy"],addons:[p.cheese,p.spicy]},{id:"item_truffle_funghi_pizza",categoryId:"cat_pizza_pasta",name:"Truffle & Forest Funghi Pizza",description:"White bianca base with fior di latte, roasted wild mushrooms, caramelized shallots, fresh thyme, and cold-pressed white truffle oil.",price:459,isVeg:!0,isAvailable:!0,rating:5,reviewsCount:198,prepTime:"15-18 mins",calories:"720 kcal",imageUrl:"https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",tags:["Chef's Pick","Gourmet Bianca"],ingredients:["White Sourdough","Fior di Latte","Wild Mushrooms","White Truffle Oil","Thyme"],allergens:["Gluten","Dairy"],addons:[p.cheese]},{id:"item_pepperoni_hot_honey",categoryId:"cat_pizza_pasta",name:"Spicy Pepperoni & Hot Honey",description:"Crispy-edged artisanal pepperoni cups, San Marzano tomato sauce, mozzarella, chili flakes, and hot chili-infused honey drizzle.",price:489,isVeg:!1,isAvailable:!0,rating:4.9,reviewsCount:224,prepTime:"15-18 mins",calories:"790 kcal",imageUrl:"https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",tags:["Bestseller","Sweet & Spicy","Popular"],ingredients:["Slow-ferment Sourdough","Artisanal Pepperoni","Hot Honey","Mozzarella","Calabrian Chili"],allergens:["Gluten","Dairy"],addons:[p.cheese,p.dip]},{id:"item_fettuccine_alfredo",categoryId:"cat_pizza_pasta",name:"Creamy Truffle Fettuccine",description:"Fresh hand-rolled pasta ribbons tossed in aged 24-month Parmigiano-Reggiano cream sauce with roasted garlic and toasted crushed black pepper.",price:389,isVeg:!0,isAvailable:!0,rating:4.8,reviewsCount:145,prepTime:"15-17 mins",calories:"620 kcal",imageUrl:"https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80",tags:["Handmade Pasta","Comfort Food"],ingredients:["Handmade Egg Fettuccine","Aged Parmigiano","Heavy Cream","Black Truffle Essence"],allergens:["Gluten","Dairy","Egg"],addons:[p.cheese,p.spicy]},{id:"item_penne_arrabiata",categoryId:"cat_pizza_pasta",name:"Fiery Penne All'Arrabbiata",description:"Al dente artisanal penne in spicy San Marzano tomato sugo, garlic chips, bird's eye chili, kalamata olives, and fresh basil chiffonade.",price:349,isVeg:!0,isAvailable:!0,rating:4.7,reviewsCount:110,prepTime:"14-16 mins",calories:"450 kcal",imageUrl:"https://images.unsplash.com/photo-1621996346565-e3d5d6281781?auto=format&fit=crop&w=800&q=80",tags:["Spicy","Vegan Friendly"],ingredients:["Artisanal Penne","San Marzano Sugo","Garlic","Bird's Eye Chili","Kalamata Olives"],allergens:["Gluten"],addons:[p.cheese]},{id:"item_single_origin_pourover",categoryId:"cat_beverages",name:"Chikmagalur Single-Origin Pour Over",description:"Hand-poured using V60 dripper. Estate beans from Chikmagalur hills with notes of candied orange, dark chocolate, and jasmine florality.",price:210,isVeg:!0,isAvailable:!0,rating:5,reviewsCount:260,prepTime:"6-8 mins",calories:"5 kcal",imageUrl:"https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",tags:["Signature Coffee","Single Origin","Specialty SCA 86+"],ingredients:["100% Arabica Chikmagalur Estate Beans","Filtered Mountain Spring Water"],allergens:[],addons:[p.oatmilk,p.syrup]},{id:"item_spanish_iced_latte",categoryId:"cat_beverages",name:"Velvet Spanish Iced Latte",description:"Double ristretto shot pulled over sweetened condensed milk, velvety chilled whole milk, and crushed crystalline ice.",price:240,isVeg:!0,isAvailable:!0,rating:4.9,reviewsCount:340,prepTime:"5 mins",calories:"210 kcal",imageUrl:"https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",tags:["Top Bestseller","Iced Special","Creamy"],ingredients:["Espresso Blend","Condensed Milk","Fresh Whole Milk","Ice"],allergens:["Dairy"],addons:[p.oatmilk,p.syrup]},{id:"item_classic_flat_white",categoryId:"cat_beverages",name:"Artisanal Flat White",description:"Silky microfoam poured delicately over a dense double shot of medium-roast house blend with intricate latte art.",price:195,isVeg:!0,isAvailable:!0,rating:4.9,reviewsCount:195,prepTime:"4-5 mins",calories:"120 kcal",imageUrl:"https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80",tags:["Barista Favorite","Latte Art"],ingredients:["Double Ristretto","Steamed Whole Milk"],allergens:["Dairy"],addons:[p.oatmilk,p.syrup]},{id:"item_cold_brew_tonic",categoryId:"cat_beverages",name:"Citrus Cold Brew Tonic",description:"18-hour cold steeped coffee topped with botanical elderflower tonic water, dehydrated grapefruit wheel, and fresh rosemary sprig.",price:230,isVeg:!0,isAvailable:!0,rating:4.8,reviewsCount:120,prepTime:"4 mins",calories:"45 kcal",imageUrl:"https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",tags:["Refreshing","Botanical","Summer Tonic"],ingredients:["18-hr Slow Cold Brew","Indian Tonic Water","Grapefruit Slice","Rosemary"],allergens:[],addons:[]},{id:"item_belgian_hot_chocolate",categoryId:"cat_beverages",name:"70% Belgian Dark Hot Chocolate",description:"Melted Callebaut Belgian dark chocolate couverture simmered with creamy milk, topped with toasted marshmallow fluff and cocoa dust.",price:260,isVeg:!0,isAvailable:!0,rating:4.9,reviewsCount:280,prepTime:"6-8 mins",calories:"320 kcal",imageUrl:"https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",tags:["Decadent","Callebaut 70%","Cozy Winter Warmth"],ingredients:["70% Callebaut Dark Chocolate","Full Cream Milk","Vanilla Extract","Marshmallows"],allergens:["Dairy"],addons:[p.gelato,p.oatmilk]},{id:"item_hibiscus_berry_tea",categoryId:"cat_beverages",name:"Wild Hibiscus Berry Iced Tea",description:"Organic Egyptian hibiscus flowers steeped with wild blueberries, mint sprigs, raw clover honey, and chilled soda splash.",price:190,isVeg:!0,isAvailable:!0,rating:4.7,reviewsCount:88,prepTime:"4 mins",calories:"60 kcal",imageUrl:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",tags:["Caffeine Free","Antioxidant Rich","Crisp"],ingredients:["Organic Dried Hibiscus","Wild Berries","Raw Honey","Mint","Soda"],allergens:[],addons:[]},{id:"item_chocolate_fondant",categoryId:"cat_desserts",name:"Warm Valrhona Molten Fondant",description:"Rich French dark chocolate cake with a warm flowing lava center, served with a scoop of Madagascar vanilla bean gelato and berry compote.",price:290,isVeg:!0,isAvailable:!0,rating:5,reviewsCount:320,prepTime:"12-14 mins",calories:"480 kcal",imageUrl:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",tags:["Chef's Signature","Warm Lava","Must Have"],ingredients:["Valrhona 72% Chocolate","Organic Butter","Madagascar Vanilla Gelato","Fresh Raspberry Sauce"],allergens:["Dairy","Gluten","Egg"],addons:[p.gelato]},{id:"item_classic_tiramisu",categoryId:"cat_desserts",name:"Traditional Venetian Tiramisu",description:"Italian savoiardi ladyfingers soaked in freshly brewed espresso and amaretto, layered with cloud-like mascarpone zabaglione and Dutch cocoa.",price:275,isVeg:!0,isAvailable:!0,rating:4.9,reviewsCount:240,prepTime:"Immediate",calories:"410 kcal",imageUrl:"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",tags:["Italian Classic","Fresh Daily"],ingredients:["Savoiardi Biscuits","Espresso","Mascarpone","Cocoa Powder","Vanilla"],allergens:["Dairy","Gluten","Egg"],addons:[p.gelato]},{id:"item_wild_berry_cheesecake",categoryId:"cat_desserts",name:"New York Wild Berry Cheesecake",description:"Velvety baked Philadelphia cream cheese on a buttery graham cracker crust, topped with homemade wild blackberry and raspberry glaze.",price:285,isVeg:!0,isAvailable:!0,rating:4.8,reviewsCount:165,prepTime:"Immediate",calories:"430 kcal",imageUrl:"https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",tags:["Baked In-House","Creamy Perfection"],ingredients:["Philadelphia Cream Cheese","Graham Crackers","Blackberry Compote","Madagascar Vanilla"],allergens:["Dairy","Gluten"],addons:[p.gelato]},{id:"item_cinnamon_brioche_roll",categoryId:"cat_desserts",name:"Warm Cinnamon Brioche Roll",description:"Freshly baked morning brioche swirl infused with Ceylon cinnamon butter, smothered in warm cream cheese frosting and toasted pecans.",price:185,isVeg:!0,isAvailable:!0,rating:4.8,reviewsCount:190,prepTime:"5 mins (Warmed)",calories:"360 kcal",imageUrl:"https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",tags:["Morning Bake","Fresh at 8AM"],ingredients:["Brioche Dough","Ceylon Cinnamon","Brown Sugar","Cream Cheese Glaze","Pecans"],allergens:["Gluten","Dairy","Tree Nuts"],addons:[p.gelato]},{id:"item_matcha_basque_cheesecake",categoryId:"cat_desserts",name:"Uji Matcha Basque Burnt Cheesecake",description:"Caramelized charred exterior with an oozy matcha green tea center made with ceremonial grade tea imported from Uji, Kyoto.",price:310,isVeg:!0,isAvailable:!0,rating:4.9,reviewsCount:140,prepTime:"Immediate",calories:"390 kcal",imageUrl:"https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&w=800&q=80",tags:["Ceremonial Matcha","Gluten-Free Option"],ingredients:["Uji Ceremonial Matcha","Cream Cheese","Heavy Cream","Organic Eggs"],allergens:["Dairy","Egg"],addons:[p.gelato]}],ce=[{id:"offer_morning_brew",title:"Morning Roastery Rush",tagline:"Start your sunrise with artisanal craft",code:"MORNING20",discountPercent:20,discountDisplay:"20% OFF",validDays:"Mon – Fri",validHours:"8:00 AM – 11:00 AM",validUntil:"2026-12-31",description:"Enjoy a flat 20% discount on all single-origin pour overs, espresso lattes, and fresh bakery pastries every weekday morning.",terms:["Valid on dine-in orders placed between 8:00 AM and 11:00 AM","Applicable across Coffee & Desserts categories","Cannot be clubbed with other promotional discount vouchers"],isActive:!0,minSpend:250,badge:"Sunrise Special",bgGradient:"linear-gradient(135deg, #1B382B 0%, #0B2018 100%)"},{id:"offer_pizza_duo",title:"Artisanal Pizza & Sourdough Fest",tagline:"Buy 1 Gourmet Pizza, get 50% off on second",code:"PIZZA50",discountPercent:50,discountDisplay:"50% OFF 2ND",validDays:"All Days",validHours:"12:00 PM – 10:30 PM",validUntil:"2026-11-30",description:"Order any artisanal wood-fired sourdough pizza and get the second pizza at half price! Perfect for pairs and pizza lovers.",terms:["Discount applies to the pizza of equal or lesser value","Available for both dine-in and takeaway","Max discount ₹250 per transaction"],isActive:!0,minSpend:600,badge:"Dinner Crowd Favorite",bgGradient:"linear-gradient(135deg, #3C2214 0%, #1A0D08 100%)"},{id:"offer_weekend_brunch",title:"Connaught Weekend High-Tea & Brunch",tagline:"Flat ₹200 off on our signature High-Tea Platter",code:"HIGHTEA200",discountAmount:200,discountDisplay:"₹200 OFF",validDays:"Saturday & Sunday",validHours:"3:00 PM – 7:00 PM",validUntil:"2026-12-31",description:"Indulge in our 3-tier High-Tea tower with savory finger tartines, freshly baked scones with clotted cream, and unlimited pot of premium tea.",terms:["Valid exclusively on Saturdays and Sundays between 3:00 PM and 7:00 PM","Prior table reservation recommended","Minimum party of 2 guests"],isActive:!0,minSpend:850,badge:"Weekend Luxury",bgGradient:"linear-gradient(135deg, #2D271E 0%, #16120C 100%)"},{id:"offer_work_perk",title:"Remote Work & Creator Sanctuary",tagline:"Unlimited brewed coffee refills on any sandwich or main",code:"WORKBREW",discountDisplay:"FREE REFILLS",validDays:"Mon – Thu",validHours:"10:00 AM – 6:00 PM",validUntil:"2026-10-31",description:"Work comfortably from our sunlit greenhouse patio with 300Mbps WiFi and power outlets. Order any lunch plate or sandwich and receive unlimited batch brew coffee refills.",terms:["Valid on house batch brew and Americano refills","Applies per individual guest ordering a qualifying main plate","Available during weekday work hours"],isActive:!0,minSpend:350,badge:"Co-Work Friendly",bgGradient:"linear-gradient(135deg, #1A2820 0%, #0E1612 100%)"},{id:"offer_celebration_dessert",title:"Chef's Celebration Sweet Treat",tagline:"Complimentary Molten Fondant on bookings of 4+ guests",code:"CELEBRATE",discountDisplay:"FREE DESSERT",validDays:"All Days",validHours:"All Day",validUntil:"2026-12-31",description:"Celebrating a birthday, anniversary, or reunion? Book a table for 4 or more guests, mention your celebration, and get our signature Valrhona Chocolate Fondant on the house!",terms:["Requires online table reservation for 4 or more guests","Mention coupon code 'CELEBRATE' in reservation notes","One complimentary dessert per registered table booking"],isActive:!0,minSpend:1200,badge:"Party Perk",bgGradient:"linear-gradient(135deg, #2E1B24 0%, #170B11 100%)"},{id:"offer_student_discount",title:"Student & Artist Creative Perk",tagline:"15% off food and beverage all day",code:"CREATIVE15",discountPercent:15,discountDisplay:"15% OFF",validDays:"All Days",validHours:"All Day",validUntil:"2026-12-31",description:"We love empowering students, researchers, and creative freelancers! Flash any valid student or university identity card and enjoy 15% off your entire bill.",terms:["Valid physical or digital student/university ID required at checkout","Maximum discount of ₹180 per visit","Valid for the ID holder's portion"],isActive:!0,minSpend:200,badge:"Student ID Required",bgGradient:"linear-gradient(135deg, #24222E 0%, #100F15 100%)"}],de=[{id:"rev_01",author:"Rhea Singhania",location:"New Delhi",rating:5,date:"2 days ago",relativeTime:"September 2026",avatar:"RS",title:"Best pour over and sourdough in Connaught Place!",review:"Cafe Aroma is easily the most atmospheric cafe in Delhi. The Chikmagalur pour over has unmistakable orange zest notes, and the Truffle Funghi Pizza was out of this world. Fast WiFi, warm acoustic jazz, and wonderful baristas.",verified:!0,favoriteItem:"Chikmagalur Pour Over & Truffle Funghi Pizza"},{id:"rev_02",author:"Arjun Mathur",location:"Gurugram",rating:5,date:"1 week ago",relativeTime:"September 2026",avatar:"AM",title:"Spectacular butter chicken tartine & cozy corner tables",review:"Had a 4-person Sunday brunch here. The Butter Chicken Tartine on toasted brioche is a masterpiece — rich without being heavy. Booking online was effortless and our window table was waiting for us with zero delay. 10/10.",verified:!0,favoriteItem:"Butter Chicken Tartine"},{id:"rev_03",author:"Pooja Vashisht",location:"Noida",rating:5,date:"2 weeks ago",relativeTime:"September 2026",avatar:"PV",title:"A remote worker's dream cafe!",review:"I worked here for 5 hours on Tuesday. Power sockets at every wooden desk, smooth 300Mbps internet, quiet background vibe, and the Barista Oat Milk Spanish Iced Latte kept me energized. They even brought water refills without asking.",verified:!0,favoriteItem:"Spanish Iced Latte"},{id:"rev_04",author:"Devendra Kulkarni",location:"Mumbai (Visiting)",rating:5,date:"3 weeks ago",relativeTime:"September 2026",avatar:"DK",title:"Michelin-level attention to detail",review:"The Valrhona chocolate molten cake with Tahitian gelato is sheer indulgence. The copper and deep forest green interiors make you feel like you stepped into a chic Milanese cafe. Super friendly staff who genuinely know their coffee origins.",verified:!0,favoriteItem:"Warm Valrhona Molten Fondant"},{id:"rev_05",author:"Ananya Deshmukh",location:"South Delhi",rating:5,date:"1 month ago",relativeTime:"August 2026",avatar:"AD",title:"Flawless anniversary dinner experience",review:"Booked a table for our 3rd anniversary. They had placed fresh jasmine flowers on our table and treated us with complimentary dessert! The Neapolitan margherita crust was leopard-spotted and chewy. Thank you team Aroma!",verified:!0,favoriteItem:"Margherita Con Bufala"},{id:"rev_06",author:"Kabir Sengupta",location:"New Delhi",rating:4,date:"1 month ago",relativeTime:"August 2026",avatar:"KS",title:"Top-notch coffee, can get busy on Saturday evenings",review:"The cold brew tonic with grapefruit wheel is super crisp and refreshing. Only advice is to book online in advance for weekend evenings because walk-ins can wait up to 25 minutes. Once seated, everything was smooth.",verified:!0,favoriteItem:"Citrus Cold Brew Tonic"},{id:"rev_07",author:"Meera Nair",location:"Bengaluru",rating:5,date:"1 month ago",relativeTime:"August 2026",avatar:"MN",title:"Real specialty coffee finally done right in CP",review:"As a coffee roaster from Bangalore, I have high standards. Cafe Aroma's V60 technique, water TDS control, and bean freshness rival the finest third-wave roasters in Tokyo and Melbourne. Essential visit.",verified:!0,favoriteItem:"Single-Origin V60 Pour Over"},{id:"rev_08",author:"Tanmay Bansal",location:"Faridabad",rating:5,date:"2 months ago",relativeTime:"July 2026",avatar:"TB",title:"Crispy Peri Peri fries & Smoky BBQ wings were fire!",review:"Came with college buddies. Loved the generous portions and how quickly food arrived. The hot honey pepperoni pizza was a massive hit. Can't wait to return next weekend.",verified:!0,favoriteItem:"Spicy Pepperoni & Hot Honey"}],E=[{id:"gal_01",category:"coffee",title:"Precision V60 Manual Brew",description:"Barista extracting single-origin Chikmagalur Arabica at 93°C",imageUrl:"https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85",aspectRatio:"tall"},{id:"gal_02",category:"food",title:"Wood-Fired Neapolitan Sourdough",description:"Bubbling buffalo mozzarella and San Marzano DOP tomatoes fresh from the oven",imageUrl:"https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=1000&q=85",aspectRatio:"wide"},{id:"gal_03",category:"ambience",title:"Sunlit Botanical Courtyard",description:"Our pet-friendly patio greenhouse with natural skylights and lush palms",imageUrl:"https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85",aspectRatio:"normal"},{id:"gal_04",category:"coffee",title:"Velvet Swan Latte Art",description:"Pouring microfoam over a rich double ristretto blend",imageUrl:"https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=1000&q=85",aspectRatio:"normal"},{id:"gal_05",category:"food",title:"Valrhona Molten Fondant & Tahitian Gelato",description:"Gooey 72% dark chocolate center dusted with organic cocoa powder",imageUrl:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=85",aspectRatio:"tall"},{id:"gal_06",category:"ambience",title:"The Copper Espresso Bar & Library",description:"Custom brass La Marzocco machine set against deep forest emerald tiles",imageUrl:"https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=85",aspectRatio:"wide"},{id:"gal_07",category:"food",title:"Old Delhi Makhani Brioche Tartine",description:"Tender pulled chicken braised in rich tomato-cream reduction",imageUrl:"https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1000&q=85",aspectRatio:"normal"},{id:"gal_08",category:"events",title:"Friday Acoustic Jazz Evenings",description:"Live vinyl & unplugged indie acoustic sessions every Friday at 8PM",imageUrl:"https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1000&q=85",aspectRatio:"normal"},{id:"gal_09",category:"coffee",title:"Cold Drip Slow Extraction Tower",description:"18-hour Dutch cold drip extraction capturing subtle floral aromatics",imageUrl:"https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=85",aspectRatio:"tall"},{id:"gal_10",category:"food",title:"Truffle & Porcini Sourdough Pizza",description:"Wild foraged mushrooms with fior di latte and white truffle oil",imageUrl:"https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=85",aspectRatio:"normal"},{id:"gal_11",category:"ambience",title:"Quiet Reading & Remote Work Alcove",description:"Ergonomic walnut desks, reading lamps, and warm stone interiors",imageUrl:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85",aspectRatio:"wide"},{id:"gal_12",category:"food",title:"Golden Morning Brioche Swirls",description:"Straight from our morning 7AM bake with Ceylon cinnamon",imageUrl:"https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85",aspectRatio:"normal"},{id:"gal_13",category:"coffee",title:"Iced Botanical Spanish Latte",description:"Condensed milk layers with double ristretto and fresh microfoam",imageUrl:"https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1000&q=85",aspectRatio:"tall"},{id:"gal_14",category:"events",title:"Weekend Barista Cupping Sessions",description:"Weekly sensory coffee tasting workshops hosted every Sunday morning",imageUrl:"https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=85",aspectRatio:"wide"},{id:"gal_15",category:"food",title:"Tandoori Paneer Tikka Charcoal Skewer",description:"Charred cottage cheese cubes with bell pepper relish",imageUrl:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1000&q=85",aspectRatio:"normal"},{id:"gal_16",category:"ambience",title:"Evening Lanterns & Courtyard Lights",description:"Warm brass lighting casting golden reflections as night sets in",imageUrl:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",aspectRatio:"wide"}],pe=[{name:"Chef Vikrant Rao",role:"Culinary Director & Head Chef",bio:"Trained at Le Cordon Bleu Paris and Taj Luxury Hotels. Vikrant reimagines comfort bistro classics with bold Indian spice heritage and 36-hour sourdough mastery.",image:"https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80"},{name:"Elena Sen",role:"Master Q-Grader & Roaster",bio:"Certified by the Specialty Coffee Association. Elena spends three months every year in Chikmagalur and Coorg estate farms collaborating directly with regenerative coffee growers.",image:"https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=600&q=80"},{name:"Kabir Dewan",role:"Hospitality Lead & Sommelier",bio:"With over a decade across boutique European cafes, Kabir ensures that every guest walking into Cafe Aroma experiences unhurried warmth and genuine personalized care.",image:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}],me=[{q:"Do I need to book a table in advance?",a:"Walk-ins are always warmly welcomed! However, for Friday evenings, weekends, and holidays, we highly recommend booking a table online to guarantee your preferred seating area without any wait time."},{q:"Is there high-speed Wi-Fi and power outlets for working?",a:"Yes! We offer enterprise-grade 300Mbps fiber Wi-Fi throughout the cafe. Our indoor salon and courtyard are equipped with designated power outlets at nearly every table."},{q:"Are pets allowed at Cafe Aroma?",a:"Yes! Our outdoor botanical courtyard is 100% pet-friendly. We provide complimentary fresh water bowls and house-baked peanut butter oat treats for our furry friends."},{q:"Do you have vegan, gluten-friendly, and keto options?",a:"Absolutely. Over 40% of our menu is vegetarian or vegan-friendly. We offer barista oat milk, almond milk, gluten-free sourdough crusts upon request, and dairy-free desserts clearly labeled on our menu."},{q:"Can I host a private party or corporate workshop at Cafe Aroma?",a:"Yes, we host private dining, corporate strategy lunches, cupping workshops, and intimate celebrations. Please fill out our contact form or email us at events@cafearoma.com for custom packages."},{q:"Where can I park my car?",a:"We offer complimentary valet parking right in front of 12 Heritage Lane, Inner Circle. In addition, Connaught Place multi-level underground parking is just a 2-minute walk away."}],ue=[{id:"table_1",number:1,capacity:2,area:"Window Alcove",description:"Intimate window nook overlooking Heritage Lane"},{id:"table_2",number:2,capacity:2,area:"Window Alcove",description:"Sunlit corner for couples and quiet conversations"},{id:"table_3",number:3,capacity:2,area:"Indoor Salon",description:"Cozy bistro table beside the library bookshelves"},{id:"table_4",number:4,capacity:2,area:"Indoor Salon",description:"Quiet reading corner with plush leather armchairs"},{id:"table_5",number:5,capacity:4,area:"Courtyard Patio",description:"Under the botanical glass canopy with garden views"},{id:"table_6",number:6,capacity:4,area:"Courtyard Patio",description:"Sunlit garden table surrounded by fresh potted herbs"},{id:"table_7",number:7,capacity:4,area:"Courtyard Patio",description:"Central courtyard table with direct garden breeze"},{id:"table_8",number:8,capacity:4,area:"Indoor Salon",description:"Spacious booth adjacent to the copper espresso bar"},{id:"table_9",number:9,capacity:4,area:"Indoor Salon",description:"Warm wooden table perfect for family lunches"},{id:"table_10",number:10,capacity:4,area:"Window Alcove",description:"Panoramic view of Connaught Place historic colonnade"},{id:"table_11",number:11,capacity:6,area:"Courtyard Patio",description:"Long rustic teakwood table for friendly gatherings"},{id:"table_12",number:12,capacity:6,area:"Indoor Salon",description:"Central banquet table under brass pendant fixtures"},{id:"table_13",number:13,capacity:8,area:"Private Salon",description:"Dedicated private dining salon for celebrations"},{id:"table_14",number:14,capacity:8,area:"Courtyard Patio",description:"Large outdoor conservatory table for grand brunches"}],L=(t=100)=>new Promise(e=>setTimeout(e,t)),ge="http://localhost:4000/api";let F=null,j=0;const G={async getCafe(){const t=Date.now();if(F&&t-j<3e3)return{...F};try{const e=await fetch(`${ge}/cafe`,{cache:"no-store"});if(e.ok){const a=await e.json();return F={...s,...a,address:{...s.address,full:a.address||s.address.full},contact:{...s.contact,phone:a.phone||s.contact.phone,phoneDisplay:a.phone||s.contact.phoneDisplay,email:a.email||s.contact.email},hours:a.hours||s.hours},j=t,{...F}}}catch{}return{...s}},async getHours(){return(await this.getCafe()).hours||s.hours},isOpenNow(){var b,w,M,P,B,C;const t=F||s,e=new Date,o=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][e.getDay()],i=(t.hours||s.hours).find(se=>se.day===o);if(!i)return{isOpen:!1,statusText:"Closed",closingTime:""};const r=e.getHours()*60+e.getMinutes(),[c,d]=(i.open||"08:00").split(":").map(Number),[g,v]=(i.close||"23:00").split(":").map(Number),l=c*60+d,u=g*60+v,h=r>=l&&r<u;return{isOpen:h,currentDay:o,hoursToday:i.display,statusText:h?"Open Now":"Closed",closingTime:((w=(b=i.display)==null?void 0:b.split("–")[1])==null?void 0:w.trim())||"11:00 PM",nextOpenText:h?`Closes at ${((P=(M=i.display)==null?void 0:M.split("–")[1])==null?void 0:P.trim())||"11:00 PM"}`:`Opens at ${((C=(B=i.display)==null?void 0:B.split("–")[0])==null?void 0:C.trim())||"8:00 AM"}`}}};function he(){const t=G.isOpenNow();return`
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <header class="site-header" id="site-header">
      <div class="container nav-container">
        <!-- Brand Logo -->
        <a href="#/" class="brand-logo" id="nav-brand-logo" aria-label="Cafe Aroma Home">
          <div class="brand-emblem">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
              <line x1="6" y1="1" x2="6" y2="4"/>
              <line x1="10" y1="1" x2="10" y2="4"/>
              <line x1="14" y1="1" x2="14" y2="4"/>
            </svg>
          </div>
          <div class="brand-text-wrap">
            <span class="brand-name">${s.name}</span>
            <span class="brand-tagline">Artisanal Coffee &amp; Kitchen</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="desktop-nav" aria-label="Primary Navigation">
          <ul class="nav-links">
            <li><a href="#/" class="nav-link" data-route="/">Home</a></li>
            <li><a href="#/menu" class="nav-link" data-route="/menu">Menu</a></li>
            <li><a href="#/about" class="nav-link" data-route="/about">Our Story</a></li>
            <li><a href="#/offers" class="nav-link" data-route="/offers">Offers</a></li>
            <li><a href="#/gallery" class="nav-link" data-route="/gallery">Gallery</a></li>
            <li><a href="#/contact" class="nav-link" data-route="/contact">Location &amp; Contact</a></li>
          </ul>
        </nav>

        <!-- Header Actions -->
        <div class="nav-actions">
          <div class="nav-status-badge" title="${t.hoursToday}">
            <span class="status-dot ${t.isOpen?"open":"closed"}"></span>
            <span>${t.statusText}</span>
          </div>
          <a href="#/reservations" class="btn btn-primary" id="btn-header-book">
            <span>Book a Table</span>
          </a>
          <button class="menu-toggle" id="menu-toggle" aria-label="Open mobile menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  `}function fe(){const t=document.getElementById("site-header");t&&window.addEventListener("scroll",()=>{window.scrollY>30?t.classList.add("scrolled"):t.classList.remove("scrolled")})}function ve(t){const e=document.querySelectorAll(".nav-link, .drawer-link"),a=t.split("?")[0]||"/";e.forEach(o=>{const i=o.getAttribute("data-route");i===a||i!=="/"&&a.startsWith(i)?o.classList.add("active"):o.classList.remove("active")})}function be(){return`
    <div class="drawer-backdrop" id="drawer-backdrop"></div>
    <aside class="mobile-drawer" id="mobile-drawer" aria-label="Mobile Navigation" aria-hidden="true">
      <div class="drawer-header">
        <div class="brand-text-wrap">
          <span class="brand-name" style="color:#FFF;">${s.name}</span>
          <span class="brand-tagline">Connaught Place, Delhi</span>
        </div>
        <button class="drawer-close" id="drawer-close" aria-label="Close mobile menu">&times;</button>
      </div>

      <div class="drawer-body">
        <ul class="drawer-links">
          <li><a href="#/" class="drawer-link" data-route="/">Home <span>&rarr;</span></a></li>
          <li><a href="#/menu" class="drawer-link" data-route="/menu">Menu <span>&rarr;</span></a></li>
          <li><a href="#/about" class="drawer-link" data-route="/about">Our Story <span>&rarr;</span></a></li>
          <li><a href="#/offers" class="drawer-link" data-route="/offers">Current Offers <span>&rarr;</span></a></li>
          <li><a href="#/gallery" class="drawer-link" data-route="/gallery">Photo Gallery <span>&rarr;</span></a></li>
          <li><a href="#/contact" class="drawer-link" data-route="/contact">Location &amp; Contact <span>&rarr;</span></a></li>
        </ul>

        <div style="margin-top:auto; padding-top:16px;">
          <a href="#/reservations" class="btn btn-primary w-full" style="width:100%; text-align:center;">
            Book a Table
          </a>
        </div>
      </div>

      <div class="drawer-footer">
        <div class="drawer-contact-item">
          <span>📞</span>
          <a href="tel:${s.contact.phone}">${s.contact.phoneDisplay}</a>
        </div>
        <div class="drawer-contact-item">
          <span>📍</span>
          <span>${s.address.street}, ${s.address.locality}</span>
        </div>
        <div class="drawer-contact-item">
          <span>⏰</span>
          <span>Open Daily from 8:00 AM</span>
        </div>
      </div>
    </aside>
  `}function ye(){const t=document.getElementById("menu-toggle"),e=document.getElementById("mobile-drawer"),a=document.getElementById("drawer-backdrop"),o=document.getElementById("drawer-close");if(!t||!e||!a)return;function i(){e.classList.add("is-open"),a.classList.add("is-open"),t.classList.add("is-open"),t.setAttribute("aria-expanded","true"),e.setAttribute("aria-hidden","false"),document.body.style.overflow="hidden"}function r(){e.classList.remove("is-open"),a.classList.remove("is-open"),t.classList.remove("is-open"),t.setAttribute("aria-expanded","false"),e.setAttribute("aria-hidden","true"),document.body.style.overflow=""}t.addEventListener("click",()=>{e.classList.contains("is-open")?r():i()}),o&&o.addEventListener("click",r),a.addEventListener("click",r),e.querySelectorAll(".drawer-link, .btn").forEach(c=>{c.addEventListener("click",r)}),document.addEventListener("keydown",c=>{c.key==="Escape"&&e.classList.contains("is-open")&&r()})}class we{constructor(){this.container=null,this.init()}init(){if(typeof document>"u")return;let e=document.getElementById("toast-container");e||(e=document.createElement("div"),e.id="toast-container",e.className="toast-container",document.body.appendChild(e)),this.container=e}show(e,a="info",o=3500){this.container||this.init();const i=document.createElement("div");i.className=`toast toast-${a}`;let r="☕";a==="success"&&(r="✓"),a==="error"&&(r="✕"),i.innerHTML=`
      <span style="font-size:1.1rem; line-height:1;">${r}</span>
      <span class="toast-message">${e}</span>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `,i.querySelector(".toast-close").addEventListener("click",()=>this.dismiss(i)),this.container.appendChild(i),o>0&&setTimeout(()=>this.dismiss(i),o)}dismiss(e){!e||!e.parentNode||(e.style.opacity="0",e.style.transform="translateY(10px)",setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},250))}}const f=new we;function xe(){const t=new Date().getFullYear();return`
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Col 1: Brand & Contact -->
          <div class="footer-col-brand">
            <div class="brand-logo" style="margin-bottom:16px;">
              <div class="brand-emblem">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                  <line x1="6" y1="1" x2="6" y2="4"/>
                  <line x1="10" y1="1" x2="10" y2="4"/>
                  <line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
              </div>
              <div class="brand-text-wrap">
                <span class="brand-name" style="color:#FFF;">${s.name}</span>
                <span class="brand-tagline">Artisanal Coffee &amp; Kitchen</span>
              </div>
            </div>
            <p>${s.tagline}. Single-origin estate roasts, scratch-made sourdough bakes, and soulful moments in Connaught Place.</p>
            <div style="font-size:0.88rem; color:rgba(255,255,255,0.7); display:flex; flex-direction:column; gap:6px;">
              <span>📍 ${s.address.full}</span>
              <span>📞 <a href="tel:${s.contact.phone}" style="color:var(--copper-light);">${s.contact.phoneDisplay}</a></span>
              <span>✉️ <a href="mailto:${s.contact.email}" style="color:var(--copper-light);">${s.contact.email}</a></span>
            </div>
            <div class="footer-social-links">
              <a href="${s.social.instagram}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Instagram">IG</a>
              <a href="${s.social.facebook}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Facebook">FB</a>
              <a href="${s.contact.whatsappLink}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="WhatsApp">WA</a>
            </div>
          </div>

          <!-- Col 2: Quick Links -->
          <div>
            <h4 class="footer-col-title">Explore</h4>
            <ul class="footer-links">
              <li><a href="#/">Home</a></li>
              <li><a href="#/menu">Full Food &amp; Coffee Menu</a></li>
              <li><a href="#/about">Our Story &amp; Roastery</a></li>
              <li><a href="#/offers">Exclusive Offers</a></li>
              <li><a href="#/gallery">Cafe Photo Gallery</a></li>
              <li><a href="#/reservations">Book a Table Online</a></li>
              <li><a href="#/booking-confirmation">Check Booking Status</a></li>
            </ul>
          </div>

          <!-- Col 3: Operating Hours -->
          <div>
            <h4 class="footer-col-title">Opening Hours</h4>
            <div class="footer-hours-list">
              <div class="footer-hours-row">
                <span>Mon – Thu</span>
                <span>8:00 AM – 11:00 PM</span>
              </div>
              <div class="footer-hours-row">
                <span>Friday</span>
                <span>8:00 AM – 11:30 PM</span>
              </div>
              <div class="footer-hours-row">
                <span>Saturday</span>
                <span>7:30 AM – 11:30 PM</span>
              </div>
              <div class="footer-hours-row">
                <span>Sunday</span>
                <span>7:30 AM – 11:00 PM</span>
              </div>
            </div>
            <div style="margin-top:18px; padding:10px 14px; background:rgba(255,255,255,0.06); border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.1); font-size:0.8rem; color:rgba(255,255,255,0.75);">
              ☕ Kitchen last order: 45 mins prior to closing.
            </div>
          </div>

          <!-- Col 4: Newsletter & Club -->
          <div>
            <h4 class="footer-col-title">Aroma Coffee Club</h4>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.65); margin-bottom:14px;">
              Subscribe for secret tasting invitations, seasonal micro-lot bean drops, and 15% off your next visit.
            </p>
            <form id="footer-newsletter-form" onsubmit="window.handleNewsletterSubmit(event)" style="display:flex; flex-direction:column; gap:10px;">
              <input type="email" id="newsletter-email" class="form-input" placeholder="Your email address" required style="background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2); color:#FFFFFF;">
              <button type="submit" class="btn btn-primary btn-sm" style="width:100%;">
                Subscribe to Aroma Club
              </button>
            </form>
          </div>
        </div>

        <!-- Footer Bottom Bar -->
        <div class="footer-bottom">
          <div>
            &copy; ${t} ${s.name}. All rights reserved. Handcrafted with passion in New Delhi.
          </div>
          <div class="footer-bottom-links">
            <a href="#/privacy">Privacy Policy</a>
            <a href="#/terms">Terms &amp; Conditions</a>
            <a href="#/contact">Find Us</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Mobile Fixed Bottom Action Bar -->
    <div class="mobile-bottom-bar" id="mobile-bottom-bar">
      <a href="#/menu" class="btn btn-outline" style="flex:1; padding:10px; font-size:0.88rem;">
        <span>🍽️ View Menu</span>
      </a>
      <a href="#/reservations" class="btn btn-primary" style="flex:1.2; padding:10px; font-size:0.88rem;">
        <span>Book Table</span>
      </a>
    </div>
  `}typeof window<"u"&&(window.handleNewsletterSubmit=function(t){t.preventDefault();const e=document.getElementById("newsletter-email");!e||!e.value||(f.show(`Welcome to Aroma Club, ${e.value}! Check your inbox for your 15% discount voucher.`,"success"),e.value="")});const ke="http://localhost:4000/api";let O=null,Y=0;async function N(){const t=Date.now();if(O&&t-Y<2e3)return O;try{const e=await fetch(`${ke}/menu`,{cache:"no-store"});if(e.ok){const a=await e.json();if(Array.isArray(a)&&a.length>0)return O=a.map(o=>({...o,id:o.id,name:o.name,categoryId:o.categoryId||o.category||"cat_starters",category:o.category||o.categoryId||"Starters",price:Number(o.price),isVeg:o.isVeg!==!1,isAvailable:o.available!==!1&&o.isAvailable!==!1,rating:o.rating||4.8,reviewsCount:o.reviewsCount||120,prepTime:o.prepTime||"10 mins",calories:o.calories||"280 kcal",description:o.description||"",imageUrl:o.imageUrl||"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",tags:o.tags||(o.isPopular?["Bestseller"]:[]),ingredients:o.ingredients||[],allergens:o.allergens||[],addons:o.addons||[]})),Y=t,O}}catch{}return le}const S={async getCategories(){const t=await N(),e=new Map;t.forEach(o=>{const i=o.category||o.categoryId;i&&e.set(i,(e.get(i)||0)+1)});const a=[{id:"all",name:"All Creations",shortName:"All",icon:"sparkles",count:t.length}];for(const[o,i]of e.entries())a.push({id:o,name:o,shortName:o,description:`Freshly prepared ${o.toLowerCase()}`,icon:o.toLowerCase().includes("coffee")?"mug-hot":"utensils",count:i});return a},async getItems({categoryId:t="all",search:e="",isVeg:a=null,sortBy:o="popular",onlyAvailable:i=!1}={}){let r=await N();if(t&&t!=="all"){const c=t.toLowerCase();r=r.filter(d=>(d.category||"").toLowerCase()===c||(d.categoryId||"").toLowerCase()===c)}if(a!=null&&a!=="all"){const c=a===!0||a==="true";r=r.filter(d=>d.isVeg===c)}if(i&&(r=r.filter(c=>c.isAvailable)),e&&e.trim()!==""){const c=e.toLowerCase().trim();r=r.filter(d=>{const g=(d.name||"").toLowerCase().includes(c),v=(d.description||"").toLowerCase().includes(c),l=(d.tags||[]).some(h=>h.toLowerCase().includes(c)),u=(d.ingredients||[]).some(h=>h.toLowerCase().includes(c));return g||v||l||u})}switch(o){case"price-asc":r.sort((c,d)=>c.price-d.price);break;case"price-desc":r.sort((c,d)=>d.price-c.price);break;case"rating":r.sort((c,d)=>(d.rating||0)-(c.rating||0));break;case"popular":default:r.sort((c,d)=>{const g=(c.tags||[]).includes("Bestseller")||!!c.isPopular,v=(d.tags||[]).includes("Bestseller")||!!d.isPopular;return g&&!v?-1:!g&&v?1:(d.rating||0)-(c.rating||0)});break}return[...r]},async getItemById(t){const e=await N(),a=String(t).toLowerCase(),o=e.find(i=>String(i.id).toLowerCase()===a||i.name&&i.name.toLowerCase()===a);return o?{...o}:null}};let x=null,R=new Set;function Ce(){return`
    <div class="modal-backdrop" id="item-detail-modal-backdrop" aria-hidden="true">
      <div class="modal-dialog" style="max-width:760px;" role="dialog" aria-modal="true" aria-labelledby="item-modal-title">
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <div id="modal-diet-indicator"></div>
            <h3 class="modal-title" id="item-modal-title">Item Details</h3>
          </div>
          <button class="modal-close" id="item-modal-close" aria-label="Close modal">&times;</button>
        </div>

        <div class="modal-body" id="item-modal-body">
          <!-- Dynamic Content Loaded Here -->
        </div>

        <div class="modal-footer" id="item-modal-footer">
          <!-- Actions & Live Price Total -->
        </div>
      </div>
    </div>
  `}function $e(){const t=document.getElementById("item-detail-modal-backdrop"),e=document.getElementById("item-modal-close");if(!t)return;function a(){t.classList.remove("is-open"),t.setAttribute("aria-hidden","true"),document.body.style.overflow="",window.location.hash.startsWith("#/menu/")&&(window.location.hash="#/menu")}e&&e.addEventListener("click",a),t.addEventListener("click",i=>{i.target===t&&a()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&t.classList.contains("is-open")&&a()}),window.openItemModal=async function(i){try{const r=await S.getItemById(i);x=r,R=new Set;const c=document.getElementById("item-modal-title"),d=document.getElementById("modal-diet-indicator"),g=document.getElementById("item-modal-body"),v=document.getElementById("item-modal-footer");c&&(c.textContent=r.name),d&&(d.className=r.isVeg?"veg-indicator":"nonveg-indicator",d.title=r.isVeg?"Vegetarian":"Non-Vegetarian"),g.innerHTML=`
        <div class="item-detail-grid">
          <div class="item-detail-img-wrap">
            <img src="${r.imageUrl}" alt="${r.name}" loading="lazy">
            ${r.isAvailable?"":'<div style="position:absolute; inset:0; background:rgba(0,0,0,0.65); color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:700; letter-spacing:0.1em;">CURRENTLY SOLD OUT</div>'}
          </div>

          <div class="item-detail-info">
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
              ${r.tags.map(l=>`<span class="badge badge-copper">${l}</span>`).join("")}
              <span class="badge ${r.isVeg?"badge-veg":"badge-nonveg"}">${r.isVeg?"Pure Veg":"Non-Veg"}</span>
            </div>

            <p class="item-detail-desc">${r.description}</p>

            <div class="item-spec-box">
              <div class="item-spec-item">
                <strong>Prep Time</strong>
                <span>⏱️ ${r.prepTime||"12-15 mins"}</span>
              </div>
              <div class="item-spec-item">
                <strong>Calories</strong>
                <span>🔥 ${r.calories||"350 kcal"}</span>
              </div>
              <div class="item-spec-item">
                <strong>Rating</strong>
                <span>★ ${r.rating} (${r.reviewsCount})</span>
              </div>
            </div>

            <!-- Ingredients -->
            <div style="margin-bottom:18px;">
              <strong style="display:block; font-size:0.8rem; text-transform:uppercase; color:var(--forest); margin-bottom:6px;">Key Ingredients</strong>
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                ${r.ingredients.map(l=>`<span style="font-size:0.8rem; background:var(--bg); border:1px solid var(--border); padding:3px 8px; border-radius:var(--radius-xs);">${l}</span>`).join("")}
              </div>
            </div>

            <!-- Allergens -->
            ${r.allergens&&r.allergens.length>0?`
              <div style="margin-bottom:18px;">
                <strong style="display:block; font-size:0.8rem; text-transform:uppercase; color:var(--nonveg-red); margin-bottom:4px;">Allergen Information</strong>
                <span style="font-size:0.82rem; color:var(--text-secondary);">Contains: ${r.allergens.join(", ")}</span>
              </div>
            `:`
              <div style="margin-bottom:18px;">
                <span style="font-size:0.82rem; color:var(--veg-green); font-weight:500;">✓ No major allergens reported</span>
              </div>
            `}

            <!-- Add-ons Selection -->
            ${r.addons&&r.addons.length>0?`
              <div class="addons-section">
                <div class="addons-title">Customizations &amp; Add-ons</div>
                ${r.addons.map(l=>`
                  <label class="addon-row">
                    <div style="display:flex; align-items:center;">
                      <input type="checkbox" value="${l.id}" data-price="${l.price}" onchange="window.handleModalAddonChange(event)">
                      <span>${l.name}</span>
                    </div>
                    <span style="font-weight:600; color:var(--copper);">+${s.currency}${l.price}</span>
                  </label>
                `).join("")}
              </div>
            `:""}

            <!-- Special Instructions Note -->
            <div>
              <label class="form-label" style="font-size:0.8rem;">Special Preparation Note (Optional)</label>
              <input type="text" class="form-input" id="item-special-notes" placeholder="e.g. Less spicy, extra hot, oat milk..." style="padding:8px 12px; font-size:0.85rem;">
            </div>
          </div>
        </div>
      `,o(),t.classList.add("is-open"),t.setAttribute("aria-hidden","false"),document.body.style.overflow="hidden"}catch(r){console.error(r),f.show("Failed to load item details.","error")}},window.handleModalAddonChange=function(i){const r=i.target.value;i.target.checked?R.add(r):R.delete(r),o()};function o(){const i=document.getElementById("item-modal-footer");if(!i||!x)return;let r=x.price;if(x.addons&&x.addons.forEach(c=>{R.has(c.id)&&(r+=c.price)}),!x.isAvailable){i.innerHTML=`
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
          <div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Current Price</div>
            <div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:var(--text-muted);">${s.currency}${r}</div>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-outline btn-sm" onclick="window.copyItemShareLink('${x.id}')">Share</button>
            <button class="btn btn-secondary disabled" disabled>Sold Out Today</button>
          </div>
        </div>
      `;return}i.innerHTML=`
      <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
        <div>
          <div style="font-size:0.8rem; color:var(--text-muted);">Total with Add-ons</div>
          <div style="font-family:var(--font-serif); font-size:1.45rem; font-weight:700; color:var(--copper);">${s.currency}${r}</div>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-outline btn-sm" onclick="window.copyItemShareLink('${x.id}')">
            🔗 Share
          </button>
          <a href="#/reservations?item=${encodeURIComponent(x.name)}" class="btn btn-primary" onclick="document.getElementById('item-detail-modal-backdrop').classList.remove('is-open')">
            Book Table to Taste
          </a>
        </div>
      </div>
    `}window.copyItemShareLink=function(i){var c;const r=`${window.location.origin}${window.location.pathname}#/menu/${i}`;(c=navigator.clipboard)==null||c.writeText(r).then(()=>f.show("Menu item link copied to clipboard!","success")).catch(()=>f.show(`Share URL: ${r}`,"info"))}}let T=0,$=[...E];function Se(){return`
    <div class="lightbox-overlay" id="lightbox-overlay" aria-hidden="true" role="dialog" aria-label="Photo Preview">
      <button class="lightbox-close-btn" id="lightbox-close" aria-label="Close Lightbox">&times;</button>
      <button class="lightbox-btn lightbox-prev" id="lightbox-prev" aria-label="Previous Image">&#10094;</button>
      <button class="lightbox-btn lightbox-next" id="lightbox-next" aria-label="Next Image">&#10095;</button>

      <div class="lightbox-img-wrap">
        <img src="" alt="" class="lightbox-img" id="lightbox-img">
      </div>

      <div class="lightbox-caption">
        <h4 id="lightbox-title">Image Title</h4>
        <p id="lightbox-desc">Image Description</p>
      </div>
    </div>
  `}function Te(){const t=document.getElementById("lightbox-overlay"),e=document.getElementById("lightbox-close"),a=document.getElementById("lightbox-prev"),o=document.getElementById("lightbox-next"),i=document.getElementById("lightbox-img"),r=document.getElementById("lightbox-title"),c=document.getElementById("lightbox-desc");if(!t)return;function d(){const u=$[T];u&&(i.src=u.imageUrl,i.alt=u.title,r.textContent=u.title,c.textContent=u.description)}function g(){t.classList.remove("is-open"),t.setAttribute("aria-hidden","true"),document.body.style.overflow=""}function v(){T=(T+1)%$.length,d()}function l(){T=(T-1+$.length)%$.length,d()}e&&e.addEventListener("click",g),a&&a.addEventListener("click",l),o&&o.addEventListener("click",v),t.addEventListener("click",u=>{u.target===t&&g()}),document.addEventListener("keydown",u=>{t.classList.contains("is-open")&&(u.key==="Escape"&&g(),u.key==="ArrowRight"&&v(),u.key==="ArrowLeft"&&l())}),window.openLightbox=function(u,h=null){h&&Array.isArray(h)?$=h:$=[...E];const b=$.findIndex(w=>w.id===u);T=b!==-1?b:0,d(),t.classList.add("is-open"),t.setAttribute("aria-hidden","false"),document.body.style.overflow="hidden"}}const Ae="http://localhost:4000/api",D={async getOffers(t=!0){try{const a=await fetch(`${Ae}/offers?onlyActive=${t}`,{cache:"no-store"});if(a.ok){const o=await a.json();if(Array.isArray(o)&&o.length>0)return o.map(i=>({...i,validUntil:i.validUntil||i.endDate,badge:i.discountType==="percentage"?`${i.discountValue}% OFF`:`₹${i.discountValue} OFF`}))}}catch{}const e=new Date;return ce.filter(a=>{if(!t)return!0;const o=new Date(a.validUntil);return a.isActive&&o>=e})},async getOfferByCode(t){if(!t)return null;const e=t.trim().toUpperCase(),o=(await this.getOffers(!1)).find(d=>(d.code||"").toUpperCase()===e);if(!o)return null;const i=new Date,c=new Date(o.validUntil||o.endDate)<i;return{...o,isExpired:c,isValid:(o.status==="Active"||o.isActive)&&!c}}},K="http://localhost:4000/api",Q={async getReviews(){try{const t=await fetch(`${K}/reviews`,{cache:"no-store"});if(t.ok){const e=await t.json();if(Array.isArray(e)&&e.length>0)return e.map(a=>({...a,author:a.author||a.customer||"Guest",review:a.review||a.text||"",rating:Number(a.rating||5)}))}}catch{}return[...de]},async getReviewStats(){const t=await this.getReviews(),e=t.length;if(e===0)return{average:5,count:0,breakdown:{5:100,4:0,3:0,2:0,1:0}};const o=(t.reduce((c,d)=>c+(d.rating||5),0)/e).toFixed(1),i={5:0,4:0,3:0,2:0,1:0};t.forEach(c=>{const d=Math.min(5,Math.max(1,Math.round(c.rating||5)));i[d]=(i[d]||0)+1});const r={5:Math.round(i[5]/e*100),4:Math.round(i[4]/e*100),3:Math.round(i[3]/e*100),2:Math.round(i[2]/e*100),1:Math.round(i[1]/e*100)};return{average:parseFloat(o),count:520+e,breakdown:r}},async addReview({author:t,rating:e,review:a,location:o="New Delhi",favoriteItem:i="Artisanal Coffee"}){if(!t||!t.trim())throw new Error("Please provide your name.");if(!e||e<1||e>5)throw new Error("Please select a rating between 1 and 5 stars.");if(!a||a.trim().length<10)throw new Error("Review must be at least 10 characters long.");const r={author:t.trim(),customer:t.trim(),rating:Number(e),review:a.trim(),text:a.trim(),location:o.trim(),favoriteItem:i.trim()};try{const d=await fetch(`${K}/reviews`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(d.ok)return await d.json()}catch{}const c=t.split(" ").map(d=>d[0]).slice(0,2).join("").toUpperCase()||"CA";return{id:`rev_user_${Date.now()}`,author:t.trim(),customer:t.trim(),location:o.trim(),rating:Number(e),date:"Just now",avatar:c,title:`${e}-Star Experience`,review:a.trim(),text:a.trim(),verified:!0}}},W={async getGalleryImages(t="all"){return await L(120),!t||t==="all"?[...E]:E.filter(e=>e.category===t)},async getPreviewImages(t=6){return await L(80),E.slice(0,t)}};async function Ie(){const[t,e,a,o,i,r,c]=await Promise.all([S.getCategories(),S.getFeaturedItems(4),S.getSignatureDishes(3),D.getOffers(!0),Q.getReviewStats(),Q.getReviews(),W.getPreviewImages(6)]),d=G.isOpenNow(),g=r.slice(0,3),v=o.slice(0,3);return`
    <!-- 1. HERO SECTION -->
    <section class="hero-section" id="hero">
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="hero-badge-wrap">
            <span>✨</span>
            <span>Connaught Place • Open Daily</span>
          </div>

          <h1 class="hero-title">
            Crafted with passion, roasted to <span class="accent">perfection</span>.
          </h1>

          <p class="hero-description">
            Welcome to ${s.name}. A sunlit botanical sanctuary where single-origin Indian coffees meet 36-hour slow fermented sourdough and warm hospitality.
          </p>

          <div class="hero-cta-group">
            <a href="#/menu" class="btn btn-primary btn-lg" id="btn-hero-menu">
              <span>Explore Our Menu</span>
              <span>&rarr;</span>
            </a>
            <a href="#/reservations" class="btn btn-outline-copper btn-lg" id="btn-hero-book" style="color:#FFF; border-color:var(--copper-light);">
              <span>Reserve a Table</span>
            </a>
          </div>

          <!-- Hero Highlights Bar -->
          <div class="hero-stats-row">
            <div class="hero-stat-item">
              <span class="hero-stat-val">4.9 ★</span>
              <span class="hero-stat-label">520+ Reviews</span>
            </div>
            <div class="hero-stat-item">
              <span class="hero-stat-val">36 Hrs</span>
              <span class="hero-stat-label">Wild Sourdough</span>
            </div>
            <div class="hero-stat-item">
              <span class="hero-stat-val">100%</span>
              <span class="hero-stat-label">Single Origin</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-image-frame">
            <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85" alt="Cafe Aroma Ambience and Coffee" loading="eager">
          </div>
          <div class="hero-floating-card">
            <div class="hero-floating-icon">☕</div>
            <div>
              <div class="hero-floating-title">Specialty Pour Over</div>
              <div class="hero-floating-desc">Single-origin Chikmagalur Estate V60</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. LIVE STATUS STRIP -->
    <div style="background:var(--forest-dark); border-bottom:1px solid rgba(255,255,255,0.08); padding:14px 0; color:#FFF; font-size:0.9rem;">
      <div class="container" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="status-dot ${d.isOpen?"open":"closed"}"></span>
          <strong>${d.statusText}:</strong>
          <span style="color:rgba(255,255,255,0.8);">${d.nextOpenText} (Today's Hours: ${d.hoursToday})</span>
        </div>
        <div style="display:flex; gap:18px; font-size:0.85rem;">
          <span>📍 12 Heritage Lane, CP</span>
          <span>📞 <a href="tel:${s.contact.phone}" style="color:var(--copper-light);">${s.contact.phoneDisplay}</a></span>
        </div>
      </div>
    </div>

    <!-- 3. CAFE INTRODUCTION & WHY CHOOSE US -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Our Philosophy</span>
          <h2 class="section-title">An Unhurried Coffee &amp; Culinary Haven</h2>
          <p class="section-subtitle">
            Founded in 2018, Cafe Aroma was envisioned as an antidote to frantic city life. A warm, aesthetic retreat where honest ingredients take center stage.
          </p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:24px; margin-bottom:48px;">
          <div class="card card-hover" style="border-top:3px solid var(--copper);">
            <div style="font-size:2rem; margin-bottom:12px;">🌱</div>
            <h3 style="font-size:1.25rem; margin-bottom:8px;">Farm-Direct Sourcing</h3>
            <p style="font-size:0.92rem;">Direct shade-grown Arabica beans from Chikmagalur estates and organic dairy delivered every morning.</p>
          </div>
          <div class="card card-hover" style="border-top:3px solid var(--copper);">
            <div style="font-size:2rem; margin-bottom:12px;">🥖</div>
            <h3 style="font-size:1.25rem; margin-bottom:8px;">36-Hour Sourdough</h3>
            <p style="font-size:0.92rem;">Naturally leavened daily at 6:00 AM with zero commercial yeast, creating crispy, gut-friendly crusts.</p>
          </div>
          <div class="card card-hover" style="border-top:3px solid var(--copper);">
            <div style="font-size:2rem; margin-bottom:12px;">🌿</div>
            <h3 style="font-size:1.25rem; margin-bottom:8px;">Botanical Courtyard</h3>
            <p style="font-size:0.92rem;">A pet-friendly sunlit glasshouse patio surrounded by tropical ferns, fresh rosemary, and natural breeze.</p>
          </div>
          <div class="card card-hover" style="border-top:3px solid var(--copper);">
            <div style="font-size:2rem; margin-bottom:12px;">⚡</div>
            <h3 style="font-size:1.25rem; margin-bottom:8px;">Remote Work Haven</h3>
            <p style="font-size:0.92rem;">Ergonomic walnut desks, 300Mbps fiber internet, and ample power outlets at every indoor station.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. CATEGORIES SHOWCASE -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Menu Categories</span>
          <h2 class="section-title">What Are You Craving Today?</h2>
          <p class="section-subtitle">From sunrise pour overs to midnight wood-fired sourdough pizzas.</p>
        </div>

        <div class="categories-grid">
          ${t.filter(l=>l.id!=="all").map(l=>`
            <a href="#/menu?category=${l.id}" class="category-card" id="cat-card-${l.id}">
              <div class="category-icon-box">
                ${Me(l.id)}
              </div>
              <h3 class="category-title">${l.shortName||l.name}</h3>
              <span class="category-count">${l.count} handcrafted items</span>
            </a>
          `).join("")}
        </div>

        <div style="text-align:center; margin-top:36px;">
          <a href="#/menu" class="btn btn-outline">
            Browse Complete Interactive Menu &rarr;
          </a>
        </div>
      </div>
    </section>

    <!-- 5. SIGNATURE DISHES SPOTLIGHT -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Chef's Masterpieces</span>
          <h2 class="section-title">Signature Tasting Spotlight</h2>
          <p class="section-subtitle">Dishes crafted with rare technique and celebrated by our regulars.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:32px;">
          ${a.map(l=>`
            <div class="card card-hover" style="overflow:hidden; padding:0; display:flex; flex-direction:column;">
              <div style="height:230px; position:relative; overflow:hidden;">
                <img src="${l.imageUrl}" alt="${l.name}" style="width:100%; height:100%; object-fit:cover;">
                <span class="badge badge-gold" style="position:absolute; top:14px; left:14px;">Signature Choice</span>
                <span class="badge ${l.isVeg?"badge-veg":"badge-nonveg"}" style="position:absolute; top:14px; right:14px;">${l.isVeg?"Veg":"Non-Veg"}</span>
              </div>
              <div style="padding:24px; flex:1; display:flex; flex-direction:column;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                  <h3 style="font-size:1.25rem;">${l.name}</h3>
                  <span style="font-family:var(--font-serif); font-size:1.3rem; font-weight:700; color:var(--copper);">${s.currency}${l.price}</span>
                </div>
                <p style="font-size:0.9rem; margin-bottom:18px; flex:1;">${l.description}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.8rem; color:var(--text-muted);">⏱️ ${l.prepTime} • ★ ${l.rating}</span>
                  <button class="btn btn-primary btn-sm" onclick="window.openItemModal('${l.id}')">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>

    <!-- 6. FEATURED BESTSELLERS -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Guest Favorites</span>
          <h2 class="section-title">Most Loved Creations</h2>
          <p class="section-subtitle">Tried, tested, and ordered on repeat by Delhi's coffee connoisseurs.</p>
        </div>

        <div class="menu-grid">
          ${e.map(l=>`
            <div class="menu-item-card" id="featured-${l.id}">
              <div class="menu-item-image-wrap">
                <img src="${l.imageUrl}" alt="${l.name}" loading="lazy">
                <div class="menu-item-badges">
                  <span class="badge badge-copper">Bestseller</span>
                  <span class="badge ${l.isVeg?"badge-veg":"badge-nonveg"}">${l.isVeg?"Veg":"Non-Veg"}</span>
                </div>
              </div>
              <div class="menu-item-body">
                <div class="menu-item-header">
                  <h3 class="menu-item-name">${l.name}</h3>
                  <span class="menu-item-price">${s.currency}${l.price}</span>
                </div>
                <p class="menu-item-desc">${l.description}</p>
                <div class="menu-item-meta">
                  <span>⏱️ ${l.prepTime}</span>
                  <span>🔥 ${l.calories}</span>
                  <span>★ ${l.rating} (${l.reviewsCount})</span>
                </div>
                <div class="menu-item-footer">
                  <button class="btn btn-outline btn-sm" onclick="window.openItemModal('${l.id}')">
                    Customise &amp; Info
                  </button>
                  <a href="#/reservations?item=${encodeURIComponent(l.name)}" class="btn btn-primary btn-sm">
                    Taste in Cafe
                  </a>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>

    <!-- 7. CURRENT OFFERS PREVIEW -->
    <section class="section section-dark">
      <div class="container">
        <div class="section-header">
          <span class="section-tag" style="color:var(--copper-light);">Special Perks</span>
          <h2 class="section-title" style="color:#FFF;">Exclusive Seasonal Offers</h2>
          <p class="section-subtitle" style="color:rgba(255,255,255,0.7);">Save on your morning brew, group brunches, and celebratory dinners.</p>
        </div>

        <div class="offers-grid">
          ${v.map(l=>`
            <div class="offer-card" style="background:${l.bgGradient};">
              <div>
                <span class="offer-badge">${l.badge}</span>
                <h3 class="offer-title">${l.title}</h3>
                <div class="offer-discount">${l.discountDisplay}</div>
                <p class="offer-desc">${l.description}</p>
              </div>

              <div>
                <div class="offer-voucher-box">
                  <div>
                    <span style="font-size:0.75rem; text-transform:uppercase; color:rgba(255,255,255,0.6); display:block;">Coupon Code</span>
                    <span class="offer-code">${l.code}</span>
                  </div>
                  <button class="btn btn-sm btn-outline-copper" style="color:#FFF; border-color:rgba(255,255,255,0.4);" onclick="window.copyHomeOfferCode('${l.code}')">
                    Copy Code
                  </button>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span class="offer-validity">Valid: ${l.validDays}</span>
                  <a href="#/reservations?code=${l.code}" class="btn btn-sm btn-primary">
                    Book with Offer &rarr;
                  </a>
                </div>
              </div>
            </div>
          `).join("")}
        </div>

        <div style="text-align:center; margin-top:36px;">
          <a href="#/offers" class="btn btn-outline-copper" style="color:#FFF; border-color:rgba(255,255,255,0.4);">
            View All Active Offers &rarr;
          </a>
        </div>
      </div>
    </section>

    <!-- 8. CAFE EXPERIENCE STORYTELLING -->
    <section class="section">
      <div class="container">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:54px; align-items:center;">
          <div style="border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg);">
            <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80" alt="The Coffee Bar" style="width:100%; height:440px; object-fit:cover;">
          </div>
          <div>
            <span class="section-tag">The Experience</span>
            <h2 class="section-title">The Art of the Slow Pour</h2>
            <p style="margin-bottom:18px;">
              Every cup of coffee at Cafe Aroma begins with relationships. We source directly from third-generation estate planters in Karnataka, testing moisture levels, bean density, and roast profiles on our custom copper drum roaster.
            </p>
            <p style="margin-bottom:24px;">
              Whether you are settling in with a book, meeting a creative collaborator, or escaping the Delhi summer heat under our misted patio, our team is dedicated to making you feel genuinely at home.
            </p>
            <div style="display:flex; gap:16px;">
              <a href="#/about" class="btn btn-outline">Read Our Full Story</a>
              <a href="#/gallery" class="btn btn-ghost">View Photo Gallery &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. PHOTO GALLERY PREVIEW -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Visual Moments</span>
          <h2 class="section-title">Moments at Cafe Aroma</h2>
          <p class="section-subtitle">A glimpse into our sunlit corners, artisanal bakes, and vibrant community.</p>
        </div>

        <div class="gallery-grid">
          ${c.map(l=>`
            <div class="gallery-card" onclick="window.openLightbox('${l.id}')">
              <img src="${l.imageUrl}" alt="${l.title}" loading="lazy">
              <div class="gallery-overlay">
                <h4 class="gallery-title">${l.title}</h4>
                <p class="gallery-desc">${l.description}</p>
              </div>
            </div>
          `).join("")}
        </div>

        <div style="text-align:center; margin-top:36px;">
          <a href="#/gallery" class="btn btn-outline">
            Open Full Gallery (16+ Photos) &rarr;
          </a>
        </div>
      </div>
    </section>

    <!-- 10. CUSTOMER REVIEWS & RATING CARD -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Guest Love</span>
          <h2 class="section-title">Stories From Our Community</h2>
          <p class="section-subtitle">Real experiences from our daily guests and coffee lovers.</p>
        </div>

        <div class="reviews-summary-card">
          <div class="rating-big-box">
            <div class="rating-big-num">${i.average}</div>
            <div class="star-rating" style="margin:8px 0; font-size:1.3rem;">★★★★★</div>
            <div style="font-weight:600; color:var(--forest);">Overall Guest Rating</div>
            <div style="font-size:0.85rem; color:var(--text-muted);">${i.count}+ Verified Experiences</div>
          </div>

          <div>
            <div class="rating-bar-row">
              <span style="width:50px;">5 Star</span>
              <div class="rating-bar-track">
                <div class="rating-bar-fill" style="width:${i.breakdown[5]}%;"></div>
              </div>
              <span style="width:40px; text-align:right; font-weight:600;">${i.breakdown[5]}%</span>
            </div>
            <div class="rating-bar-row">
              <span style="width:50px;">4 Star</span>
              <div class="rating-bar-track">
                <div class="rating-bar-fill" style="width:${i.breakdown[4]}%;"></div>
              </div>
              <span style="width:40px; text-align:right; font-weight:600;">${i.breakdown[4]}%</span>
            </div>
            <div class="rating-bar-row">
              <span style="width:50px;">3 Star</span>
              <div class="rating-bar-track">
                <div class="rating-bar-fill" style="width:${i.breakdown[3]}%;"></div>
              </div>
              <span style="width:40px; text-align:right; font-weight:600;">${i.breakdown[3]}%</span>
            </div>
          </div>
        </div>

        <div class="reviews-grid">
          ${g.map(l=>`
            <div class="review-card">
              <div>
                <div class="review-header">
                  <div class="review-avatar">${l.avatar}</div>
                  <div>
                    <div class="review-author-name">${l.author}</div>
                    <div class="review-meta">${l.location} • ${l.date}</div>
                  </div>
                </div>
                <div class="star-rating" style="margin-bottom:8px;">
                  ${"★".repeat(l.rating)}${"☆".repeat(5-l.rating)}
                </div>
                <h4 style="font-size:1.05rem; margin-bottom:6px; color:var(--forest);">${l.title||"Exceptional experience"}</h4>
                <p class="review-body">"${l.review}"</p>
              </div>

              ${l.favoriteItem?`
                <div style="margin-top:12px;">
                  <span class="review-fav-item">❤️ Loves: ${l.favoriteItem}</span>
                </div>
              `:""}
            </div>
          `).join("")}
        </div>
      </div>
    </section>

    <!-- 11. LOCATION & RESERVATION CTA -->
    <section class="section section-dark" style="background:linear-gradient(135deg, var(--forest-dark) 0%, var(--forest) 100%);">
      <div class="container" style="text-align:center; max-width:760px;">
        <span class="section-tag" style="color:var(--copper-light);">Reserve Your Moment</span>
        <h2 class="section-title" style="color:#FFF;">Planning a Date, Brunch or Celebration?</h2>
        <p style="font-size:1.1rem; color:rgba(255,255,255,0.8); margin-bottom:36px; line-height:1.6;">
          Tables during peak weekend hours fill quickly. Book your table in less than 60 seconds with instant table confirmation and zero reservation fees.
        </p>
        <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
          <a href="#/reservations" class="btn btn-primary btn-lg" id="btn-cta-reserve">
            <span>Book a Table Online Now</span>
            <span>&rarr;</span>
          </a>
          <a href="#/contact" class="btn btn-outline-copper btn-lg" style="color:#FFF; border-color:rgba(255,255,255,0.4);">
            <span>Find Us on Map</span>
          </a>
        </div>
      </div>
    </section>
  `}function Me(t){switch(t){case"cat_starters":return"🍟";case"cat_mains":return"🍲";case"cat_pizza_pasta":return"🍕";case"cat_beverages":return"☕";case"cat_desserts":return"🍰";default:return"✨"}}typeof window<"u"&&(window.copyHomeOfferCode=function(t){var e;(e=navigator.clipboard)==null||e.writeText(t).then(()=>f.show(`Coupon code "${t}" copied! Use when booking.`,"success")).catch(()=>f.show(`Coupon: ${t}`,"info"))});let m={categoryId:"all",search:"",isVeg:null,sortBy:"popular",onlyAvailable:!1};async function J(t={}){const e=new URLSearchParams(window.location.hash.split("?")[1]||"");e.get("category")&&(m.categoryId=e.get("category")),e.get("search")&&(m.search=e.get("search"));const[a,o]=await Promise.all([S.getCategories(),S.getItems(m)]);return`
    <!-- Header Banner -->
    <div style="background:var(--forest); color:#FFF; padding:50px 0 40px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Culinary Creations</span>
        <h1 style="color:#FFF; margin-bottom:12px;">The Complete Menu</h1>
        <p style="color:rgba(255,255,255,0.75); max-width:600px; margin:0 auto;">
          Handcrafted artisanal coffee, 36-hour slow-fermented sourdough pizzas, wholesome grain bowls, and decadent bakes.
        </p>
      </div>
    </div>

    <!-- Interactive Menu Section -->
    <section class="section" style="padding-top:36px;">
      <div class="container">
        <!-- Controls & Filters Bar -->
        <div style="background:#FFF; border:1px solid var(--border); border-radius:var(--radius-md); padding:20px; box-shadow:var(--shadow-xs); margin-bottom:32px;">
          <!-- Row 1: Search & Quick Filters -->
          <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; margin-bottom:16px;">
            <!-- Live Search -->
            <div style="flex:1; min-width:240px; position:relative;">
              <input 
                type="text" 
                id="menu-search-input" 
                class="form-input" 
                placeholder="Search food, ingredients, coffee..." 
                value="${Z(m.search)}"
                style="padding-left:40px;"
                oninput="window.handleMenuSearch(this.value)"
              >
              <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted); font-size:1.1rem; pointer-events:none;">🔍</span>
              ${m.search?`
                <button onclick="window.clearMenuSearch()" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); color:var(--text-muted); font-size:1.1rem;">&times;</button>
              `:""}
            </div>

            <!-- Dietary Toggle -->
            <div style="display:flex; background:var(--bg); padding:4px; border-radius:var(--radius-sm); border:1px solid var(--border);">
              <button 
                class="btn btn-sm ${m.isVeg===null?"btn-secondary":"btn-ghost"}" 
                onclick="window.setDietFilter(null)"
                id="diet-filter-all"
              >
                All
              </button>
              <button 
                class="btn btn-sm ${m.isVeg===!0?"btn-secondary":"btn-ghost"}" 
                onclick="window.setDietFilter(true)"
                id="diet-filter-veg"
              >
                🌱 Veg Only
              </button>
              <button 
                class="btn btn-sm ${m.isVeg===!1?"btn-secondary":"btn-ghost"}" 
                onclick="window.setDietFilter(false)"
                id="diet-filter-nonveg"
              >
                🍗 Non-Veg
              </button>
            </div>

            <!-- Sort By Dropdown -->
            <div style="min-width:170px;">
              <select id="menu-sort-select" class="form-select" onchange="window.setMenuSort(this.value)">
                <option value="popular" ${m.sortBy==="popular"?"selected":""}>Sort: Most Popular</option>
                <option value="rating" ${m.sortBy==="rating"?"selected":""}>Sort: Top Rated</option>
                <option value="price-asc" ${m.sortBy==="price-asc"?"selected":""}>Price: Low to High</option>
                <option value="price-desc" ${m.sortBy==="price-desc"?"selected":""}>Price: High to Low</option>
              </select>
            </div>

            <!-- In-Stock Toggle -->
            <label style="display:flex; align-items:center; gap:8px; font-size:0.88rem; cursor:pointer; user-select:none;">
              <input 
                type="checkbox" 
                id="menu-avail-toggle" 
                ${m.onlyAvailable?"checked":""} 
                onchange="window.setMenuAvailOnly(this.checked)"
                style="width:16px; height:16px; accent-color:var(--copper);"
              >
              <span>Available Now</span>
            </label>
          </div>

          <!-- Row 2: Category Filter Pills -->
          <div class="tab-list">
            ${a.map(i=>`
              <button 
                class="tab-btn ${m.categoryId===i.id?"active":""}" 
                id="tab-cat-${i.id}"
                onclick="window.setMenuCategory('${i.id}')"
              >
                <span>${i.shortName||i.name}</span>
                <span class="tab-badge">${i.count}</span>
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Active Filters Indicator / Count -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
          <div style="font-size:0.95rem; color:var(--text-secondary);">
            Showing <strong style="color:var(--forest);">${o.length}</strong> creations
            ${m.categoryId!=="all"?` in <em>${Pe(a,m.categoryId)}</em>`:""}
            ${m.search?` matching "<em>${Z(m.search)}</em>"`:""}
          </div>
          ${m.categoryId!=="all"||m.search||m.isVeg!==null||m.onlyAvailable?`
            <button class="btn btn-ghost btn-sm" onclick="window.resetMenuFilters()" style="color:var(--copper); font-size:0.85rem;">
              Reset Filters ↺
            </button>
          `:""}
        </div>

        <!-- Items Grid or Empty State -->
        <div id="menu-items-container">
          ${te(o)}
        </div>
      </div>
    </section>
  `}function te(t){return t.length===0?`
      <div style="text-align:center; padding:60px 20px; background:#FFF; border:1px solid var(--border); border-radius:var(--radius-md);">
        <div style="font-size:3rem; margin-bottom:16px;">🔍</div>
        <h3 style="margin-bottom:8px;">No matching menu creations found</h3>
        <p style="color:var(--text-muted); margin-bottom:20px;">Try adjusting your search terms or dietary filters.</p>
        <button class="btn btn-outline" onclick="window.resetMenuFilters()">Clear All Filters</button>
      </div>
    `:`
    <div class="menu-grid">
      ${t.map(e=>`
        <article class="menu-item-card ${e.isAvailable?"":"is-unavailable"}" id="menu-card-${e.id}">
          <div class="menu-item-image-wrap" onclick="window.openItemModal('${e.id}')" style="cursor:pointer;">
            <img src="${e.imageUrl}" alt="${e.name}" loading="lazy">
            <div class="menu-item-badges">
              <span class="badge ${e.tags.includes("Bestseller")?"badge-copper":e.tags.includes("Chef's Special")?"badge-gold":"badge-forest"}">
                ${e.tags[0]||"Artisanal"}
              </span>
              <span class="badge ${e.isVeg?"badge-veg":"badge-nonveg"}">
                ${e.isVeg?"Veg":"Non-Veg"}
              </span>
            </div>
          </div>
          <div class="menu-item-body">
            <div class="menu-item-header">
              <h3 class="menu-item-name" onclick="window.openItemModal('${e.id}')" style="cursor:pointer;">
                ${e.name}
              </h3>
              <span class="menu-item-price">${s.currency}${e.price}</span>
            </div>
            <p class="menu-item-desc">${e.description}</p>
            <div class="menu-item-meta">
              <span>⏱️ ${e.prepTime}</span>
              <span>🔥 ${e.calories}</span>
              <span>★ ${e.rating} (${e.reviewsCount})</span>
            </div>
            <div class="menu-item-footer">
              <button class="btn btn-outline btn-sm" onclick="window.openItemModal('${e.id}')" id="btn-info-${e.id}">
                ${e.addons&&e.addons.length>0?"Customise":"View Details"}
              </button>
              ${e.isAvailable?`
                <a href="#/reservations?item=${encodeURIComponent(e.name)}" class="btn btn-primary btn-sm" id="btn-order-${e.id}">
                  Taste in Cafe
                </a>
              `:`
                <button class="btn btn-secondary btn-sm disabled" disabled>
                  Sold Out Today
                </button>
              `}
            </div>
          </div>
        </article>
      `).join("")}
    </div>
  `}function Pe(t,e){const a=t.find(o=>o.id===e);return a?a.name:e}function Z(t){return t?t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}if(typeof window<"u"){let t=null;window.handleMenuSearch=function(a){clearTimeout(t),t=setTimeout(async()=>{m.search=a,await e()},250)},window.clearMenuSearch=async function(){m.search="";const a=document.getElementById("menu-search-input");a&&(a.value=""),await e()},window.setMenuCategory=async function(a){m.categoryId=a,await e()},window.setDietFilter=async function(a){m.isVeg=a,await e()},window.setMenuSort=async function(a){m.sortBy=a,await e()},window.setMenuAvailOnly=async function(a){m.onlyAvailable=a,await e()},window.resetMenuFilters=async function(){m={categoryId:"all",search:"",isVeg:null,sortBy:"popular",onlyAvailable:!1};const a=document.getElementById("menu-search-input");a&&(a.value="");const o=document.getElementById("menu-sort-select");o&&(o.value="popular");const i=document.getElementById("menu-avail-toggle");i&&(i.checked=!1),await e()};async function e(){const a=document.getElementById("menu-items-container");if(!a)return;a.innerHTML='<div style="text-align:center; padding:40px;"><div class="spinner spinner-copper"></div></div>';const o=await S.getItems(m);a.innerHTML=te(o),document.querySelectorAll(".tab-btn").forEach(d=>{d.id===`tab-cat-${m.categoryId}`?d.classList.add("active"):d.classList.remove("active")});const i=document.getElementById("diet-filter-all"),r=document.getElementById("diet-filter-veg"),c=document.getElementById("diet-filter-nonveg");i&&r&&c&&(i.className=`btn btn-sm ${m.isVeg===null?"btn-secondary":"btn-ghost"}`,r.className=`btn btn-sm ${m.isVeg===!0?"btn-secondary":"btn-ghost"}`,c.className=`btn btn-sm ${m.isVeg===!1?"btn-secondary":"btn-ghost"}`)}}async function Be(){return`
    <!-- Header -->
    <div style="background:var(--forest); color:#FFF; padding:60px 0 50px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Our Heritage &amp; Craft</span>
        <h1 style="color:#FFF; margin-bottom:14px;">The Cafe Aroma Story</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:640px; margin:0 auto; font-size:1.1rem;">
          Rooted in a passion for honest ingredients, artisanal roasting, and unhurried hospitality in New Delhi's Connaught Place since ${s.foundedYear}.
        </p>
      </div>
    </div>

    <!-- Chapter 1: The Origin -->
    <section class="section">
      <div class="container">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:54px; align-items:center;">
          <div>
            <span class="section-tag">Chapter One</span>
            <h2 class="section-title">Born From a Love for True Craft</h2>
            <p style="margin-bottom:16px;">
              In 2018, amidst the bustling commercial energy of Connaught Place, we set out to build an intimate sanctuary for people who appreciate exceptional coffee and scratch cooking.
            </p>
            <p style="margin-bottom:16px;">
              We began with a single vintage copper-drum roaster and a dream: to celebrate India's magnificent single-estate coffees that were historically exported rather than cherished locally.
            </p>
            <p>
              Today, Cafe Aroma is a vibrant meeting ground for writers, founders, artists, and families who gather for the aromas of fresh sourdough bread baked at 6:00 AM and specialty pour overs poured with surgical precision.
            </p>
          </div>
          <div style="border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg);">
            <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80" alt="Manual coffee cupping and roasting" style="width:100%; height:420px; object-fit:cover;">
          </div>
        </div>
      </div>
    </section>

    <!-- Chapter 2: The Two Pillars -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Our Dual Passion</span>
          <h2 class="section-title">The Coffee &amp; The Kitchen</h2>
          <p class="section-subtitle">We don't cut corners. From farm soil to your cup and plate.</p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:36px;">
          <!-- Pillar 1: Coffee -->
          <div class="card" style="padding:36px; border-top:4px solid var(--copper);">
            <div style="font-size:2.4rem; margin-bottom:14px;">☕</div>
            <h3 style="font-size:1.4rem; margin-bottom:12px;">Specialty Coffee Philosophy</h3>
            <p style="margin-bottom:16px;">
              We partner exclusively with certified organic, shade-grown estates in the Western Ghats (Chikmagalur, Biligirirangana Hills, and Coorg).
            </p>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:10px; font-size:0.92rem; color:var(--text-secondary);">
              <li>✓ <strong>Micro-Lot Roasting:</strong> Small 5kg batches roasted weekly on site for peak aromatic volatility.</li>
              <li>✓ <strong>Custom Mineral Water:</strong> Water remineralized to 130 TDS for optimal flavor clarity.</li>
              <li>✓ <strong>SCA Certified Baristas:</strong> Every pour over follows strict recipe ratios (1:16 at 93°C).</li>
            </ul>
          </div>

          <!-- Pillar 2: Kitchen -->
          <div class="card" style="padding:36px; border-top:4px solid var(--forest);">
            <div style="font-size:2.4rem; margin-bottom:14px;">🥖</div>
            <h3 style="font-size:1.4rem; margin-bottom:12px;">36-Hour Sourdough Mastery</h3>
            <p style="margin-bottom:16px;">
              Our bread and pizza dough are fermented for 36 hours using a wild sourdough starter lovingly nicknamed <em>"Mother Roma"</em>, nurtured since 2018.
            </p>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:10px; font-size:0.92rem; color:var(--text-secondary);">
              <li>✓ <strong>Zero Commercial Yeast:</strong> Natural lactic acid breakdown creates an easily digestible, airy crumb.</li>
              <li>✓ <strong>San Marzano DOP Tomatoes:</strong> Sun-ripened tomatoes grown in rich volcanic soil for authentic sugo.</li>
              <li>✓ <strong>Farm Fresh Mozzarella:</strong> Artisanal buffalo fior di latte sourced locally from organic dairy farms.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Chapter 3: The Team -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Master Craftsmen</span>
          <h2 class="section-title">Meet the Culinary &amp; Coffee Team</h2>
          <p class="section-subtitle">The passionate artisans shaping your daily sensory experience.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:32px;">
          ${pe.map(t=>`
            <div class="card" style="padding:0; overflow:hidden; display:flex; flex-direction:column;">
              <div style="height:280px; overflow:hidden;">
                <img src="${t.image}" alt="${t.name}" style="width:100%; height:100%; object-fit:cover;">
              </div>
              <div style="padding:24px; flex:1; display:flex; flex-direction:column;">
                <h3 style="font-size:1.2rem; margin-bottom:4px;">${t.name}</h3>
                <span style="font-size:0.84rem; font-weight:600; color:var(--copper); text-transform:uppercase; margin-bottom:12px;">${t.role}</span>
                <p style="font-size:0.9rem; line-height:1.6; color:var(--text-secondary);">${t.bio}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>

    <!-- Chapter 4: Core Brand Values -->
    <section class="section section-dark">
      <div class="container">
        <div class="section-header">
          <span class="section-tag" style="color:var(--copper-light);">Guiding Principles</span>
          <h2 class="section-title" style="color:#FFF;">What We Stand For</h2>
          <p class="section-subtitle" style="color:rgba(255,255,255,0.7);">Our commitment to our guests, our growers, and our craft.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:24px;">
          <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:28px;">
            <div style="font-size:2rem; margin-bottom:12px; color:var(--copper-light);">✨ Craftsmanship</div>
            <h4 style="color:#FFF; margin-bottom:8px;">Uncompromised Quality</h4>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.7);">Every espresso extraction is weighed to 0.1g, and every dough is hand-shaped with care.</p>
          </div>

          <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:28px;">
            <div style="font-size:2rem; margin-bottom:12px; color:var(--copper-light);">🤝 Community</div>
            <h4 style="color:#FFF; margin-bottom:8px;">Warm Inclusive Space</h4>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.7);">A welcoming community hub for quiet reading, remote work, live jazz, and long conversations.</p>
          </div>

          <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:28px;">
            <div style="font-size:2rem; margin-bottom:12px; color:var(--copper-light);">🌿 Sustainability</div>
            <h4 style="color:#FFF; margin-bottom:8px;">Direct &amp; Fair Trade</h4>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.7);">We pay our partner farm estates 35% above fair-trade market price to support regenerative agriculture.</p>
          </div>

          <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:28px;">
            <div style="font-size:2rem; margin-bottom:12px; color:var(--copper-light);">🧡 Hospitality</div>
            <h4 style="color:#FFF; margin-bottom:8px;">Heartfelt Warmth</h4>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.7);">We remember our regulars by name, their favorite brew ratios, and their table preferences.</p>
          </div>
        </div>

        <div style="text-align:center; margin-top:48px;">
          <a href="#/reservations" class="btn btn-primary btn-lg">
            Experience Cafe Aroma in Person &rarr;
          </a>
        </div>
      </div>
    </section>
  `}let z="active";async function Fe(){const[t,e]=await Promise.all([D.getOffers(!0),D.getOffers(!1)]),a=z==="active"?t:e.filter(o=>!o.isActive||new Date(o.validUntil)<new Date);return`
    <div style="background:var(--forest); color:#FFF; padding:60px 0 45px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Special Vouchers</span>
        <h1 style="color:#FFF; margin-bottom:12px;">Exclusive Offers &amp; Perks</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:600px; margin:0 auto; font-size:1.1rem;">
          Enjoy promotional privileges on your morning artisanal coffee, group celebrations, and weekend sourdough dining.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <!-- Offers Filter Tabs -->
        <div style="display:flex; justify-content:center; margin-bottom:36px;">
          <div class="tab-list">
            <button 
              class="tab-btn ${z==="active"?"active":""}" 
              onclick="window.switchOffersTab('active')"
              id="tab-offers-active"
            >
              <span>Active Promotions (${t.length})</span>
            </button>
            <button 
              class="tab-btn ${z==="expired"?"active":""}" 
              onclick="window.switchOffersTab('expired')"
              id="tab-offers-expired"
            >
              <span>Past / Expired Archive</span>
            </button>
          </div>
        </div>

        <div id="offers-list-container">
          ${ae(a)}
        </div>

        <!-- How To Redeem Info Card -->
        <div style="margin-top:60px; background:var(--card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:36px; box-shadow:var(--shadow-xs);">
          <div style="text-align:center; max-width:600px; margin:0 auto 28px;">
            <h3 style="font-size:1.4rem; color:var(--forest); margin-bottom:8px;">How to Redeem Your Perk</h3>
            <p style="font-size:0.92rem; color:var(--text-muted);">Simple steps to apply discounts during your visit or reservation.</p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:24px;">
            <div style="text-align:center;">
              <div style="width:48px; height:48px; border-radius:50%; background:var(--copper-dim); color:var(--copper); font-size:1.3rem; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-weight:700;">1</div>
              <h4 style="font-size:1.05rem; margin-bottom:6px;">Copy Coupon Code</h4>
              <p style="font-size:0.85rem; color:var(--text-secondary);">Click the "Copy Code" button on any active offer card above.</p>
            </div>

            <div style="text-align:center;">
              <div style="width:48px; height:48px; border-radius:50%; background:var(--copper-dim); color:var(--copper); font-size:1.3rem; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-weight:700;">2</div>
              <h4 style="font-size:1.05rem; margin-bottom:6px;">Book Table Online</h4>
              <p style="font-size:0.85rem; color:var(--text-secondary);">Paste the code in the promo box during table reservation checkout.</p>
            </div>

            <div style="text-align:center;">
              <div style="width:48px; height:48px; border-radius:50%; background:var(--copper-dim); color:var(--copper); font-size:1.3rem; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-weight:700;">3</div>
              <h4 style="font-size:1.05rem; margin-bottom:6px;">Show Code at Cafe</h4>
              <p style="font-size:0.85rem; color:var(--text-secondary);">Or show the code directly to your barista or server when ordering at table.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `}function ae(t){return t.length===0?`
      <div style="text-align:center; padding:60px 20px; background:#FFF; border:1px solid var(--border); border-radius:var(--radius-md);">
        <div style="font-size:3rem; margin-bottom:12px;">🎟️</div>
        <h3>No offers found in this category</h3>
        <p style="color:var(--text-muted); margin-bottom:16px;">Check our active promotions tab for current valid discounts.</p>
        <button class="btn btn-outline" onclick="window.switchOffersTab('active')">View Active Offers</button>
      </div>
    `:`
    <div class="offers-grid">
      ${t.map(e=>`
        <div class="offer-card" style="background:${e.bgGradient};">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span class="offer-badge">${e.badge}</span>
              <span style="font-size:0.75rem; color:rgba(255,255,255,0.7);">${e.validDays} • ${e.validHours}</span>
            </div>
            <h3 class="offer-title">${e.title}</h3>
            <div class="offer-discount">${e.discountDisplay}</div>
            <p class="offer-desc">${e.description}</p>
          </div>

          <div>
            <div class="offer-voucher-box">
              <div>
                <span style="font-size:0.75rem; text-transform:uppercase; color:rgba(255,255,255,0.6); display:block;">Promo Code</span>
                <span class="offer-code">${e.code}</span>
              </div>
              <button class="btn btn-sm btn-outline-copper" style="color:#FFF; border-color:rgba(255,255,255,0.4);" onclick="window.copyOfferCode('${e.code}')">
                Copy Code
              </button>
            </div>

            <!-- Terms Details Toggle -->
            <details style="margin-bottom:18px; font-size:0.8rem; color:rgba(255,255,255,0.8); cursor:pointer;">
              <summary style="font-weight:600; color:var(--copper-light); margin-bottom:6px;">View Terms &amp; Conditions</summary>
              <ul style="padding-left:18px; margin-top:6px; display:flex; flex-direction:column; gap:4px; color:rgba(255,255,255,0.7);">
                ${e.terms.map(a=>`<li>${a}</li>`).join("")}
                <li>Valid until ${e.validUntil}</li>
                <li>Minimum spend: ₹${e.minSpend}</li>
              </ul>
            </details>

            <a href="#/reservations?code=${e.code}" class="btn btn-primary w-full" style="width:100%;">
              Book Table with ${e.code} &rarr;
            </a>
          </div>
        </div>
      `).join("")}
    </div>
  `}typeof window<"u"&&(window.copyOfferCode=function(t){var e;(e=navigator.clipboard)==null||e.writeText(t).then(()=>f.show(`Coupon code "${t}" copied to clipboard!`,"success")).catch(()=>f.show(`Code: ${t}`,"info"))},window.switchOffersTab=async function(t){z=t;const e=document.getElementById("offers-list-container");if(!e)return;e.innerHTML='<div style="text-align:center; padding:40px;"><div class="spinner spinner-copper"></div></div>';const[a,o]=await Promise.all([D.getOffers(!0),D.getOffers(!1)]),i=z==="active"?a:o.filter(d=>!d.isActive||new Date(d.validUntil)<new Date);e.innerHTML=ae(i);const r=document.getElementById("tab-offers-active"),c=document.getElementById("tab-offers-expired");r&&c&&(r.classList.toggle("active",t==="active"),c.classList.toggle("active",t==="expired"))});let V="all";async function Ee(){const t=await W.getGalleryImages(V);return`
    <div style="background:var(--forest); color:#FFF; padding:60px 0 45px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Visual Chronicle</span>
        <h1 style="color:#FFF; margin-bottom:12px;">The Cafe Atmosphere</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:600px; margin:0 auto; font-size:1.1rem;">
          Take a sensory tour through our coffee roasting station, hand-stretched pizzas, and sunlit courtyard moments.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <!-- Category Filter Pills -->
        <div style="display:flex; justify-content:center; margin-bottom:36px;">
          <div class="tab-list">
            ${[{id:"all",name:"All Photography"},{id:"coffee",name:"Artisanal Coffee & Roastery"},{id:"food",name:"Sourdough & Culinary"},{id:"ambience",name:"Interiors & Courtyard"},{id:"events",name:"Jazz Evenings & Workshops"}].map(a=>`
              <button 
                class="tab-btn ${V===a.id?"active":""}" 
                id="gallery-tab-${a.id}"
                onclick="window.switchGalleryCategory('${a.id}')"
              >
                ${a.name}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Gallery Grid -->
        <div id="gallery-items-container">
          ${ie(t)}
        </div>
      </div>
    </section>
  `}function ie(t){return`
    <div class="gallery-grid">
      ${t.map(e=>`
        <div class="gallery-card" onclick="window.openLightbox('${e.id}')" role="button" aria-label="Open photo: ${e.title}">
          <img src="${e.imageUrl}" alt="${e.title}" loading="lazy">
          <div class="gallery-overlay">
            <h4 class="gallery-title">${e.title}</h4>
            <p class="gallery-desc">${e.description}</p>
          </div>
        </div>
      `).join("")}
    </div>
  `}typeof window<"u"&&(window.switchGalleryCategory=async function(t){V=t;const e=document.getElementById("gallery-items-container");if(!e)return;e.innerHTML='<div style="text-align:center; padding:40px;"><div class="spinner spinner-copper"></div></div>';const a=await W.getGalleryImages(t);e.innerHTML=ie(a),document.querySelectorAll('[id^="gallery-tab-"]').forEach(o=>{o.classList.toggle("active",o.id===`gallery-tab-${t}`)})});const A="http://localhost:4000/api",oe="cafe_aroma_bookings",q=new Map;function re(){return typeof localStorage<"u"?localStorage:{getItem:t=>q.get(t)||null,setItem:(t,e)=>q.set(t,String(e)),removeItem:t=>q.delete(t)}}function I(){try{const t=re().getItem(oe);return t?JSON.parse(t):[]}catch{return[]}}function _(t){try{re().setItem(oe,JSON.stringify(t))}catch(e){console.error("Failed to save bookings locally:",e)}}const y={getTimeSlots(){return[{time:"08:30",label:"08:30 AM",session:"Breakfast"},{time:"09:30",label:"09:30 AM",session:"Breakfast"},{time:"11:00",label:"11:00 AM",session:"Brunch"},{time:"12:00",label:"12:00 PM",session:"Lunch"},{time:"12:30",label:"12:30 PM",session:"Lunch"},{time:"13:00",label:"01:00 PM",session:"Lunch"},{time:"13:30",label:"01:30 PM",session:"Lunch"},{time:"14:00",label:"02:00 PM",session:"Lunch"},{time:"16:00",label:"04:00 PM",session:"High-Tea"},{time:"17:00",label:"05:00 PM",session:"High-Tea"},{time:"18:30",label:"06:30 PM",session:"Dinner"},{time:"19:00",label:"07:00 PM",session:"Dinner"},{time:"19:30",label:"07:30 PM",session:"Dinner"},{time:"20:00",label:"08:00 PM",session:"Dinner"},{time:"20:30",label:"08:30 PM",session:"Dinner"},{time:"21:00",label:"09:00 PM",session:"Dinner"}]},getSeatingAreas(){return[{id:"any",name:"No Preference (Best Available)",desc:"We will allocate the finest available spot for your party"},{id:"Courtyard Patio",name:"Sunlit Courtyard Patio",desc:"Pet-friendly glass botanical greenhouse with garden vibes"},{id:"Indoor Salon",name:"Main Indoor Salon",desc:"Acoustic jazz, espresso bar aromas & comfortable dining chairs"},{id:"Window Alcove",name:"Heritage Window Alcove",desc:"Cozy scenic nooks overlooking Connaught Place colonnade"},{id:"Private Salon",name:"Private Dining Nook",desc:"Intimate and quiet space for celebrations & gatherings (6+ guests)"}]},async checkAvailability({date:t,time:e,guests:a,area:o="any"}){await L(120);const i=parseInt(a,10);if(!i||i<1||i>20)return{available:!1,message:"Bookings support parties between 1 and 20 guests."};try{const r=await fetch(`${A}/bookings?date=${encodeURIComponent(t)}`,{cache:"no-store"});if(r.ok&&(await r.json()).filter(g=>g.time===e&&g.status!=="Cancelled").length>=10)return{available:!1,message:`No tables currently available for ${i} guests at ${e} on ${t}.`}}catch{}return{available:!0,message:"Table confirmed available! We have reserved seating for your party.",table:{id:"T-04",number:4,area:o==="any"?"Main Dining":o}}},async createBooking(t){const{name:e,phone:a,email:o="",date:i,time:r,guests:c,area:d="any",specialRequest:g="",couponCode:v=""}=t;if(!e||e.trim().length<2)throw new Error("Please enter your full name.");if(!a||a.trim().length<8)throw new Error("Please enter a valid contact phone number.");if(!i)throw new Error("Please select a date.");if(!r)throw new Error("Please select a time slot.");const l={name:e.trim(),phone:a.trim(),email:o.trim(),date:i,time:r,guests:parseInt(c,10),area:d,specialRequests:g.trim(),couponCode:v.trim().toUpperCase(),channel:"Customer Web"};try{const u=await fetch(`${A}/bookings`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)});if(u.ok){const h=await u.json(),b=I();return b.unshift(h),_(b),h}else{const h=await u.json();throw new Error(h.error||"Failed to create booking")}}catch(u){if(u.message&&!u.message.includes("Failed to fetch"))throw u;const b={id:`BK-${Math.floor(1e4+Math.random()*9e4)}`,customerName:e.trim(),name:e.trim(),phone:a.trim(),email:o.trim(),date:i,time:r,guests:parseInt(c,10),area:d==="any"?"Main Dining":d,tableId:"T-04",tableNumber:4,table:"Table 4",specialRequests:g.trim(),specialRequest:g.trim(),status:"Confirmed",createdAt:new Date().toISOString()},w=I();return w.unshift(b),_(w),b}},async getBooking(t){if(!t)return null;const e=t.trim();try{const o=await fetch(`${A}/bookings/${encodeURIComponent(e)}`,{cache:"no-store"});if(o.ok){const i=await o.json();return{...i,customerName:i.customerName||i.name,specialRequest:i.specialRequest||i.specialRequests,tableNumber:i.tableNumber||(i.table?parseInt(i.table.replace(/[^0-9]/g,""),10):1)}}}catch{}return I().find(o=>(o.id||"").toUpperCase()===e.toUpperCase())||null},async findBookingsByPhone(t){if(!t)return[];try{const o=await fetch(`${A}/bookings?phone=${encodeURIComponent(t)}`,{cache:"no-store"});if(o.ok)return await o.json()}catch{}const e=t.replace(/[^0-9]/g,"");return I().filter(o=>(o.phone||"").replace(/[^0-9]/g,"").includes(e))},async updateBooking(t,e){try{const i=await fetch(`${A}/bookings/${encodeURIComponent(t)}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(i.ok)return await i.json()}catch{}const a=I(),o=a.findIndex(i=>(i.id||"").toUpperCase()===t.toUpperCase());if(o!==-1)return a[o]={...a[o],...e,updatedAt:new Date().toISOString()},_(a),a[o];throw new Error(`Booking ${t} not found`)},async cancelBooking(t,e="Customer requested cancellation"){try{const i=await fetch(`${A}/bookings/${encodeURIComponent(t)}/cancel`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reason:e})});if(i.ok)return await i.json()}catch{}const a=I(),o=a.findIndex(i=>(i.id||"").toUpperCase()===t.toUpperCase());if(o!==-1)return a[o].status="Cancelled",a[o].cancellationReason=e,a[o].cancelledAt=new Date().toISOString(),_(a),a[o];throw new Error(`Booking ${t} not found`)}};let n={step:1,guests:2,date:"",time:"19:30",area:"any",name:"",phone:"",email:"",specialRequest:"",occasion:"Casual Dining",couponCode:"",isChecking:!1,errorMsg:""};async function ze(t={}){const e=new URLSearchParams(window.location.hash.split("?")[1]||"");if(e.get("code")&&(n.couponCode=e.get("code")),e.get("item")&&(n.specialRequest=`Requesting to taste: ${e.get("item")}`),!n.date){const r=new Date().toISOString().split("T")[0];n.date=r}const a=y.getTimeSlots(),o=y.getSeatingAreas(),i=new Date().toISOString().split("T")[0];return`
    <div style="background:var(--forest); color:#FFF; padding:60px 0 45px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Table Reservations</span>
        <h1 style="color:#FFF; margin-bottom:12px;">Reserve Your Experience</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:600px; margin:0 auto; font-size:1.1rem;">
          Instant table confirmation with real-time seat availability. Zero booking fee, free cancellation anytime.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container booking-container">
        <div class="booking-card">
          <!-- Step Progress Indicator -->
          <div class="booking-steps-bar">
            <div class="booking-step-node ${n.step===1?"active":n.step>1?"completed":""}" onclick="window.goToBookingStep(1)">
              <div class="step-circle">${n.step>1?"✓":"1"}</div>
              <span class="step-label">Party &amp; Date</span>
            </div>
            <div class="booking-step-node ${n.step===2?"active":n.step>2?"completed":""}" onclick="window.goToBookingStep(2)">
              <div class="step-circle">${n.step>2?"✓":"2"}</div>
              <span class="step-label">Time &amp; Area</span>
            </div>
            <div class="booking-step-node ${n.step===3?"active":n.step>3?"completed":""}" onclick="window.goToBookingStep(3)">
              <div class="step-circle">${n.step>3?"✓":"3"}</div>
              <span class="step-label">Guest Details</span>
            </div>
            <div class="booking-step-node ${n.step===4?"active":""}">
              <div class="step-circle">4</div>
              <span class="step-label">Confirm</span>
            </div>
          </div>

          <!-- Error Alert Banner -->
          <div id="booking-error-box" style="display:${n.errorMsg?"block":"none"}; background:var(--nonveg-red-bg); border:1px solid var(--nonveg-red-border); color:var(--nonveg-red); padding:12px 16px; border-radius:var(--radius-sm); margin-bottom:24px; font-weight:500; font-size:0.92rem;">
            ${n.errorMsg}
          </div>

          <!-- Form Content Container -->
          <div id="booking-step-content">
            ${ne(a,o,i)}
          </div>
        </div>

        <!-- Check Existing Booking Banner -->
        <div style="text-align:center; margin-top:32px; font-size:0.92rem; color:var(--text-muted);">
          Already have a reservation with us? 
          <a href="#/booking-confirmation" style="color:var(--copper); font-weight:600; text-decoration:underline;">
            Look up your booking status or modify details &rarr;
          </a>
        </div>
      </div>
    </section>
  `}function ne(t,e,a){return n.step===1?`
      <div>
        <h3 style="margin-bottom:20px; color:var(--forest);">Step 1: Party Size &amp; Date</h3>

        <!-- Guest Count Selector -->
        <div class="form-group">
          <label class="form-label">Number of Guests</label>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            ${[1,2,3,4,5,6,8,10].map(o=>`
              <button 
                type="button"
                class="btn ${n.guests===o?"btn-secondary":"btn-outline"}" 
                style="min-width:54px; height:48px; border-radius:var(--radius-sm);"
                onclick="window.selectBookingGuests(${o})"
              >
                ${o} ${o===1?"Guest":"Guests"}
              </button>
            `).join("")}
          </div>
          <span class="form-help" style="margin-top:6px;">For parties greater than 10 guests, a private salon alcove will be requested.</span>
        </div>

        <!-- Date Picker with Quick Selectors -->
        <div class="form-group" style="margin-top:24px;">
          <label class="form-label">Select Date <span class="required">*</span></label>
          <div style="display:flex; gap:10px; margin-bottom:12px; flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-ghost" onclick="window.selectQuickDate(0)">Today</button>
            <button type="button" class="btn btn-sm btn-ghost" onclick="window.selectQuickDate(1)">Tomorrow</button>
            <button type="button" class="btn btn-sm btn-ghost" onclick="window.selectQuickDate(2)">Day After</button>
          </div>
          <input 
            type="date" 
            id="booking-date" 
            class="form-input" 
            value="${n.date}" 
            min="${a}"
            onchange="bookingState.date = this.value"
            style="max-width:320px;"
          >
        </div>

        <div style="margin-top:36px; display:flex; justify-content:flex-end;">
          <button type="button" class="btn btn-primary" onclick="window.validateStep1AndProceed()">
            Continue to Time Selection &rarr;
          </button>
        </div>
      </div>
    `:n.step===2?`
      <div>
        <h3 style="margin-bottom:20px; color:var(--forest);">Step 2: Choose Preferred Time Slot</h3>

        <div class="form-group">
          <label class="form-label">Available Seating Times for ${n.guests} Guests on ${n.date}</label>
          <div class="slot-grid" style="margin-top:8px;">
            ${t.map(o=>`
              <div 
                class="slot-btn ${n.time===o.time?"selected":""}" 
                onclick="window.selectBookingTime('${o.time}')"
                role="button"
                tabindex="0"
              >
                <span class="slot-time">${o.label}</span>
                <span class="slot-session">${o.session}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="form-group" style="margin-top:28px;">
          <label class="form-label">Seating Atmosphere Preference</label>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${e.map(o=>`
              <label class="card" style="padding:14px; display:flex; align-items:flex-start; gap:12px; cursor:pointer; border-color:${n.area===o.id?"var(--copper)":"var(--border)"}; background:${n.area===o.id?"rgba(184, 115, 51, 0.04)":"#FFF"};">
                <input 
                  type="radio" 
                  name="booking-area" 
                  value="${o.id}" 
                  ${n.area===o.id?"checked":""}
                  onchange="bookingState.area = this.value; window.updateBookingStepUI();"
                  style="margin-top:3px; accent-color:var(--copper);"
                >
                <div>
                  <strong style="color:var(--forest); font-size:0.95rem;">${o.name}</strong>
                  <p style="font-size:0.84rem; color:var(--text-muted); margin:0;">${o.desc}</p>
                </div>
              </label>
            `).join("")}
          </div>
        </div>

        <div style="margin-top:36px; display:flex; justify-content:space-between;">
          <button type="button" class="btn btn-outline" onclick="window.goToBookingStep(1)">&larr; Back</button>
          <button type="button" class="btn btn-primary" onclick="window.validateStep2AndProceed()">
            Continue to Guest Details &rarr;
          </button>
        </div>
      </div>
    `:n.step===3?`
      <div>
        <h3 style="margin-bottom:20px; color:var(--forest);">Step 3: Guest &amp; Occasion Information</h3>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
          <div class="form-group">
            <label class="form-label">Full Name <span class="required">*</span></label>
            <input 
              type="text" 
              id="booking-name" 
              class="form-input" 
              placeholder="e.g. Ananya Sharma" 
              value="${k(n.name)}"
              oninput="bookingState.name = this.value"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number <span class="required">*</span></label>
            <input 
              type="tel" 
              id="booking-phone" 
              class="form-input" 
              placeholder="e.g. +91 98765 43210" 
              value="${k(n.phone)}"
              oninput="bookingState.phone = this.value"
              required
            >
            <span class="form-help">We send an instant SMS booking confirmation.</span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
          <div class="form-group">
            <label class="form-label">Email Address (Optional)</label>
            <input 
              type="email" 
              id="booking-email" 
              class="form-input" 
              placeholder="name@example.com" 
              value="${k(n.email)}"
              oninput="bookingState.email = this.value"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Special Occasion</label>
            <select class="form-select" onchange="bookingState.occasion = this.value">
              <option value="Casual Dining" ${n.occasion==="Casual Dining"?"selected":""}>Casual Dining</option>
              <option value="Birthday Celebration" ${n.occasion==="Birthday Celebration"?"selected":""}>Birthday Celebration</option>
              <option value="Anniversary" ${n.occasion==="Anniversary"?"selected":""}>Anniversary</option>
              <option value="Business Meeting / Co-Working" ${n.occasion==="Business Meeting / Co-Working"?"selected":""}>Business / Co-Working</option>
              <option value="First Date" ${n.occasion==="First Date"?"selected":""}>Date Night</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Special Seating or Dietary Notes (Optional)</label>
          <textarea 
            class="form-textarea" 
            rows="2" 
            placeholder="e.g. High chair needed, window seat preferred, celebrating Rahul's birthday..."
            oninput="bookingState.specialRequest = this.value"
          >${k(n.specialRequest)}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Promotional Coupon Code</label>
          <div style="display:flex; gap:10px;">
            <input 
              type="text" 
              class="form-input" 
              placeholder="e.g. MORNING20 or CELEBRATE" 
              value="${k(n.couponCode)}"
              oninput="bookingState.couponCode = this.value.toUpperCase()"
              style="text-transform:uppercase; max-width:260px;"
            >
          </div>
        </div>

        <div style="margin-top:36px; display:flex; justify-content:space-between;">
          <button type="button" class="btn btn-outline" onclick="window.goToBookingStep(2)">&larr; Back</button>
          <button type="button" class="btn btn-primary" onclick="window.validateStep3AndProceed()">
            Review &amp; Verify Availability &rarr;
          </button>
        </div>
      </div>
    `:`
    <div>
      <h3 style="margin-bottom:20px; color:var(--forest);">Step 4: Review &amp; Check Availability</h3>

      <div class="card" style="background:var(--bg); border:1px solid var(--border); margin-bottom:24px;">
        <h4 style="margin-bottom:14px; color:var(--forest);">Reservation Summary</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.92rem;">
          <div><strong style="color:var(--text-muted);">Date:</strong> ${n.date}</div>
          <div><strong style="color:var(--text-muted);">Time:</strong> ${n.time}</div>
          <div><strong style="color:var(--text-muted);">Party Size:</strong> ${n.guests} Guests</div>
          <div><strong style="color:var(--text-muted);">Area:</strong> ${n.area==="any"?"Best Available":n.area}</div>
          <div><strong style="color:var(--text-muted);">Guest Name:</strong> ${k(n.name)}</div>
          <div><strong style="color:var(--text-muted);">Phone:</strong> ${k(n.phone)}</div>
          ${n.occasion?`<div><strong style="color:var(--text-muted);">Occasion:</strong> ${k(n.occasion)}</div>`:""}
          ${n.couponCode?`<div><strong style="color:var(--copper);">Offer Code:</strong> ${k(n.couponCode)}</div>`:""}
        </div>
      </div>

      <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:28px; line-height:1.5;">
        🔒 By clicking "Confirm Reservation", our live booking system verifies table availability against current cafe floor occupancy and holds your table for 15 minutes past reservation time.
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <button type="button" class="btn btn-outline" onclick="window.goToBookingStep(3)">&larr; Edit Details</button>
        <button 
          type="button" 
          class="btn btn-primary btn-lg" 
          id="btn-confirm-booking" 
          onclick="window.executeBookingVerification()"
          ${n.isChecking?"disabled":""}
        >
          ${n.isChecking?'<span class="spinner"></span> Checking Availability...':"Confirm Table Reservation ✓"}
        </button>
      </div>
    </div>
  `}function k(t){return t?t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}typeof window<"u"&&(window.selectBookingGuests=function(t){n.guests=t,window.updateBookingStepUI()},window.selectQuickDate=function(t){const e=new Date;e.setDate(e.getDate()+t),n.date=e.toISOString().split("T")[0];const a=document.getElementById("booking-date");a&&(a.value=n.date)},window.selectBookingTime=function(t){n.time=t,window.updateBookingStepUI()},window.goToBookingStep=function(t){n.errorMsg="",n.step=t,window.updateBookingStepUI()},window.validateStep1AndProceed=function(){n.errorMsg="";const t=document.getElementById("booking-date");if(t&&(n.date=t.value),!n.date){n.errorMsg="Please select a reservation date.",window.updateBookingStepUI();return}n.step=2,window.updateBookingStepUI()},window.validateStep2AndProceed=function(){if(n.errorMsg="",!n.time){n.errorMsg="Please pick a time slot.",window.updateBookingStepUI();return}n.step=3,window.updateBookingStepUI()},window.validateStep3AndProceed=function(){n.errorMsg="";const t=document.getElementById("booking-name"),e=document.getElementById("booking-phone");if(t&&(n.name=t.value),e&&(n.phone=e.value),!n.name||n.name.trim().length<2){n.errorMsg="Please enter your full name.",window.updateBookingStepUI();return}if(!n.phone||n.phone.trim().length<8){n.errorMsg="Please enter a valid phone number for booking updates.",window.updateBookingStepUI();return}n.step=4,window.updateBookingStepUI()},window.executeBookingVerification=async function(){n.errorMsg="",n.isChecking=!0,window.updateBookingStepUI();try{const t=await y.checkAvailability({date:n.date,time:n.time,guests:n.guests,area:n.area});if(!t.available){n.isChecking=!1,n.errorMsg=t.message||"Sorry, this time slot is fully committed. Please select an adjacent time.",n.step=2,window.updateBookingStepUI();return}const e=await y.createBooking({name:n.name,phone:n.phone,email:n.email,date:n.date,time:n.time,guests:n.guests,area:n.area,specialRequest:n.specialRequest,couponCode:n.couponCode});f.show(`Reservation Confirmed! Ref: ${e.id}`,"success",5e3),n={step:1,guests:2,date:"",time:"19:30",area:"any",name:"",phone:"",email:"",specialRequest:"",occasion:"Casual Dining",couponCode:"",isChecking:!1,errorMsg:""},window.location.hash=`#/booking-confirmation?id=${e.id}`}catch(t){console.error(t),n.isChecking=!1,n.errorMsg=t.message||"An error occurred while verifying reservation.",window.updateBookingStepUI()}},window.updateBookingStepUI=function(){const t=document.getElementById("booking-error-box");t&&(t.style.display=n.errorMsg?"block":"none",t.textContent=n.errorMsg);const e=document.getElementById("booking-step-content");if(e){const o=y.getTimeSlots(),i=y.getSeatingAreas(),r=new Date().toISOString().split("T")[0];e.innerHTML=ne(o,i,r)}document.querySelectorAll(".booking-step-node").forEach((o,i)=>{const r=i+1;o.className=`booking-step-node ${n.step===r?"active":n.step>r?"completed":""}`;const c=o.querySelector(".step-circle");c&&(c.textContent=n.step>r?"✓":r)})});async function De(){const e=new URLSearchParams(window.location.hash.split("?")[1]||"").get("id");let a=null;return e&&(a=await y.getBooking(e)),`
    <div style="background:var(--forest); color:#FFF; padding:50px 0 40px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Reservation Central</span>
        <h1 style="color:#FFF; margin-bottom:10px;">Booking Status &amp; Details</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:580px; margin:0 auto; font-size:1.05rem;">
          View confirmation details, sync to your personal calendar, or manage existing table reservations.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container" style="max-width:820px;">
        ${a?Oe(a):Re()}
      </div>
    </section>
  `}function Oe(t){const e=t.status==="CANCELLED";return`
    <div class="confirmation-card">
      <div class="confirmation-header">
        <div class="confirmation-icon" style="${e?"background:var(--nonveg-red-bg); border-color:var(--nonveg-red-border); color:var(--nonveg-red);":""}">
          ${e?"✕":"✓"}
        </div>
        <h2 style="font-size:1.8rem; margin-bottom:6px; color:var(--forest);">
          ${e?"Reservation Cancelled":"Table Confirmed!"}
        </h2>
        <p style="color:var(--text-muted); font-size:0.95rem;">
          ${e?"This reservation was successfully cancelled. We hope to welcome you another time.":`We are delighted to host you at ${s.name}. A confirmation SMS has been dispatched.`}
        </p>
        <div class="booking-ref-badge" id="conf-booking-id">
          Booking ID: ${t.id}
        </div>
      </div>

      <!-- Details Summary Table -->
      <div class="confirmation-details-list">
        <div class="conf-detail-row">
          <span class="conf-detail-label">Cafe Destination</span>
          <span class="conf-detail-value">${s.name} — ${s.address.locality}</span>
        </div>
        <div class="conf-detail-row">
          <span class="conf-detail-label">Guest Name</span>
          <span class="conf-detail-value" id="conf-guest-name">${H(t.customerName)}</span>
        </div>
        <div class="conf-detail-row">
          <span class="conf-detail-label">Date &amp; Time</span>
          <span class="conf-detail-value" id="conf-datetime">${_e(t.date)} at ${t.time}</span>
        </div>
        <div class="conf-detail-row">
          <span class="conf-detail-label">Party Size</span>
          <span class="conf-detail-value" id="conf-guests">${t.guests} ${t.guests===1?"Guest":"Guests"}</span>
        </div>
        <div class="conf-detail-row">
          <span class="conf-detail-label">Assigned Seating</span>
          <span class="conf-detail-value">${t.area||"Courtyard Patio"} (Table ${t.tableNumber||7})</span>
        </div>
        <div class="conf-detail-row">
          <span class="conf-detail-label">Contact Phone</span>
          <span class="conf-detail-value">${H(t.phone)}</span>
        </div>
        ${t.specialRequest?`
          <div class="conf-detail-row">
            <span class="conf-detail-label">Special Requests</span>
            <span class="conf-detail-value">${H(t.specialRequest)}</span>
          </div>
        `:""}
        <div class="conf-detail-row">
          <span class="conf-detail-label">Status</span>
          <span class="badge ${e?"badge-nonveg":"badge-veg"}">
            ${t.status}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      ${e?`
        <div style="text-align:center; padding-top:16px;">
          <a href="#/reservations" class="btn btn-primary">
            Make a New Reservation &rarr;
          </a>
        </div>
      `:`
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px;">
          <button class="btn btn-outline" onclick="window.downloadIcsCalendar('${t.id}')">
            📅 Download .ICS Calendar
          </button>
          <a href="${Le(t)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
            🗓️ Add to Google Calendar
          </a>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; padding-top:20px; border-top:1px dashed var(--border);">
          <div style="display:flex; gap:10px;">
            <button class="btn btn-ghost btn-sm" onclick="window.openModifyBookingModal('${t.id}')" style="color:var(--copper);">
              ✏️ Modify Time / Guests
            </button>
            <button class="btn btn-ghost btn-sm" onclick="window.confirmCancelBooking('${t.id}')" style="color:var(--nonveg-red);">
              ✕ Cancel Reservation
            </button>
          </div>
          <a href="#/menu" class="btn btn-primary btn-sm">
            Explore Menu in Advance &rarr;
          </a>
        </div>
      `}

      <!-- Direction and Contact Guidance -->
      <div style="margin-top:32px; background:var(--bg); border-radius:var(--radius-sm); padding:16px; font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">
        <strong>Need help or running late?</strong> Call our floor host at 
        <a href="tel:${s.contact.phone}" style="color:var(--copper); font-weight:600;">${s.contact.phoneDisplay}</a>. 
        Tables are held for up to 15 minutes past scheduled arrival time. Complimentary valet parking is available at the entrance.
      </div>
    </div>
  `}function Re(){return`
    <div class="card" style="padding:40px; box-shadow:var(--shadow-md);">
      <div style="text-align:center; margin-bottom:28px;">
        <div style="font-size:2.5rem; margin-bottom:12px;">🔎</div>
        <h2 style="font-size:1.6rem; color:var(--forest); margin-bottom:6px;">Find Your Table Reservation</h2>
        <p style="color:var(--text-muted); font-size:0.95rem;">Enter your 7-character Booking Reference (e.g. BK-82914) or contact phone number.</p>
      </div>

      <form id="lookup-booking-form" onsubmit="window.handleLookupSubmit(event)" style="max-width:480px; margin:0 auto;">
        <div class="form-group">
          <label class="form-label">Booking Reference or Phone Number</label>
          <input 
            type="text" 
            id="lookup-query-input" 
            class="form-input" 
            placeholder="e.g. BK-82914 or 9811234567" 
            required
            style="font-size:1.05rem; padding:14px;"
          >
        </div>

        <button type="submit" class="btn btn-primary w-full" style="width:100%; margin-top:8px;">
          Check Reservation Status &rarr;
        </button>
      </form>

      <div style="margin-top:32px; text-align:center; font-size:0.88rem; color:var(--text-muted);">
        Don't have a reservation yet? 
        <a href="#/reservations" style="color:var(--copper); font-weight:600; text-decoration:underline;">
          Book a table online in 60 seconds &rarr;
        </a>
      </div>
    </div>
  `}function _e(t){if(!t)return"";const[e,a,o]=t.split("-");return new Date(e,a-1,o).toLocaleDateString("en-IN",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}function Le(t){const e=encodeURIComponent(`Reservation at ${s.name}`),a=encodeURIComponent(`Table Reservation for ${t.guests} guests (Booking ID: ${t.id}). Address: ${s.address.full}. Phone: ${s.contact.phone}`),o=encodeURIComponent(s.address.full),i=t.date.replace(/-/g,""),[r,c]=t.time.split(":"),d=r.padStart(2,"0"),g=String(Number(r)+2).padStart(2,"0"),v=`${i}T${d}${c}00/${i}T${g}${c}00`;return`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${e}&details=${a}&location=${o}&dates=${v}`}function H(t){return t?t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}typeof window<"u"&&(window.handleLookupSubmit=async function(t){var a,o;t.preventDefault();const e=(o=(a=document.getElementById("lookup-query-input"))==null?void 0:a.value)==null?void 0:o.trim();if(e)if(e.toUpperCase().startsWith("BK-")){const i=await y.getBooking(e);i?window.location.hash=`#/booking-confirmation?id=${i.id}`:f.show(`No reservation found matching "${e}".`,"error")}else{const i=await y.findBookingsByPhone(e);i.length>0?window.location.hash=`#/booking-confirmation?id=${i[0].id}`:f.show(`No reservations found for phone number "${e}".`,"error")}},window.downloadIcsCalendar=function(t){y.getBooking(t).then(e=>{if(!e)return;const a=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Cafe Aroma//Table Reservation//EN","BEGIN:VEVENT",`UID:${e.id}@cafearoma.com`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,"").split(".")[0]}Z`,`SUMMARY:Table at ${s.name}`,`DESCRIPTION:Reservation for ${e.guests} guests. Reference: ${e.id}. Phone: ${s.contact.phone}`,`LOCATION:${s.address.full}`,`DTSTART:${e.date.replace(/-/g,"")}T${e.time.replace(":","")}00`,`DTEND:${e.date.replace(/-/g,"")}T${String(Number(e.time.split(":")[0])+2).padStart(2,"0")}${e.time.split(":")[1]}00`,"STATUS:CONFIRMED","END:VEVENT","END:VCALENDAR"].join(`\r
`),o=new Blob([a],{type:"text/calendar;charset=utf-8"}),i=document.createElement("a");i.href=URL.createObjectURL(o),i.download=`CafeAroma_Reservation_${e.id}.ics`,document.body.appendChild(i),i.click(),document.body.removeChild(i),f.show("Calendar event file downloaded!","success")})},window.confirmCancelBooking=function(t){confirm("Are you sure you wish to cancel this table reservation?")&&y.cancelBooking(t).then(()=>{f.show("Reservation cancelled successfully.","info"),window.location.hash=`#/booking-confirmation?id=${t}`}).catch(e=>{f.show(e.message||"Failed to cancel reservation.","error")})},window.openModifyBookingModal=function(t){const e=prompt("Enter new party size (e.g. 4):");if(!e)return;const a=parseInt(e,10);if(isNaN(a)||a<1||a>16){alert("Please enter a valid guest count between 1 and 16.");return}y.updateBooking(t,{guests:a}).then(()=>{f.show(`Booking party updated to ${a} guests!`,"success"),window.location.hash=`#/booking-confirmation?id=${t}`,window.location.reload()}).catch(o=>{f.show(o.message||"Failed to update booking.","error")})});const X="cafe_aroma_inquiries",U=new Map;function Ne(){return typeof localStorage<"u"?localStorage:{getItem:t=>U.get(t)||null,setItem:(t,e)=>U.set(t,String(e)),removeItem:t=>U.delete(t)}}function qe(t){try{const e=Ne(),a=e.getItem(X),o=a?JSON.parse(a):[];o.unshift(t),e.setItem(X,JSON.stringify(o))}catch(e){console.error("Failed to save inquiry:",e)}}const He={async submitContact({name:t,email:e,phone:a="",subject:o="General Inquiry",message:i}){if(await L(320),!t||t.trim().length<2)throw new Error("Please enter your name.");if(!e&&!a)throw new Error("Please provide either an email address or phone number so we can respond.");if(e&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))throw new Error("Please enter a valid email address.");if(!i||i.trim().length<8)throw new Error("Please provide a message with at least 8 characters.");const r=`INQ-${Math.floor(1e3+Math.random()*9e3)}`,c={ticketId:r,name:t.trim(),email:e.trim(),phone:a.trim(),subject:o.trim(),message:i.trim(),submittedAt:new Date().toISOString(),status:"RECEIVED"};return qe(c),{success:!0,ticketId:r,message:`Thank you, ${t.trim()}! Your message has been received (Ref: ${r}). Our hospitality team will reply within 2–4 hours.`}}};async function Ue(){const t=G.isOpenNow();return`
    <div style="background:var(--forest); color:#FFF; padding:60px 0 45px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Get in Touch</span>
        <h1 style="color:#FFF; margin-bottom:12px;">Visit Us in Connaught Place</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:600px; margin:0 auto; font-size:1.1rem;">
          We are located at 12 Heritage Lane, Inner Circle. Drop by for a cup or send us a message for private event inquiries.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container contact-grid">
        <!-- Col 1: Location Info, Hours & Map -->
        <div>
          <div class="contact-info-list">
            <!-- Address Card -->
            <div class="contact-info-card">
              <div class="contact-info-icon">📍</div>
              <div>
                <h4 style="font-size:1.1rem; margin-bottom:4px; color:var(--forest);">Cafe Location</h4>
                <p style="font-size:0.92rem; margin-bottom:6px;">${s.address.full}</p>
                <a href="${s.address.googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--copper); font-size:0.85rem; font-weight:600;">
                  Open in Google Maps &rarr;
                </a>
              </div>
            </div>

            <!-- Phone Card -->
            <div class="contact-info-card">
              <div class="contact-info-icon">📞</div>
              <div>
                <h4 style="font-size:1.1rem; margin-bottom:4px; color:var(--forest);">Reservations &amp; Floor</h4>
                <p style="font-size:0.92rem; margin-bottom:6px;">
                  <a href="tel:${s.contact.phone}">${s.contact.phoneDisplay}</a>
                </p>
                <span style="font-size:0.82rem; color:var(--text-muted);">Available daily from 8:00 AM to 11:00 PM</span>
              </div>
            </div>

            <!-- Email Card -->
            <div class="contact-info-card">
              <div class="contact-info-icon">✉️</div>
              <div>
                <h4 style="font-size:1.1rem; margin-bottom:4px; color:var(--forest);">Email Inquiries</h4>
                <p style="font-size:0.92rem; margin-bottom:4px;">
                  General: <a href="mailto:${s.contact.email}" style="color:var(--copper);">${s.contact.email}</a>
                </p>
                <p style="font-size:0.92rem;">
                  Events: <a href="mailto:events@cafearoma.com" style="color:var(--copper);">events@cafearoma.com</a>
                </p>
              </div>
            </div>

            <!-- Hours Card with Live Status -->
            <div class="contact-info-card">
              <div class="contact-info-icon">⏰</div>
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <h4 style="font-size:1.1rem; color:var(--forest);">Operating Schedule</h4>
                  <span class="badge ${t.isOpen?"badge-veg":"badge-nonveg"}">
                    <span class="status-dot ${t.isOpen?"open":"closed"}"></span>
                    ${t.statusText}
                  </span>
                </div>
                <div style="font-size:0.88rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:4px;">
                  <div style="display:flex; justify-content:space-between;">
                    <span>Monday – Thursday:</span>
                    <strong>8:00 AM – 11:00 PM</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span>Friday:</span>
                    <strong>8:00 AM – 11:30 PM</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span>Saturday – Sunday:</span>
                    <strong>7:30 AM – 11:30 PM</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Interactive Map Placeholder -->
          <div class="map-placeholder-box">
            <div class="map-pin">☕</div>
            <h4 style="color:var(--forest); margin-bottom:4px;">Cafe Aroma — Heritage Lane</h4>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:14px;">Block A, Inner Circle, Connaught Place</p>
            <a href="${s.address.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              🧭 Get Turn-by-Turn Directions
            </a>
          </div>
        </div>

        <!-- Col 2: Validated Contact Form -->
        <div>
          <div class="card" style="padding:36px; box-shadow:var(--shadow-md);">
            <h3 style="font-size:1.45rem; color:var(--forest); margin-bottom:8px;">Send Us a Message</h3>
            <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:24px;">
              Have questions about menu allergens, private party bookings, coffee workshops, or corporate catering? Drop us a note.
            </p>

            <form id="contact-form" onsubmit="window.handleContactSubmit(event)">
              <div id="contact-feedback" style="display:none; padding:12px 16px; border-radius:var(--radius-sm); margin-bottom:20px; font-size:0.92rem;"></div>

              <div class="form-group">
                <label class="form-label" for="contact-name">Your Full Name <span class="required">*</span></label>
                <input type="text" id="contact-name" class="form-input" placeholder="e.g. Vikram Malhotra" required>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <div class="form-group">
                  <label class="form-label" for="contact-email">Email Address <span class="required">*</span></label>
                  <input type="email" id="contact-email" class="form-input" placeholder="vikram@example.com" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-phone">Phone Number</label>
                  <input type="tel" id="contact-phone" class="form-input" placeholder="+91 98765 43210">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-subject">Inquiry Nature</label>
                <select id="contact-subject" class="form-select">
                  <option value="General Inquiry">General Question &amp; Feedback</option>
                  <option value="Private Dining & Events">Private Event / Banquet Booking</option>
                  <option value="Corporate Catering">Office &amp; Corporate Catering</option>
                  <option value="Coffee Workshop">Barista &amp; Coffee Cupping Workshop</option>
                  <option value="Press & Media">Press &amp; Media Collaboration</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-message">Your Message <span class="required">*</span></label>
                <textarea id="contact-message" class="form-textarea" rows="4" placeholder="Tell us how we can assist you..." required></textarea>
              </div>

              <button type="submit" class="btn btn-primary w-full" id="btn-submit-contact" style="width:100%; padding:14px;">
                <span>Send Message</span>
                <span>&rarr;</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Accordion Section -->
    <section class="section section-alt">
      <div class="container" style="max-width:840px;">
        <div class="section-header">
          <span class="section-tag">Frequently Asked</span>
          <h2 class="section-title">Common Questions</h2>
          <p class="section-subtitle">Everything you need to know about visiting Cafe Aroma.</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:14px;">
          ${me.map((e,a)=>`
            <details class="card" style="padding:18px 24px; cursor:pointer;" ${a===0?"open":""}>
              <summary style="font-weight:600; font-size:1.05rem; color:var(--forest); user-select:none;">
                ${e.q}
              </summary>
              <p style="margin-top:12px; font-size:0.92rem; color:var(--text-secondary); line-height:1.6;">
                ${e.a}
              </p>
            </details>
          `).join("")}
        </div>
      </div>
    </section>
  `}typeof window<"u"&&(window.handleContactSubmit=async function(t){var g,v,l,u,h,b,w,M,P,B;t.preventDefault();const e=document.getElementById("btn-submit-contact"),a=document.getElementById("contact-feedback"),o=(v=(g=document.getElementById("contact-name"))==null?void 0:g.value)==null?void 0:v.trim(),i=(u=(l=document.getElementById("contact-email"))==null?void 0:l.value)==null?void 0:u.trim(),r=(b=(h=document.getElementById("contact-phone"))==null?void 0:h.value)==null?void 0:b.trim(),c=(w=document.getElementById("contact-subject"))==null?void 0:w.value,d=(P=(M=document.getElementById("contact-message"))==null?void 0:M.value)==null?void 0:P.trim();e&&(e.disabled=!0,e.innerHTML='<span class="spinner"></span> Dispatching Message...');try{const C=await He.submitContact({name:o,email:i,phone:r,subject:c,message:d});a&&(a.style.display="block",a.style.background="var(--veg-green-bg)",a.style.border="1px solid var(--veg-green-border)",a.style.color="var(--veg-green)",a.innerHTML=`✓ ${C.message}`),f.show(`Inquiry received! Reference: ${C.ticketId}`,"success",5e3),(B=document.getElementById("contact-form"))==null||B.reset()}catch(C){a&&(a.style.display="block",a.style.background="var(--nonveg-red-bg)",a.style.border="1px solid var(--nonveg-red-border)",a.style.color="var(--nonveg-red)",a.textContent=C.message||"Failed to submit form."),f.show(C.message||"Error submitting message.","error")}finally{e&&(e.disabled=!1,e.innerHTML="<span>Send Message</span> <span>&rarr;</span>")}});const Ve="http://localhost:4000/api",Ge={async getTableInfo(t){if(!t)return null;const e=t.toString().replace(/[^0-9]/g,""),a=parseInt(e,10);if(isNaN(a))return{isValid:!1,tableNumber:null,cafeName:s.name,error:`Invalid table identifier: ${t}`};try{const i=await fetch(`${Ve}/tables/${a}`,{cache:"no-store"});if(i.ok){const r=await i.json();return r.isActive===!1||r.status==="Inactive"?{isValid:!1,tableNumber:r.number,cafeName:s.name,error:`Table ${r.number} is currently inactive and not accepting orders.`}:{isValid:!0,tableId:r.id,tableNumber:r.number,capacity:r.capacity,area:r.zone||"Dining Area",description:`Capacity ${r.capacity} guests in ${r.zone}`,cafeName:s.name,welcomeTitle:`Welcome to ${s.name} — Table ${r.number}`,welcomeSubtitle:`Seated in ${r.zone} • Capacity ${r.capacity} guests`,qrUrl:`#/table/${r.number}`,dineInUrl:`#/menu?table=${r.number}&dineIn=true`}}}catch{}const o=ue.find(i=>i.number===a)||{id:`table_${a}`,number:a,capacity:4,area:"Dining Area",description:"Standard Cafe Table"};return{isValid:!0,tableId:o.id,tableNumber:o.number,capacity:o.capacity,area:o.area,description:o.description,cafeName:s.name,welcomeTitle:`Welcome to ${s.name} — Table ${o.number}`,welcomeSubtitle:`Seated in ${o.area} • Capacity ${o.capacity} guests`,qrUrl:`#/table/${o.number}`,dineInUrl:`#/menu?table=${o.number}&dineIn=true`}}};async function We(t={}){const e=t.tableId||"7",a=await Ge.getTableInfo(e);return!a||!a.isValid?`
      <section class="section">
        <div class="container" style="max-width:560px; text-align:center;">
          <div class="card" style="padding:48px 30px;">
            <div style="font-size:3rem; margin-bottom:14px;">⚠️</div>
            <h2 style="color:var(--forest); margin-bottom:8px;">Unrecognized Table QR</h2>
            <p style="color:var(--text-muted); margin-bottom:24px;">
              Could not identify a table for reference "${e}". Please ask your floor attendant for assistance.
            </p>
            <a href="#/menu" class="btn btn-primary">Browse Public Menu &rarr;</a>
          </div>
        </div>
      </section>
    `:`
    <div style="background:var(--forest); color:#FFF; padding:45px 0 35px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Dine-In Guest Gateway</span>
        <h1 style="color:#FFF; font-size:clamp(1.8rem, 3.5vw, 2.6rem); margin-bottom:6px;">
          ${a.welcomeTitle}
        </h1>
        <p style="color:rgba(255,255,255,0.8); font-size:1rem;">
          ${a.welcomeSubtitle}
        </p>
      </div>
    </div>

    <section class="section" style="padding-top:40px;">
      <div class="container">
        <div class="table-gateway-card">
          <div class="table-icon-circle">
            🍽️
          </div>

          <span class="table-badge-large" id="table-badge-display">
            Table #${a.tableNumber} • Active Session
          </span>

          <h2 style="font-size:1.6rem; color:var(--forest); margin-bottom:10px;">
            Enjoy Your Dine-In Meal
          </h2>

          <p style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:28px; line-height:1.5;">
            Browse our full food and specialty coffee catalog, check dietary ingredients, and prepare your order directly from your mobile device.
          </p>

          <!-- Primary CTA Button -->
          <div style="margin-bottom:28px;">
            <a href="#/menu?table=${a.tableNumber}&dineIn=true" class="btn btn-primary btn-lg" id="btn-view-order-menu" style="width:100%; font-size:1.1rem; padding:16px;">
              <span>🍽️ View Menu &amp; Order</span>
              <span>&rarr;</span>
            </a>
          </div>

          <!-- Floor Service Assistance Buttons -->
          <div style="border-top:1px dashed var(--border); padding-top:20px; text-align:left;">
            <h4 style="font-size:0.92rem; color:var(--forest); margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em;">
              Quick Table Assistance
            </h4>
            <div class="table-service-actions">
              <button type="button" class="btn btn-outline btn-sm" onclick="window.callTableWaiter(${a.tableNumber})">
                🔔 Call Attendant
              </button>
              <button type="button" class="btn btn-outline btn-sm" onclick="window.requestTableWater(${a.tableNumber})">
                💧 Request Mineral Water
              </button>
            </div>
          </div>

          <!-- Integration Architecture Notice -->
          <div style="margin-top:28px; background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px 16px; font-size:0.8rem; color:var(--text-muted); text-align:left; display:flex; gap:10px; align-items:flex-start;">
            <span style="font-size:1.1rem; color:var(--copper);">ℹ️</span>
            <div>
              <strong>QR Dine-In Handoff:</strong> This gateway connects with the Cafe Aroma QR Dine-In Ordering &amp; POS Module to provide kitchen dispatch and live order tracking.
            </div>
          </div>
        </div>
      </div>
    </section>
  `}typeof window<"u"&&(window.callTableWaiter=async function(t){try{await fetch("http://localhost:4000/api/table-requests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tableNumber:parseInt(t,10),requestType:"waiter",notes:`Dine-in guest at Table ${t} called waiter.`})})}catch{}f.show(`Attendant summoned for Table ${t}. A team member will visit you shortly!`,"info")},window.requestTableWater=async function(t){try{await fetch("http://localhost:4000/api/table-requests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tableNumber:parseInt(t,10),requestType:"water",notes:`Mineral water requested for Table ${t}.`})})}catch{}f.show(`Water request received for Table ${t}. Refreshments on the way!`,"success")});async function je(){return`
    <div style="background:var(--forest); color:#FFF; padding:50px 0 40px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Legal Integrity</span>
        <h1 style="color:#FFF; margin-bottom:8px;">Privacy Policy</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:600px; margin:0 auto; font-size:0.95rem;">
          Last updated: September 2026 • Effective for all guests of ${s.name}.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container" style="max-width:820px;">
        <div class="card" style="padding:40px; line-height:1.7; font-size:0.95rem;">
          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">1. Information We Collect</h2>
          <p style="margin-bottom:20px;">
            When you make a table reservation, submit a contact inquiry, or join the Aroma Coffee Club, we collect contact information including your full name, phone number, and optional email address. This information is exclusively utilized to verify table availability, send SMS confirmation alerts, and process dietary preferences.
          </p>

          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">2. How Your Data is Used</h2>
          <p style="margin-bottom:20px;">
            Your personal information is used strictly to deliver hospitality services:
          </p>
          <ul style="padding-left:20px; margin-bottom:20px; display:flex; flex-direction:column; gap:8px;">
            <li>Dispatching booking confirmation, calendar invites, and table ready notices.</li>
            <li>Responding directly to inquiries regarding private events, catering, or culinary questions.</li>
            <li>Sending exclusive newsletter promotions and micro-lot coffee release announcements (only with opt-in consent).</li>
          </ul>

          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">3. Data Protection &amp; Confidentiality</h2>
          <p style="margin-bottom:20px;">
            We do not sell, rent, or trade your personal information to third-party advertisers. All customer data is safeguarded with modern TLS encryption standards.
          </p>

          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">4. Contact &amp; Grievance Redressal</h2>
          <p style="margin-bottom:24px;">
            For privacy inquiries or to request deletion of your reservation history, contact our Data Governance Officer at 
            <a href="mailto:privacy@cafearoma.com" style="color:var(--copper); font-weight:600;">privacy@cafearoma.com</a>.
          </p>

          <div style="border-top:1px dashed var(--border); padding-top:20px;">
            <a href="#/" class="btn btn-outline btn-sm">&larr; Return to Home</a>
          </div>
        </div>
      </div>
    </section>
  `}async function Ye(){return`
    <div style="background:var(--forest); color:#FFF; padding:50px 0 40px; border-bottom:1px solid rgba(255,255,255,0.08);">
      <div class="container text-center">
        <span class="section-tag" style="color:var(--copper-light);">Guest Agreement</span>
        <h1 style="color:#FFF; margin-bottom:8px;">Terms &amp; Conditions</h1>
        <p style="color:rgba(255,255,255,0.8); max-width:600px; margin:0 auto; font-size:0.95rem;">
          Effective: September 2026 • Governing table bookings, dine-in visits and digital vouchers.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container" style="max-width:820px;">
        <div class="card" style="padding:40px; line-height:1.7; font-size:0.95rem;">
          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">1. Reservation &amp; Seating Policy</h2>
          <p style="margin-bottom:20px;">
            Confirmed reservations are held for up to 15 minutes past scheduled arrival time. If your party is delayed, please notify our host desk via telephone at ${s.contact.phoneDisplay}. While we strive to honor specific seating area requests (e.g. Courtyard Patio or Window Alcove), final table allocation is subject to live floor dynamics.
          </p>

          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">2. Cancellations &amp; Modifications</h2>
          <p style="margin-bottom:20px;">
            Guests may cancel or modify reservations online or via phone at zero fee. We appreciate at least 2 hours notice for table cancellations to permit allocation to waiting guests.
          </p>

          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">3. Food Allergens &amp; Dietary Notes</h2>
          <p style="margin-bottom:20px;">
            While we take meticulous precautions to prevent cross-contamination, our kitchen prepares dishes containing tree nuts, dairy, gluten, and eggs. Guests with severe allergies are requested to inform our team prior to ordering.
          </p>

          <h2 style="font-size:1.4rem; color:var(--forest); margin-bottom:12px;">4. Promotional Vouchers &amp; Discounts</h2>
          <p style="margin-bottom:24px;">
            Promotional codes must be applied or presented before final bill generation. Offers cannot be clubbed together unless explicitly specified.
          </p>

          <div style="border-top:1px dashed var(--border); padding-top:20px;">
            <a href="#/" class="btn btn-outline btn-sm">&larr; Return to Home</a>
          </div>
        </div>
      </div>
    </section>
  `}async function Ke(){return`
    <section class="section" style="padding:100px 0; text-align:center;">
      <div class="container" style="max-width:580px;">
        <div style="font-family:var(--font-serif); font-size:6rem; font-weight:800; color:var(--copper); line-height:1; margin-bottom:12px;">
          404
        </div>
        <h1 style="font-size:2rem; color:var(--forest); margin-bottom:14px;">
          Page Not Found
        </h1>
        <p style="color:var(--text-secondary); font-size:1.05rem; margin-bottom:32px; line-height:1.6;">
          It looks like the brew you're searching for hasn't been extracted yet. Let's guide you back to familiar flavors.
        </p>
        <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
          <a href="#/" class="btn btn-primary">Return Home</a>
          <a href="#/menu" class="btn btn-outline">Explore Menu</a>
          <a href="#/reservations" class="btn btn-ghost">Book a Table</a>
        </div>
      </div>
    </section>
  `}const Qe=[{path:"/",handler:Ie,title:`${s.name} — Artisanal Coffee & Sourdough Kitchen | Connaught Place, New Delhi`,description:`Experience ${s.name} in Connaught Place. Single-origin specialty coffee, 36-hour slow fermented sourdough, botanical patio and warm hospitality.`},{path:"/menu",handler:J,title:`Menu — Artisanal Brews, Sourdough Pizzas & Plates | ${s.name}`,description:`Browse the complete food and specialty coffee menu of ${s.name}. Check dietary allergens, customize add-ons, and order in cafe.`},{path:"/menu/:itemId",handler:async t=>{const e=await J(t);return setTimeout(()=>{typeof window.openItemModal=="function"&&window.openItemModal(t.itemId)},100),e},title:`Menu Item Details | ${s.name}`,description:`Details, ingredients and customizations for our handcrafted creations at ${s.name}.`},{path:"/about",handler:Be,title:`Our Story, Roastery & Heritage | ${s.name}`,description:`Learn how ${s.name} was founded in 2018. Explore our single-estate coffee sourcing from Chikmagalur and sourdough philosophy.`},{path:"/offers",handler:Fe,title:`Offers, Discounts & Vouchers | ${s.name}`,description:`Exclusive promotions, coffee rush vouchers, student discounts and celebration deals at ${s.name}.`},{path:"/gallery",handler:Ee,title:`Atmosphere & Photography Gallery | ${s.name}`,description:"Explore photos of our sunlit botanical courtyard, brass espresso bar, artisan pizzas and Friday acoustic jazz nights."},{path:"/reservations",handler:ze,title:`Book a Table Online | ${s.name}`,description:`Reserve a table at ${s.name} with real-time seat availability, instant confirmation, and zero booking fee.`},{path:"/booking-confirmation",handler:De,title:`Reservation Status & Lookup | ${s.name}`,description:`Check table booking confirmation details, add to calendar, modify or cancel reservations at ${s.name}.`},{path:"/contact",handler:Ue,title:`Location, Opening Hours & Contact | ${s.name}`,description:`Visit ${s.name} at 12 Heritage Lane, Connaught Place, New Delhi. Opening hours, directions, and event inquiries.`},{path:"/table/:tableId",handler:We,title:`Table Dine-In Ordering | ${s.name}`,description:`Welcome to ${s.name} Dine-In. Browse our digital menu and order right from your seat.`},{path:"/privacy",handler:je,title:`Privacy Policy | ${s.name}`,description:`Privacy guidelines and customer data policies for ${s.name}.`},{path:"/terms",handler:Ye,title:`Terms & Conditions | ${s.name}`,description:`Terms and conditions governing table reservations and service at ${s.name}.`}];class Je{constructor(){this.compiledRoutes=Qe.map(e=>this.compileRoute(e)),this.appContainer=null}compileRoute(e){const a=[],o="^"+e.path.replace(/:([a-zA-Z0-9_]+)/g,(i,r)=>(a.push(r),"([^/]+)"))+"$";return{pattern:new RegExp(o),paramNames:a,handler:e.handler,title:e.title,description:e.description,rawPath:e.path}}init(e="app-content"){if(this.appContainer=document.getElementById(e),window.location.pathname.startsWith("/table/")){const a=window.location.pathname.replace("/table/","");window.location.hash=`#/table/${a}`}window.addEventListener("hashchange",()=>this.handleRoute()),this.handleRoute()}getCurrentPath(){const e=window.location.hash.slice(1);return!e||e===""?"/":e.split("?")[0]||"/"}async handleRoute(){if(!this.appContainer)return;const e=this.getCurrentPath();let a=null,o={};for(const i of this.compiledRoutes){const r=e.match(i.pattern);if(r){a=i,i.paramNames.forEach((c,d)=>{o[c]=r[d+1]});break}}ve(e),window.scrollTo({top:0,behavior:"instant"}),this.appContainer.innerHTML=`
      <div style="min-height:50vh; display:flex; align-items:center; justify-content:center;">
        <div class="spinner spinner-copper" style="width:36px; height:36px;"></div>
      </div>
    `;try{if(a){document.title=a.title;const i=document.querySelector('meta[name="description"]');i&&i.setAttribute("content",a.description);const r=await a.handler(o);this.appContainer.innerHTML=r}else{document.title=`404 Page Not Found | ${s.name}`;const i=await Ke();this.appContainer.innerHTML=i}}catch(i){console.error("Route handler error:",i),this.appContainer.innerHTML=`
        <div class="container section text-center">
          <div class="card" style="padding:40px; max-width:600px; margin:0 auto;">
            <h3 style="color:var(--nonveg-red); margin-bottom:12px;">Failed to load view</h3>
            <p style="color:var(--text-secondary); margin-bottom:20px;">${i.message||"An unexpected error occurred."}</p>
            <a href="#/" class="btn btn-primary">Return to Home</a>
          </div>
        </div>
      `}}}const Ze=new Je;function ee(){const t=document.getElementById("app");if(!t){console.error("Root element #app not found");return}t.innerHTML=`
    <!-- Top Navigation Header -->
    <div id="navbar-mount">${he()}</div>

    <!-- Mobile Off-Canvas Drawer -->
    <div id="drawer-mount">${be()}</div>

    <!-- Main Content Container Driven by Router -->
    <main class="main-content" id="main-content" role="main">
      <div id="app-content"></div>
    </main>

    <!-- Global Item Customization Modal -->
    <div id="item-modal-mount">${Ce()}</div>

    <!-- Global Gallery Lightbox -->
    <div id="lightbox-mount">${Se()}</div>

    <!-- Footer & Mobile Bottom Bar -->
    <div id="footer-mount">${xe()}</div>
  `,fe(),ye(),$e(),Te(),Ze.init("app-content")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ee):ee();
