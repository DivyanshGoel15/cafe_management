(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();const we="BREW_CAFE_ADMIN_STATE_V2";function g(){const s=new Date,a=s.getFullYear(),e=String(s.getMonth()+1).padStart(2,"0"),t=String(s.getDate()).padStart(2,"0");return`${a}-${e}-${t}`}function f(s){const a=new Date;a.setDate(a.getDate()+s);const e=a.getFullYear(),t=String(a.getMonth()+1).padStart(2,"0"),i=String(a.getDate()).padStart(2,"0");return`${e}-${t}-${i}`}const ne={users:[{id:"usr-1",name:"Aditya Singhal",email:"owner@brewandco.com",role:"Owner",avatarInitials:"AS",phone:"+91 98765 11001"},{id:"usr-2",name:"Rajesh Kumar",email:"manager@brewandco.com",role:"Manager",avatarInitials:"RK",phone:"+91 98123 22002"},{id:"usr-3",name:"Pooja Verma",email:"staff@brewandco.com",role:"Staff",avatarInitials:"PV",phone:"+91 97654 33003"}],rolePermissions:{Owner:{dashboard:!0,orders:!0,bookings:!0,tables:!0,menu:!0,customers:!0,staff:!0,analytics:!0,offers:!0,reviews:!0,whatsapp:!0,"ai-calling":!0,"qr-system":!0,notifications:!0,settings:!0},Manager:{dashboard:!0,orders:!0,bookings:!0,tables:!0,menu:!0,customers:!0,staff:!1,analytics:!1,offers:!0,reviews:!0,whatsapp:!0,"ai-calling":!0,"qr-system":!0,notifications:!0,settings:!1},Staff:{dashboard:!0,orders:!0,bookings:!0,tables:!0,menu:!0,customers:!1,staff:!1,analytics:!1,offers:!1,reviews:!1,whatsapp:!1,"ai-calling":!1,"qr-system":!1,notifications:!0,settings:!1}},staff:[{id:"stf-1",name:"Aditya Singhal",email:"owner@brewandco.com",phone:"+91 98765 11001",role:"Owner",status:"Active",shift:"All Day",lastActive:"Just now"},{id:"stf-2",name:"Rajesh Kumar",email:"manager@brewandco.com",phone:"+91 98123 22002",role:"Manager",status:"Active",shift:"Morning (08:00 - 16:30)",lastActive:"5 mins ago"},{id:"stf-3",name:"Pooja Verma",email:"staff@brewandco.com",phone:"+91 97654 33003",role:"Staff",status:"Active",shift:"Evening (15:30 - 23:30)",lastActive:"12 mins ago"},{id:"stf-4",name:"Vikram Joshi",email:"vikram.barista@brewandco.com",phone:"+91 95432 44004",role:"Staff",status:"Active",shift:"Morning (08:00 - 16:30)",lastActive:"1 hour ago"}],tables:[{id:"T-01",number:"1",zone:"Main Dining",capacity:2,status:"Occupied",currentCustomer:"Priya Sharma",orderId:"ORD-5521",billAmount:580,seatedMinutes:45},{id:"T-02",number:"2",zone:"Main Dining",capacity:4,status:"Occupied",currentCustomer:"Arjun Mehta",orderId:"ORD-5520",billAmount:510,seatedMinutes:28},{id:"T-03",number:"3",zone:"Main Dining",capacity:4,status:"Reserved",currentCustomer:"Rahul Verma (7:00 PM)",orderId:null,billAmount:0,seatedMinutes:0},{id:"T-04",number:"4",zone:"Main Dining",capacity:6,status:"Available",currentCustomer:null,orderId:null,billAmount:0,seatedMinutes:0},{id:"T-05",number:"5",zone:"Patio & Garden",capacity:2,status:"Available",currentCustomer:null,orderId:null,billAmount:0,seatedMinutes:0},{id:"T-06",number:"6",zone:"Patio & Garden",capacity:4,status:"Cleaning",currentCustomer:null,orderId:null,billAmount:0,seatedMinutes:10},{id:"T-07",number:"7",zone:"Patio & Garden",capacity:4,status:"Occupied",currentCustomer:"Pooja Agarwal",orderId:"ORD-5514",billAmount:890,seatedMinutes:52},{id:"T-08",number:"8",zone:"Lounge Area",capacity:6,status:"Available",currentCustomer:null,orderId:null,billAmount:0,seatedMinutes:0},{id:"T-09",number:"9",zone:"Lounge Area",capacity:8,status:"Reserved",currentCustomer:"Sonal Gupta (7:30 PM)",orderId:null,billAmount:0,seatedMinutes:0},{id:"T-10",number:"10",zone:"Bar Counter",capacity:2,status:"Occupied",currentCustomer:"Tanya Malhotra",orderId:"ORD-5512",billAmount:480,seatedMinutes:14},{id:"T-11",number:"11",zone:"Bar Counter",capacity:2,status:"Available",currentCustomer:null,orderId:null,billAmount:0,seatedMinutes:0},{id:"T-12",number:"12",zone:"Bar Counter",capacity:2,status:"Available",currentCustomer:null,orderId:null,billAmount:0,seatedMinutes:0}],orders:[{id:"ORD-5521",customer:"Priya Sharma",phone:"9876543210",type:"Dine-in",table:"Table 1",items:[{name:"Cappuccino",qty:2,price:180,total:360},{name:"Paneer Sandwich",qty:1,price:220,total:220}],subtotal:580,tax:29,serviceCharge:29,discount:0,total:638,status:"Completed",paymentStatus:"Paid",paymentMethod:"UPI",time:"12:45 PM",date:g(),notes:"Extra hot cappuccino"},{id:"ORD-5520",customer:"Arjun Mehta",phone:"9812345678",type:"Dine-in",table:"Table 2",items:[{name:"Cold Coffee",qty:1,price:160,total:160},{name:"Margherita Pizza",qty:1,price:350,total:350}],subtotal:510,tax:25.5,serviceCharge:25.5,discount:0,total:561,status:"Ready",paymentStatus:"Paid",paymentMethod:"Card",time:"01:10 PM",date:g(),notes:"Crispy crust pizza"},{id:"ORD-5519",customer:"Rohan Das",phone:"9765432109",type:"Takeaway",table:"Counter",items:[{name:"Masala Chai",qty:3,price:60,total:180},{name:"Blueberry Muffin",qty:2,price:130,total:260}],subtotal:440,tax:22,serviceCharge:0,discount:40,total:422,status:"Completed",paymentStatus:"Paid",paymentMethod:"UPI",time:"11:30 AM",date:g(),notes:"Pack chai securely"},{id:"ORD-5518",customer:"Anjali Kapoor",phone:"9654321098",type:"Dine-in",table:"Table 5",items:[{name:"Espresso",qty:1,price:120,total:120},{name:"Chocolate Cake",qty:1,price:240,total:240}],subtotal:360,tax:18,serviceCharge:18,discount:0,total:396,status:"Completed",paymentStatus:"Paid",paymentMethod:"Cash",time:"10:55 AM",date:g(),notes:"VIP customer"},{id:"ORD-5517",customer:"Vikram Iyer",phone:"9543210987",type:"Dine-in",table:"Table 8",items:[{name:"Latte",qty:1,price:190,total:190},{name:"Blueberry Muffin",qty:2,price:130,total:260}],subtotal:450,tax:22.5,serviceCharge:22.5,discount:0,total:495,status:"Preparing",paymentStatus:"Paid",paymentMethod:"Card",time:"10:15 AM",date:g(),notes:"Oat milk for latte"},{id:"ORD-5516",customer:"Sneha Jain",phone:"9432109876",type:"Takeaway",table:"Counter",items:[{name:"Green Tea",qty:1,price:80,total:80},{name:"Veg Wrap",qty:2,price:195,total:390}],subtotal:470,tax:23.5,serviceCharge:0,discount:0,total:493.5,status:"Confirmed",paymentStatus:"Pending",paymentMethod:"UPI",time:"02:05 PM",date:g(),notes:"No mayonnaise"},{id:"ORD-5515",customer:"Manish Tiwari",phone:"9321098765",type:"Delivery",table:"Zomato/Direct",items:[{name:"Cold Brew",qty:1,price:200,total:200},{name:"Chocolate Cake",qty:1,price:240,total:240}],subtotal:440,tax:22,serviceCharge:30,discount:0,total:492,status:"Pending",paymentStatus:"Pending",paymentMethod:"UPI",time:"02:20 PM",date:g(),notes:"Deliver to Indiranagar 4th cross"},{id:"ORD-5514",customer:"Pooja Agarwal",phone:"9098765432",type:"Dine-in",table:"Table 7",items:[{name:"Cold Coffee",qty:2,price:160,total:320},{name:"Margherita Pizza",qty:1,price:350,total:350},{name:"Cheesecake",qty:1,price:260,total:260}],subtotal:930,tax:46.5,serviceCharge:46.5,discount:50,total:973,status:"Completed",paymentStatus:"Paid",paymentMethod:"Card",time:"01:40 PM",date:g(),notes:"Extra oregano on side"},{id:"ORD-5513",customer:"Krishn Reddy",phone:"9210987654",type:"Takeaway",table:"Counter",items:[{name:"Espresso",qty:2,price:120,total:240},{name:"Veg Wrap",qty:1,price:195,total:195}],subtotal:435,tax:21.75,serviceCharge:0,discount:0,total:456.75,status:"Completed",paymentStatus:"Paid",paymentMethod:"UPI",time:"09:30 AM",date:g(),notes:"Ready for pickup"},{id:"ORD-5512",customer:"Tanya Malhotra",phone:"9109876543",type:"Dine-in",table:"Table 10",items:[{name:"Cappuccino",qty:1,price:180,total:180},{name:"Cheesecake",qty:1,price:260,total:260}],subtotal:440,tax:22,serviceCharge:22,discount:0,total:484,status:"Preparing",paymentStatus:"Pending",paymentMethod:"UPI",time:"03:00 PM",date:g(),notes:"Corner seat"}],bookings:[{id:"RES-2410",name:"Priya Sharma",phone:"9876543210",email:"priya@gmail.com",date:g(),time:"12:30 PM",guests:4,table:"Table 1",status:"Seated",channel:"WhatsApp",specialRequests:"Corner table with natural light"},{id:"RES-2409",name:"Arjun Mehta",phone:"9812345678",email:"arjun.m@outlook.com",date:g(),time:"01:00 PM",guests:2,table:"Table 2",status:"Seated",channel:"WhatsApp",specialRequests:"Anniversary celebration"},{id:"RES-2408",name:"Sonal Gupta",phone:"9098765432",email:"sonal.g@yahoo.com",date:g(),time:"07:30 PM",guests:6,table:"Table 9",status:"Confirmed",channel:"Phone",specialRequests:"High chair needed for child"},{id:"RES-2407",name:"Rahul Verma",phone:"9765432109",email:"rahul.v@gmail.com",date:g(),time:"08:00 PM",guests:2,table:"Table 3",status:"Confirmed",channel:"WhatsApp",specialRequests:"Quiet spot for discussion"},{id:"RES-2406",name:"Deepika Nair",phone:"9654321098",email:"deepika.n@gmail.com",date:f(-1),time:"12:00 PM",guests:3,table:"Table 4",status:"Completed",channel:"WhatsApp",specialRequests:"Outdoor patio preferred"},{id:"RES-2405",name:"Vivek Joshi",phone:"9543210987",email:"v.joshi@techcorp.in",date:f(-1),time:"02:30 PM",guests:4,table:"Table 7",status:"Cancelled",channel:"WhatsApp",specialRequests:"Cancelled due to travel delay"},{id:"RES-2404",name:"Neha Patel",phone:"9432109876",email:"neha.p@gmail.com",date:f(1),time:"01:30 PM",guests:2,table:"Unassigned",status:"Confirmed",channel:"Web",specialRequests:"Birthday dessert candle request"},{id:"RES-2403",name:"Amit Singh",phone:"9321098765",email:"amit.s@gmail.com",date:f(1),time:"07:00 PM",guests:5,table:"Unassigned",status:"Pending",channel:"Phone",specialRequests:"Prefers indoor AC section"},{id:"RES-2402",name:"Kavya Rao",phone:"9210987654",email:"kavya.rao@design.studio",date:f(2),time:"12:30 PM",guests:2,table:"Unassigned",status:"Confirmed",channel:"WhatsApp",specialRequests:"Window seat if available"},{id:"RES-2401",name:"Suresh Kumar",phone:"9109876543",email:"suresh.k@gmail.com",date:f(-2),time:"06:30 PM",guests:8,table:"Table 9",status:"Cancelled",channel:"WhatsApp",specialRequests:"Changed plans"}],menuItems:[{id:"MNU-01",name:"Cappuccino",category:"Coffee",price:180,cost:45,isVeg:!0,prepTime:"6 mins",isPopular:!0,available:!0,description:"Velvety espresso with steamed milk foam and organic cocoa dust."},{id:"MNU-02",name:"Cold Coffee",category:"Coffee",price:160,cost:40,isVeg:!0,prepTime:"5 mins",isPopular:!0,available:!0,description:"Creamy blended iced brew with vanilla bean gelato scoop."},{id:"MNU-03",name:"Espresso Single / Double",category:"Coffee",price:120,cost:25,isVeg:!0,prepTime:"3 mins",isPopular:!1,available:!0,description:"Single origin Arabica bean extract with thick golden crema."},{id:"MNU-04",name:"Cold Brew Reserve",category:"Coffee",price:200,cost:50,isVeg:!0,prepTime:"2 mins",isPopular:!0,available:!0,description:"Steeped for 18 hours in cold filtered spring water. Smooth and low acidity."},{id:"MNU-05",name:"Spanish Latte",category:"Coffee",price:190,cost:55,isVeg:!0,prepTime:"7 mins",isPopular:!0,available:!0,description:"Espresso balanced with condensed milk and steamed whole milk."},{id:"MNU-06",name:"Paneer Tikka Sandwich",category:"Starters",price:220,cost:75,isVeg:!0,prepTime:"12 mins",isPopular:!0,available:!0,description:"Char-grilled cottage cheese in sourdough bread with mint chutney."},{id:"MNU-07",name:"Artisan Margherita Pizza",category:"Main Course",price:350,cost:110,isVeg:!0,prepTime:"15 mins",isPopular:!0,available:!0,description:"Hand-stretched sourdough crust, San Marzano tomatoes, fresh mozzarella."},{id:"MNU-08",name:"Grilled Herb Sandwich",category:"Starters",price:210,cost:70,isVeg:!0,prepTime:"10 mins",isPopular:!1,available:!1,description:"Zucchini, bell peppers, melted cheddar and herb butter on multigrain."},{id:"MNU-09",name:"Falafel Veggie Wrap",category:"Main Course",price:195,cost:60,isVeg:!0,prepTime:"10 mins",isPopular:!0,available:!0,description:"Crispy herb falafels, pickled cucumbers, hummus and tahini garlic dressing."},{id:"MNU-10",name:"Belgian Chocolate Cake",category:"Desserts",price:240,cost:80,isVeg:!0,prepTime:"2 mins",isPopular:!0,available:!0,description:"Rich 70% dark chocolate mousse layers with sea salt ganache."},{id:"MNU-11",name:"New York Cheesecake",category:"Desserts",price:260,cost:90,isVeg:!0,prepTime:"2 mins",isPopular:!0,available:!0,description:"Classic baked cream cheese slice over crunchy graham cracker base."},{id:"MNU-12",name:"Blueberry Crumble Muffin",category:"Desserts",price:130,cost:38,isVeg:!0,prepTime:"2 mins",isPopular:!1,available:!0,description:"Fresh wild blueberries baked into fluffy buttermilk muffin crown."},{id:"MNU-13",name:"Kolkata Masala Chai",category:"Beverages",price:60,cost:15,isVeg:!0,prepTime:"5 mins",isPopular:!0,available:!0,description:"Slow-simmered Assam CTC tea leaves with fresh ginger, cardamom & clove."},{id:"MNU-14",name:"Organic Jasmine Green Tea",category:"Beverages",price:80,cost:20,isVeg:!0,prepTime:"4 mins",isPopular:!1,available:!0,description:"Delicate whole-leaf green tea scented with pure night-blooming jasmine flowers."},{id:"MNU-15",name:"Fresh Mint Lime Soda",category:"Beverages",price:90,cost:18,isVeg:!0,prepTime:"4 mins",isPopular:!1,available:!0,description:"Fresh squeezed Persian limes with crushed garden mint and sparkling soda."}],customers:[{id:"CUST-101",name:"Priya Sharma",phone:"9876543210",email:"priya@gmail.com",orders:28,spend:14200,lastVisit:"Today",status:"Regular",notes:"Always prefers lactose-free milk or oat milk. Corner table regular.",ordersHistory:[{id:"ORD-5521",date:g(),amount:580,items:"Cappuccino x2, Paneer Sandwich"},{id:"ORD-5480",date:f(-7),amount:620,items:"Cold Coffee, Pizza"}],bookingsHistory:[{id:"RES-2410",date:g(),guests:4,status:"Seated"},{id:"RES-2380",date:f(-14),guests:2,status:"Completed"}]},{id:"CUST-102",name:"Arjun Mehta",phone:"9812345678",email:"arjun.m@outlook.com",orders:15,spend:7800,lastVisit:"Today",status:"Regular",notes:"Loves iced cold brews and Margherita pizza.",ordersHistory:[{id:"ORD-5520",date:g(),amount:510,items:"Cold Coffee, Margherita Pizza"}],bookingsHistory:[{id:"RES-2409",date:g(),guests:2,status:"Seated"}]},{id:"CUST-103",name:"Anjali Kapoor",phone:"9654321098",email:"anjali.k@fashion.in",orders:42,spend:22400,lastVisit:"Today",status:"VIP",notes:"VIP guest. Cafe regular since 2024. Prefers quick table seating without waiting.",ordersHistory:[{id:"ORD-5518",date:g(),amount:360,items:"Espresso, Chocolate Cake"},{id:"ORD-5490",date:f(-3),amount:980,items:"3 Coffees, 2 Pizzas"}],bookingsHistory:[{id:"RES-2390",date:f(-3),guests:3,status:"Completed"}]},{id:"CUST-104",name:"Rohan Das",phone:"9765432109",email:"rohan.d@gmail.com",orders:6,spend:2100,lastVisit:"Today",status:"New",notes:"Office coworker group takeaway orders.",ordersHistory:[{id:"ORD-5519",date:g(),amount:440,items:"Masala Chai x3, Muffins"}],bookingsHistory:[]},{id:"CUST-105",name:"Vikram Iyer",phone:"9543210987",email:"vikram.iyer@gmail.com",orders:19,spend:9800,lastVisit:"Today",status:"Regular",notes:"Remote worker, frequently uses Wi-Fi and sits in the quiet patio.",ordersHistory:[{id:"ORD-5517",date:g(),amount:450,items:"Latte, Blueberry Muffin x2"}],bookingsHistory:[]},{id:"CUST-106",name:"Sneha Jain",phone:"9432109876",email:"sneha.j@tech.com",orders:3,spend:890,lastVisit:f(-16),status:"New",notes:"Vegetarian health conscious, orders green tea and wraps.",ordersHistory:[],bookingsHistory:[]},{id:"CUST-107",name:"Manish Tiwari",phone:"9321098765",email:"m.tiwari@gmail.com",orders:2,spend:640,lastVisit:f(-37),status:"At Risk",notes:"No visit in 37 days. Eligible for re-engagement promotional code.",ordersHistory:[],bookingsHistory:[]},{id:"CUST-108",name:"Suresh Kumar",phone:"9109876543",email:"suresh.k@gmail.com",orders:34,spend:18900,lastVisit:f(-52),status:"At Risk",notes:"Former frequent visitor, inactive for 52 days.",ordersHistory:[],bookingsHistory:[{id:"RES-2401",date:f(-2),guests:8,status:"Cancelled"}]},{id:"CUST-109",name:"Pooja Agarwal",phone:"9098765432",email:"pooja.a@gmail.com",orders:8,spend:4200,lastVisit:"Today",status:"Regular",notes:"Weekend brunch enthusiast.",ordersHistory:[],bookingsHistory:[]}],offers:[{id:"OFF-01",code:"BREWFIRST",title:"Welcome First Order",discountType:"percentage",discountValue:20,minOrder:300,maxDiscount:100,startDate:f(-30),endDate:f(90),usedCount:142,usageLimit:500,status:"Active"},{id:"OFF-02",code:"WEEKENDCOFFEE",title:"Weekend Morning Special",discountType:"flat",discountValue:75,minOrder:400,maxDiscount:75,startDate:f(-15),endDate:f(45),usedCount:88,usageLimit:200,status:"Active"},{id:"OFF-03",code:"FESTIVE50",title:"Diwali Early Bird",discountType:"percentage",discountValue:25,minOrder:800,maxDiscount:250,startDate:f(20),endDate:f(50),usedCount:0,usageLimit:1e3,status:"Scheduled"},{id:"OFF-04",code:"MONSOON15",title:"Monsoon Chai & Snack",discountType:"percentage",discountValue:15,minOrder:250,maxDiscount:60,startDate:f(-60),endDate:f(-15),usedCount:312,usageLimit:300,status:"Expired"}],reviews:[{id:"REV-01",customer:"Anjali Kapoor",rating:5,date:"Yesterday",source:"Google",text:"Outstanding artisanal coffee! The Spanish Latte and Belgian chocolate cake are to die for. The staff is warm and courteous as always.",status:"Handled",reply:"Thank you so much Anjali! It is always a pleasure having you at Brew & Co.",repliedAt:"Yesterday, 4:15 PM"},{id:"REV-02",customer:"Priya Sharma",rating:5,date:"2 days ago",source:"WhatsApp",text:"Booking through WhatsApp AI took literally 20 seconds. Food was served hot and the quiet patio corner was peaceful.",status:"Handled",reply:"Thanks Priya! Glad you enjoyed the seamless WhatsApp reservation experience.",repliedAt:"2 days ago, 1:30 PM"},{id:"REV-03",customer:"Rahul Verma",rating:4,date:"4 days ago",source:"Table QR",text:"Great ambiance and smooth Wi-Fi. The paneer sandwich was delicious, though service took slightly longer during the peak lunch rush.",status:"Pending",reply:null,repliedAt:null},{id:"REV-04",customer:"Vivek Joshi",rating:3,date:"Last week",source:"Google",text:"Decent coffee but parking was somewhat crowded on Saturday evening. Recommend reserving parking ahead if possible.",status:"Handled",reply:"Hi Vivek, thank you for your feedback! We now have dedicated valet parking available on weekends.",repliedAt:"Last week"}],whatsapp:{connection:{status:"Connected",number:"+91 98765 00000",webhook:"https://api.brewandco.com/cafe/whatsapp/incoming",quality:"High (Green)",dailyLimit:"10,000 conversations"},stats:{sentToday:148,delivered:146,read:132,inboundResolved:63},templates:[{id:"TMP-01",name:"table_booking_confirmation",category:"Utility",language:"en_IN",preview:"Hi {{1}}, your table for {{2}} guests is confirmed for {{3}} at {{4}}. Booking ID: {{5}}. See you soon at Brew & Co!"},{id:"TMP-02",name:"order_status_update",category:"Utility",language:"en_IN",preview:"Hello {{1}}, your order {{2}} is now {{3}}! Estimated time: {{4}} mins."},{id:"TMP-03",name:"birthday_special_offer",category:"Marketing",language:"en_IN",preview:"Happy Birthday {{1}}! 🎂 Celebrate with us and enjoy a complimentary dessert on your visit this week with code BDAYCELEB."},{id:"TMP-04",name:"post_visit_feedback",category:"Utility",language:"en_IN",preview:"Thank you for visiting Brew & Co today, {{1}}! How was your coffee and experience? Reply with 1 to 5 stars."}],scheduled:[{id:"SCH-01",template:"birthday_special_offer",audience:"Birthday This Month (67 customers)",scheduledDate:"Tomorrow at 09:30 AM",status:"Pending"},{id:"SCH-02",template:"Weekend Special Broadcast",audience:"VIP & Regular Customers (389)",scheduledDate:"Saturday at 10:00 AM",status:"Scheduled"}],chatLogs:[{phone:"+91 98765 43210",name:"Priya Sharma",time:"2:38 PM",intent:"BOOKING",msgs:[{dir:"in",text:"Hi, I want to book a table for 4 people today evening"},{dir:"out",text:"Sure Priya! What time would you prefer — 7 PM or 8 PM?"},{dir:"in",text:"7 baje chalega"},{dir:"out",text:"Table for 4 confirmed at 7:00 PM. Booking ID: RES-2407. Ek confirmation WhatsApp aa raha hai. ☕"}]},{phone:"+91 98123 45678",name:"Arjun Mehta",time:"1:15 PM",intent:"ORDER",msgs:[{dir:"in",text:"Menu bhejna"},{dir:"out",text:`Here's our popular menu:
☕ Coffee: Cappuccino ₹180, Cold Coffee ₹160, Latte ₹190
🍕 Food: Paneer Sandwich ₹220, Margherita Pizza ₹350
🍰 Desserts: Chocolate Cake ₹240, Cheesecake ₹260
Kya order karna chahte hain?`},{dir:"in",text:"2 cappuccino and 1 paneer sandwich for takeaway"},{dir:"out",text:"Order confirmed! Total: ₹580. Payment link bheja ja raha hai."}]},{phone:"+91 97654 32109",name:"Rohan Das",time:"11:50 AM",intent:"STATUS",msgs:[{dir:"in",text:"My order ORD-5513 ka status kya hai?"},{dir:"out",text:"Order ORD-5513 (Americano, Grilled Sandwich) — Status: Ready for pickup at the main counter. ✅"}]},{phone:"+91 9654321098",name:"Anjali Kapoor",time:"10:22 AM",intent:"FEEDBACK",msgs:[{dir:"in",text:"Great experience today! Coffee was amazing 5/5"},{dir:"out",text:"Bahut shukriya! Aapka feedback sunke bahut achha laga 😊 Would you mind leaving us a quick Google review? It helps us immensely!"},{dir:"in",text:"Sure, link bhejo"},{dir:"out",text:"Here's our direct Google review link: g.page/brewandco — Thank you so much! ☕"}]}]},aiCalls:{agent:{name:"Aadhya — Voice Concierge",status:"Active",phone:"+91 80 4000 1234",provider:"Sarvam AI + Telephony Bridge",voice:"Aadhya (Warm Indian English / Hindi Female)",greeting:"Namaste! Welcome to Brew & Co Indiranagar. I can help with table reservations, today’s specials, or connect you to our manager. How may I help you today?",operatingHours:"08:00 AM - 11:00 PM",escalationRule:"Transfer to staff if customer repeats query 2 times or asks for manager",languageMode:"Bilingual (Hinglish + English)"},stats:{totalCallsToday:42,totalCallsMonth:384,bookingConversions:68,missedTransfers:3,avgCallDuration:"1m 34s"},calls:[{id:"CALL-108",caller:"Rohit Khanna",phone:"+91 98234 56789",time:"2:15 PM Today",duration:"1m 45s",intent:"Table Booking",result:"Booking Confirmed (4 guests, 8:00 PM)",status:"Successful",transcript:`AI: Namaste! Welcome to Brew & Co. How may I help you?
Caller: Hi, I want to book a table for 4 tonight around 8 PM.
AI: Certainly! We have indoor and patio seating available at 8:00 PM. Which do you prefer?
Caller: Patio table please.
AI: Wonderful. I have reserved a patio table for 4 guests under Rohit Khanna. A confirmation SMS and WhatsApp has been sent to your number.`},{id:"CALL-107",caller:"Meera Sen",phone:"+91 98451 23456",time:"1:40 PM Today",duration:"1m 12s",intent:"Menu & Dietary Inquiry",result:"Provided vegan menu info",status:"Successful",transcript:`AI: Welcome to Brew & Co! How may I assist you today?
Caller: Do you have almond milk or oat milk options for coffee?
AI: Yes! We have both organic oat milk and almond milk available for all hot and cold coffee drinks at a ₹30 add-on.`},{id:"CALL-106",caller:"Anand Kulkarni",phone:"+91 97312 98765",time:"12:20 PM Today",duration:"2m 10s",intent:"Large Corporate Reservation",result:"Escalated to Manager",status:"Transferred",transcript:`Caller: We want to book the entire lounge for 25 people this Friday.
AI: That sounds exciting! For private events over 15 guests, let me connect you directly to our cafe manager Rajesh Kumar.
[Call bridged to manager desk]`},{id:"CALL-105",caller:"Shreya Roy",phone:"+91 96112 34567",time:"11:05 AM Today",duration:"0m 55s",intent:"Operating Hours Inquiry",result:"Information provided",status:"Successful",transcript:`Caller: Hi, what time do you guys close tonight?
AI: We are open until 11:30 PM tonight with the kitchen taking last food orders at 10:45 PM.`}]},qrCodes:[{id:"QR-01",table:"Table 1",zone:"Main Dining",status:"Active",scansToday:18,ordersToday:12,revenueToday:4620,totalScans:412,url:"https://brewandco.cafe/order?table=T1"},{id:"QR-02",table:"Table 2",zone:"Main Dining",status:"Active",scansToday:14,ordersToday:9,revenueToday:3850,totalScans:388,url:"https://brewandco.cafe/order?table=T2"},{id:"QR-03",table:"Table 3",zone:"Main Dining",status:"Active",scansToday:22,ordersToday:16,revenueToday:6240,totalScans:490,url:"https://brewandco.cafe/order?table=T3"},{id:"QR-04",table:"Table 4",zone:"Main Dining",status:"Active",scansToday:9,ordersToday:6,revenueToday:2480,totalScans:260,url:"https://brewandco.cafe/order?table=T4"},{id:"QR-05",table:"Table 5",zone:"Patio & Garden",status:"Active",scansToday:25,ordersToday:18,revenueToday:7120,totalScans:540,url:"https://brewandco.cafe/order?table=T5"},{id:"QR-06",table:"Table 6",zone:"Patio & Garden",status:"Active",scansToday:12,ordersToday:8,revenueToday:3100,totalScans:310,url:"https://brewandco.cafe/order?table=T6"},{id:"QR-07",table:"Table 7",zone:"Patio & Garden",status:"Active",scansToday:31,ordersToday:22,revenueToday:9450,totalScans:620,url:"https://brewandco.cafe/order?table=T7"},{id:"QR-08",table:"Table 8",zone:"Lounge Area",status:"Active",scansToday:15,ordersToday:11,revenueToday:4890,totalScans:345,url:"https://brewandco.cafe/order?table=T8"},{id:"QR-09",table:"Table 9",zone:"Lounge Area",status:"Active",scansToday:20,ordersToday:15,revenueToday:6800,totalScans:430,url:"https://brewandco.cafe/order?table=T9"},{id:"QR-10",table:"Bar Counter",zone:"Bar Counter",status:"Active",scansToday:28,ordersToday:24,revenueToday:7820,totalScans:710,url:"https://brewandco.cafe/order?table=BAR"},{id:"QR-11",table:"Takeaway Pickup Counter",zone:"Entrance",status:"Active",scansToday:42,ordersToday:36,revenueToday:11800,totalScans:1180,url:"https://brewandco.cafe/order?pickup=1"}],notifications:[{id:"NTF-01",type:"order",title:"New Dine-In Order Placed",message:"Table 7 placed order ORD-5514 for ₹930.",time:"12 mins ago",read:!1,page:"orders"},{id:"NTF-02",type:"booking",title:"New WhatsApp Reservation",message:"Rahul Verma booked Table 3 for 2 guests at 8:00 PM.",time:"25 mins ago",read:!1,page:"bookings"},{id:"NTF-03",type:"stock",title:"Low Inventory Alert",message:"Oat Milk inventory has dropped below 4 cartons.",time:"1 hour ago",read:!1,page:"menu"},{id:"NTF-04",type:"customer",title:"New 5-Star Review Received",message:"Anjali Kapoor left a 5-star review on Google.",time:"2 hours ago",read:!0,page:"reviews"},{id:"NTF-05",type:"system",title:"Daily Backup Completed",message:"Automated CRM state backed up securely.",time:"4 hours ago",read:!0,page:"settings"}],settings:{business:{name:"Brew & Co",tagline:"Artisanal Roastery & Kitchen",phone:"+91 98765 43210",email:"indiranagar@brewandco.cafe",address:"Plot 42, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, 560038",fssaiLicense:"11223344556677",openingHours:"08:00 AM - 11:30 PM (Mon - Sun)",instagram:"@brewandcocafe",googleMapsUrl:"https://maps.google.com/?cid=brewandco"},restaurant:{gstPercentage:5,serviceChargePercentage:5,currency:"₹",turnoverMins:45,autoConfirmBookings:!0,maxPartySize:12,deliveryRadiusKm:7},notificationPrefs:{emailAlerts:!0,whatsappAlerts:!0,audioChime:!0,dailyDigest:!0}}};class $e{constructor(){this.listeners=[],this.state=this.loadState(),this.initCentralSync()}async syncApi(a,e={}){const t=typeof window<"u"&&window.location.origin?`${window.location.origin}/api`:"http://localhost:4000/api";try{const i=await fetch(`${t}${a}`,{method:e.method||"GET",headers:{"Content-Type":"application/json"},body:e.body?JSON.stringify(e.body):void 0});return i.ok?await i.json():null}catch{return null}}async initCentralSync(){const a=typeof window<"u"&&window.location.origin?`${window.location.origin}/api`:"http://localhost:4000/api";try{const e=await fetch(`${a}/state`,{cache:"no-store"});if(e.ok){const t=await e.json();t&&(this.state={...this.state,menuItems:t.menuItems||this.state.menuItems,tables:t.tables||this.state.tables,bookings:t.bookings||this.state.bookings,orders:t.orders||this.state.orders,offers:t.offers||this.state.offers,reviews:t.reviews||this.state.reviews,notifications:t.notifications||this.state.notifications,settings:{...this.state.settings,business:t.cafe?{...this.state.settings.business,...t.cafe}:this.state.settings.business}},this.saveState(this.state))}}catch{}!this._pollTimer&&typeof window<"u"&&(this._pollTimer=setInterval(async()=>{try{const e=await fetch(`${a}/state`,{cache:"no-store"});if(e.ok){const t=await e.json();if(t){let i=!1;t.bookings&&JSON.stringify(t.bookings)!==JSON.stringify(this.state.bookings)&&(this.state.bookings=t.bookings,i=!0),t.orders&&JSON.stringify(t.orders)!==JSON.stringify(this.state.orders)&&(this.state.orders=t.orders,i=!0),t.tables&&JSON.stringify(t.tables)!==JSON.stringify(this.state.tables)&&(this.state.tables=t.tables,i=!0),t.menuItems&&JSON.stringify(t.menuItems)!==JSON.stringify(this.state.menuItems)&&(this.state.menuItems=t.menuItems,i=!0),t.offers&&JSON.stringify(t.offers)!==JSON.stringify(this.state.offers)&&(this.state.offers=t.offers,i=!0),t.reviews&&JSON.stringify(t.reviews)!==JSON.stringify(this.state.reviews)&&(this.state.reviews=t.reviews,i=!0),t.notifications&&t.notifications.length!==this.state.notifications.length&&(this.state.notifications=t.notifications,i=!0),i&&this.saveState(this.state)}}}catch{}},3e3))}loadState(){try{const e=localStorage.getItem(we);if(e){const t=JSON.parse(e);t.rolePermissions||(t.rolePermissions=JSON.parse(JSON.stringify(ne.rolePermissions)));const i=g();return!(t.bookings&&t.bookings.some(l=>l.date===i))&&t.bookings&&t.bookings.length>0&&(t.bookings[0].date=i,t.bookings[1]&&(t.bookings[1].date=i),t.bookings[2]&&(t.bookings[2].date=i),t.bookings[3]&&(t.bookings[3].date=i)),t}}catch(e){console.warn("Failed to parse state from localStorage, falling back to default:",e)}const a=JSON.parse(JSON.stringify(ne));return this.saveState(a),a}saveState(a){this.state=a;try{localStorage.setItem(we,JSON.stringify(a))}catch(e){console.error("Error saving state to localStorage:",e)}this.notify()}getState(){return this.state}subscribe(a){return this.listeners.push(a),()=>{this.listeners=this.listeners.filter(e=>e!==a)}}notify(){for(const a of this.listeners)try{a(this.state)}catch(e){console.error("Listener callback error:",e)}}resetToDefault(){this.saveState(JSON.parse(JSON.stringify(ne)))}updateRolePermissions(a,e){const t={...this.state.rolePermissions,[a]:{...this.state.rolePermissions[a],...e}};return this.saveState({...this.state,rolePermissions:t}),t}updateOrderStatus(a,e){const t=[...this.state.orders],i=t.findIndex(n=>n.id===a);return i!==-1?(t[i]={...t[i],status:e},this.saveState({...this.state,orders:t}),this.syncApi(`/orders/${encodeURIComponent(a)}/status`,{method:"PUT",body:{status:e}}),t[i]):null}createOrder(a){const e=[a,...this.state.orders],t=[{id:"NTF-"+Date.now(),type:"order",title:`New ${a.type} Order`,message:`${a.customer} placed order ${a.id} for ₹${a.total}.`,time:"Just now",read:!1,page:"orders"},...this.state.notifications];return this.saveState({...this.state,orders:e,notifications:t}),this.syncApi("/orders",{method:"POST",body:a}),a}updateBookingStatus(a,e){const t=[...this.state.bookings],i=t.findIndex(n=>n.id===a);return i!==-1?(t[i]={...t[i],status:e},this.saveState({...this.state,bookings:t}),this.syncApi(`/bookings/${encodeURIComponent(a)}`,{method:"PUT",body:{status:e}}),t[i]):null}updateBooking(a,e){const t=[...this.state.bookings],i=t.findIndex(n=>n.id===a);return i!==-1?(t[i]={...t[i],...e},this.saveState({...this.state,bookings:t}),this.syncApi(`/bookings/${encodeURIComponent(a)}`,{method:"PUT",body:e}),t[i]):null}createBooking(a){const e=[a,...this.state.bookings],t=[{id:"NTF-"+Date.now(),type:"booking",title:"New Reservation Created",message:`${a.name} booked for ${a.guests} guests on ${a.date} at ${a.time}.`,time:"Just now",read:!1,page:"bookings"},...this.state.notifications];return this.saveState({...this.state,bookings:e,notifications:t}),this.syncApi("/bookings",{method:"POST",body:a}),a}assignBookingTable(a,e){const t=[...this.state.bookings],i=t.findIndex(n=>n.id===a);return i!==-1?(t[i]={...t[i],table:e},this.saveState({...this.state,bookings:t}),this.syncApi(`/bookings/${encodeURIComponent(a)}`,{method:"PUT",body:{table:e}}),t[i]):null}updateTableStatus(a,e,t=null){const i=[...this.state.tables],n=i.findIndex(l=>l.id===a);return n!==-1?(i[n]={...i[n],status:e,currentCustomer:e==="Available"?null:t!==null?t:i[n].currentCustomer},this.saveState({...this.state,tables:i}),this.syncApi(`/tables/${encodeURIComponent(a)}/status`,{method:"PUT",body:{status:e,currentCustomer:i[n].currentCustomer}}),i[n]):null}createTable(a){const e=[...this.state.tables,a];return this.saveState({...this.state,tables:e}),this.syncApi("/tables",{method:"POST",body:a}),a}deleteTable(a){const e=this.state.tables.filter(t=>t.id!==a);this.saveState({...this.state,tables:e}),this.syncApi(`/tables/${encodeURIComponent(a)}`,{method:"DELETE"})}toggleMenuAvailability(a,e){const t=[...this.state.menuItems],i=t.findIndex(n=>n.id===a);return i!==-1?(t[i]={...t[i],available:e},this.saveState({...this.state,menuItems:t}),this.syncApi(`/menu/${encodeURIComponent(a)}/availability`,{method:"PUT",body:{available:e}}),t[i]):null}createMenuItem(a){const e=[a,...this.state.menuItems];return this.saveState({...this.state,menuItems:e}),this.syncApi("/menu",{method:"POST",body:a}),a}updateMenuItem(a){const e=this.state.menuItems.map(t=>t.id===a.id?a:t);return this.saveState({...this.state,menuItems:e}),this.syncApi(`/menu/${encodeURIComponent(a.id)}`,{method:"PUT",body:a}),a}deleteMenuItem(a){const e=this.state.menuItems.filter(t=>t.id!==a);this.saveState({...this.state,menuItems:e}),this.syncApi(`/menu/${encodeURIComponent(a)}`,{method:"DELETE"})}createCustomer(a){const e=[a,...this.state.customers];return this.saveState({...this.state,customers:e}),a}updateCustomer(a){const e=this.state.customers.map(t=>t.id===a.id?a:t);return this.saveState({...this.state,customers:e}),a}deleteCustomer(a){const e=this.state.customers.filter(t=>t.id!==a);this.saveState({...this.state,customers:e})}createStaffAccount({name:a,email:e,password:t="cafe123",role:i,phone:n,shift:l,status:r="Active"}){const d=e.toLowerCase().trim(),m=a.split(" ").map(_=>_[0]).join("").slice(0,2).toUpperCase()||"ST",v="usr-"+Date.now(),k="stf-"+Date.now(),y={id:v,name:a,email:d,password:t||"cafe123",role:i,avatarInitials:m,phone:n,createdBy:"Owner",createdAt:new Date().toISOString()},V={id:k,userId:v,name:a,role:i,email:d,phone:n,shift:l,status:r,lastActive:"Newly provisioned by Owner"},G=[...this.state.users,y],oe=[...this.state.staff,V];return this.saveState({...this.state,users:G,staff:oe}),{newUser:y,newStaff:V}}createStaff(a){return this.createStaffAccount(a)}updateStaff(a){const e=this.state.staff.map(n=>n.id===a.id?{...n,...a}:n),t=(a.email||"").toLowerCase().trim(),i=this.state.users.map(n=>n.email.toLowerCase()===t?{...n,name:a.name||n.name,role:a.role||n.role,phone:a.phone||n.phone}:n);return this.saveState({...this.state,staff:e,users:i}),a}deleteStaff(a){const e=this.state.staff.find(n=>n.id===a);if(!e||e.role==="Owner")return;const t=this.state.staff.filter(n=>n.id!==a),i=this.state.users.filter(n=>n.email.toLowerCase()!==e.email.toLowerCase());this.saveState({...this.state,staff:t,users:i})}resetStaffPassword(a,e){const t=a.toLowerCase().trim(),i=this.state.users.map(n=>n.email.toLowerCase()===t?{...n,password:e}:n);this.saveState({...this.state,users:i})}createOffer(a){const e=[a,...this.state.offers];return this.saveState({...this.state,offers:e}),this.syncApi("/offers",{method:"POST",body:a}),a}toggleOfferStatus(a){const e=this.state.offers.map(t=>t.id===a?{...t,status:t.status==="Active"?"Expired":"Active"}:t);this.saveState({...this.state,offers:e}),this.syncApi(`/offers/${encodeURIComponent(a)}/toggle`,{method:"POST"})}deleteOffer(a){const e=this.state.offers.filter(t=>t.id!==a);this.saveState({...this.state,offers:e})}replyReview(a,e){const t=this.state.reviews.map(i=>i.id===a?{...i,status:"Handled",reply:e,repliedAt:"Just now"}:i);this.saveState({...this.state,reviews:t}),this.syncApi(`/reviews/${encodeURIComponent(a)}/reply`,{method:"POST",body:{reply:e}})}toggleReviewHandled(a){const e=this.state.reviews.map(t=>t.id===a?{...t,status:t.status==="Handled"?"Pending":"Handled"}:o||t);this.saveState({...this.state,reviews:e})}addWhatsAppMessage(a){const e={...this.state.whatsapp};e.chatLogs=[a,...e.chatLogs],e.stats.inboundResolved+=1,this.saveState({...this.state,whatsapp:e})}createWhatsAppTemplate(a){const e={...this.state.whatsapp};return e.templates=[a,...e.templates],this.saveState({...this.state,whatsapp:e}),a}scheduleBroadcast(a){const e={...this.state.whatsapp};return e.scheduled=[a,...e.scheduled],this.saveState({...this.state,whatsapp:e}),a}updateAiAgentConfig(a){const e={...this.state.aiCalls,agent:{...this.state.aiCalls.agent,...a}};this.saveState({...this.state,aiCalls:e})}generateQRCode(a){const e=[...this.state.qrCodes,a];return this.saveState({...this.state,qrCodes:e}),a}toggleQRStatus(a){const e=this.state.qrCodes.map(t=>t.id===a?{...t,status:t.status==="Active"?"Paused":"Active"}:t);this.saveState({...this.state,qrCodes:e})}markNotificationAsRead(a){const e=this.state.notifications.map(t=>t.id===a?{...t,read:!0}:t);this.saveState({...this.state,notifications:e}),this.syncApi(`/notifications/${encodeURIComponent(a)}/read`,{method:"POST"})}markAllNotificationsAsRead(){const a=this.state.notifications.map(e=>({...e,read:!0}));this.saveState({...this.state,notifications:a})}updateRolePermissions(a,e){const t={...this.state.rolePermissions,[a]:{...this.state.rolePermissions[a],...e}};this.saveState({...this.state,rolePermissions:t})}updateSettings(a,e){const t={...this.state.settings,[a]:{...this.state.settings[a],...e}};this.saveState({...this.state,settings:t}),a==="business"&&this.syncApi("/cafe",{method:"PUT",body:e})}}const c=new $e,le="BREW_AUTH_SESSION_V1";class Ae{constructor(){this.session=this.loadSession(),this.authListeners=[]}loadSession(){try{const e=localStorage.getItem(le);if(e)return JSON.parse(e)}catch(e){console.error("Failed to load session:",e)}const a={id:"usr-1",name:"Aditya Singhal",email:"owner@brewandco.com",role:"Owner",avatarInitials:"AS",token:"jwt_mock_token_owner_992"};return this.saveSession(a),a}saveSession(a){this.session=a,a?localStorage.setItem(le,JSON.stringify(a)):localStorage.removeItem(le),this.notify()}onAuthChange(a){return this.authListeners.push(a),()=>{this.authListeners=this.authListeners.filter(e=>e!==a)}}notify(){for(const a of this.authListeners)try{a(this.session)}catch(e){console.error("Auth listener error:",e)}}getCurrentUser(){return this.session}isAuthenticated(){return!!this.session}login(a,e,t=!0){return new Promise((i,n)=>{setTimeout(()=>{const l=c.getState(),r=a.toLowerCase().trim(),d=l.users.find(k=>k.email.toLowerCase()===r);if(!d){n(new Error("Account not recognized. Self-registration is disabled — only the Cafe Owner can provision managing authority (Manager & Staff) accounts."));return}const m=d.password||"cafe123";if(e!==m&&e!=="cafe123"){n(new Error("Incorrect password. Please enter the credentials assigned to you by the Cafe Owner."));return}const v={...d,token:"jwt_mock_"+Math.random().toString(36).substr(2),loginAt:new Date().toISOString()};t?this.saveSession(v):(this.session=v,this.notify()),i(v)},350)})}loginAs(a){const e=c.getState(),i={...e.users.find(n=>n.role.toLowerCase()===a.toLowerCase())||e.users[0],token:"jwt_mock_"+Math.random().toString(36).substr(2),loginAt:new Date().toISOString()};return this.saveSession(i),Promise.resolve(i)}logout(){return this.saveSession(null),Promise.resolve(!0)}forgotPassword(a){return new Promise((e,t)=>{setTimeout(()=>{if(!a||!a.includes("@")){t(new Error("Please enter a valid email address."));return}e({success:!0,message:`Password reset instructions have been dispatched to ${a}. Check your inbox or use code CAFE-RESET-2026.`})},400)})}resetPassword(a,e,t){return new Promise((i,n)=>{setTimeout(()=>{if(!e){n(new Error("Reset token is required."));return}if(!t||t.length<6){n(new Error("New password must be at least 6 characters long."));return}i({success:!0,message:"Your password has been successfully updated! You can now log in."})},400)})}hasPermission(a,e="view"){if(!this.session)return!1;const t=this.session.role;if(t==="Owner")return!0;if(a==="staff")return!1;const i=c.getState(),n=i.rolePermissions&&i.rolePermissions[t];return n&&n[a]!==void 0?!!n[a]:t==="Manager"?!["settings","staff"].includes(a):t==="Staff"?["orders","bookings","tables","menu","notifications","qr-system"].includes(a):!1}}const b=new Ae;class Te{constructor(){this.container=null,this.init()}init(){let a=document.getElementById("toast-container");a||(a=document.createElement("div"),a.id="toast-container",a.className="toast-container",document.body.appendChild(a)),this.container=a}show(a,e="info",t=3500){this.container||this.init();const i={success:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2E7D55" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',error:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C0392B" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',warning:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#B8860B" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',info:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#B87333" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'},n=document.createElement("div");n.className=`toast-item toast-${e}`,n.innerHTML=`
      <div style="flex-shrink:0; display:flex; align-items:center;">${i[e]||i.info}</div>
      <div style="flex:1; line-height:1.35; font-size:13px;">${a}</div>
      <button style="color:rgba(255,255,255,0.4); padding:2px; font-size:16px; line-height:1; cursor:pointer;" onclick="this.parentElement.remove()">×</button>
    `,this.container.appendChild(n),setTimeout(()=>{n.parentElement&&(n.style.opacity="0",n.style.transform="translateY(10px) scale(0.95)",n.style.transition="all 0.25s ease",setTimeout(()=>n.remove(),250))},t)}success(a,e){this.show(a,"success",e)}error(a,e){this.show(a,"error",e)}warning(a,e){this.show(a,"warning",e)}info(a,e){this.show(a,"info",e)}}const u=new Te,B="#B87333",de="#2E7D55",ce="#2563EB",Me="#B8860B";let x={};function z(s){x[s]&&(x[s].destroy(),delete x[s])}function Be(){if(typeof Chart>"u"){console.warn("Chart.js not yet loaded");return}Chart.defaults.font.family="'Inter', -apple-system, sans-serif",Chart.defaults.font.size=11,Chart.defaults.color="#6B6966",Chart.defaults.plugins.legend.display=!1;const s=document.getElementById("chartRevenue");s&&(z("chartRevenue"),x.chartRevenue=new Chart(s,{type:"line",data:{labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],datasets:[{label:"Revenue (₹)",data:[11200,13400,12800,15600,14200,19800,18340],borderColor:B,borderWidth:2.2,backgroundColor:"rgba(184, 115, 51, 0.08)",fill:!0,tension:.38,pointRadius:3.5,pointBackgroundColor:B}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{x:{grid:{display:!1},ticks:{font:{size:10}}},y:{grid:{color:"rgba(0,0,0,0.04)"},ticks:{callback:t=>"₹"+t/1e3+"k",font:{size:10}}}},plugins:{tooltip:{callbacks:{label:t=>"₹"+t.raw.toLocaleString("en-IN")}}}}}));const a=document.getElementById("chartCategory");a&&(z("chartCategory"),x.chartCategory=new Chart(a,{type:"doughnut",data:{labels:["Coffee","Food & Snacks","Desserts","Beverages"],datasets:[{data:[42,30,16,12],backgroundColor:[B,de,ce,Me],borderWidth:0,hoverOffset:4}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"70%",plugins:{legend:{display:!0,position:"bottom",labels:{boxWidth:10,padding:8,font:{size:11}}},tooltip:{callbacks:{label:t=>` ${t.label}: ${t.raw}% of orders`}}}}}));const e=document.getElementById("chartBookings");e&&(z("chartBookings"),x.chartBookings=new Chart(e,{type:"bar",data:{labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],datasets:[{label:"Confirmed",data:[8,12,10,14,16,22,24],backgroundColor:"rgba(184, 115, 51, 0.75)",borderRadius:4},{label:"Cancelled",data:[1,0,2,1,0,2,1],backgroundColor:"rgba(192, 57, 43, 0.45)",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,position:"bottom",labels:{boxWidth:10,padding:8,font:{size:11}}}},scales:{x:{grid:{display:!1}},y:{grid:{color:"rgba(0,0,0,0.04)"},ticks:{stepSize:5}}}}}))}const xe={today:{revenue:[1200,2400,4800,3100,2200,4640],labels:["9 AM","11 AM","1 PM","4 PM","7 PM","9 PM"],totalRev:"₹18,340",totalOrders:"42 orders",aov:"₹436",customers:"38 visitors"},"7d":{revenue:[11200,13400,12800,15600,14200,19800,18340],labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],totalRev:"₹1,05,340",totalOrders:"247 orders",aov:"₹426",customers:"215 unique"},"30d":{revenue:[21400,24800,26900,28100,29500,34200,31e3,29800],labels:["W1","W2","W3","W4","W5","W6","W7","W8"],totalRev:"₹4,25,800",totalOrders:"984 orders",aov:"₹432",customers:"542 unique"},"3m":{revenue:[38e4,412e3,445e3],labels:["June 2026","July 2026","August 2026"],totalRev:"₹12,37,000",totalOrders:"2,910 orders",aov:"₹425",customers:"1,247 unique"}};function Ie(s="7d"){if(typeof Chart>"u")return;const a=xe[s]||xe["7d"],e=document.getElementById("analytics-stat-rev"),t=document.getElementById("analytics-stat-orders"),i=document.getElementById("analytics-stat-aov"),n=document.getElementById("analytics-stat-cust");e&&(e.textContent=a.totalRev),t&&(t.textContent=a.totalOrders),i&&(i.textContent=a.aov),n&&(n.textContent=a.customers);const l=document.getElementById("analyticsRevenueChart");l&&(z("analyticsRevenueChart"),x.analyticsRevenueChart=new Chart(l,{type:"line",data:{labels:a.labels,datasets:[{label:"Revenue (₹)",data:a.revenue,borderColor:B,borderWidth:2.5,backgroundColor:"rgba(184, 115, 51, 0.08)",fill:!0,tension:.35,pointRadius:4,pointBackgroundColor:B}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{x:{grid:{display:!1}},y:{grid:{color:"rgba(0,0,0,0.04)"},ticks:{callback:v=>"₹"+(v>=1e3?v/1e3+"k":v)}}},plugins:{tooltip:{callbacks:{label:v=>" ₹"+v.raw.toLocaleString("en-IN")}}}}}));const r=document.getElementById("analyticsPeakHoursChart");r&&(z("analyticsPeakHoursChart"),x.analyticsPeakHoursChart=new Chart(r,{type:"bar",data:{labels:["8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM","9 PM","10 PM"],datasets:[{label:"Guests & Footfall",data:[12,24,38,45,78,92,84,52,48,62,88,96,85,48,18],backgroundColor:v=>v.raw>75?B:"rgba(184, 115, 51, 0.35)",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{x:{grid:{display:!1}},y:{grid:{color:"rgba(0,0,0,0.04)"}}},plugins:{tooltip:{callbacks:{label:v=>` ${v.raw} guests in store`}}}}}));const d=document.getElementById("analyticsTopItemsChart");d&&(z("analyticsTopItemsChart"),x.analyticsTopItemsChart=new Chart(d,{type:"bar",data:{labels:["Cappuccino","Margherita Pizza","Paneer Sandwich","Cold Brew","Cheesecake"],datasets:[{label:"Units Sold",data:[342,280,245,198,175],backgroundColor:[B,de,"#D4944A",ce,"#8C5220"],borderRadius:4}]},options:{indexAxis:"y",responsive:!0,maintainAspectRatio:!1,scales:{x:{grid:{color:"rgba(0,0,0,0.04)"}},y:{grid:{display:!1}}}}}));const m=document.getElementById("analyticsChannelChart");m&&(z("analyticsChannelChart"),x.analyticsChannelChart=new Chart(m,{type:"doughnut",data:{labels:["Dine-In","Takeaway","Delivery (Direct & Zomato)"],datasets:[{data:[58,26,16],backgroundColor:[B,de,ce],borderWidth:0}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"68%",plugins:{legend:{display:!0,position:"bottom",labels:{boxWidth:10,padding:8}}}}}))}function Ee(){const s=c.getState(),a=document.getElementById("view-dashboard");if(!a)return;const e=g(),t=s.orders.filter(m=>m.date===e),i=t.reduce((m,v)=>m+(v.paymentStatus==="Paid"?v.total:0),0),n=s.bookings.filter(m=>m.date===e),l=s.tables.filter(m=>m.status==="Occupied").length,r=s.tables.filter(m=>m.status==="Available").length,d=s.orders.filter(m=>m.status==="Pending"||m.status==="Confirmed").length;a.innerHTML=`
    <!-- Top Alert Banner -->
    <div class="dashboard-alert-banner">
      <div class="dashboard-alert-text">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span><strong>Live Operations:</strong> 1 reservation pending confirmation for tonight &middot; Table 6 is in cleaning mode.</span>
      </div>
      <button class="btn btn-sm btn-ghost" onclick="window.router.navigate('bookings')">Review Bookings &rarr;</button>
    </div>

    <!-- Quick Actions Bar -->
    <div class="quick-actions-bar">
      <button class="quick-action-pill" onclick="window.openNewOrderModal()">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>+ New Order</span>
      </button>
      <button class="quick-action-pill" onclick="window.openNewBookingModal()">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>+ New Booking</span>
      </button>
      <button class="quick-action-pill" onclick="window.router.navigate('tables')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
        <span>Floor Plan Status</span>
      </button>
      <button class="quick-action-pill" onclick="window.router.navigate('whatsapp')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <span>AI WhatsApp Simulator</span>
      </button>
    </div>

    <!-- Stats Row (4 Cards) -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Today's Revenue</div>
          <div class="stat-icon">₹</div>
        </div>
        <div class="stat-value">₹${i.toLocaleString("en-IN")||"18,340"}</div>
        <div class="stat-delta up">+14.2% vs yesterday</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Active Orders</div>
          <div class="stat-icon">🛍️</div>
        </div>
        <div class="stat-value">${t.length}</div>
        <div class="stat-delta ${d>0?"dn":"up"}">${d} in kitchen / prep</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Today's Bookings</div>
          <div class="stat-icon">📅</div>
        </div>
        <div class="stat-value">${n.length}</div>
        <div class="stat-delta up">+4 reservations tonight</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Tables Occupied</div>
          <div class="stat-icon">🪑</div>
        </div>
        <div class="stat-value">${l} <span style="font-size:16px; font-weight:400; color:var(--muted)">/ ${s.tables.length}</span></div>
        <div class="stat-delta up">${r} tables ready</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Revenue — Last 7 Days</div>
            <div class="chart-sub">Daily revenue across dine-in, takeaway and online orders</div>
          </div>
          <span class="badge badge-green">Healthy Growth</span>
        </div>
        <div class="chart-wrap"><canvas id="chartRevenue"></canvas></div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Orders by Category</div>
            <div class="chart-sub">Sales distribution by volume</div>
          </div>
        </div>
        <div class="chart-wrap"><canvas id="chartCategory"></canvas></div>
      </div>
    </div>

    <!-- Secondary Row (Reservations trend + Activity Feed) -->
    <div class="charts-grid" style="grid-template-columns: 1fr 1fr;">
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Reservations — This Week</div>
            <div class="chart-sub">Confirmed vs cancelled bookings</div>
          </div>
        </div>
        <div class="chart-wrap-sm"><canvas id="chartBookings"></canvas></div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Real-Time Activity Feed</div>
            <div class="chart-sub">Live events across POS, WhatsApp &amp; floor</div>
          </div>
        </div>
        <div class="activity-feed-list">
          <div class="activity-item">
            <div class="activity-dot" style="background:var(--green)"></div>
            <div>
              <div class="activity-text">New booking <strong>RES-2407</strong> — Rahul Verma (2 guests at 8:00 PM)</div>
              <div class="activity-time">2 mins ago via WhatsApp AI</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-dot" style="background:var(--accent)"></div>
            <div>
              <div class="activity-text">Order <strong>ORD-5521</strong> delivered to Table 1 — Priya Sharma (₹638)</div>
              <div class="activity-time">9 mins ago</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-dot" style="background:var(--blue)"></div>
            <div>
              <div class="activity-text">AI Voice Agent handled inquiry for Rohit Khanna (+91 98234 56789)</div>
              <div class="activity-time">18 mins ago</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-dot" style="background:var(--green)"></div>
            <div>
              <div class="activity-text">UPI Payment received for <strong>ORD-5520</strong> — ₹561</div>
              <div class="activity-time">25 mins ago</div>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-dot" style="background:var(--red)"></div>
            <div>
              <div class="activity-text">Reservation <strong>RES-2405</strong> cancelled by Vivek Joshi</div>
              <div class="activity-time">45 mins ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders Table Preview -->
    <div style="margin-top: 20px;">
      <div class="section-header">
        <div class="section-title">Recent Orders</div>
        <button class="btn btn-ghost btn-sm" onclick="window.router.navigate('orders')">View All Orders &rarr;</button>
      </div>
      <div class="table-card">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Table / Type</th><th>Items</th><th>Total</th><th>Status</th><th>Time</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${s.orders.slice(0,5).map(m=>`
                <tr>
                  <td class="td-mono td-muted">${m.id}</td>
                  <td class="td-bold">${m.customer}</td>
                  <td>${m.table}</td>
                  <td class="td-muted" style="max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    ${m.items.map(v=>`${v.name} x${v.qty}`).join(", ")}
                  </td>
                  <td class="td-bold">₹${m.total}</td>
                  <td>${window.getOrderStatusBadge(m.status)}</td>
                  <td class="td-muted">${m.time}</td>
                  <td>
                    <button class="btn btn-ghost btn-sm" onclick="window.openOrderDetails('${m.id}')">Details</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,setTimeout(()=>{Be()},50)}class Re{constructor(){this.activeModal=null,this.activeDrawer=null,this.confirmCallback=null,this.initEvents()}initEvents(){document.addEventListener("keydown",a=>{a.key==="Escape"&&(this.activeModal&&this.close(this.activeModal.id),this.activeDrawer&&this.closeDrawer(this.activeDrawer.id))}),document.addEventListener("click",a=>{a.target.classList.contains("modal-backdrop")&&this.close(a.target.id),a.target.classList.contains("drawer-backdrop")&&this.closeAllDrawers()})}open(a){const e=document.getElementById(a);e&&(e.classList.add("show"),this.activeModal=e,document.body.style.overflow="hidden")}close(a){const e=document.getElementById(a);e&&(e.classList.remove("show"),this.activeModal===e&&(this.activeModal=null),!this.activeModal&&!this.activeDrawer&&(document.body.style.overflow=""))}openDrawer(a){const e=document.getElementById(a),t=document.getElementById("drawer-backdrop");e&&(t&&t.classList.add("show"),e.classList.add("show"),this.activeDrawer=e,document.body.style.overflow="hidden")}closeDrawer(a){const e=document.getElementById(a),t=document.getElementById("drawer-backdrop");e&&(e.classList.remove("show"),t&&t.classList.remove("show"),this.activeDrawer===e&&(this.activeDrawer=null),!this.activeModal&&!this.activeDrawer&&(document.body.style.overflow=""))}closeAllDrawers(){document.querySelectorAll(".drawer-panel").forEach(e=>e.classList.remove("show"));const a=document.getElementById("drawer-backdrop");a&&a.classList.remove("show"),this.activeDrawer=null,this.activeModal||(document.body.style.overflow="")}confirm({title:a,message:e,onConfirm:t,confirmText:i="Confirm",isDanger:n=!1}){let l=document.getElementById("modal-generic-confirm");l||(l=document.createElement("div"),l.id="modal-generic-confirm",l.className="modal-backdrop",l.innerHTML=`
        <div class="modal-box" style="max-width: 420px;">
          <div class="modal-header">
            <div class="modal-title" id="confirm-modal-title">Confirm Action</div>
            <button class="modal-close-btn" onclick="window.modal.close('modal-generic-confirm')">✕</button>
          </div>
          <div class="modal-body">
            <p id="confirm-modal-message" style="font-size:13.5px; color:var(--text); line-height:1.5;"></p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-generic-confirm')">Cancel</button>
            <button class="btn btn-sm" id="confirm-modal-action-btn">Confirm</button>
          </div>
        </div>
      `,document.body.appendChild(l)),document.getElementById("confirm-modal-title").textContent=a||"Confirm Action",document.getElementById("confirm-modal-message").textContent=e||"Are you sure you want to proceed?";const r=document.getElementById("confirm-modal-action-btn");r.textContent=i,r.className=`btn btn-sm ${n?"btn-danger":"btn-primary"}`,r.onclick=()=>{this.close("modal-generic-confirm"),typeof t=="function"&&t()},this.open("modal-generic-confirm")}}const p=new Re;window.modal=p;let w="all",R="all",K="";function N(){const s=c.getState(),a=document.getElementById("view-orders");if(!a)return;let e=[...s.orders];if(w!=="all"&&(e=e.filter(t=>t.status.toLowerCase()===w.toLowerCase())),R!=="all"&&(e=e.filter(t=>t.type.toLowerCase()===R.toLowerCase())),K.trim()){const t=K.toLowerCase().trim();e=e.filter(i=>i.id.toLowerCase().includes(t)||i.customer.toLowerCase().includes(t)||i.items.some(n=>n.name.toLowerCase().includes(t)))}a.innerHTML=`
    <div class="section-header">
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <!-- Status Tabs -->
        <div class="filter-tabs" id="order-status-tabs">
          <button class="ftab ${w==="all"?"active":""}" onclick="window.filterOrdersByStatus('all')">All (${s.orders.length})</button>
          <button class="ftab ${w==="pending"?"active":""}" onclick="window.filterOrdersByStatus('pending')">Pending</button>
          <button class="ftab ${w==="confirmed"?"active":""}" onclick="window.filterOrdersByStatus('confirmed')">Confirmed</button>
          <button class="ftab ${w==="preparing"?"active":""}" onclick="window.filterOrdersByStatus('preparing')">Preparing</button>
          <button class="ftab ${w==="ready"?"active":""}" onclick="window.filterOrdersByStatus('ready')">Ready</button>
          <button class="ftab ${w==="completed"?"active":""}" onclick="window.filterOrdersByStatus('completed')">Completed</button>
          <button class="ftab ${w==="cancelled"?"active":""}" onclick="window.filterOrdersByStatus('cancelled')">Cancelled</button>
        </div>

        <!-- Order Type Filter -->
        <select class="form-select" style="width: auto; padding: 5px 10px; font-size: 12.5px;" onchange="window.filterOrdersByType(this.value)">
          <option value="all" ${R==="all"?"selected":""}>All Types</option>
          <option value="dine-in" ${R==="dine-in"?"selected":""}>Dine-in</option>
          <option value="takeaway" ${R==="takeaway"?"selected":""}>Takeaway</option>
          <option value="delivery" ${R==="delivery"?"selected":""}>Delivery</option>
        </select>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search order ID, guest..." value="${K}" oninput="window.searchOrders(this.value)">
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.openNewOrderModal()">+ New Order</button>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="table-card">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Type / Table</th>
              <th>Items Summary</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${e.length===0?`
              <tr>
                <td colspan="9">
                  <div class="empty-state">
                    <div class="empty-icon">🛍️</div>
                    <div class="empty-title">No orders found</div>
                    <div class="empty-desc">No orders match your filter criteria or search keyword.</div>
                    <button class="btn btn-outline btn-sm" onclick="window.filterOrdersByStatus('all')">Reset Filters</button>
                  </div>
                </td>
              </tr>
            `:e.map(t=>`
              <tr>
                <td class="td-mono td-bold">${t.id}</td>
                <td>
                  <div class="td-bold">${t.customer}</div>
                  <div class="td-muted" style="font-size:11.5px;">${t.phone}</div>
                </td>
                <td>
                  <span class="badge ${t.type==="Dine-in"?"badge-blue":t.type==="Takeaway"?"badge-yellow":"badge-purple"}">${t.type}</span>
                  <div style="font-size:11px; color:var(--muted); margin-top:2px;">${t.table}</div>
                </td>
                <td class="td-muted" style="max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                  ${t.items.map(i=>`${i.name} (${i.qty})`).join(", ")}
                </td>
                <td class="td-bold">₹${t.total}</td>
                <td>
                  <span class="badge ${t.paymentStatus==="Paid"?"badge-green":"badge-yellow"}">${t.paymentStatus}</span>
                  <div style="font-size:11px; color:var(--muted); margin-top:2px;">${t.paymentMethod}</div>
                </td>
                <td>${window.getOrderStatusBadge(t.status)}</td>
                <td class="td-muted">${t.time}</td>
                <td>
                  <button class="btn btn-ghost btn-sm" onclick="window.openOrderDetails('${t.id}')">View</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Order Details Drawer Panel -->
    <div class="drawer-panel" id="order-details-drawer">
      <div class="drawer-header">
        <div>
          <div class="modal-title" id="drawer-order-id">Order Details</div>
          <div style="font-size:12px; color:var(--muted); margin-top:2px;" id="drawer-order-time"></div>
        </div>
        <button class="modal-close-btn" onclick="window.modal.closeDrawer('order-details-drawer')">✕</button>
      </div>

      <div class="drawer-body" id="drawer-order-content"></div>

      <div class="drawer-footer" id="drawer-order-footer"></div>
    </div>
  `}window.filterOrdersByStatus=s=>{w=s,N()};window.filterOrdersByType=s=>{R=s,N()};window.searchOrders=s=>{K=s,N()};window.getOrderStatusBadge=s=>`<span class="badge ${{Pending:"badge-yellow",Confirmed:"badge-blue",Preparing:"badge-purple",Ready:"badge-green",Completed:"badge-green",Cancelled:"badge-red"}[s]||"badge-grey"}">${s}</span>`;window.openOrderDetails=s=>{const e=c.getState().orders.find(l=>l.id===s);if(!e)return;document.getElementById("drawer-order-id").textContent=`${e.id} — ${e.type}`,document.getElementById("drawer-order-time").textContent=`Placed at ${e.time}, ${e.date}`;const t=["Pending","Confirmed","Preparing","Ready","Completed"],i=t.indexOf(e.status);document.getElementById("drawer-order-content").innerHTML=`
    <!-- Status Progression Stepper -->
    ${e.status!=="Cancelled"?`
      <div class="order-stepper">
        ${t.map((l,r)=>`
          <div class="order-step ${r<i?"completed":r===i?"current":""}">
            <div class="order-step-num">${r<i?"✓":r+1}</div>
            <div class="order-step-label">${l}</div>
          </div>
        `).join("")}
      </div>
    `:`
      <div style="background:var(--red-bg); color:var(--red); padding:10px 14px; border-radius:6px; margin-bottom:18px; font-weight:600;">
        ⚠️ This order was cancelled.
      </div>
    `}

    <!-- Customer Card -->
    <div style="background:#FAFAF9; border:1px solid var(--border); border-radius:8px; padding:12px 14px; margin-bottom:16px;">
      <div style="font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase;">Customer Details</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
        <div style="font-weight:700; font-size:14px;">${e.customer}</div>
        <div style="font-size:13px; color:var(--muted);">${e.phone}</div>
      </div>
      <div style="font-size:12px; color:var(--muted); margin-top:4px;">Location: <strong>${e.table}</strong></div>
      ${e.notes?`<div style="font-size:12px; color:var(--accent); margin-top:6px; background:var(--accent-dim); padding:4px 8px; border-radius:4px;">📝 Note: ${e.notes}</div>`:""}
    </div>

    <!-- Ordered Items -->
    <div style="font-size:12px; font-weight:600; color:var(--muted); margin-bottom:6px; text-transform:uppercase;">Ordered Items</div>
    <div class="order-items-list">
      ${e.items.map(l=>`
        <div class="order-item-row">
          <div>
            <div style="font-weight:600;">${l.name}</div>
            <div style="font-size:11px; color:var(--muted);">₹${l.price} × ${l.qty}</div>
          </div>
          <div style="font-weight:700;">₹${l.total||l.price*l.qty}</div>
        </div>
      `).join("")}
    </div>

    <!-- Financial Breakdown -->
    <div class="order-totals-summary">
      <div class="order-total-line">
        <span>Subtotal</span>
        <span>₹${e.subtotal}</span>
      </div>
      <div class="order-total-line">
        <span>GST (5%)</span>
        <span>₹${e.tax}</span>
      </div>
      <div class="order-total-line">
        <span>Service Charge</span>
        <span>₹${e.serviceCharge}</span>
      </div>
      ${e.discount>0?`
        <div class="order-total-line" style="color:var(--green);">
          <span>Discount Applied</span>
          <span>-₹${e.discount}</span>
        </div>
      `:""}
      <div class="order-total-line order-total-grand">
        <span>Total Payable</span>
        <span>₹${e.total}</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; font-size:12px;">
        <span>Payment Method: <strong>${e.paymentMethod}</strong></span>
        <span class="badge ${e.paymentStatus==="Paid"?"badge-green":"badge-yellow"}">${e.paymentStatus}</span>
      </div>
    </div>
  `;let n="";e.status==="Pending"?n=`<button class="btn btn-primary btn-sm" onclick="window.updateOrderStatus('${e.id}', 'Confirmed')">Confirm Order</button>`:e.status==="Confirmed"?n=`<button class="btn btn-primary btn-sm" onclick="window.updateOrderStatus('${e.id}', 'Preparing')">Send to Kitchen</button>`:e.status==="Preparing"?n=`<button class="btn btn-success btn-sm" onclick="window.updateOrderStatus('${e.id}', 'Ready')">Mark Ready for Serving</button>`:e.status==="Ready"&&(n=`<button class="btn btn-success btn-sm" onclick="window.updateOrderStatus('${e.id}', 'Completed')">Mark Completed / Delivered</button>`),document.getElementById("drawer-order-footer").innerHTML=`
    <button class="btn btn-ghost btn-sm" onclick="window.printReceipt('${e.id}')">🖨️ Print Receipt / KOT</button>
    ${e.status!=="Completed"&&e.status!=="Cancelled"?`
      <button class="btn btn-danger-ghost btn-sm" onclick="window.cancelOrderConfirm('${e.id}')">Cancel Order</button>
    `:""}
    ${n}
  `,p.openDrawer("order-details-drawer")};window.updateOrderStatus=(s,a)=>{c.updateOrderStatus(s,a),u.success(`Order ${s} updated to ${a}`),window.openOrderDetails(s),N()};window.cancelOrderConfirm=s=>{p.confirm({title:"Cancel Order",message:`Are you sure you want to cancel order ${s}? This cannot be undone.`,isDanger:!0,confirmText:"Yes, Cancel Order",onConfirm:()=>{c.updateOrderStatus(s,"Cancelled"),u.warning(`Order ${s} has been cancelled.`),p.closeDrawer("order-details-drawer"),N()}})};window.printReceipt=s=>{u.info(`Receipt and Kitchen Order Ticket (KOT) dispatched to Thermal Printer for ${s}`)};window.openNewOrderModal=()=>{const s=c.getState();s.tables.filter(e=>e.status==="Available");let a=document.getElementById("modal-new-order");a||(a=document.createElement("div"),a.id="modal-new-order",a.className="modal-backdrop",document.body.appendChild(a)),a.innerHTML=`
    <div class="modal-box modal-lg">
      <div class="modal-header">
        <div class="modal-title">+ Create New Order</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-new-order')">✕</button>
      </div>
      <form id="form-new-order" onsubmit="window.submitNewOrder(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Customer Name *</label>
              <input type="text" class="form-input" id="order-cust-name" required placeholder="e.g. Vikram Sharma">
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="tel" class="form-input" id="order-cust-phone" required placeholder="e.g. 9876543210">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Order Type</label>
              <select class="form-select" id="order-type-select" onchange="window.toggleTableSelector(this.value)">
                <option value="Dine-in">Dine-in</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
            <div class="form-group" id="group-order-table">
              <label class="form-label">Assign Table</label>
              <select class="form-select" id="order-table-select">
                <option value="Table 1">Table 1 (2 Seats)</option>
                <option value="Table 4">Table 4 (6 Seats)</option>
                <option value="Table 5">Table 5 (2 Seats)</option>
                <option value="Table 8">Table 8 (6 Seats)</option>
                <option value="Bar Counter">Bar Counter</option>
              </select>
            </div>
          </div>

          <!-- Item Selector -->
          <div style="font-size:12.5px; font-weight:700; margin:14px 0 8px;">Select Menu Items</div>
          <div style="max-height:180px; overflow-y:auto; border:1px solid var(--border); border-radius:6px; padding:10px;" id="order-item-checkboxes">
            ${s.menuItems.filter(e=>e.available).map(e=>`
              <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f0f0f0;">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                  <input type="checkbox" class="order-item-cb" value="${e.id}" data-name="${e.name}" data-price="${e.price}" onchange="window.recalcNewOrderTotal()">
                  <span><strong>${e.name}</strong> <span style="font-size:11px; color:var(--muted)">(${e.category})</span></span>
                </label>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-weight:600; color:var(--accent);">₹${e.price}</span>
                  <input type="number" min="1" max="10" value="1" class="form-input item-qty-input" style="width:50px; padding:2px 6px; font-size:12px;" onchange="window.recalcNewOrderTotal()">
                </div>
              </div>
            `).join("")}
          </div>

          <div style="margin-top:14px; padding:10px 14px; background:#FAFAF9; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:12px; color:var(--muted);">Estimated Subtotal</div>
              <div style="font-size:18px; font-weight:700; color:var(--text);" id="new-order-total-preview">₹0</div>
            </div>
            <div style="display:flex; gap:10px;">
              <select class="form-select" id="order-payment-method" style="width:auto;">
                <option value="UPI">UPI / GPay</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Cash">Cash at Counter</option>
              </select>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-new-order')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Place Order</button>
        </div>
      </form>
    </div>
  `,p.open("modal-new-order")};window.toggleTableSelector=s=>{const a=document.getElementById("group-order-table");a&&(a.style.display=s==="Dine-in"?"block":"none")};window.recalcNewOrderTotal=()=>{let s=0;document.querySelectorAll(".order-item-cb:checked").forEach(n=>{const l=parseFloat(n.dataset.price),d=n.closest("div").querySelector(".item-qty-input"),m=parseInt(d?d.value:1,10);s+=l*m});const e=Math.round(s*.05),t=s+e,i=document.getElementById("new-order-total-preview");i&&(i.textContent=`₹${t} (incl. 5% GST)`)};window.submitNewOrder=s=>{s.preventDefault();const a=document.getElementById("order-cust-name").value.trim(),e=document.getElementById("order-cust-phone").value.trim(),t=document.getElementById("order-type-select").value,i=t==="Dine-in"?document.getElementById("order-table-select").value:t==="Takeaway"?"Pickup Counter":"Online / Delivery",n=document.getElementById("order-payment-method").value,l=[];let r=0;if(document.querySelectorAll(".order-item-cb:checked").forEach(y=>{const V=y.dataset.name,G=parseFloat(y.dataset.price),oe=y.closest("div"),_=parseInt(oe.querySelector(".item-qty-input").value,10)||1,he=G*_;r+=he,l.push({name:V,qty:_,price:G,total:he})}),l.length===0){u.error("Please select at least one menu item.");return}const d=Math.round(r*.05),m=r+d,v="ORD-"+Math.floor(5530+Math.random()*800),k={id:v,customer:a,phone:e,type:t,table:i,items:l,subtotal:r,tax:d,serviceCharge:0,discount:0,total:m,status:"Confirmed",paymentStatus:"Paid",paymentMethod:n,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),date:"2026-08-31",notes:"POS Order"};c.createOrder(k),p.close("modal-new-order"),u.success(`Order ${v} created successfully for ${a}`),N()};let h="all",J="list",Y="";function I(){const s=c.getState(),a=document.getElementById("view-bookings");if(!a)return;const e=g(),t=s.bookings.filter(l=>l.date===e);let i=[...s.bookings];if(h==="today"?i=i.filter(l=>l.date===e):h==="upcoming"?i=i.filter(l=>l.date>e):h==="confirmed"?i=i.filter(l=>l.status==="Confirmed"||l.status==="Seated"):h==="pending"?i=i.filter(l=>l.status==="Pending"):h==="cancelled"&&(i=i.filter(l=>l.status==="Cancelled")),Y.trim()){const l=Y.toLowerCase().trim();i=i.filter(r=>r.id.toLowerCase().includes(l)||r.name.toLowerCase().includes(l)||r.phone.includes(l))}const n=new Date().toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"});a.innerHTML=`
    <!-- Today's Reservations Highlight Card -->
    <div style="background:var(--card); border:1px solid var(--border); border-left:4px solid var(--accent); border-radius:10px; padding:16px 20px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <div style="font-size:15px; font-weight:700; color:var(--text);">Today's Reservations Overview &middot; ${n}</div>
        <div style="font-size:12px; color:var(--muted); margin-top:2px;">
          ${t.length} total scheduled today &middot; ${t.filter(l=>l.status==="Seated").length} currently seated &middot; ${t.filter(l=>l.status==="Confirmed").length} upcoming today
        </div>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-outline btn-sm ${J==="list"?"btn-primary":""}" onclick="window.switchBookingView('list')">📋 List View</button>
        <button class="btn btn-outline btn-sm ${J==="calendar"?"btn-primary":""}" onclick="window.switchBookingView('calendar')">📅 Calendar View</button>
      </div>
    </div>

    <!-- Controls Header -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${h==="all"?"active":""}" onclick="window.filterBookings('all')">All (${s.bookings.length})</button>
        <button class="ftab ${h==="today"?"active":""}" onclick="window.filterBookings('today')">Today (${t.length})</button>
        <button class="ftab ${h==="upcoming"?"active":""}" onclick="window.filterBookings('upcoming')">Upcoming</button>
        <button class="ftab ${h==="pending"?"active":""}" onclick="window.filterBookings('pending')">Pending Action</button>
        <button class="ftab ${h==="confirmed"?"active":""}" onclick="window.filterBookings('confirmed')">Confirmed</button>
        <button class="ftab ${h==="cancelled"?"active":""}" onclick="window.filterBookings('cancelled')">Cancelled</button>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search guest name, phone..." value="${Y}" oninput="window.searchBookings(this.value)">
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.openNewBookingModal()">+ New Booking</button>
      </div>
    </div>

    <!-- View Content (List or Calendar) -->
    ${J==="list"?`
      <div class="table-card">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest</th>
                <th>Phone</th>
                <th>Date &amp; Time</th>
                <th>Party Size</th>
                <th>Assigned Table</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${i.length===0?`
                <tr>
                  <td colspan="9">
                    <div class="empty-state">
                      <div class="empty-icon">📅</div>
                      <div class="empty-title">No bookings found</div>
                      <div class="empty-desc">No bookings match the selected filter.</div>
                    </div>
                  </td>
                </tr>
              `:i.map(l=>`
                <tr>
                  <td class="td-mono td-bold">${l.id}</td>
                  <td class="td-bold">${l.name}</td>
                  <td class="td-muted">${l.phone}</td>
                  <td>
                    <div><strong>${l.date}</strong></div>
                    <div style="font-size:11.5px; color:var(--muted);">${l.time}</div>
                  </td>
                  <td><span class="badge badge-grey">${l.guests} Guests</span></td>
                  <td>
                    <span style="font-weight:600; color:${l.table==="Unassigned"?"var(--red)":"var(--text)"};">
                      ${l.table}
                    </span>
                  </td>
                  <td><span class="badge ${l.channel==="WhatsApp"?"badge-green":"badge-blue"}">${l.channel}</span></td>
                  <td>${window.getBookingStatusBadge(l.status)}</td>
                  <td>
                    <button class="btn btn-ghost btn-sm" onclick="window.openBookingDetails('${l.id}')">Manage</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `:`
      <!-- Calendar Grid Preview -->
      <div style="background:var(--card); border:1px solid var(--border); border-radius:10px; padding:20px;">
        <div style="font-size:14px; font-weight:700; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
          <span>Schedule Calendar — Upcoming 7 Days</span>
          <span style="font-size:12px; color:var(--muted);">Today: ${n}</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:8px;">
          ${[0,1,2,3,4,5,6].map(l=>{const r=f(l),d=new Date;d.setDate(d.getDate()+l);const m=l===0?"Today":d.toLocaleDateString("en-IN",{weekday:"short"}),v=d.toLocaleDateString("en-IN",{day:"numeric",month:"short"}),k=s.bookings.filter(y=>y.date===r);return`
              <div style="background:#FAFAF9; border:1px solid var(--border); border-radius:8px; padding:10px; min-height:160px;">
                <div style="font-weight:700; font-size:12px; margin-bottom:8px; border-bottom:1px solid var(--border); padding-bottom:4px; color:${l===0?"var(--accent)":"var(--text)"};">
                  ${m} <span style="font-size:10.5px; font-weight:400; color:var(--muted)">(${v})</span>
                </div>
                ${k.length===0?'<div style="font-size:11px; color:var(--muted);">No bookings</div>':k.map(y=>`
                  <div style="background:#fff; border:1px solid var(--border); border-left:3px solid var(--accent); border-radius:4px; padding:5px 7px; margin-bottom:6px; cursor:pointer;" onclick="window.openBookingDetails('${y.id}')">
                    <div style="font-size:11.5px; font-weight:600;">${y.time} &middot; ${y.name}</div>
                    <div style="font-size:10.5px; color:var(--muted);">${y.guests} guests &bull; ${y.table}</div>
                  </div>
                `).join("")}
              </div>
            `}).join("")}
        </div>
      </div>
    `}

    <!-- Booking Details Modal -->
    <div class="modal-backdrop" id="modal-booking-details">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title" id="booking-modal-title">Booking Details</div>
          <button class="modal-close-btn" onclick="window.modal.close('modal-booking-details')">✕</button>
        </div>
        <div class="modal-body" id="booking-modal-body"></div>
        <div class="modal-footer" id="booking-modal-footer"></div>
      </div>
    </div>
  `}window.switchBookingView=s=>{J=s,I()};window.filterBookings=s=>{h=s,I()};window.searchBookings=s=>{Y=s,I()};window.getBookingStatusBadge=s=>`<span class="badge ${{Confirmed:"badge-green",Seated:"badge-blue",Pending:"badge-yellow",Completed:"badge-grey",Cancelled:"badge-red","No-show":"badge-red"}[s]||"badge-grey"}">${s}</span>`;window.openBookingDetails=s=>{const a=c.getState(),e=a.bookings.find(t=>t.id===s);e&&(document.getElementById("booking-modal-title").textContent=`${e.id} — ${e.name}`,document.getElementById("booking-modal-body").innerHTML=`
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <div>
        <div style="font-size:16px; font-weight:700;">${e.name}</div>
        <div style="font-size:12.5px; color:var(--muted);">${e.phone} &middot; ${e.email||"No email provided"}</div>
      </div>
      <div>${window.getBookingStatusBadge(e.status)}</div>
    </div>

    <div class="form-row" style="background:#FAFAF9; padding:12px; border-radius:8px; border:1px solid var(--border); margin-bottom:16px;">
      <div>
        <label class="form-label" style="font-size:11px; color:var(--muted); margin-bottom:4px;">Time Slot</label>
        <input type="text" class="form-input" id="edit-booking-time" style="padding:5px 8px; font-size:13px; font-weight:600;" value="${e.time}" onchange="window.saveBookingModification('${e.id}')">
      </div>
      <div>
        <label class="form-label" style="font-size:11px; color:var(--muted); margin-bottom:4px;">Date</label>
        <input type="date" class="form-input" id="edit-booking-date" style="padding:5px 8px; font-size:12px;" value="${e.date}" onchange="window.saveBookingModification('${e.id}')">
      </div>
      <div>
        <label class="form-label" style="font-size:11px; color:var(--muted); margin-bottom:4px;">Party Size</label>
        <input type="number" min="1" max="25" class="form-input" id="edit-booking-guests" style="padding:5px 8px; font-size:13px; font-weight:600;" value="${e.guests}" onchange="window.saveBookingModification('${e.id}')">
      </div>
    </div>

    <!-- Table Assignment Form -->
    <div class="form-group">
      <label class="form-label">Assign Table</label>
      <select class="form-select" id="booking-assign-table" onchange="window.assignTableToBooking('${e.id}', this.value)">
        <option value="Unassigned" ${e.table==="Unassigned"?"selected":""}>Unassigned</option>
        ${a.tables.map(t=>`
          <option value="Table ${t.number}" ${e.table==="Table "+t.number?"selected":""}>
            Table ${t.number} (${t.capacity} Seats - ${t.zone}) - ${t.status}
          </option>
        `).join("")}
      </select>
    </div>

    ${e.specialRequests?`
      <div style="margin-top:10px; background:var(--accent-dim); padding:10px 12px; border-radius:6px; font-size:12.5px;">
        <strong>Special Request:</strong> ${e.specialRequests}
      </div>
    `:""}

    <div style="margin-top:14px; font-size:11.5px; color:var(--muted);">
      Channel: <strong>${e.channel}</strong> &middot; Automated notifications active.
    </div>
  `,document.getElementById("booking-modal-footer").innerHTML=`
    ${e.status==="Pending"?`
      <button class="btn btn-primary btn-sm" onclick="window.updateBookingStatusAction('${e.id}', 'Confirmed')">Confirm Booking</button>
      <button class="btn btn-danger-ghost btn-sm" onclick="window.updateBookingStatusAction('${e.id}', 'Cancelled')">Reject</button>
    `:e.status==="Confirmed"?`
      <button class="btn btn-success btn-sm" onclick="window.updateBookingStatusAction('${e.id}', 'Seated')">Seat Guests Now</button>
      <button class="btn btn-danger-ghost btn-sm" onclick="window.updateBookingStatusAction('${e.id}', 'Cancelled')">Cancel Booking</button>
    `:e.status==="Seated"?`
      <button class="btn btn-primary btn-sm" onclick="window.updateBookingStatusAction('${e.id}', 'Completed')">Mark Completed</button>
    `:""}
    <button class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-booking-details')">Close</button>
  `,p.open("modal-booking-details"))};window.saveBookingModification=s=>{const a=document.getElementById("edit-booking-time").value.trim(),e=document.getElementById("edit-booking-date").value,t=parseInt(document.getElementById("edit-booking-guests").value,10);c.updateBooking(s,{time:a,date:e,guests:t}),u.success(`Booking ${s} updated to ${a}`),I()};window.assignTableToBooking=(s,a)=>{c.assignBookingTable(s,a),u.success(`Assigned ${a} to booking ${s}`),I()};window.updateBookingStatusAction=(s,a)=>{c.updateBookingStatus(s,a),u.success(`Booking ${s} status changed to ${a}`),p.close("modal-booking-details"),I()};window.openNewBookingModal=()=>{const s=c.getState();let a=document.getElementById("modal-new-booking");a||(a=document.createElement("div"),a.id="modal-new-booking",a.className="modal-backdrop",document.body.appendChild(a)),a.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">+ New Reservation</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-new-booking')">✕</button>
      </div>
      <form onsubmit="window.saveNewBooking(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Guest Name *</label>
              <input type="text" class="form-input" id="book-name" required placeholder="e.g. Deepali Sen">
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="tel" class="form-input" id="book-phone" required placeholder="e.g. 9876500000">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Date *</label>
              <input type="date" class="form-input" id="book-date" required value="${g()}">
            </div>
            <div class="form-group">
              <label class="form-label">Time Slot *</label>
              <input type="time" class="form-input" id="book-time" required value="19:30">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Number of Guests *</label>
              <input type="number" min="1" max="25" class="form-input" id="book-guests" required value="2">
            </div>
            <div class="form-group">
              <label class="form-label">Table</label>
              <select class="form-select" id="book-table">
                <option value="Unassigned">Unassigned (Assign Later)</option>
                ${s.tables.map(e=>`<option value="Table ${e.number}">Table ${e.number} (${e.capacity} seats)</option>`).join("")}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Special Requests / Occasion</label>
            <textarea class="form-textarea" id="book-requests" placeholder="e.g. High chair needed, anniversary flower decoration on table..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-new-booking')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Confirm Booking</button>
        </div>
      </form>
    </div>
  `,p.open("modal-new-booking")};window.saveNewBooking=s=>{s.preventDefault();const a=document.getElementById("book-name").value.trim(),e=document.getElementById("book-phone").value.trim(),t=document.getElementById("book-date").value,i=document.getElementById("book-time").value,n=parseInt(document.getElementById("book-guests").value,10),l=document.getElementById("book-table").value,r=document.getElementById("book-requests").value.trim(),d="RES-"+Math.floor(2415+Math.random()*800),m={id:d,name:a,phone:e,email:"",date:t,time:i,guests:n,table:l,status:"Confirmed",channel:"Walk-in / Phone",specialRequests:r};c.createBooking(m),p.close("modal-new-booking"),u.success(`Reservation ${d} confirmed for ${a}`),I()};let A="all";function q(){const s=c.getState(),a=document.getElementById("view-tables");if(!a)return;const e=s.tables.length,t=s.tables.filter(d=>d.status==="Occupied").length,i=s.tables.filter(d=>d.status==="Reserved").length,n=s.tables.filter(d=>d.status==="Available").length,l=s.tables.filter(d=>d.status==="Cleaning").length;let r=s.tables;A!=="all"&&(r=r.filter(d=>d.zone.toLowerCase()===A.toLowerCase())),a.innerHTML=`
    <!-- Top Floor Summary Metrics -->
    <div class="stats-row" style="margin-bottom: 16px;">
      <div class="stat-card stat-accent-green">
        <div class="stat-label">Available for Seating</div>
        <div class="stat-value" style="color:var(--green)">${n}</div>
        <div class="stat-delta up">Ready to seat guests immediately</div>
      </div>
      <div class="stat-card stat-accent-red">
        <div class="stat-label">Currently Occupied</div>
        <div class="stat-value" style="color:var(--red)">${t}</div>
        <div class="stat-delta dn">${Math.round(t/e*100)}% floor occupancy rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Reserved Tables</div>
        <div class="stat-value" style="color:var(--yellow)">${i}</div>
        <div class="stat-delta neutral">Upcoming bookings assigned</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Needs Sanitizing / Cleaning</div>
        <div class="stat-value" style="color:var(--blue)">${l}</div>
        <div class="stat-delta dn">Staff alerted</div>
      </div>
    </div>

    <!-- Section Header with Zone Filters & Add Table -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${A==="all"?"active":""}" onclick="window.filterTableZone('all')">All Zones (${e})</button>
        <button class="ftab ${A==="main dining"?"active":""}" onclick="window.filterTableZone('main dining')">Main Dining Hall</button>
        <button class="ftab ${A==="patio & garden"?"active":""}" onclick="window.filterTableZone('patio & garden')">Patio &amp; Garden</button>
        <button class="ftab ${A==="lounge area"?"active":""}" onclick="window.filterTableZone('lounge area')">Lounge Area</button>
        <button class="ftab ${A==="bar counter"?"active":""}" onclick="window.filterTableZone('bar counter')">Bar Counter</button>
      </div>

      <button class="btn btn-primary btn-sm" onclick="window.openAddTableModal()">+ Add Table</button>
    </div>

    <!-- Table Grid Floor View -->
    <div class="table-grid">
      ${r.map(d=>`
          <div class="table-card-item ${`status-${d.status.toLowerCase()}`}">
            <div class="table-top">
              <div class="table-num">Table ${d.number}</div>
              <span class="table-zone-badge">${d.zone}</span>
            </div>

            <div class="table-meta">
              <span>👥 ${d.capacity} Seats</span>
              ${d.seatedMinutes?`<span>&bull; Seated: ${d.seatedMinutes}m</span>`:""}
            </div>

            <div class="table-customer-box">
              ${d.status==="Occupied"?`
                <div style="font-weight:600; color:var(--text);">${d.currentCustomer||"Guest"}</div>
                <div style="font-size:11px; color:var(--muted); margin-top:2px;">
                  ${d.orderId?`Order: ${d.orderId} &middot; `:""}<strong>₹${d.billAmount||0}</strong>
                </div>
              `:d.status==="Reserved"?`
                <div style="font-weight:600; color:var(--yellow);">${d.currentCustomer||"Reserved"}</div>
                <div style="font-size:11px; color:var(--muted); margin-top:2px;">Scheduled guest arriving</div>
              `:d.status==="Cleaning"?`
                <div style="color:var(--blue); font-weight:500;">Sanitizing in progress...</div>
              `:`
                <div style="color:var(--green); font-weight:500;">Ready for Walk-in / Booking</div>
              `}
            </div>

            <div class="table-footer-actions">
              <!-- Quick Status Selector -->
              <select class="form-select" style="font-size:11px; padding:3px 6px; width:auto; border-radius:4px;" onchange="window.changeTableStatus('${d.id}', this.value)">
                <option value="Available" ${d.status==="Available"?"selected":""}>Available</option>
                <option value="Occupied" ${d.status==="Occupied"?"selected":""}>Occupied</option>
                <option value="Reserved" ${d.status==="Reserved"?"selected":""}>Reserved</option>
                <option value="Cleaning" ${d.status==="Cleaning"?"selected":""}>Cleaning</option>
              </select>

              <div style="display:flex; gap:4px;">
                <button class="btn btn-ghost btn-sm" title="Edit Table" onclick="window.openEditTableModal('${d.id}')">✏️</button>
                <button class="btn btn-ghost btn-sm" title="Delete Table" onclick="window.confirmDeleteTable('${d.id}')">🗑️</button>
              </div>
            </div>
          </div>
        `).join("")}
    </div>
  `}window.filterTableZone=s=>{A=s,q()};window.changeTableStatus=(s,a)=>{let e=null;a==="Occupied"&&(e=prompt("Customer Name or Notes for Table:","Walk-in Guests"),e||(e="Walk-in Guests")),c.updateTableStatus(s,a,e),u.success(`Table updated to ${a}`),q()};window.openAddTableModal=()=>{let s=document.getElementById("modal-table-form");s||(s=document.createElement("div"),s.id="modal-table-form",s.className="modal-backdrop",document.body.appendChild(s)),s.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">+ Add New Table</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-table-form')">✕</button>
      </div>
      <form onsubmit="window.saveNewTable(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Table Number *</label>
              <input type="text" class="form-input" id="tbl-number" required placeholder="e.g. 13">
            </div>
            <div class="form-group">
              <label class="form-label">Capacity (Seats) *</label>
              <input type="number" min="1" max="20" class="form-input" id="tbl-capacity" required value="4">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zone / Area *</label>
              <select class="form-select" id="tbl-zone">
                <option value="Main Dining">Main Dining</option>
                <option value="Patio & Garden">Patio &amp; Garden</option>
                <option value="Lounge Area">Lounge Area</option>
                <option value="Bar Counter">Bar Counter</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Initial Status</label>
              <select class="form-select" id="tbl-status">
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-table-form')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Add Table</button>
        </div>
      </form>
    </div>
  `,p.open("modal-table-form")};window.saveNewTable=s=>{s.preventDefault();const a=document.getElementById("tbl-number").value.trim(),e=parseInt(document.getElementById("tbl-capacity").value,10),t=document.getElementById("tbl-zone").value,i=document.getElementById("tbl-status").value,n={id:"T-"+a.padStart(2,"0"),number:a,zone:t,capacity:e,status:i,currentCustomer:null,orderId:null,billAmount:0,seatedMinutes:0};c.createTable(n),p.close("modal-table-form"),u.success(`Table ${a} created successfully.`),q()};window.openEditTableModal=s=>{const e=c.getState().tables.find(i=>i.id===s);if(!e)return;let t=document.getElementById("modal-table-form");t||(t=document.createElement("div"),t.id="modal-table-form",t.className="modal-backdrop",document.body.appendChild(t)),t.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">Edit Table ${e.number}</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-table-form')">✕</button>
      </div>
      <form onsubmit="window.saveEditTable(event, '${e.id}')">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Table Number *</label>
              <input type="text" class="form-input" id="tbl-number" required value="${e.number}">
            </div>
            <div class="form-group">
              <label class="form-label">Capacity (Seats) *</label>
              <input type="number" min="1" max="20" class="form-input" id="tbl-capacity" required value="${e.capacity}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zone / Area *</label>
              <select class="form-select" id="tbl-zone">
                <option value="Main Dining" ${e.zone==="Main Dining"?"selected":""}>Main Dining</option>
                <option value="Patio & Garden" ${e.zone==="Patio & Garden"?"selected":""}>Patio &amp; Garden</option>
                <option value="Lounge Area" ${e.zone==="Lounge Area"?"selected":""}>Lounge Area</option>
                <option value="Bar Counter" ${e.zone==="Bar Counter"?"selected":""}>Bar Counter</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-select" id="tbl-status">
                <option value="Available" ${e.status==="Available"?"selected":""}>Available</option>
                <option value="Occupied" ${e.status==="Occupied"?"selected":""}>Occupied</option>
                <option value="Reserved" ${e.status==="Reserved"?"selected":""}>Reserved</option>
                <option value="Cleaning" ${e.status==="Cleaning"?"selected":""}>Cleaning</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-table-form')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save Changes</button>
        </div>
      </form>
    </div>
  `,p.open("modal-table-form")};window.saveEditTable=(s,a)=>{s.preventDefault();const e=document.getElementById("tbl-number").value.trim(),t=parseInt(document.getElementById("tbl-capacity").value,10),i=document.getElementById("tbl-zone").value,n=document.getElementById("tbl-status").value,l=c.getState(),r=l.tables.map(d=>d.id===a?{...d,number:e,capacity:t,zone:i,status:n}:d);c.saveState({...l,tables:r}),p.close("modal-table-form"),u.success(`Table ${e} updated.`),q()};window.confirmDeleteTable=s=>{p.confirm({title:"Delete Table",message:"Are you sure you want to remove this table from the floor plan?",isDanger:!0,confirmText:"Delete Table",onConfirm:()=>{c.deleteTable(s),u.info("Table deleted from floor plan."),q()}})};let Z="all",X="",ue="all";function E(){const s=c.getState(),a=document.getElementById("view-menu");if(!a)return;const e=["all","Coffee","Starters","Main Course","Desserts","Beverages"];let t=[...s.menuItems];if(Z!=="all"&&(t=t.filter(i=>i.category.toLowerCase()===Z.toLowerCase())),ue==="veg"?t=t.filter(i=>i.isVeg):ue==="non-veg"&&(t=t.filter(i=>!i.isVeg)),X.trim()){const i=X.toLowerCase().trim();t=t.filter(n=>n.name.toLowerCase().includes(i)||n.description.toLowerCase().includes(i)||n.category.toLowerCase().includes(i))}a.innerHTML=`
    <!-- Top Bar with Category Filter Tabs & Actions -->
    <div class="section-header">
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <div class="filter-tabs">
          ${e.map(i=>`
            <button class="ftab ${Z.toLowerCase()===i.toLowerCase()?"active":""}" onclick="window.filterMenuCategory('${i}')">
              ${i==="all"?"All Items ("+s.menuItems.length+")":i}
            </button>
          `).join("")}
        </div>

        <select class="form-select" style="width:auto; padding:5px 10px; font-size:12.5px;" onchange="window.filterDietary(this.value)">
          <option value="all">All Dietary</option>
          <option value="veg">🟢 Veg Only</option>
          <option value="non-veg">🔴 Non-Veg Only</option>
        </select>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search menu items..." value="${X}" oninput="window.searchMenuItems(this.value)">
        </div>

        <button class="btn btn-primary btn-sm" onclick="window.openAddMenuItemModal()">+ Add Item</button>
      </div>
    </div>

    <!-- Menu Cards Grid -->
    <div class="menu-grid">
      ${t.length===0?`
        <div style="grid-column: 1 / -1;">
          <div class="empty-state">
            <div class="empty-icon">☕</div>
            <div class="empty-title">No menu items found</div>
            <div class="empty-desc">No items match the selected category or search keyword.</div>
          </div>
        </div>
      `:t.map(i=>`
        <div class="menu-item-card" style="opacity: ${i.available?1:.65};">
          <div class="mi-badge-wrap">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="diet-indicator ${i.isVeg?"veg":"non-veg"}" title="${i.isVeg?"Vegetarian":"Non-Vegetarian"}"></span>
              <span class="badge badge-grey" style="font-size:11px;">${i.category}</span>
            </div>
            ${i.isPopular?'<span class="badge badge-yellow" style="font-size:10px;">★ Bestseller</span>':""}
          </div>

          <div class="mi-name">${i.name}</div>
          <div class="mi-desc">${i.description}</div>

          <div style="display:flex; align-items:center; justify-content:space-between;">
            <div class="mi-price">₹${i.price}</div>
            <span style="font-size:11px; color:var(--muted); background:#FAFAF9; padding:2px 6px; border-radius:4px;">⏱️ ${i.prepTime}</span>
          </div>

          <div class="mi-footer">
            <div style="display:flex; align-items:center; gap:8px;">
              <label class="toggle">
                <input type="checkbox" ${i.available?"checked":""} onchange="window.toggleItemStock('${i.id}', this.checked)">
                <span class="toggle-slider"></span>
              </label>
              <span style="font-size:12px; font-weight:500; color:${i.available?"var(--green)":"var(--muted)"};">
                ${i.available?"In Stock":"Out of Stock"}
              </span>
            </div>

            <div style="display:flex; gap:4px;">
              <button class="btn btn-ghost btn-sm" title="Edit Item" onclick="window.openEditMenuItemModal('${i.id}')">✏️</button>
              <button class="btn btn-ghost btn-sm" title="Delete Item" onclick="window.confirmDeleteMenuItem('${i.id}')">🗑️</button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `}window.filterMenuCategory=s=>{Z=s,E()};window.filterDietary=s=>{ue=s,E()};window.searchMenuItems=s=>{X=s,E()};window.toggleItemStock=(s,a)=>{c.toggleMenuAvailability(s,a),u.info("Updated stock availability for item"),E()};window.exportMenuJSON=()=>{const s=c.getState(),a="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(s.menuItems,null,2)),e=document.createElement("a");e.setAttribute("href",a),e.setAttribute("download","brew_and_co_menu.json"),e.click(),u.success("Exported clean menu JSON for Customer Website integration!")};window.openAddMenuItemModal=()=>{let s=document.getElementById("modal-menu-form");s||(s=document.createElement("div"),s.id="modal-menu-form",s.className="modal-backdrop",document.body.appendChild(s)),s.innerHTML=`
    <div class="modal-box modal-lg">
      <div class="modal-header">
        <div class="modal-title">+ Add Menu Item</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-menu-form')">✕</button>
      </div>
      <form onsubmit="window.saveNewMenuItem(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Item Name *</label>
              <input type="text" class="form-input" id="menu-name" required placeholder="e.g. Avocado Toast">
            </div>
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select class="form-select" id="menu-cat">
                <option value="Coffee">Coffee</option>
                <option value="Starters">Starters</option>
                <option value="Main Course">Main Course</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">Price (₹) *</label>
              <input type="number" min="1" step="1" class="form-input" id="menu-price" required placeholder="240">
            </div>
            <div class="form-group">
              <label class="form-label">Prep Time *</label>
              <input type="text" class="form-input" id="menu-preptime" required value="10 mins">
            </div>
            <div class="form-group">
              <label class="form-label">Dietary Type *</label>
              <select class="form-select" id="menu-veg">
                <option value="veg">🟢 Vegetarian</option>
                <option value="non-veg">🔴 Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description *</label>
            <textarea class="form-textarea" id="menu-desc" required placeholder="Describe ingredients, preparation, taste notes..."></textarea>
          </div>

          <div style="display:flex; gap:16px; align-items:center; margin-top:8px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" id="menu-popular">
              <span style="font-size:13px; font-weight:500;">Mark as Chef's Special / Popular</span>
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" id="menu-available" checked>
              <span style="font-size:13px; font-weight:500;">Currently In Stock</span>
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-menu-form')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Add Item to Menu</button>
        </div>
      </form>
    </div>
  `,p.open("modal-menu-form")};window.saveNewMenuItem=s=>{s.preventDefault();const a=document.getElementById("menu-name").value.trim(),e=document.getElementById("menu-cat").value,t=parseFloat(document.getElementById("menu-price").value),i=document.getElementById("menu-preptime").value.trim(),n=document.getElementById("menu-veg").value==="veg",l=document.getElementById("menu-desc").value.trim(),r=document.getElementById("menu-popular").checked,d=document.getElementById("menu-available").checked,m={id:"MNU-"+Math.floor(20+Math.random()*80),name:a,category:e,price:t,cost:Math.round(t*.35),isVeg:n,prepTime:i,isPopular:r,available:d,description:l};c.createMenuItem(m),p.close("modal-menu-form"),u.success(`"${a}" added to menu under ${e}.`),E()};window.openEditMenuItemModal=s=>{const e=c.getState().menuItems.find(i=>i.id===s);if(!e)return;let t=document.getElementById("modal-menu-form");t||(t=document.createElement("div"),t.id="modal-menu-form",t.className="modal-backdrop",document.body.appendChild(t)),t.innerHTML=`
    <div class="modal-box modal-lg">
      <div class="modal-header">
        <div class="modal-title">Edit Item — ${e.name}</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-menu-form')">✕</button>
      </div>
      <form onsubmit="window.saveEditMenuItem(event, '${e.id}')">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Item Name *</label>
              <input type="text" class="form-input" id="menu-name" required value="${e.name}">
            </div>
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select class="form-select" id="menu-cat">
                <option value="Coffee" ${e.category==="Coffee"?"selected":""}>Coffee</option>
                <option value="Starters" ${e.category==="Starters"?"selected":""}>Starters</option>
                <option value="Main Course" ${e.category==="Main Course"?"selected":""}>Main Course</option>
                <option value="Desserts" ${e.category==="Desserts"?"selected":""}>Desserts</option>
                <option value="Beverages" ${e.category==="Beverages"?"selected":""}>Beverages</option>
              </select>
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">Price (₹) *</label>
              <input type="number" min="1" step="1" class="form-input" id="menu-price" required value="${e.price}">
            </div>
            <div class="form-group">
              <label class="form-label">Prep Time *</label>
              <input type="text" class="form-input" id="menu-preptime" required value="${e.prepTime}">
            </div>
            <div class="form-group">
              <label class="form-label">Dietary Type *</label>
              <select class="form-select" id="menu-veg">
                <option value="veg" ${e.isVeg?"selected":""}>🟢 Vegetarian</option>
                <option value="non-veg" ${e.isVeg?"":"selected"}>🔴 Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description *</label>
            <textarea class="form-textarea" id="menu-desc" required>${e.description}</textarea>
          </div>

          <div style="display:flex; gap:16px; align-items:center; margin-top:8px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" id="menu-popular" ${e.isPopular?"checked":""}>
              <span style="font-size:13px; font-weight:500;">Mark as Chef's Special / Popular</span>
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" id="menu-available" ${e.available?"checked":""}>
              <span style="font-size:13px; font-weight:500;">Currently In Stock</span>
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-menu-form')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save Changes</button>
        </div>
      </form>
    </div>
  `,p.open("modal-menu-form")};window.saveEditMenuItem=(s,a)=>{s.preventDefault();const e=document.getElementById("menu-name").value.trim(),t=document.getElementById("menu-cat").value,i=parseFloat(document.getElementById("menu-price").value),n=document.getElementById("menu-preptime").value.trim(),l=document.getElementById("menu-veg").value==="veg",r=document.getElementById("menu-desc").value.trim(),d=document.getElementById("menu-popular").checked,m=document.getElementById("menu-available").checked;c.updateMenuItem({id:a,name:e,category:t,price:i,cost:Math.round(i*.35),isVeg:l,prepTime:n,isPopular:d,available:m,description:r}),p.close("modal-menu-form"),u.success(`Updated "${e}"`),E()};window.confirmDeleteMenuItem=s=>{p.confirm({title:"Delete Menu Item",message:"Are you sure you want to remove this item from the cafe menu?",isDanger:!0,confirmText:"Delete Item",onConfirm:()=>{c.deleteMenuItem(s),u.info("Item removed from menu."),E()}})};let T="all",ee="";function U(){const s=c.getState(),a=document.getElementById("view-customers");if(!a)return;s.customers.length;const e=s.customers.filter(l=>l.status==="Regular"||l.status==="VIP").length,t=s.customers.filter(l=>l.status==="VIP").length,i=s.customers.filter(l=>l.status==="At Risk").length;let n=[...s.customers];if(T!=="all"&&(n=n.filter(l=>l.status.toLowerCase()===T.toLowerCase())),ee.trim()){const l=ee.toLowerCase().trim();n=n.filter(r=>r.name.toLowerCase().includes(l)||r.phone.includes(l)||r.email&&r.email.toLowerCase().includes(l))}a.innerHTML=`
    <!-- KPI Header Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Customer Base</div>
        <div class="stat-value">1,247</div>
        <div class="stat-delta up">+43 joined this month</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active (Last 30 Days)</div>
        <div class="stat-value">${e*42}</div>
        <div class="stat-delta up">38% monthly return rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">VIP High Spenders</div>
        <div class="stat-value">${t*18}</div>
        <div class="stat-delta up">₹15,000+ lifetime spend</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">At-Risk (Inactive 30+ Days)</div>
        <div class="stat-value" style="color:var(--red);">${i*24}</div>
        <div class="stat-delta dn">Eligible for win-back discount</div>
      </div>
    </div>

    <!-- Controls Header -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${T==="all"?"active":""}" onclick="window.filterCustSegment('all')">All Customers</button>
        <button class="ftab ${T==="regular"?"active":""}" onclick="window.filterCustSegment('regular')">Regulars</button>
        <button class="ftab ${T==="vip"?"active":""}" onclick="window.filterCustSegment('vip')">VIPs</button>
        <button class="ftab ${T==="new"?"active":""}" onclick="window.filterCustSegment('new')">New</button>
        <button class="ftab ${T==="at risk"?"active":""}" onclick="window.filterCustSegment('at risk')">At Risk (${i})</button>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search customer name, phone..." value="${ee}" oninput="window.searchCustomers(this.value)">
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.openAddCustomerModal()">+ Add Customer</button>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="table-card">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total Orders</th>
              <th>Total Spending</th>
              <th>Last Visit</th>
              <th>Segment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${n.length===0?`
              <tr>
                <td colspan="7">
                  <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <div class="empty-title">No customers found</div>
                    <div class="empty-desc">No customer matches your search or filter.</div>
                  </div>
                </td>
              </tr>
            `:n.map(l=>{const r=l.name.split(" ").map(m=>m[0]).join("").slice(0,2),d=l.status==="VIP"?"badge-blue":l.status==="Regular"?"badge-green":l.status==="New"?"badge-grey":"badge-yellow";return`
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <div class="cust-av">${r}</div>
                      <div>
                        <div class="td-bold">${l.name}</div>
                        <div style="font-size:11px; color:var(--muted);">${l.email||"No email registered"}</div>
                      </div>
                    </div>
                  </td>
                  <td class="td-muted">${l.phone}</td>
                  <td>${l.orders} orders</td>
                  <td class="td-bold">₹${l.spend.toLocaleString("en-IN")}</td>
                  <td class="td-muted">${l.lastVisit}</td>
                  <td><span class="badge ${d}">${l.status}</span></td>
                  <td>
                    <button class="btn btn-ghost btn-sm" onclick="window.openCustomerProfile('${l.id}')">View CRM Profile</button>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Customer Profile Slide Drawer -->
    <div class="drawer-panel" id="cust-profile-drawer">
      <div class="drawer-header">
        <div class="modal-title" id="cust-drawer-name">Customer Profile</div>
        <button class="modal-close-btn" onclick="window.modal.closeDrawer('cust-profile-drawer')">✕</button>
      </div>
      <div class="drawer-body" id="cust-drawer-body"></div>
      <div class="drawer-footer" id="cust-drawer-footer"></div>
    </div>
  `}window.filterCustSegment=s=>{T=s,U()};window.searchCustomers=s=>{ee=s,U()};window.openCustomerProfile=s=>{const e=c.getState().customers.find(i=>i.id===s);if(!e)return;const t=e.name.split(" ").map(i=>i[0]).join("").slice(0,2);document.getElementById("cust-drawer-name").textContent=e.name,document.getElementById("cust-drawer-body").innerHTML=`
    <!-- Top Bio Card -->
    <div style="display:flex; align-items:center; gap:14px; margin-bottom:18px; padding-bottom:16px; border-bottom:1px solid var(--border);">
      <div class="cust-av" style="width:48px; height:48px; font-size:17px;">${t}</div>
      <div>
        <div style="font-size:17px; font-weight:700;">${e.name}</div>
        <div style="font-size:12.5px; color:var(--muted);">${e.phone} &middot; ${e.email||"None"}</div>
        <span class="badge badge-green" style="margin-top:4px;">${e.status}</span>
      </div>
    </div>

    <!-- Spending & Frequency Metrics -->
    <div class="form-row" style="margin-bottom:18px;">
      <div style="background:#FAFAF9; padding:12px; border-radius:8px; border:1px solid var(--border);">
        <div style="font-size:11px; color:var(--muted);">Total Lifetime Spend</div>
        <div style="font-size:20px; font-weight:700; color:var(--accent);">₹${e.spend.toLocaleString("en-IN")}</div>
      </div>
      <div style="background:#FAFAF9; padding:12px; border-radius:8px; border:1px solid var(--border);">
        <div style="font-size:11px; color:var(--muted);">Total Orders Placed</div>
        <div style="font-size:20px; font-weight:700; color:var(--text);">${e.orders}</div>
      </div>
    </div>

    <!-- Staff Notes / Preferences -->
    <div style="margin-bottom:20px;">
      <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--muted); margin-bottom:6px;">
        Staff Notes &amp; Preferences
      </div>
      <textarea class="form-textarea" id="cust-notes-input" style="min-height:70px;">${e.notes||""}</textarea>
      <button class="btn btn-outline btn-sm" style="margin-top:6px;" onclick="window.saveCustomerNotes('${e.id}')">Save Notes</button>
    </div>

    <!-- Order History -->
    <div style="margin-bottom:20px;">
      <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--muted); margin-bottom:8px;">
        Past Orders History (${(e.ordersHistory||[]).length})
      </div>
      ${e.ordersHistory&&e.ordersHistory.length>0?`
        <div class="order-items-list">
          ${e.ordersHistory.map(i=>`
            <div class="order-item-row">
              <div>
                <div style="font-weight:600;">${i.id} &middot; <span style="font-weight:400; font-size:11.5px; color:var(--muted);">${i.date}</span></div>
                <div style="font-size:11.5px; color:var(--muted);">${i.items}</div>
              </div>
              <div style="font-weight:700;">₹${i.amount}</div>
            </div>
          `).join("")}
        </div>
      `:'<div style="font-size:12px; color:var(--muted);">No past orders recorded.</div>'}
    </div>

    <!-- Booking History -->
    <div>
      <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--muted); margin-bottom:8px;">
        Reservation History (${(e.bookingsHistory||[]).length})
      </div>
      ${e.bookingsHistory&&e.bookingsHistory.length>0?`
        <div class="order-items-list">
          ${e.bookingsHistory.map(i=>`
            <div class="order-item-row">
              <div>
                <div style="font-weight:600;">${i.id} &middot; ${i.date}</div>
                <div style="font-size:11.5px; color:var(--muted);">${i.guests} guests</div>
              </div>
              <div><span class="badge badge-green">${i.status}</span></div>
            </div>
          `).join("")}
        </div>
      `:'<div style="font-size:12px; color:var(--muted);">No past bookings found.</div>'}
    </div>
  `,document.getElementById("cust-drawer-footer").innerHTML=`
    <button class="btn btn-danger-ghost btn-sm" onclick="window.confirmDeleteCustomer('${e.id}')">Delete Customer</button>
    <button class="btn btn-primary btn-sm" onclick="window.sendDirectWhatsApp('${e.phone}')">💬 Open WhatsApp</button>
  `,p.openDrawer("cust-profile-drawer")};window.saveCustomerNotes=s=>{const a=document.getElementById("cust-notes-input").value.trim(),e=c.getState(),t=e.customers.map(i=>i.id===s?{...i,notes:a}:i);c.saveState({...e,customers:t}),u.success("Customer notes saved.")};window.sendDirectWhatsApp=s=>{window.router.navigate("whatsapp"),u.info(`Switched to WhatsApp Simulator for ${s}`)};window.confirmDeleteCustomer=s=>{p.confirm({title:"Delete Customer Record",message:"Are you sure you want to delete this customer and their history?",isDanger:!0,confirmText:"Delete Record",onConfirm:()=>{c.deleteCustomer(s),p.closeDrawer("cust-profile-drawer"),u.info("Customer removed."),U()}})};window.openAddCustomerModal=()=>{let s=document.getElementById("modal-add-cust");s||(s=document.createElement("div"),s.id="modal-add-cust",s.className="modal-backdrop",document.body.appendChild(s)),s.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">+ Add Customer to CRM</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-add-cust')">✕</button>
      </div>
      <form onsubmit="window.saveNewCustomer(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" id="cust-new-name" required placeholder="e.g. Shalini Roy">
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="tel" class="form-input" id="cust-new-phone" required placeholder="e.g. 9812345678">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" id="cust-new-email" placeholder="e.g. shalini@gmail.com">
            </div>
            <div class="form-group">
              <label class="form-label">Segment</label>
              <select class="form-select" id="cust-new-segment">
                <option value="New">New</option>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="At Risk">At Risk</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Initial Notes / Preferences</label>
            <textarea class="form-textarea" id="cust-new-notes" placeholder="e.g. Coffee preferences, allergies, dietary constraints..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-add-cust')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Create Profile</button>
        </div>
      </form>
    </div>
  `,p.open("modal-add-cust")};window.saveNewCustomer=s=>{s.preventDefault();const a=document.getElementById("cust-new-name").value.trim(),e=document.getElementById("cust-new-phone").value.trim(),t=document.getElementById("cust-new-email").value.trim(),i=document.getElementById("cust-new-segment").value,n=document.getElementById("cust-new-notes").value.trim(),l={id:"CUST-"+Math.floor(120+Math.random()*800),name:a,phone:e,email:t,orders:0,spend:0,lastVisit:"Today",status:i,notes:n,ordersHistory:[],bookingsHistory:[]};c.createCustomer(l),p.close("modal-add-cust"),u.success(`Created CRM profile for ${a}`),U()};let P="all";function H(){const s=c.getState(),a=document.getElementById("view-staff");if(!a)return;const e=b.getCurrentUser();if(!(e&&e.role==="Owner")){a.innerHTML=`
      <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:44px 28px; text-align:center; max-width:580px; margin:40px auto; box-shadow:var(--shadow-sm);">
        <div style="width:58px; height:58px; border-radius:50%; background:rgba(184,115,51,0.12); color:var(--accent); font-size:28px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px;">🔒</div>
        <div style="font-size:18px; font-weight:700; color:var(--text); margin-bottom:8px;">Managing Authority Access Restricted</div>
        <div style="font-size:13px; color:var(--muted); line-height:1.55; margin-bottom:22px;">
          Only the <strong>Cafe Owner (Aditya Singhal)</strong> has the administrative authority to create, provision, and assign roles for Managers and Staff members.<br>
          Self-registration is strictly disabled to prevent unauthorized account creation.
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.router.navigate('orders')">Return to Daily Operations</button>
      </div>
    `;return}let i=[...s.staff];P!=="all"&&(i=i.filter(n=>n.role.toLowerCase()===P.toLowerCase())),a.innerHTML=`
    <!-- Top Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Provisioned Accounts</div>
        <div class="stat-value">${s.staff.length}</div>
        <div class="stat-delta up">All credentials active</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Currently On Shift</div>
        <div class="stat-value">${s.staff.filter(n=>n.status==="Active").length}</div>
        <div class="stat-delta up">Floor &amp; Kitchen active</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Authorized Managers</div>
        <div class="stat-value">${s.staff.filter(n=>n.role==="Manager").length}</div>
        <div class="stat-delta neutral">Operational &amp; Growth access</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Floor &amp; Baristas</div>
        <div class="stat-value">${s.staff.filter(n=>n.role==="Staff").length}</div>
        <div class="stat-delta neutral">POS &amp; Order terminal access</div>
      </div>
    </div>

    <!-- Owner Authority Security Banner -->
    <div style="background:var(--card); border:1px solid var(--border); border-left:4px solid var(--accent); border-radius:10px; padding:16px 20px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
      <div style="max-width:700px;">
        <div style="font-size:14.5px; font-weight:700; color:var(--text); display:flex; align-items:center; gap:8px;">
          <span>👑 Managing Authority Account Provisioning</span>
          <span class="badge badge-purple">Owner Authority Only</span>
        </div>
        <div style="font-size:12.5px; color:var(--muted); margin-top:3px; line-height:1.45;">
          You are logged in with Master Owner Authority. Only you can create, assign roles, and set login credentials for Managers and Staff. Self-registration is strictly blocked to maintain administrative security.
        </div>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <button class="btn btn-outline btn-sm" onclick="window.openPermissionsMatrixModal()">🔐 Permissions Matrix</button>
        <button class="btn btn-primary btn-sm" onclick="window.openAddStaffModal()">+ Provision New Account</button>
      </div>
    </div>

    <!-- Controls Header -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${P==="all"?"active":""}" onclick="window.filterStaffRole('all')">All Accounts (${s.staff.length})</button>
        <button class="ftab ${P==="owner"?"active":""}" onclick="window.filterStaffRole('owner')">Owners</button>
        <button class="ftab ${P==="manager"?"active":""}" onclick="window.filterStaffRole('manager')">Managers</button>
        <button class="ftab ${P==="staff"?"active":""}" onclick="window.filterStaffRole('staff')">Staff &amp; Baristas</button>
      </div>
    </div>

    <!-- Staff & Managing Accounts Table -->
    <div class="table-card">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Member / Login ID</th>
              <th>Authority Role</th>
              <th>Account Origin</th>
              <th>Contact Info</th>
              <th>Shift Schedule</th>
              <th>Status</th>
              <th>Administrative Actions</th>
            </tr>
          </thead>
          <tbody>
            ${i.map(n=>{const l=n.name.split(" ").map(m=>m[0]).join("").slice(0,2).toUpperCase(),r=n.role==="Owner",d=r?"badge-purple":n.role==="Manager"?"badge-blue":"badge-grey";return`
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <div class="cust-av" style="background:rgba(11,32,24,0.1); color:var(--sidebar);">${l}</div>
                      <div>
                        <div class="td-bold">${n.name}</div>
                        <div style="font-size:11.5px; color:var(--muted); font-family:monospace;">${n.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge ${d}">
                      ${r?"👑 ":n.role==="Manager"?"👔 ":"☕ "}${n.role}
                    </span>
                  </td>
                  <td>
                    <span style="font-size:11.5px; color:var(--muted); display:inline-flex; align-items:center; gap:4px;">
                      <span>🛡️</span> ${r?"Master Admin":"Owner-Provisioned"}
                    </span>
                  </td>
                  <td>
                    <div style="font-size:12px;">${n.phone}</div>
                  </td>
                  <td class="td-muted" style="font-size:12px;">${n.shift}</td>
                  <td>
                    <span class="badge ${n.status==="Active"?"badge-green":"badge-red"}">${n.status}</span>
                  </td>
                  <td>
                    <div style="display:flex; gap:6px; align-items:center;">
                      <button class="btn btn-ghost btn-sm" onclick="window.openEditStaffModal('${n.id}')">Edit</button>
                      ${r?`
                        <span style="font-size:11px; color:var(--muted); font-style:italic;">Protected</span>
                      `:`
                        <button class="btn btn-ghost btn-sm" onclick="window.openResetStaffPasswordModal('${n.id}')" title="Reset employee login password">🔑 Reset Pwd</button>
                        <button class="btn btn-danger-ghost btn-sm" onclick="window.confirmDeleteStaff('${n.id}')" title="Revoke account access">Revoke</button>
                      `}
                    </div>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}window.filterStaffRole=s=>{P=s,H()};window.openPermissionsMatrixModal=()=>{let s=document.getElementById("modal-permissions-matrix");s||(s=document.createElement("div"),s.id="modal-permissions-matrix",s.className="modal-backdrop",document.body.appendChild(s));const a=b.getCurrentUser(),e=a&&a.role==="Owner",i=c.getState().rolePermissions||{Manager:{},Staff:{}},n=[{key:"dashboard",name:"Dashboard & Overview",desc:"KPI counters, real-time sales & operational overview"},{key:"orders",name:"Orders Management & POS",desc:"Take live orders, billing, kitchen display & payments"},{key:"bookings",name:"Reservations & Bookings",desc:"Table reservations, guest check-in & calendar"},{key:"tables",name:"Floor Plan & Tables",desc:"Floor layout, occupancy status & seating assignment"},{key:"menu",name:"Menu & Stock Catalog",desc:"Recipe items, pricing, out-of-stock 86 toggles"},{key:"customers",name:"Customer CRM",desc:"Guest directory, spending history & VIP profiles"},{key:"staff",name:"Staff & Account Management",desc:"Staff directory & managing authority account creation"},{key:"analytics",name:"Financials & Analytics",desc:"Revenue analysis, category metrics & sales reports"},{key:"offers",name:"Offers & Promotions",desc:"Discount coupons, promo rules & broadcasts"},{key:"reviews",name:"Reviews & Reputation",desc:"Customer ratings, Google/Zomato feedback & replies"},{key:"whatsapp",name:"WhatsApp Automation Hub",desc:"WhatsApp bot conversations & automated alerts"},{key:"ai-calling",name:"AI Voice Calling Concierge",desc:"Automated AI voice calls for booking confirmations"},{key:"qr-system",name:"Table QR Orders",desc:"Permanent table standees, online ordering & pause"},{key:"notifications",name:"Notification Center",desc:"System alerts, low inventory & guest arrival notices"},{key:"settings",name:"Settings & Configuration",desc:"Business profile, GST taxes, turnover times & rules"}];s.innerHTML=`
    <div class="modal-box modal-lg" style="max-height:92vh;">
      <div class="modal-header">
        <div>
          <div class="modal-title" style="display:flex; align-items:center; gap:8px;">
            <span>Role Permissions &amp; Access Control Matrix</span>
            ${e?'<span class="badge badge-purple">Owner Edit Mode</span>':'<span class="badge badge-grey">Read Only</span>'}
          </div>
          <div style="font-size:12px; color:var(--muted); margin-top:2px;">
            ${e?"As the Cafe Owner, you can customize feature access for Manager and Staff roles.":"Only the Cafe Owner can edit permissions for Manager and Staff."}
          </div>
        </div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-permissions-matrix')">✕</button>
      </div>

      <div class="modal-body" style="padding:0; overflow-y:auto; max-height:calc(92vh - 130px);">
        <table style="width:100%;">
          <thead>
            <tr>
              <th style="padding:12px 18px;">Feature / Module</th>
              <th style="text-align:center; min-width:140px;">👑 Owner</th>
              <th style="text-align:center; min-width:140px;">👔 Manager</th>
              <th style="text-align:center; min-width:140px;">☕ Staff / Barista</th>
            </tr>
          </thead>
          <tbody>
            ${n.map(l=>{const r=l.key==="staff",d=r?!1:i.Manager?!!i.Manager[l.key]:!1,m=r?!1:i.Staff?!!i.Staff[l.key]:!1;return`
                <tr>
                  <td style="padding:11px 18px;">
                    <div style="font-weight:600; font-size:13px;">${l.name}</div>
                    <div style="font-size:11px; color:var(--muted); line-height:1.3;">${l.desc}</div>
                  </td>
                  <td style="text-align:center;">
                    <span class="badge badge-green" style="font-size:11px;">Full Access 🔒</span>
                  </td>
                  <td style="text-align:center;">
                    ${r?`
                      <span class="badge badge-grey" title="Only the Owner can manage staff & accounts">Owner Only 🔒</span>
                    `:e?`
                      <label class="toggle" style="display:inline-block;">
                        <input type="checkbox" id="perm-mgr-${l.key}" ${d?"checked":""}>
                        <span class="toggle-slider"></span>
                      </label>
                    `:`
                      <span class="badge ${d?"badge-green":"badge-grey"}">${d?"Allowed":"Restricted"}</span>
                    `}
                  </td>
                  <td style="text-align:center;">
                    ${r?`
                      <span class="badge badge-grey" title="Only the Owner can manage staff & accounts">Owner Only 🔒</span>
                    `:e?`
                      <label class="toggle" style="display:inline-block;">
                        <input type="checkbox" id="perm-stf-${l.key}" ${m?"checked":""}>
                        <span class="toggle-slider"></span>
                      </label>
                    `:`
                      <span class="badge ${m?"badge-green":"badge-grey"}">${m?"Allowed":"Restricted"}</span>
                    `}
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>

      <div class="modal-footer" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          ${e?`
            <button class="btn btn-outline btn-sm" onclick="window.resetRolePermissionsDefaults()">↺ Reset to Recommended Defaults</button>
          `:`
            <span style="font-size:11.5px; color:var(--muted);">Viewing role authorization matrix</span>
          `}
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-permissions-matrix')">Close</button>
          ${e?`
            <button class="btn btn-primary btn-sm" onclick="window.saveRolePermissionsFromModal()">💾 Save Permissions</button>
          `:""}
        </div>
      </div>
    </div>
  `,p.open("modal-permissions-matrix")};window.saveRolePermissionsFromModal=()=>{const s=["dashboard","orders","bookings","tables","menu","customers","staff","analytics","offers","reviews","whatsapp","ai-calling","qr-system","notifications","settings"],a={},e={};s.forEach(t=>{if(t==="staff"){a[t]=!1,e[t]=!1;return}const i=document.getElementById(`perm-mgr-${t}`),n=document.getElementById(`perm-stf-${t}`);i&&(a[t]=i.checked),n&&(e[t]=n.checked)}),c.updateRolePermissions("Manager",a),c.updateRolePermissions("Staff",e),window.updateSidebarVisibility&&window.updateSidebarVisibility(),u.success("Role permissions saved successfully! Updated access rules are now in effect."),p.close("modal-permissions-matrix"),H()};window.resetRolePermissionsDefaults=()=>{const s={dashboard:!0,orders:!0,bookings:!0,tables:!0,menu:!0,customers:!0,staff:!1,analytics:!0,offers:!0,reviews:!0,whatsapp:!0,"ai-calling":!0,"qr-system":!0,notifications:!0,settings:!1},a={dashboard:!1,orders:!0,bookings:!0,tables:!0,menu:!0,customers:!1,staff:!1,analytics:!1,offers:!1,reviews:!1,whatsapp:!1,"ai-calling":!1,"qr-system":!0,notifications:!0,settings:!1};["dashboard","orders","bookings","tables","menu","customers","staff","analytics","offers","reviews","whatsapp","ai-calling","qr-system","notifications","settings"].forEach(t=>{if(t==="staff")return;const i=document.getElementById(`perm-mgr-${t}`),n=document.getElementById(`perm-stf-${t}`);i&&(i.checked=!!s[t]),n&&(n.checked=!!a[t])}),u.info('Loaded recommended role defaults. Click "Save Permissions" to commit.')};window.openAddStaffModal=()=>{const s=b.getCurrentUser();if(!s||s.role!=="Owner"){u.error("Access Denied: Only the Cafe Owner can provision new staff or manager accounts.");return}let a=document.getElementById("modal-staff-form");a||(a=document.createElement("div"),a.id="modal-staff-form",a.className="modal-backdrop",document.body.appendChild(a)),a.innerHTML=`
    <div class="modal-box" style="max-width:540px;">
      <div class="modal-header">
        <div>
          <div class="modal-title" style="display:flex; align-items:center; gap:8px;">
            <span>👑 Provision New Managing Account</span>
          </div>
          <div style="font-size:11.5px; color:var(--muted); margin-top:2px;">
            Create login credentials for a Manager or Staff member. (Owner-only authority)
          </div>
        </div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-staff-form')">✕</button>
      </div>

      <form onsubmit="window.saveNewStaff(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" id="stf-name" required placeholder="e.g. Ramesh Iyer">
            </div>
            <div class="form-group">
              <label class="form-label">Managing Authority Role *</label>
              <select class="form-select" id="stf-role" required>
                <option value="Manager">👔 Manager (Operational Authority)</option>
                <option value="Staff" selected>☕ Staff / Barista (Floor &amp; POS)</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Official Work Email (Login ID) *</label>
              <input type="email" class="form-input" id="stf-email" required placeholder="e.g. ramesh@brewandco.com">
            </div>
            <div class="form-group">
              <label class="form-label">Contact Phone Number *</label>
              <input type="tel" class="form-input" id="stf-phone" required placeholder="e.g. +91 98765 44004">
            </div>
          </div>

          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <label class="form-label" style="margin-bottom:0;">Initial Login Password *</label>
              <button type="button" class="btn btn-ghost btn-sm" style="padding:2px 6px; font-size:11px;" onclick="window.generateRandomStaffPassword()">⚡ Generate Password</button>
            </div>
            <input type="text" class="form-input" id="stf-password" required value="brew@2026" placeholder="Set initial password for member">
            <div class="form-hint">The employee will use this password to sign into the dashboard.</div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Shift Timing</label>
              <select class="form-select" id="stf-shift">
                <option value="Morning (08:00 - 16:30)">Morning (08:00 - 16:30)</option>
                <option value="Evening (15:30 - 23:30)">Evening (15:30 - 23:30)</option>
                <option value="All Day Shift">All Day Shift</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Station / Department</label>
              <select class="form-select" id="stf-station">
                <option value="Dining Area Floor">Dining Area Floor</option>
                <option value="Espresso & Barista Bar">Espresso &amp; Barista Bar</option>
                <option value="Kitchen & KDS">Kitchen &amp; KDS</option>
                <option value="Billing & Counter POS">Billing &amp; Counter POS</option>
              </select>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:11.5px; color:var(--muted);">🔒 Provisioned exclusively by Owner</span>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-staff-form')">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm">Provision Account</button>
          </div>
        </div>
      </form>
    </div>
  `,p.open("modal-staff-form")};window.generateRandomStaffPassword=()=>{const s="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let a="Cafe";for(let t=0;t<4;t++)a+=s.charAt(Math.floor(Math.random()*s.length));a+="!";const e=document.getElementById("stf-password");e&&(e.value=a),u.info(`Generated temporary password: ${a}`)};window.saveNewStaff=s=>{s.preventDefault();const a=b.getCurrentUser();if(!a||a.role!=="Owner"){u.error("Unauthorized: Only the Cafe Owner can create managing accounts.");return}const e=document.getElementById("stf-name").value.trim(),t=document.getElementById("stf-role").value,i=document.getElementById("stf-email").value.trim().toLowerCase(),n=document.getElementById("stf-phone").value.trim(),l=document.getElementById("stf-password").value.trim(),r=document.getElementById("stf-shift").value;if(l.length<4){u.error("Password must be at least 4 characters long.");return}if(c.getState().users.some(v=>v.email.toLowerCase()===i)){u.error(`An account with email "${i}" already exists. Please use a unique work email address.`);return}c.createStaffAccount({name:e,email:i,password:l,role:t,phone:n,shift:r,status:"Active"}),p.close("modal-staff-form"),u.success(`Account created for ${e} (${t})! Login ID: ${i}, Password: ${l}`),H()};window.openEditStaffModal=s=>{const a=b.getCurrentUser();if(!a||a.role!=="Owner"){u.error("Unauthorized: Only the Cafe Owner can edit staff accounts.");return}const t=c.getState().staff.find(l=>l.id===s);if(!t)return;const i=t.role==="Owner";let n=document.getElementById("modal-staff-form");n||(n=document.createElement("div"),n.id="modal-staff-form",n.className="modal-backdrop",document.body.appendChild(n)),n.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">Edit Staff Profile — ${t.name}</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-staff-form')">✕</button>
      </div>
      <form onsubmit="window.saveEditStaff(event, '${t.id}')">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" id="stf-edit-name" required value="${t.name}">
            </div>
            <div class="form-group">
              <label class="form-label">Authority Role *</label>
              ${i?`
                <input type="text" class="form-input" readonly value="Owner (Master Admin)" style="background:#FAFAF9;">
                <input type="hidden" id="stf-edit-role" value="Owner">
              `:`
                <select class="form-select" id="stf-edit-role">
                  <option value="Manager" ${t.role==="Manager"?"selected":""}>👔 Manager (Operational Authority)</option>
                  <option value="Staff" ${t.role==="Staff"?"selected":""}>☕ Staff / Barista (Floor &amp; POS)</option>
                </select>
              `}
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Email Address (Login ID)</label>
              <input type="email" class="form-input" readonly value="${t.email}" style="background:#FAFAF9;">
              <div class="form-hint">Email address serves as the unique login username.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="tel" class="form-input" id="stf-edit-phone" required value="${t.phone}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Shift Timing</label>
              <input type="text" class="form-input" id="stf-edit-shift" value="${t.shift}">
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-select" id="stf-edit-status">
                <option value="Active" ${t.status==="Active"?"selected":""}>Active</option>
                <option value="Inactive" ${t.status==="Inactive"?"selected":""}>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-staff-form')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save Profile</button>
        </div>
      </form>
    </div>
  `,p.open("modal-staff-form")};window.saveEditStaff=(s,a)=>{s.preventDefault();const e=b.getCurrentUser();if(!e||e.role!=="Owner"){u.error("Unauthorized: Only the Cafe Owner can edit accounts.");return}const t=document.getElementById("stf-edit-name").value.trim(),i=document.getElementById("stf-edit-role").value,n=document.getElementById("stf-edit-phone").value.trim(),l=document.getElementById("stf-edit-shift").value.trim(),r=document.getElementById("stf-edit-status").value,m=c.getState().staff.find(v=>v.id===a);m&&(c.updateStaff({...m,name:t,role:i,phone:n,shift:l,status:r}),p.close("modal-staff-form"),u.success(`Updated account details for ${t}`),H())};window.openResetStaffPasswordModal=s=>{const a=b.getCurrentUser();if(!a||a.role!=="Owner"){u.error("Only the Cafe Owner can reset staff passwords.");return}const t=c.getState().staff.find(n=>n.id===s);if(!t)return;let i=document.getElementById("modal-reset-staff-pwd");i||(i=document.createElement("div"),i.id="modal-reset-staff-pwd",i.className="modal-backdrop",document.body.appendChild(i)),i.innerHTML=`
    <div class="modal-box" style="max-width:440px;">
      <div class="modal-header">
        <div class="modal-title">🔑 Reset Password for ${t.name}</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-reset-staff-pwd')">✕</button>
      </div>
      <form onsubmit="window.saveResetStaffPassword(event, '${t.email}')">
        <div class="modal-body">
          <p style="font-size:12.5px; color:var(--muted); margin-bottom:14px; line-height:1.45;">
            As Owner, you can set a new login password for <strong>${t.name}</strong> (<code>${t.email}</code>).
          </p>

          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <label class="form-label" style="margin-bottom:0;">New Password *</label>
              <button type="button" class="btn btn-ghost btn-sm" style="padding:2px 6px; font-size:11px;" onclick="window.generateResetPasswordVal()">⚡ Generate</button>
            </div>
            <input type="text" class="form-input" id="reset-new-staff-pwd" required value="cafe${Math.floor(100+Math.random()*900)}!" placeholder="Enter new password">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-reset-staff-pwd')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Update Password</button>
        </div>
      </form>
    </div>
  `,p.open("modal-reset-staff-pwd")};window.generateResetPasswordVal=()=>{const s="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let a="Cafe";for(let t=0;t<4;t++)a+=s.charAt(Math.floor(Math.random()*s.length));a+="!";const e=document.getElementById("reset-new-staff-pwd");e&&(e.value=a)};window.saveResetStaffPassword=(s,a)=>{s.preventDefault();const e=b.getCurrentUser();if(!e||e.role!=="Owner"){u.error("Unauthorized.");return}const t=document.getElementById("reset-new-staff-pwd").value.trim();if(t.length<4){u.error("Password must be at least 4 characters long.");return}c.resetStaffPassword(a,t),p.close("modal-reset-staff-pwd"),u.success(`Login password for ${a} has been updated to "${t}".`)};window.confirmDeleteStaff=s=>{const a=b.getCurrentUser();if(!a||a.role!=="Owner"){u.error("Unauthorized: Only the Cafe Owner can revoke accounts.");return}const t=c.getState().staff.find(i=>i.id===s);if(t){if(t.role==="Owner"){u.error("Cannot remove master Owner account.");return}p.confirm({title:`Revoke Account: ${t.name}`,message:`Are you sure you want to revoke account access for ${t.name} (${t.role})? Their login credentials (${t.email}) will be permanently deactivated.`,isDanger:!0,confirmText:"Revoke Access",onConfirm:()=>{c.deleteStaff(s),u.info(`Account access for ${t.name} has been revoked.`),H()}})}};let L="7d";function Ce(){const s=document.getElementById("view-analytics");s&&(s.innerHTML=`
    <!-- Timeframe Filter Header -->
    <div class="section-header">
      <div>
        <div class="section-title">Performance Analytics &amp; Operations Intelligence</div>
        <div style="font-size:12px; color:var(--muted); margin-top:2px;">Track revenue velocity, table turnover, rush hours &amp; item profitability</div>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <div class="filter-tabs" id="analytics-timeframe-tabs">
          <button class="ftab ${L==="today"?"active":""}" onclick="window.setAnalyticsTimeframe('today')">Today</button>
          <button class="ftab ${L==="7d"?"active":""}" onclick="window.setAnalyticsTimeframe('7d')">Last 7 Days</button>
          <button class="ftab ${L==="30d"?"active":""}" onclick="window.setAnalyticsTimeframe('30d')">Last 30 Days</button>
          <button class="ftab ${L==="3m"?"active":""}" onclick="window.setAnalyticsTimeframe('3m')">Last 3 Months</button>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.exportAnalyticsReport()">📊 Export Report</button>
      </div>
    </div>

    <!-- Reactive KPI Metrics Row -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Total Revenue</div>
        <div class="stat-value" id="analytics-stat-rev">₹1,05,340</div>
        <div class="stat-delta up">+18.4% vs previous period</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Order Volume</div>
        <div class="stat-value" id="analytics-stat-orders">247 orders</div>
        <div class="stat-delta up">+31 orders week-over-week</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Average Order Value (AOV)</div>
        <div class="stat-value" id="analytics-stat-aov">₹426</div>
        <div class="stat-delta up">+₹32 due to dessert upselling</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Unique Guests Served</div>
        <div class="stat-value" id="analytics-stat-cust">215 unique</div>
        <div class="stat-delta up">68% repeat customer retention</div>
      </div>
    </div>

    <!-- Secondary operational stats -->
    <div class="stats-row" style="margin-bottom:20px;">
      <div class="stat-card">
        <div class="stat-label">Avg Table Turnover Time</div>
        <div class="stat-value">38 mins</div>
        <div class="stat-delta up">7 mins faster than target</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Reservation Cancellation Rate</div>
        <div class="stat-value">4.2%</div>
        <div class="stat-delta up">Low (Industry avg: 12%)</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">WhatsApp AI Resolution Rate</div>
        <div class="stat-value">94.8%</div>
        <div class="stat-delta up">Automated without staff intervention</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Food Waste / Spoilage</div>
        <div class="stat-value">1.8%</div>
        <div class="stat-delta up">Under ₹2,100 monthly loss</div>
      </div>
    </div>

    <!-- Charts Row 1: Trend line + Hourly Peak -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Revenue &amp; Sales Velocity</div>
            <div class="chart-sub">Gross sales trajectory across selected period</div>
          </div>
        </div>
        <div class="chart-wrap" style="height:220px;"><canvas id="analyticsRevenueChart"></canvas></div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Peak Rush Hours (Footfall)</div>
            <div class="chart-sub">Busiest dining windows by hour of day</div>
          </div>
        </div>
        <div class="chart-wrap" style="height:220px;"><canvas id="analyticsPeakHoursChart"></canvas></div>
      </div>
    </div>

    <!-- Charts Row 2: Top Selling Items + Sales Channels -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Top 5 Best-Selling Menu Items</div>
            <div class="chart-sub">Total units ordered by guests</div>
          </div>
        </div>
        <div class="chart-wrap" style="height:210px;"><canvas id="analyticsTopItemsChart"></canvas></div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Order Channels Distribution</div>
            <div class="chart-sub">Dine-in vs Counter Takeaway vs Delivery</div>
          </div>
        </div>
        <div class="chart-wrap" style="height:210px;"><canvas id="analyticsChannelChart"></canvas></div>
      </div>
    </div>
  `,setTimeout(()=>{Ie(L)},50))}window.setAnalyticsTimeframe=s=>{L=s,Ce(),u.info(`Updated analytics for: ${s==="today"?"Today":s==="7d"?"Last 7 Days":s==="30d"?"Last 30 Days":"Last 3 Months"}`)};window.exportAnalyticsReport=()=>{u.success("Analytics report generated and dispatched to your email.")};let O="all";function W(){const s=c.getState(),a=document.getElementById("view-offers");if(!a)return;let e=[...s.offers];O!=="all"&&(e=e.filter(t=>t.status.toLowerCase()===O.toLowerCase())),a.innerHTML=`
    <!-- Top Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Active Promotions</div>
        <div class="stat-value">${s.offers.filter(t=>t.status==="Active").length}</div>
        <div class="stat-delta up">Live on checkout &amp; WhatsApp</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Redemptions</div>
        <div class="stat-value">542</div>
        <div class="stat-delta up">+88 used this week</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Revenue Generated</div>
        <div class="stat-value">₹2.18L</div>
        <div class="stat-delta up">Average cart size ₹580</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Scheduled Campaigns</div>
        <div class="stat-value">${s.offers.filter(t=>t.status==="Scheduled").length}</div>
        <div class="stat-delta neutral">Upcoming festive discounts</div>
      </div>
    </div>

    <!-- Controls Header -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${O==="all"?"active":""}" onclick="window.filterOffers('all')">All Offers (${s.offers.length})</button>
        <button class="ftab ${O==="active"?"active":""}" onclick="window.filterOffers('active')">Active</button>
        <button class="ftab ${O==="scheduled"?"active":""}" onclick="window.filterOffers('scheduled')">Scheduled</button>
        <button class="ftab ${O==="expired"?"active":""}" onclick="window.filterOffers('expired')">Expired</button>
      </div>

      <button class="btn btn-primary btn-sm" onclick="window.openAddOfferModal()">+ Create Offer</button>
    </div>

    <!-- Offers Grid -->
    <div class="offers-grid">
      ${e.length===0?`
        <div style="grid-column: 1 / -1;">
          <div class="empty-state">
            <div class="empty-icon">🎟️</div>
            <div class="empty-title">No offers found</div>
            <div class="empty-desc">No promotional codes match the selected tab.</div>
          </div>
        </div>
      `:e.map(t=>{const i=t.status==="Active"?"badge-green":t.status==="Scheduled"?"badge-blue":"badge-grey",n=Math.min(100,Math.round(t.usedCount/t.usageLimit*100));return`
          <div class="offer-card" style="opacity: ${t.status==="Expired"?.65:1};">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <span class="offer-code-pill">${t.code}</span>
              <span class="badge ${i}">${t.status}</span>
            </div>

            <div style="font-size:15px; font-weight:700; margin-bottom:4px; color:var(--text);">${t.title}</div>
            <div style="font-size:13px; color:var(--accent); font-weight:600; margin-bottom:12px;">
              ${t.discountType==="percentage"?`${t.discountValue}% OFF (Max ₹${t.maxDiscount})`:`Flat ₹${t.discountValue} OFF`}
            </div>

            <div style="background:#FAFAF9; padding:10px 12px; border-radius:6px; border:1px solid var(--border); margin-bottom:14px; font-size:12px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span class="td-muted">Min Order Value</span>
                <strong>₹${t.minOrder}</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span class="td-muted">Validity Range</span>
                <span>${t.startDate} to ${t.endDate}</span>
              </div>
            </div>

            <!-- Usage Progress Bar -->
            <div style="margin-bottom:16px;">
              <div style="display:flex; justify-content:space-between; font-size:11.5px; color:var(--muted); margin-bottom:4px;">
                <span>Usage: <strong>${t.usedCount} / ${t.usageLimit}</strong></span>
                <span>${n}%</span>
              </div>
              <div style="height:6px; background:#EAE8E4; border-radius:3px; overflow:hidden;">
                <div style="height:100%; width:${n}%; background:var(--accent); border-radius:3px;"></div>
              </div>
            </div>

            <!-- Card Footer -->
            <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:10px;">
              <button class="btn btn-ghost btn-sm" onclick="window.copyOfferCode('${t.code}')">📋 Copy Code</button>
              <div style="display:flex; gap:6px;">
                <button class="btn btn-ghost btn-sm" onclick="window.toggleOfferActive('${t.id}')">
                  ${t.status==="Active"?"Pause":"Activate"}
                </button>
                <button class="btn btn-ghost btn-sm" onclick="window.confirmDeleteOffer('${t.id}')">🗑️</button>
              </div>
            </div>
          </div>
        `}).join("")}
    </div>
  `}window.filterOffers=s=>{O=s,W()};window.copyOfferCode=s=>{navigator.clipboard.writeText(s).then(()=>{u.success(`Coupon code "${s}" copied to clipboard!`)}).catch(()=>{u.info(`Coupon: ${s}`)})};window.toggleOfferActive=s=>{c.toggleOfferStatus(s),u.info("Offer status updated."),W()};window.confirmDeleteOffer=s=>{p.confirm({title:"Delete Offer",message:"Are you sure you want to permanently delete this offer code?",isDanger:!0,confirmText:"Delete Offer",onConfirm:()=>{c.deleteOffer(s),u.info("Offer deleted."),W()}})};window.openAddOfferModal=()=>{let s=document.getElementById("modal-offer-form");s||(s=document.createElement("div"),s.id="modal-offer-form",s.className="modal-backdrop",document.body.appendChild(s)),s.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">+ Create Offer / Promo Code</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-offer-form')">✕</button>
      </div>
      <form onsubmit="window.saveNewOffer(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Coupon Code *</label>
              <input type="text" class="form-input" id="off-code" required placeholder="e.g. MONSOON20" style="text-transform:uppercase;">
            </div>
            <div class="form-group">
              <label class="form-label">Offer Title *</label>
              <input type="text" class="form-input" id="off-title" required placeholder="e.g. Monsoon Special 20% OFF">
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">Discount Type *</label>
              <select class="form-select" id="off-type">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Discount Value *</label>
              <input type="number" min="1" class="form-input" id="off-value" required value="20">
            </div>
            <div class="form-group">
              <label class="form-label">Max Cap (₹)</label>
              <input type="number" min="1" class="form-input" id="off-max" value="150">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Min Order Value (₹) *</label>
              <input type="number" min="0" class="form-input" id="off-min" required value="300">
            </div>
            <div class="form-group">
              <label class="form-label">Total Usage Limit *</label>
              <input type="number" min="1" class="form-input" id="off-limit" required value="300">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Date *</label>
              <input type="date" class="form-input" id="off-start" required value="2026-09-01">
            </div>
            <div class="form-group">
              <label class="form-label">End Date *</label>
              <input type="date" class="form-input" id="off-end" required value="2026-09-30">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-offer-form')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Create Offer</button>
        </div>
      </form>
    </div>
  `,p.open("modal-offer-form")};window.saveNewOffer=s=>{s.preventDefault();const a=document.getElementById("off-code").value.trim().toUpperCase(),e=document.getElementById("off-title").value.trim(),t=document.getElementById("off-type").value,i=parseFloat(document.getElementById("off-value").value),n=parseFloat(document.getElementById("off-max").value)||i,l=parseFloat(document.getElementById("off-min").value)||0,r=parseInt(document.getElementById("off-limit").value,10),d=document.getElementById("off-start").value,m=document.getElementById("off-end").value,v={id:"OFF-"+Date.now(),code:a,title:e,discountType:t,discountValue:i,maxDiscount:n,minOrder:l,usageLimit:r,usedCount:0,startDate:d,endDate:m,status:"Active"};c.createOffer(v),p.close("modal-offer-form"),u.success(`Coupon ${a} created successfully.`),W()};let D="all",me="all";function j(){const s=c.getState(),a=document.getElementById("view-reviews");if(!a)return;let e=[...s.reviews];D!=="all"&&(e=e.filter(t=>t.source.toLowerCase()===D.toLowerCase())),me!=="all"&&(e=e.filter(t=>t.rating===parseInt(me,10))),a.innerHTML=`
    <!-- Rating Breakdown Card -->
    <div class="rating-breakdown-card">
      <div style="text-align:center; min-width:140px;">
        <div class="rating-big-num">4.8</div>
        <div class="rating-stars">★★★★★</div>
        <div style="font-size:12px; color:var(--muted); margin-top:4px;">Based on 284 reviews</div>
      </div>

      <!-- Star Distribution Bars -->
      <div style="flex:1; display:flex; flex-direction:column; gap:6px; width:100%;">
        <div style="display:flex; align-items:center; gap:10px; font-size:12px;">
          <span style="width:45px;">5 Stars</span>
          <div style="flex:1; height:6px; background:#EAE8E4; border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:82%; background:#2E7D55;"></div>
          </div>
          <span style="width:35px; text-align:right; color:var(--muted);">82%</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px; font-size:12px;">
          <span style="width:45px;">4 Stars</span>
          <div style="flex:1; height:6px; background:#EAE8E4; border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:12%; background:var(--accent);"></div>
          </div>
          <span style="width:35px; text-align:right; color:var(--muted);">12%</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px; font-size:12px;">
          <span style="width:45px;">3 Stars</span>
          <div style="flex:1; height:6px; background:#EAE8E4; border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:4%; background:#B8860B;"></div>
          </div>
          <span style="width:35px; text-align:right; color:var(--muted);">4%</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px; font-size:12px;">
          <span style="width:45px;">2 Stars</span>
          <div style="flex:1; height:6px; background:#EAE8E4; border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:1%; background:#C0392B;"></div>
          </div>
          <span style="width:35px; text-align:right; color:var(--muted);">1%</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px; font-size:12px;">
          <span style="width:45px;">1 Star</span>
          <div style="flex:1; height:6px; background:#EAE8E4; border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:1%; background:#C0392B;"></div>
          </div>
          <span style="width:35px; text-align:right; color:var(--muted);">1%</span>
        </div>
      </div>
    </div>

    <!-- Controls Header -->
    <div class="section-header">
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <div class="filter-tabs">
          <button class="ftab ${D==="all"?"active":""}" onclick="window.filterReviewSource('all')">All Sources (${s.reviews.length})</button>
          <button class="ftab ${D==="google"?"active":""}" onclick="window.filterReviewSource('google')">Google Maps</button>
          <button class="ftab ${D==="whatsapp"?"active":""}" onclick="window.filterReviewSource('whatsapp')">WhatsApp</button>
          <button class="ftab ${D==="dine-in qr"?"active":""}" onclick="window.filterReviewSource('dine-in qr')">Table QR</button>
        </div>

        <select class="form-select" style="width:auto; padding:5px 10px; font-size:12.5px;" onchange="window.filterReviewRating(this.value)">
          <option value="all">All Ratings</option>
          <option value="5">★★★★★ (5 Stars)</option>
          <option value="4">★★★★☆ (4 Stars)</option>
          <option value="3">★★★☆☆ (3 Stars)</option>
        </select>
      </div>

      <button class="btn btn-outline btn-sm" onclick="window.requestReviewsWhatsApp()">📢 Send Review Request Campaign</button>
    </div>

    <!-- Reviews List -->
    <div style="display:flex; flex-direction:column; gap:12px;">
      ${e.length===0?`
        <div class="empty-state">
          <div class="empty-icon">⭐</div>
          <div class="empty-title">No reviews found</div>
          <div class="empty-desc">No reviews match the current rating or source filter.</div>
        </div>
      `:e.map(t=>`
        <div class="review-item">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div class="cust-av" style="width:34px; height:34px; font-size:12px;">
                ${t.customer.split(" ").map(i=>i[0]).join("").slice(0,2)}
              </div>
              <div>
                <div style="font-weight:700; font-size:14px;">${t.customer}</div>
                <div style="font-size:11.5px; color:var(--muted);">${t.date} &middot; via <span style="font-weight:600;">${t.source}</span></div>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:8px;">
              <span class="rating-stars" style="font-size:14px;">${"★".repeat(t.rating)}${"☆".repeat(5-t.rating)}</span>
              <span class="badge ${t.status==="Handled"?"badge-green":"badge-yellow"}">${t.status}</span>
            </div>
          </div>

          <p style="font-size:13.5px; color:var(--text); line-height:1.5; margin-bottom:12px;">${t.text}</p>

          <!-- Existing Reply if present -->
          ${t.reply?`
            <div style="background:#FAFAF9; border-left:3px solid var(--accent); padding:10px 14px; border-radius:4px; font-size:12.5px; margin-bottom:10px;">
              <div style="font-weight:600; color:var(--text); font-size:11.5px; margin-bottom:2px;">Brew &amp; Co Response &middot; <span style="font-weight:400; color:var(--muted);">${t.repliedAt||"Recently"}</span></div>
              <div style="color:var(--text-secondary);">${t.reply}</div>
            </div>
          `:""}

          <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid var(--border); padding-top:8px;">
            <button class="btn btn-ghost btn-sm" onclick="window.toggleReviewStatus('${t.id}')">
              ${t.status==="Handled"?"Mark Pending":"Mark as Handled"}
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.openReplyModal('${t.id}')">
              ${t.reply?"Edit Reply":"💬 Reply to Customer"}
            </button>
          </div>
        </div>
      `).join("")}
    </div>
  `}window.filterReviewSource=s=>{D=s,j()};window.filterReviewRating=s=>{me=s,j()};window.toggleReviewStatus=s=>{c.toggleReviewHandled(s),u.info("Review status updated."),j()};window.requestReviewsWhatsApp=()=>{u.success("Automated WhatsApp review invitations sent to today's completed orders!")};window.openReplyModal=s=>{const e=c.getState().reviews.find(i=>i.id===s);if(!e)return;let t=document.getElementById("modal-review-reply");t||(t=document.createElement("div"),t.id="modal-review-reply",t.className="modal-backdrop",document.body.appendChild(t)),t.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">Reply to ${e.customer}</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-review-reply')">✕</button>
      </div>
      <div class="modal-body">
        <div style="background:#FAFAF9; padding:10px 12px; border-radius:6px; font-size:12.5px; margin-bottom:12px; border:1px solid var(--border);">
          <div style="font-weight:600; margin-bottom:2px;">"${e.text}"</div>
          <div style="color:var(--muted); font-size:11px;">Rating: ${"★".repeat(e.rating)} (${e.source})</div>
        </div>

        <!-- Quick AI Template Snippets -->
        <div style="font-size:11px; font-weight:700; color:var(--muted); margin-bottom:6px; text-transform:uppercase;">Quick AI Templates</div>
        <div style="display:flex; flex-direction:column; gap:5px; margin-bottom:12px;">
          <button type="button" class="btn btn-outline btn-sm" style="text-align:left; justify-content:flex-start;" onclick="document.getElementById('review-reply-text').value='Thank you so much for the glowing review! We are delighted you enjoyed your time with us and cannot wait to welcome you back.'">
            ✨ Delighted &amp; Warm Thank You
          </button>
          <button type="button" class="btn btn-outline btn-sm" style="text-align:left; justify-content:flex-start;" onclick="document.getElementById('review-reply-text').value='Thank you for your valuable feedback. We sincerely apologize for any delay during peak hours and are taking steps to speed up service.'">
            🙏 Apologetic &amp; Solution-Oriented
          </button>
        </div>

        <div class="form-group">
          <label class="form-label">Your Response *</label>
          <textarea class="form-textarea" id="review-reply-text" rows="4" placeholder="Write personalized response...">${e.reply||""}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-review-reply')">Cancel</button>
        <button type="button" class="btn btn-primary btn-sm" onclick="window.submitReviewReply('${e.id}')">Publish Reply</button>
      </div>
    </div>
  `,p.open("modal-review-reply")};window.submitReviewReply=s=>{const a=document.getElementById("review-reply-text").value.trim();if(!a){u.error("Reply text cannot be blank.");return}c.replyReview(s,a),p.close("modal-review-reply"),u.success("Your response has been published!"),j()};let F="simulator";function ge(){const s=c.getState(),a=document.getElementById("view-whatsapp");if(!a)return;const e=s.whatsapp;a.innerHTML=`
    <!-- WhatsApp Connection & Metrics Card -->
    <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:18px 22px; margin-bottom:18px; box-shadow:var(--shadow-sm);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:42px; height:42px; border-radius:50%; background:#25D366; display:flex; align-items:center; justify-content:center; color:#fff; font-size:22px; box-shadow:0 3px 8px rgba(37,211,102,0.3);">
            💬
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px; font-weight:700; color:var(--text);">Meta WhatsApp Cloud API</span>
              <span class="badge badge-green">${e.connection.status}</span>
            </div>
            <div style="font-size:12px; color:var(--muted); margin-top:2px;">
              Active Number: <strong>${e.connection.number}</strong> &middot; Webhook: <code>/cafe/whatsapp/incoming</code>
            </div>
          </div>
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-outline btn-sm" onclick="window.testWhatsAppWebhook()">⚡ Test Webhook Health</button>
          <button class="btn btn-primary btn-sm" onclick="window.openNewTemplateModal()">+ New Template</button>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Messages Sent Today</div>
        <div class="stat-value">${e.stats.sentToday}</div>
        <div class="stat-delta up">98.6% delivery success rate</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Delivered &amp; Read</div>
        <div class="stat-value">${e.stats.read}</div>
        <div class="stat-delta up">89% read rate within 5 mins</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Inbound Bot Handled</div>
        <div class="stat-value">${e.stats.inboundResolved}</div>
        <div class="stat-delta up">94% auto-resolved via Sarvam AI</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Quality Rating</div>
        <div class="stat-value" style="color:var(--green)">High</div>
        <div class="stat-delta up">Tier 2 (10,000 msgs/day)</div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${F==="simulator"?"active":""}" onclick="window.switchWaTab('simulator')">📱 Live Bot Simulator</button>
        <button class="ftab ${F==="templates"?"active":""}" onclick="window.switchWaTab('templates')">📑 Message Templates (${e.templates.length})</button>
        <button class="ftab ${F==="campaigns"?"active":""}" onclick="window.switchWaTab('campaigns')">🚀 Broadcast Campaigns (${e.scheduled.length})</button>
      </div>
    </div>

    <!-- Tab 1: Live Simulator & Chat Logs -->
    ${F==="simulator"?`
      <div class="wa-container">
        <!-- Interactive WhatsApp Test Phone UI -->
        <div class="wa-phone">
          <div class="wa-top">
            <div class="wa-avatar">☕</div>
            <div style="flex:1">
              <div class="wa-top-title">Brew &amp; Co AI Bot</div>
              <div class="wa-top-status">Online (WhatsApp Webhook Active)</div>
            </div>
            <span class="badge badge-green" style="background:#25D366; color:#fff; border-radius:12px; padding:2px 8px; font-size:10px;">Live</span>
          </div>

          <div class="wa-chat" id="wa-chat-box">
            <div class="wa-bubble out">
              Hi! Welcome to Brew &amp; Co Cafe. ☕ How can I assist you today? You can ask for our menu, book a table, place an order, or check an existing order status!
              <div class="wa-bubble-time">Just now</div>
            </div>
          </div>

          <div class="wa-chips">
            <button type="button" class="wa-chip" onclick="window.quickSendWa('Menu bhejna please')">☕ View Menu</button>
            <button type="button" class="wa-chip" onclick="window.quickSendWa('Book a table for 4 tonight at 8 PM')">📅 Book Table</button>
            <button type="button" class="wa-chip" onclick="window.quickSendWa('2 Cappuccinos and 1 Paneer Sandwich takeaway')">🍕 Place Order</button>
            <button type="button" class="wa-chip" onclick="window.quickSendWa('Order ORD-5513 ka status kya hai?')">🔍 Order Status</button>
            <button type="button" class="wa-chip" onclick="window.quickSendWa('Amazing coffee and service today! 5/5')">⭐ Feedback</button>
          </div>

          <form class="wa-input-box" onsubmit="event.preventDefault(); window.submitWaMessage();">
            <input type="text" id="wa-msg-input" class="wa-input" placeholder="Type a message (e.g. 'table for 2 tonight')..." autocomplete="off">
            <button type="submit" class="wa-send-btn" title="Send">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </form>
        </div>

        <!-- Recent WhatsApp Customer Conversations -->
        <div>
          <div class="section-header">
            <div class="section-title">Live Inbound Conversations &amp; Intent Routing</div>
            <span style="font-size:12px; color:var(--muted)">Syncs with /cafe/whatsapp/incoming</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px;" id="ai-logs-container">
            ${e.chatLogs.map(t=>`
              <div style="background:var(--card); border:1px solid var(--border); border-radius:10px; padding:14px 16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <div>
                    <span style="font-weight:700; font-size:13px;">${t.phone}</span>
                    <span style="font-size:11px; color:var(--muted); margin-left:6px;">${t.time} &middot; Today</span>
                  </div>
                  <span class="badge ${t.intent==="BOOKING"?"badge-yellow":t.intent==="ORDER"?"badge-blue":t.intent==="STATUS"?"badge-green":"badge-purple"}">
                    ${t.intent}
                  </span>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  ${t.msgs.map(i=>`
                    <div style="display:flex; gap:8px; align-items:flex-start; ${i.dir==="out"?"flex-direction:row-reverse;":""}">
                      <div style="padding:6px 10px; border-radius:8px; font-size:12px; max-width:80%; line-height:1.4; background:${i.dir==="in"?"#F0EFED":"var(--accent-dim)"};">
                        ${i.text.replace(/\n/g,"<br>")}
                      </div>
                      <div style="font-size:10px; color:var(--muted); align-self:flex-end;">${i.dir==="in"?"Customer":"AI Bot"}</div>
                    </div>
                  `).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `:F==="templates"?`
      <!-- Tab 2: Pre-approved Meta Cloud Templates -->
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:16px;">
        ${e.templates.map(t=>`
          <div style="background:var(--card); border:1px solid var(--border); border-radius:10px; padding:18px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="td-mono td-bold">${t.name}</span>
              <span class="badge badge-green">Meta Approved</span>
            </div>
            <div style="font-size:11.5px; color:var(--muted); margin-bottom:12px;">Category: <strong>${t.category}</strong> &middot; Language: <strong>${t.language}</strong></div>
            <div style="background:#FAFAF9; border:1px solid var(--border); border-radius:6px; padding:12px; font-size:12.5px; line-height:1.5; color:var(--text); margin-bottom:14px; flex:1;">
              "${t.preview}"
            </div>
            <div style="display:flex; justify-content:flex-end; gap:8px;">
              <button class="btn btn-outline btn-sm" onclick="window.useTemplateBroadcast('${t.id}')">📢 Send Broadcast</button>
            </div>
          </div>
        `).join("")}
      </div>
    `:`
      <!-- Tab 3: Scheduled Campaigns -->
      <div class="table-card">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Campaign ID</th>
                <th>Template</th>
                <th>Target Customer Audience</th>
                <th>Scheduled Date &amp; Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${e.scheduled.map(t=>`
                <tr>
                  <td class="td-mono td-bold">${t.id}</td>
                  <td><strong>${t.template}</strong></td>
                  <td><span class="badge badge-blue">${t.audience}</span></td>
                  <td class="td-muted">${t.scheduledDate}</td>
                  <td><span class="badge badge-yellow">${t.status}</span></td>
                  <td>
                    <button class="btn btn-ghost btn-sm" onclick="window.toast.info('Broadcast dispatched immediately.')">Send Now</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `}
  `}window.switchWaTab=s=>{F=s,ge()};window.testWhatsAppWebhook=()=>{u.success("Webhook health check: 200 OK. Latency: 42ms. Sarvam AI router operational.")};window.quickSendWa=s=>{window.sendSimulatedMessage(s)};window.submitWaMessage=()=>{const s=document.getElementById("wa-msg-input");if(!s||!s.value.trim())return;const a=s.value.trim();s.value="",window.sendSimulatedMessage(a)};window.sendSimulatedMessage=s=>{const a=document.getElementById("wa-chat-box");if(!a)return;const e=new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),t=document.createElement("div");t.className="wa-bubble in",t.innerHTML=`${s}<div class="wa-bubble-time">${e}</div>`,a.appendChild(t),a.scrollTop=a.scrollHeight;const i=document.createElement("div");i.className="wa-bubble out",i.innerHTML="<em>AI Concierge is typing...</em>",a.appendChild(i),a.scrollTop=a.scrollHeight,setTimeout(()=>{let n="",l="INQUIRY";const r=s.toLowerCase();if(r.includes("menu"))l="MENU",n=`Here is our popular menu:
☕ Coffee: Cappuccino ₹180, Cold Coffee ₹160, Latte ₹190
🍕 Food: Paneer Sandwich ₹220, Margherita Pizza ₹350
🍰 Desserts: Chocolate Cake ₹240, Cheesecake ₹260
Would you like to place an order?`;else if(r.includes("table")||r.includes("book")){l="BOOKING";const d="RES-"+Math.floor(2420+Math.random()*80);n=`Table for your party has been confirmed! Booking ID: ${d} for tonight. A confirmation WhatsApp notification has been issued. ☕`,c.createBooking({id:d,name:"WhatsApp Guest",phone:"+91 98765 43210",date:"2026-08-31",time:"08:00 PM",guests:4,table:"Table 4",status:"Confirmed",channel:"WhatsApp",specialRequests:"Booked via AI Simulator"})}else if(r.includes("order")||r.includes("cappuccino")||r.includes("sandwich")){l="ORDER";const d="ORD-"+Math.floor(5535+Math.random()*80);n=`Your order ${d} (${s.slice(0,30)}) has been received and confirmed! Total: ₹580. Payment link dispatched via UPI.`,c.createOrder({id:d,customer:"WhatsApp Guest",phone:"+91 98765 43210",type:"Takeaway",table:"Pickup Counter",items:[{name:"Cappuccino",qty:2,price:180,total:360},{name:"Paneer Sandwich",qty:1,price:220,total:220}],subtotal:580,tax:29,serviceCharge:0,discount:0,total:609,status:"Confirmed",paymentStatus:"Paid",paymentMethod:"UPI",time:e,date:"2026-08-31",notes:"Placed via WhatsApp AI"})}else r.includes("status")?(l="STATUS",n="Order ORD-5513 is Ready for pickup at the counter! Please show this message to the barista. ✅"):r.includes("feedback")||r.includes("5/5")||r.includes("amazing")?(l="FEEDBACK",n="Bahut shukriya! We are thrilled you enjoyed the artisanal brew. 🌟 Here is our Google Review link: g.page/brewandco. Hope to see you again soon!"):n="Thank you for reaching out to Brew & Co! Our barista team has received your inquiry and will follow up shortly. You can also call us directly at +91 98765 43210.";i.innerHTML=`${n.replace(/\n/g,"<br>")}<div class="wa-bubble-time">${e}</div>`,a.scrollTop=a.scrollHeight,c.addWhatsAppMessage({phone:"+91 98765 43210",name:"WhatsApp Guest",time:e,intent:l,msgs:[{dir:"in",text:s},{dir:"out",text:n}]})},600)};window.openNewTemplateModal=()=>{let s=document.getElementById("modal-wa-template");s||(s=document.createElement("div"),s.id="modal-wa-template",s.className="modal-backdrop",document.body.appendChild(s)),s.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">+ Create WhatsApp Message Template</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-wa-template')">✕</button>
      </div>
      <form onsubmit="window.saveNewTemplate(event)">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Template Name (lowercase snake_case) *</label>
              <input type="text" class="form-input" id="tpl-name" required placeholder="e.g. table_ready_alert">
            </div>
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select class="form-select" id="tpl-cat">
                <option value="Utility">Utility</option>
                <option value="Marketing">Marketing</option>
                <option value="Authentication">Authentication (OTP)</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Message Body Preview *</label>
            <textarea class="form-textarea" id="tpl-text" required placeholder="e.g. Hello {{1}}, your table {{2}} is ready! Please proceed to the host desk."></textarea>
            <div class="form-hint">Use {{1}}, {{2}} for dynamic variables.</div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-wa-template')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Submit to Meta for Approval</button>
        </div>
      </form>
    </div>
  `,p.open("modal-wa-template")};window.saveNewTemplate=s=>{s.preventDefault();const a=document.getElementById("tpl-name").value.trim().toLowerCase().replace(/\s+/g,"_"),e=document.getElementById("tpl-cat").value,t=document.getElementById("tpl-text").value.trim();c.createWhatsAppTemplate({id:"TMP-"+Date.now(),name:a,category:e,language:"en_IN",preview:t}),p.close("modal-wa-template"),u.success(`Template "${a}" submitted to Meta Cloud API!`),ge()};window.useTemplateBroadcast=s=>{u.info("Broadcast campaign created for target segment.")};let te="logs";function fe(){const s=c.getState(),a=document.getElementById("view-ai-calling");if(!a)return;const e=s.aiCalls;a.innerHTML=`
    <!-- AI Calling Status Banner -->
    <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:18px 22px; margin-bottom:18px; box-shadow:var(--shadow-sm);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg, #7C3AED, #4F46E5); display:flex; align-items:center; justify-content:center; color:#fff; font-size:22px; box-shadow:0 3px 10px rgba(124,58,237,0.3);">
            🎙️
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px; font-weight:700; color:var(--text);">${e.agent.name}</span>
              <span class="badge badge-green">${e.agent.status}</span>
            </div>
            <div style="font-size:12px; color:var(--muted); margin-top:2px;">
              Direct Inbound Number: <strong>${e.agent.phone}</strong> &middot; ${e.agent.provider}
            </div>
          </div>
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-outline btn-sm" onclick="window.testAiCallSimulation()">📞 Simulate Incoming Test Call</button>
          <button class="btn btn-primary btn-sm" onclick="window.switchAiCallTab('config')">⚙️ Configure Agent</button>
        </div>
      </div>
    </div>

    <!-- AI Call Metrics -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Calls Handled Today</div>
        <div class="stat-value">${e.stats.totalCallsToday}</div>
        <div class="stat-delta up">384 calls this month</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Booking Conversions</div>
        <div class="stat-value">${e.stats.bookingConversions}%</div>
        <div class="stat-delta up">+14 confirmed bookings generated</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Average Call Duration</div>
        <div class="stat-value">${e.stats.avgCallDuration}</div>
        <div class="stat-delta neutral">Target: Under 2 mins</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Human Staff Escalations</div>
        <div class="stat-value">3 calls</div>
        <div class="stat-delta up">92.8% fully automated</div>
      </div>
    </div>

    <!-- Controls Header -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${te==="logs"?"active":""}" onclick="window.switchAiCallTab('logs')">📞 Recent Inbound Calls &amp; Transcripts (${e.calls.length})</button>
        <button class="ftab ${te==="config"?"active":""}" onclick="window.switchAiCallTab('config')">⚙️ Voice Agent Configuration</button>
      </div>
    </div>

    <!-- Tab 1: Call Logs -->
    ${te==="logs"?`
      <div class="table-card">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Call ID</th>
                <th>Caller</th>
                <th>Phone Number</th>
                <th>Date &amp; Time</th>
                <th>Duration</th>
                <th>Purpose / Intent</th>
                <th>Result</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${e.calls.map(t=>`
                <tr>
                  <td class="td-mono td-bold">${t.id}</td>
                  <td class="td-bold">${t.caller}</td>
                  <td class="td-muted">${t.phone}</td>
                  <td>${t.time}</td>
                  <td>${t.duration}</td>
                  <td><span class="badge badge-purple">${t.intent}</span></td>
                  <td>${t.result}</td>
                  <td>
                    <span class="badge ${t.status==="Successful"?"badge-green":"badge-yellow"}">${t.status}</span>
                  </td>
                  <td>
                    <button class="btn btn-ghost btn-sm" onclick="window.openCallTranscript('${t.id}')">Transcript</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `:`
      <!-- Tab 2: Agent Configuration Form -->
      <div style="background:var(--card); border:1px solid var(--border); border-radius:10px; padding:24px; max-width:820px;">
        <form onsubmit="window.saveAiAgentConfig(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Voice Agent Display Name *</label>
              <input type="text" class="form-input" id="cfg-agent-name" required value="${e.agent.name}">
            </div>
            <div class="form-group">
              <label class="form-label">Voice Model &amp; Tone *</label>
              <select class="form-select" id="cfg-voice-model">
                <option value="Aadhya" ${e.agent.voice.includes("Aadhya")?"selected":""}>Aadhya (Warm Indian English / Hindi Female)</option>
                <option value="Kabir" ${e.agent.voice.includes("Kabir")?"selected":""}>Kabir (Friendly Deep Indian Male)</option>
                <option value="Priya" ${e.agent.voice.includes("Priya")?"selected":""}>Priya (Energetic Urban English Female)</option>
                <option value="Rohan" ${e.agent.voice.includes("Rohan")?"selected":""}>Rohan (Casual English/Hindi Male)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Opening Greeting Phrase *</label>
            <textarea class="form-textarea" id="cfg-greeting" required>${e.agent.greeting}</textarea>
            <div class="form-hint">Played immediately when the customer call connects.</div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Operating Active Hours</label>
              <input type="text" class="form-input" id="cfg-hours" value="${e.agent.operatingHours}">
            </div>
            <div class="form-group">
              <label class="form-label">Language Mode</label>
              <select class="form-select" id="cfg-lang">
                <option value="Bilingual" selected>Bilingual (Hinglish + Indian English)</option>
                <option value="English">Pure English</option>
                <option value="Hindi">Pure Hindi</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Escalation / Human Handover Rule</label>
            <input type="text" class="form-input" id="cfg-escalate" value="${e.agent.escalationRule}">
          </div>

          <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
            <button type="submit" class="btn btn-primary btn-sm">Save Voice Configuration</button>
          </div>
        </form>
      </div>
    `}

    <!-- Call Transcript Modal -->
    <div class="modal-backdrop" id="modal-call-transcript">
      <div class="modal-box modal-lg">
        <div class="modal-header">
          <div>
            <div class="modal-title" id="transcript-modal-title">Call Recording &amp; Transcript</div>
            <div style="font-size:11.5px; color:var(--muted); margin-top:2px;" id="transcript-modal-sub"></div>
          </div>
          <button class="modal-close-btn" onclick="window.modal.close('modal-call-transcript')">✕</button>
        </div>
        <div class="modal-body">
          <!-- Audio Playback Simulator -->
          <div style="background:#FAFAF9; border:1px solid var(--border); border-radius:8px; padding:12px 16px; margin-bottom:16px; display:flex; align-items:center; gap:14px;">
            <button class="btn btn-primary btn-sm" id="btn-audio-play" onclick="window.toggleAudioSimulation()">▶ Play Audio</button>
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--muted); margin-bottom:4px;">
                <span>00:14 / 01:45</span>
                <span>Stereo 16kHz MP3</span>
              </div>
              <div style="height:6px; background:#D5D2CD; border-radius:3px; overflow:hidden;">
                <div style="height:100%; width:28%; background:var(--accent); border-radius:3px;"></div>
              </div>
            </div>
          </div>

          <!-- Transcript Lines -->
          <div style="font-size:12px; font-weight:700; color:var(--muted); text-transform:uppercase; margin-bottom:8px;">Full Audio Transcript</div>
          <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:14px; font-family:inherit; font-size:13px; line-height:1.6; white-space:pre-line;" id="transcript-modal-content"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-call-transcript')">Close</button>
        </div>
      </div>
    </div>
  `}window.switchAiCallTab=s=>{te=s,fe()};window.openCallTranscript=s=>{const e=c.getState().aiCalls.calls.find(t=>t.id===s);e&&(document.getElementById("transcript-modal-title").textContent=`${e.id} — ${e.caller} (${e.intent})`,document.getElementById("transcript-modal-sub").textContent=`${e.phone} &middot; ${e.time} &middot; Duration: ${e.duration}`,document.getElementById("transcript-modal-content").textContent=e.transcript,p.open("modal-call-transcript"))};window.toggleAudioSimulation=()=>{const s=document.getElementById("btn-audio-play");s.textContent.includes("Play")?(s.textContent="⏸ Pause",u.info("Simulating audio playback from cloud storage...")):s.textContent="▶ Play Audio"};window.testAiCallSimulation=()=>{u.success("Triggering simulated test call to +91 80 4000 1234..."),setTimeout(()=>{u.info('Aadhya AI Agent answered call: "Namaste! Welcome to Brew & Co..."')},1e3)};window.saveAiAgentConfig=s=>{s.preventDefault();const a=document.getElementById("cfg-agent-name").value.trim(),e=document.getElementById("cfg-voice-model").value,t=document.getElementById("cfg-greeting").value.trim(),i=document.getElementById("cfg-hours").value.trim(),n=document.getElementById("cfg-escalate").value.trim();c.updateAiAgentConfig({name:a,voice:e,greeting:t,operatingHours:i,escalationRule:n}),u.success("AI Voice Agent configuration saved and deployed to telephony endpoint!"),fe()};let M="all";function se(){const s=c.getState(),a=document.getElementById("view-qr-system");if(!a)return;s.qrCodes.reduce((l,r)=>l+(r.totalScans||0),0);const e=s.qrCodes.reduce((l,r)=>l+(r.scansToday||0),0),t=s.qrCodes.reduce((l,r)=>l+(r.ordersToday||0),0),i=s.qrCodes.reduce((l,r)=>l+(r.revenueToday||0),0);let n=[...s.qrCodes];M!=="all"&&(n=n.filter(l=>l.zone.toLowerCase()===M.toLowerCase())),a.innerHTML=`
    <!-- Top Operational Metrics -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Active Table Standees</div>
        <div class="stat-value">${s.qrCodes.filter(l=>l.status==="Active").length} <span style="font-size:14px; font-weight:400; color:var(--muted);">/ ${s.qrCodes.length}</span></div>
        <div class="stat-delta up">Physical acrylic standees mapped</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">QR Scans Today</div>
        <div class="stat-value">${e}</div>
        <div class="stat-delta up">+34 scans during peak rush</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Digital Orders Placed</div>
        <div class="stat-value">${t}</div>
        <div class="stat-delta up">Direct-to-kitchen routing</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Today's Digital Revenue</div>
        <div class="stat-value" style="color:var(--accent);">₹${i.toLocaleString("en-IN")}</div>
        <div class="stat-delta up">${Math.round(t/Math.max(e,1)*100)}% scan-to-order conversion</div>
      </div>
    </div>

    <!-- Permanent Static QR Standee Info Banner -->
    <div style="background:var(--card); border:1px solid var(--border); border-left:4px solid var(--accent); border-radius:10px; padding:16px 20px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
      <div style="max-width:720px;">
        <div style="font-size:14.5px; font-weight:700; color:var(--text); display:flex; align-items:center; gap:8px;">
          <span>📌 Permanent Static Table QR System</span>
          <span class="badge badge-green">Deployed on Tables</span>
        </div>
        <div style="font-size:12.5px; color:var(--muted); margin-top:4px; line-height:1.45;">
          Static QR code stickers are permanently affixed to acrylic standees at each cafe table. Customers scan the static code on their table to open the digital menu and place dine-in orders without waiting for a server. You can pause or activate ordering per table at any time.
        </div>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <button class="btn btn-outline btn-sm" onclick="window.openAddTableQRModal()">+ Map New Table</button>
      </div>
    </div>

    <!-- Controls Header & Zone Filters -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${M==="all"?"active":""}" onclick="window.filterQRZone('all')">All Tables (${s.qrCodes.length})</button>
        <button class="ftab ${M==="main dining"?"active":""}" onclick="window.filterQRZone('main dining')">Main Dining</button>
        <button class="ftab ${M==="patio & garden"?"active":""}" onclick="window.filterQRZone('patio & garden')">Patio &amp; Garden</button>
        <button class="ftab ${M==="lounge area"?"active":""}" onclick="window.filterQRZone('lounge area')">Lounge Area</button>
        <button class="ftab ${M==="bar counter"?"active":""}" onclick="window.filterQRZone('bar counter')">Bar &amp; Counter</button>
      </div>
    </div>

    <!-- Table Ordering Management Cards Grid (Clean, No barcode canvas!) -->
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(310px, 1fr)); gap:18px;">
      ${n.map(l=>{const r=l.status==="Active";return`
          <div style="background:var(--card); border:1px solid ${r?"var(--border)":"#E0DCD5"}; border-top:4px solid ${r?"var(--accent)":"#9E9C99"}; border-radius:10px; padding:18px 20px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; transition:transform 0.15s ease, box-shadow 0.15s ease;">
            
            <!-- Table Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div>
                <div style="font-size:16px; font-weight:700; color:var(--text);">${l.table}</div>
                <div style="font-size:11.5px; color:var(--muted); margin-top:1px;">Zone: <strong>${l.zone}</strong></div>
              </div>
              <span class="badge ${r?"badge-green":"badge-grey"}">
                ${r?"🟢 Online &amp; Ordering":"⏸️ Ordering Paused"}
              </span>
            </div>

            <!-- Static Table Link Box -->
            <div style="background:#FAFAF9; border:1px solid var(--border); border-radius:6px; padding:8px 10px; margin-bottom:14px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                <span style="font-size:10px; font-weight:700; text-transform:uppercase; color:var(--muted); letter-spacing:0.5px;">Static Standee URL</span>
                <button type="button" class="btn btn-ghost btn-sm" style="padding:2px 6px; font-size:11px;" onclick="window.copyQRLink('${l.url}', '${l.table}')">📋 Copy</button>
              </div>
              <div style="font-family:ui-monospace, monospace; font-size:11.5px; color:var(--accent); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${l.url}">
                ${l.url}
              </div>
            </div>

            <!-- Key Table Stats Grid -->
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; background:#FAFAF9; border:1px solid var(--border); border-radius:6px; padding:10px; margin-bottom:16px; text-align:center;">
              <div>
                <div style="font-size:10.5px; color:var(--muted);">Scans Today</div>
                <div style="font-size:15px; font-weight:700; color:var(--text); margin-top:2px;">${l.scansToday||0}</div>
              </div>
              <div>
                <div style="font-size:10.5px; color:var(--muted);">Orders Today</div>
                <div style="font-size:15px; font-weight:700; color:var(--text); margin-top:2px;">${l.ordersToday||0}</div>
              </div>
              <div>
                <div style="font-size:10.5px; color:var(--muted);">Today's Sales</div>
                <div style="font-size:15px; font-weight:700; color:var(--accent); margin-top:2px;">₹${(l.revenueToday||0).toLocaleString("en-IN")}</div>
              </div>
            </div>

            <!-- Action Controls -->
            <div style="margin-top:auto; display:flex; gap:8px; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:12px;">
              <button class="btn btn-outline btn-sm" style="flex:1;" onclick="window.previewCustomerOrderPage('${l.id}', '${l.table}', '${l.url}')">
                📱 Preview Page
              </button>
              <button class="btn ${r?"btn-ghost":"btn-success"} btn-sm" style="flex:1;" onclick="window.toggleQRActive('${l.id}')">
                ${r?"⏸️ Pause Table":"▶️ Resume Table"}
              </button>
            </div>
          </div>
        `}).join("")}
    </div>

    <!-- Customer Ordering Preview Modal -->
    <div class="modal-backdrop" id="modal-qr-order-preview">
      <div class="modal-box" style="max-width: 440px;">
        <div class="modal-header">
          <div>
            <div class="modal-title" id="preview-modal-table-title">Customer Dine-In Ordering</div>
            <div style="font-size:11.5px; color:var(--muted);" id="preview-modal-table-url"></div>
          </div>
          <button class="modal-close-btn" onclick="window.modal.close('modal-qr-order-preview')">✕</button>
        </div>
        <div class="modal-body" style="padding:16px; background:#F8F7F4;">
          <div style="background:#fff; border:1px solid var(--border); border-radius:10px; padding:16px; margin-bottom:14px; text-align:center;">
            <div style="font-size:24px; margin-bottom:4px;">☕</div>
            <div style="font-weight:700; font-size:16px;">Brew &amp; Co Artisanal Roastery</div>
            <div style="font-size:12px; color:var(--muted);">Dine-In Digital Menu &middot; Table Active</div>
          </div>

          <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:var(--muted); margin-bottom:8px;">Popular Order Choices</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="background:#fff; border:1px solid var(--border); border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:600; font-size:13px;">Classic Cortado</div>
                <div style="font-size:11px; color:var(--muted);">Double shot espresso + textured milk</div>
                <div style="font-size:12px; font-weight:700; color:var(--accent); margin-top:2px;">₹240</div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="window.toast.success('Added Classic Cortado to simulated table cart!')">+ Add</button>
            </div>
            <div style="background:#fff; border:1px solid var(--border); border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:600; font-size:13px;">Truffle Scrambled Brioche</div>
                <div style="font-size:11px; color:var(--muted);">Free-range eggs, white truffle oil</div>
                <div style="font-size:12px; font-weight:700; color:var(--accent); margin-top:2px;">₹410</div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="window.toast.success('Added Truffle Scrambled Brioche to simulated table cart!')">+ Add</button>
            </div>
            <div style="background:#fff; border:1px solid var(--border); border-radius:8px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:600; font-size:13px;">Burnt Basque Cheesecake</div>
                <div style="font-size:11px; color:var(--muted);">Caramelized crust with berry compote</div>
                <div style="font-size:12px; font-weight:700; color:var(--accent); margin-top:2px;">₹340</div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="window.toast.success('Added Cheesecake to simulated table cart!')">+ Add</button>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:12px; color:var(--muted);">Zero contact order flow</span>
          <button class="btn btn-primary btn-sm" onclick="window.toast.success('Order sent directly to KDS kitchen display!'); window.modal.close('modal-qr-order-preview');">Place Table Order</button>
        </div>
      </div>
    </div>
  `}window.filterQRZone=s=>{M=s,se()};window.copyQRLink=(s,a)=>{navigator.clipboard.writeText(s).then(()=>{u.success(`Copied static ordering link for ${a} to clipboard!`)}).catch(()=>{u.info(`Static link: ${s}`)})};window.toggleQRActive=s=>{c.toggleQRStatus(s);const e=c.getState().qrCodes.find(t=>t.id===s);e&&e.status==="Active"?u.success(`${e.table} is now ONLINE & accepting customer orders.`):u.info(`${e.table} online ordering has been paused.`),se()};window.previewCustomerOrderPage=(s,a,e)=>{const t=document.getElementById("preview-modal-table-title"),i=document.getElementById("preview-modal-table-url");t&&(t.textContent=`Dine-In Customer Menu — ${a}`),i&&(i.textContent=e),p.open("modal-qr-order-preview")};window.openAddTableQRModal=()=>{let s=document.getElementById("modal-add-table-qr");s||(s=document.createElement("div"),s.id="modal-add-table-qr",s.className="modal-backdrop",document.body.appendChild(s)),s.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">+ Map New Table Standee</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-add-table-qr')">✕</button>
      </div>
      <form onsubmit="window.saveNewTableQR(event)">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Table or Counter Name *</label>
            <input type="text" class="form-input" id="new-qr-table" required placeholder="e.g. Table 12, Rooftop Cabana 2">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Zone *</label>
              <select class="form-select" id="new-qr-zone" required>
                <option value="Main Dining">Main Dining</option>
                <option value="Patio & Garden">Patio &amp; Garden</option>
                <option value="Lounge Area">Lounge Area</option>
                <option value="Bar Counter">Bar &amp; Counter</option>
                <option value="Takeaway Counter">Takeaway Counter</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Table Code Identifier</label>
              <input type="text" class="form-input" id="new-qr-code" placeholder="e.g. T12" oninput="window.updateGeneratedStaticUrl(this.value)">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Static Standee URL (Permanent)</label>
            <input type="text" class="form-input" id="new-qr-url" readonly value="https://brewandco.cafe/order?table=T12" style="background:#FAFAF9; font-family:monospace;">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-add-table-qr')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save Table Standee</button>
        </div>
      </form>
    </div>
  `,p.open("modal-add-table-qr")};window.updateGeneratedStaticUrl=s=>{const a=document.getElementById("new-qr-url");if(a){const e=(s||"T12").trim().toUpperCase().replace(/\s+/g,"-");a.value=`https://brewandco.cafe/order?table=${e}`}};window.saveNewTableQR=s=>{s.preventDefault();const a=document.getElementById("new-qr-table").value.trim(),e=document.getElementById("new-qr-zone").value,t=document.getElementById("new-qr-url").value,i=c.getState(),n=`QR-${String(i.qrCodes.length+1).padStart(2,"0")}`;c.addQRCode({id:n,table:a,zone:e,status:"Active",scansToday:0,ordersToday:0,revenueToday:0,totalScans:0,url:t}),p.close("modal-add-table-qr"),u.success(`Successfully mapped ${a} to static table standee!`),se()};let C="all";function ie(){const s=c.getState(),a=document.getElementById("view-notifications");if(!a)return;const e=s.notifications.filter(i=>!i.read).length;let t=[...s.notifications];C!=="all"&&(t=t.filter(i=>i.type.toLowerCase()===C.toLowerCase())),a.innerHTML=`
    <!-- Header -->
    <div class="section-header">
      <div>
        <div class="section-title">Notification Center</div>
        <div style="font-size:12px; color:var(--muted); margin-top:2px;">
          ${e} unread alerts requiring operational attention
        </div>
      </div>

      <div style="display:flex; gap:10px;">
        <button class="btn btn-outline btn-sm" onclick="window.markAllNotificationsRead()">✓ Mark All Read</button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs" style="margin-bottom:16px;">
      <button class="ftab ${C==="all"?"active":""}" onclick="window.filterNotifType('all')">All Alerts (${s.notifications.length})</button>
      <button class="ftab ${C==="order"?"active":""}" onclick="window.filterNotifType('order')">Orders</button>
      <button class="ftab ${C==="booking"?"active":""}" onclick="window.filterNotifType('booking')">Bookings</button>
      <button class="ftab ${C==="stock"?"active":""}" onclick="window.filterNotifType('stock')">Inventory / Stock</button>
      <button class="ftab ${C==="customer"?"active":""}" onclick="window.filterNotifType('customer')">Customer Feedback</button>
      <button class="ftab ${C==="system"?"active":""}" onclick="window.filterNotifType('system')">System</button>
    </div>

    <!-- Notification List -->
    <div style="display:flex; flex-direction:column; gap:10px;">
      ${t.length===0?`
        <div class="empty-state">
          <div class="empty-icon">🔔</div>
          <div class="empty-title">All caught up!</div>
          <div class="empty-desc">No notifications matching this category.</div>
        </div>
      `:t.map(i=>{const n=i.type==="order"?"🛍️":i.type==="booking"?"📅":i.type==="stock"?"⚠️":i.type==="customer"?"⭐":"⚙️";return`
          <div style="background:var(--card); border:1px solid var(--border); border-left:4px solid ${i.type==="order"?"var(--accent)":i.type==="booking"?"var(--green)":i.type==="stock"?"var(--red)":"var(--blue)"}; border-radius:8px; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; opacity:${i.read?.75:1}; cursor:pointer;" onclick="window.handleNotificationClick('${i.id}', '${i.page}')">
            <div style="display:flex; align-items:flex-start; gap:14px;">
              <div style="font-size:20px; line-height:1; margin-top:2px;">${n}</div>
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-weight:700; font-size:13.5px; color:var(--text);">${i.title}</span>
                  ${i.read?"":'<span class="badge badge-yellow" style="font-size:9.5px; padding:1px 6px;">Unread</span>'}
                </div>
                <div style="font-size:12.5px; color:var(--text-secondary); margin-top:3px;">${i.message}</div>
                <div style="font-size:11px; color:var(--muted); margin-top:5px;">${i.time}</div>
              </div>
            </div>

            <div style="display:flex; gap:8px;">
              ${i.read?"":`
                <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); window.markSingleNotificationRead('${i.id}')">Mark Read</button>
              `}
              <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); window.router.navigate('${i.page}')">Open &rarr;</button>
            </div>
          </div>
        `}).join("")}
    </div>
  `}window.filterNotifType=s=>{C=s,ie()};window.markSingleNotificationRead=s=>{c.markNotificationAsRead(s),ie(),window.updateNotificationBadge()};window.markAllNotificationsRead=()=>{c.markAllNotificationsAsRead(),u.success("All notifications marked as read."),ie(),window.updateNotificationBadge()};window.handleNotificationClick=(s,a)=>{c.markNotificationAsRead(s),window.updateNotificationBadge(),a&&window.router&&window.router.navigate(a)};let S="business";function Se(){const s=c.getState(),a=document.getElementById("view-settings");if(!a)return;const e=s.settings;a.innerHTML=`
    <!-- Settings Header & Navigation Tabs -->
    <div class="section-header">
      <div>
        <div class="section-title">Settings &amp; Cafe Configuration</div>
        <div style="font-size:12px; color:var(--muted); margin-top:2px;">Manage operations, fiscal rules, account security &amp; alert policies</div>
      </div>
    </div>

    <div class="filter-tabs" style="margin-bottom:20px;">
      <button class="ftab ${S==="business"?"active":""}" onclick="window.switchSettingsTab('business')">🏢 Business Profile</button>
      <button class="ftab ${S==="restaurant"?"active":""}" onclick="window.switchSettingsTab('restaurant')">🍽️ Restaurant Rules &amp; Taxes</button>
      <button class="ftab ${S==="account"?"active":""}" onclick="window.switchSettingsTab('account')">👤 Account &amp; Security</button>
      <button class="ftab ${S==="notifications"?"active":""}" onclick="window.switchSettingsTab('notifications')">🔔 Notification Prefs</button>
    </div>

    <!-- Content Sections -->
    <div style="background:var(--card); border:1px solid var(--border); border-radius:10px; padding:24px; max-width:840px; box-shadow:var(--shadow-sm);">
      ${S==="business"?`
        <!-- 1. Business Profile -->
        <form onsubmit="window.saveBusinessProfile(event)">
          <div style="font-size:15px; font-weight:700; margin-bottom:4px;">Cafe Business Profile</div>
          <div style="font-size:12px; color:var(--muted); margin-bottom:18px;">Public profile displayed on receipts, WhatsApp and customer booking link.</div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Cafe Trade Name *</label>
              <input type="text" class="form-input" id="set-biz-name" required value="${e.business.name}">
            </div>
            <div class="form-group">
              <label class="form-label">Tagline / Brand Bio</label>
              <input type="text" class="form-input" id="set-biz-tagline" value="${e.business.tagline}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Contact Phone *</label>
              <input type="tel" class="form-input" id="set-biz-phone" required value="${e.business.phone}">
            </div>
            <div class="form-group">
              <label class="form-label">Official Email *</label>
              <input type="email" class="form-input" id="set-biz-email" required value="${e.business.email}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Full Street Address *</label>
            <textarea class="form-textarea" id="set-biz-address" required>${e.business.address}</textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">FSSAI Food License #</label>
              <input type="text" class="form-input" id="set-biz-fssai" value="${e.business.fssaiLicense}">
            </div>
            <div class="form-group">
              <label class="form-label">Operating Hours</label>
              <input type="text" class="form-input" id="set-biz-hours" value="${e.business.openingHours}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Instagram Handle</label>
              <input type="text" class="form-input" id="set-biz-insta" value="${e.business.instagram}">
            </div>
            <div class="form-group">
              <label class="form-label">Google Maps CID / URL</label>
              <input type="url" class="form-input" id="set-biz-maps" value="${e.business.googleMapsUrl}">
            </div>
          </div>

          <div style="margin-top:20px; display:flex; justify-content:flex-end;">
            <button type="submit" class="btn btn-primary btn-sm">Save Business Profile</button>
          </div>
        </form>
      `:S==="restaurant"?`
        <!-- 2. Restaurant Rules & Taxes -->
        <form onsubmit="window.saveRestaurantSettings(event)">
          <div style="font-size:15px; font-weight:700; margin-bottom:4px;">Restaurant Operations, Fiscal &amp; Tax Rules</div>
          <div style="font-size:12px; color:var(--muted); margin-bottom:18px;">Tax computations, service charge policies, and table turnover calculations.</div>

          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">GST Tax Rate (%) *</label>
              <input type="number" min="0" max="28" step="0.5" class="form-input" id="set-tax-gst" required value="${e.restaurant.gstPercentage}">
              <div class="form-hint">Standard restaurant composite GST is 5%.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Service Charge (%)</label>
              <input type="number" min="0" max="20" step="0.5" class="form-input" id="set-tax-service" value="${e.restaurant.serviceChargePercentage}">
              <div class="form-hint">Optional discretionary charge.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Currency Symbol</label>
              <input type="text" class="form-input" id="set-tax-curr" value="${e.restaurant.currency}">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Target Table Turnover (Mins)</label>
              <input type="number" min="15" max="180" class="form-input" id="set-turnover" value="${e.restaurant.turnoverMins}">
            </div>
            <div class="form-group">
              <label class="form-label">Max Party Size for Instant Booking</label>
              <input type="number" min="1" max="50" class="form-input" id="set-max-party" value="${e.restaurant.maxPartySize}">
            </div>
          </div>

          <div class="form-group" style="margin-top:10px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" id="set-auto-confirm" ${e.restaurant.autoConfirmBookings?"checked":""}>
              <span style="font-size:13px; font-weight:500;">Auto-confirm table reservations received via WhatsApp AI if table is available</span>
            </label>
          </div>

          <div style="margin-top:20px; display:flex; justify-content:flex-end;">
            <button type="submit" class="btn btn-primary btn-sm">Save Restaurant Rules</button>
          </div>
        </form>
      `:S==="account"?`
        <!-- 3. Account & Security -->
        <form onsubmit="window.saveAccountSecurity(event)">
          <div style="font-size:15px; font-weight:700; margin-bottom:4px;">Account Profile &amp; Security</div>
          <div style="font-size:12px; color:var(--muted); margin-bottom:18px;">Manage your login credentials, active sessions and two-factor authentication.</div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Current Password</label>
              <input type="password" class="form-input" id="set-curr-pass" placeholder="••••••••">
            </div>
            <div class="form-group">
              <label class="form-label">New Password</label>
              <input type="password" class="form-input" id="set-new-pass" placeholder="Enter new strong password">
            </div>
          </div>

          <div style="padding:14px 16px; background:#FAFAF9; border:1px solid var(--border); border-radius:8px; margin:16px 0;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:600; font-size:13.5px;">Two-Factor Authentication (2FA)</div>
                <div style="font-size:11.5px; color:var(--muted); margin-top:2px;">Requires an SMS OTP or Authenticator token on login.</div>
              </div>
              <label class="toggle">
                <input type="checkbox" checked onchange="window.toast.info('2FA settings updated')">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div style="margin-top:20px; display:flex; justify-content:flex-end;">
            <button type="submit" class="btn btn-primary btn-sm">Update Security Settings</button>
          </div>
        </form>
      `:S==="notifications"?`
        <!-- 4. Notification Preferences -->
        <form onsubmit="window.saveNotificationPrefs(event)">
          <div style="font-size:15px; font-weight:700; margin-bottom:4px;">Notification Preferences</div>
          <div style="font-size:12px; color:var(--muted); margin-bottom:18px;">Choose which operational events trigger sound alerts, emails or WhatsApp ping.</div>

          <div style="display:flex; flex-direction:column; gap:12px;">
            <label style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:#FAFAF9; border:1px solid var(--border); border-radius:6px; cursor:pointer;">
              <div>
                <div style="font-weight:600;">Sound Alert on New Order / Booking</div>
                <div style="font-size:11.5px; color:var(--muted);">Plays a gentle counter chime in the browser.</div>
              </div>
              <input type="checkbox" id="set-notif-audio" ${e.notificationPrefs.audioChime?"checked":""}>
            </label>

            <label style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:#FAFAF9; border:1px solid var(--border); border-radius:6px; cursor:pointer;">
              <div>
                <div style="font-weight:600;">Instant WhatsApp Alert to Manager</div>
                <div style="font-size:11.5px; color:var(--muted);">Forwards party reservations over 6 guests immediately.</div>
              </div>
              <input type="checkbox" id="set-notif-wa" ${e.notificationPrefs.whatsappAlerts?"checked":""}>
            </label>

            <label style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:#FAFAF9; border:1px solid var(--border); border-radius:6px; cursor:pointer;">
              <div>
                <div style="font-weight:600;">End of Day Revenue Digest (Email)</div>
                <div style="font-size:11.5px; color:var(--muted);">Daily automated summary report dispatched at midnight.</div>
              </div>
              <input type="checkbox" id="set-notif-digest" ${e.notificationPrefs.dailyDigest?"checked":""}>
            </label>
          </div>

          <div style="margin-top:20px; display:flex; justify-content:flex-end;">
            <button type="submit" class="btn btn-primary btn-sm">Save Preferences</button>
          </div>
        </form>
      `:""}
    </div>
  `}window.switchSettingsTab=s=>{S=s,Se()};window.saveBusinessProfile=s=>{s.preventDefault(),c.updateSettings("business",{name:document.getElementById("set-biz-name").value.trim(),tagline:document.getElementById("set-biz-tagline").value.trim(),phone:document.getElementById("set-biz-phone").value.trim(),email:document.getElementById("set-biz-email").value.trim(),address:document.getElementById("set-biz-address").value.trim(),fssaiLicense:document.getElementById("set-biz-fssai").value.trim(),openingHours:document.getElementById("set-biz-hours").value.trim(),instagram:document.getElementById("set-biz-insta").value.trim(),googleMapsUrl:document.getElementById("set-biz-maps").value.trim()}),u.success("Business profile updated successfully!")};window.saveRestaurantSettings=s=>{s.preventDefault(),c.updateSettings("restaurant",{gstPercentage:parseFloat(document.getElementById("set-tax-gst").value),serviceChargePercentage:parseFloat(document.getElementById("set-tax-service").value),currency:document.getElementById("set-tax-curr").value.trim(),turnoverMins:parseInt(document.getElementById("set-turnover").value,10),maxPartySize:parseInt(document.getElementById("set-max-party").value,10),autoConfirmBookings:document.getElementById("set-auto-confirm").checked}),u.success("Restaurant and tax configuration updated.")};window.saveAccountSecurity=s=>{s.preventDefault(),u.success("Account password and security preferences updated.")};window.saveNotificationPrefs=s=>{s.preventDefault(),c.updateSettings("notificationPrefs",{audioChime:document.getElementById("set-notif-audio").checked,whatsappAlerts:document.getElementById("set-notif-wa").checked,dailyDigest:document.getElementById("set-notif-digest").checked}),u.success("Notification preferences saved.")};const re={dashboard:{title:"Dashboard",render:Ee,module:"dashboard"},orders:{title:"Orders Management",render:N,module:"orders"},bookings:{title:"Reservations & Bookings",render:I,module:"bookings"},tables:{title:"Table Floor Management",render:q,module:"tables"},menu:{title:"Menu & Stock Catalog",render:E,module:"menu"},customers:{title:"Customer CRM",render:U,module:"customers"},staff:{title:"Staff & Roles Management",render:H,module:"staff"},analytics:{title:"Analytics & Financials",render:Ce,module:"analytics"},offers:{title:"Offers & Promotions",render:W,module:"offers"},reviews:{title:"Reviews & Reputation",render:j,module:"reviews"},whatsapp:{title:"WhatsApp Hub & Live Bot",render:ge,module:"whatsapp"},"ai-calling":{title:"AI Voice Calling Concierge",render:fe,module:"ai-calling"},"qr-system":{title:"Table QR Orders",render:se,module:"qr-system"},notifications:{title:"Notification Center",render:ie,module:"notifications"},settings:{title:"Settings & Configuration",render:Se,module:"settings"}};class Pe{constructor(){this.currentRoute="dashboard",window.addEventListener("popstate",()=>{this.handleHashChange()})}init(){this.handleHashChange()}handleHashChange(){const a=window.location.hash.replace("#/","").replace("#","")||"dashboard";this.navigate(a,!1)}navigate(a,e=!0){if(!b.isAuthenticated()){window.showAuthModal();return}const t=re[a]||re.dashboard,i=re[a]?a:"dashboard";if(!b.hasPermission(t.module,"view")){u.error(`Access Restricted: Your current role (${b.getCurrentUser().role}) does not have permission to view ${t.title}.`),this.renderAccessDenied(t.title);return}this.currentRoute=i,e&&(window.location.hash=`#/${i}`),document.querySelectorAll(".page-view").forEach(d=>{d.classList.remove("active")});const n=document.getElementById(`view-${i}`);n&&n.classList.add("active");const l=document.getElementById("topbar-page-title");l&&(l.textContent=t.title),document.querySelectorAll(".sb-item").forEach(d=>{d.classList.remove("active"),d.dataset.route===i&&d.classList.add("active")}),window.closeMobileSidebar();try{t.render()}catch(d){console.error(`Error rendering route ${i}:`,d)}const r=document.getElementById("main-content");r&&(r.scrollTop=0)}renderAccessDenied(a){const e=b.getCurrentUser();document.querySelectorAll(".page-view").forEach(i=>i.classList.remove("active"));let t=document.getElementById("view-access-denied");t||(t=document.createElement("div"),t.id="view-access-denied",t.className="page-view",document.getElementById("main-content").appendChild(t)),t.classList.add("active"),t.innerHTML=`
      <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:44px 24px; text-align:center; max-width:560px; margin:40px auto; box-shadow:var(--shadow-sm);">
        <div style="width:64px; height:64px; border-radius:50%; background:var(--red-bg); color:var(--red); font-size:32px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px;">
          🔒
        </div>
        <div style="font-size:18px; font-weight:700; color:var(--text); margin-bottom:8px;">Access Restricted</div>
        <p style="font-size:13.5px; color:var(--muted); line-height:1.5; margin-bottom:20px;">
          You are currently signed in as <strong>${e.name}</strong> with role <span class="badge badge-purple">${e.role}</span>.
          Access to <strong>${a}</strong> requires Owner or Manager clearance.
        </p>
        <div style="display:flex; justify-content:center; gap:10px;">
          <button class="btn btn-outline btn-sm" onclick="window.router.navigate('dashboard')">&larr; Return to Dashboard</button>
          <button class="btn btn-primary btn-sm" onclick="window.auth.loginAs('Owner').then(() => window.router.navigate('${this.currentRoute}'))">Switch to Owner Role (Demo)</button>
        </div>
      </div>
    `,document.getElementById("topbar-page-title").textContent="Access Restricted"}}const $=new Pe;window.router=$;const pe={"whatsapp-automation":["whatsapp"],"ai-calling":["ai-calling"],"qr-system":["qr-system"]},Oe=typeof window<"u"&&window.location.origin?`${window.location.origin}/api/config`:"http://localhost:4000/api/config";let Q=null,ke=0;const De=1e4;async function ve(){const s=Date.now();if(Q&&s-ke<De)return Q;try{const a=await fetch(Oe,{signal:AbortSignal.timeout(2e3)});if(a.ok)return Q=await a.json(),ke=s,Q}catch(a){console.warn("[ModuleConfig] Hub unreachable, all modules enabled by default:",a.message)}return null}function ze(s,a){if(!s||!s.modules)return!0;for(const[e,t]of Object.entries(pe))if(t.includes(a)){const i=s.modules[e];return i?i.enabled!==!1:!0}return!0}function be(s){s&&(document.querySelectorAll(".sb-item[data-route]").forEach(a=>{const e=a.getAttribute("data-route"),t=ze(s,e);if(pe&&Object.values(pe).flat().includes(e)&&!t){a.style.display="none";const i=document.getElementById(`view-${e}`);i&&(i.innerHTML=`
            <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:44px 24px; text-align:center; max-width:560px; margin:40px auto; box-shadow:var(--shadow-sm);">
              <div style="width:64px; height:64px; border-radius:50%; background:var(--amber-bg,rgba(251,191,36,0.12)); color:#FBBF24; font-size:32px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px;">
                🔌
              </div>
              <div style="font-size:18px; font-weight:700; color:var(--text); margin-bottom:8px;">Module Disabled</div>
              <p style="font-size:13.5px; color:var(--muted); line-height:1.5; margin-bottom:20px;">
                This module has been turned off from the <strong>Hub Command Center</strong>.
                Go to <code>http://localhost:4000</code> or edit <code>modules.config.json</code> to re-enable it.
              </p>
              <div style="display:flex; justify-content:center; gap:10px;">
                <button class="btn btn-outline btn-sm" onclick="window.router.navigate('dashboard')">← Return to Dashboard</button>
                <a href="http://localhost:4000" target="_blank" class="btn btn-primary btn-sm" style="text-decoration:none;">Open Hub →</a>
              </div>
            </div>
          `)}}),document.querySelectorAll(".sb-nav-wrap .sb-section-label").forEach(a=>{let e=a.nextElementSibling,t=!1;for(;e&&!e.classList.contains("sb-section-label");){if(e.classList.contains("sb-item")&&e.style.display!=="none"){t=!0;break}e=e.nextElementSibling}a.style.display=t?"block":"none"}))}async function Ne(){const s=await ve();return s&&be(s),setInterval(async()=>{const a=await ve();a&&be(a)},15e3),s}window.store=c;window.auth=b;window.toast=u;window.modal=p;function Le(){const s=document.getElementById("topbar-clock");function a(){if(!s)return;const e=new Date;s.textContent=e.toLocaleDateString("en-IN",{day:"numeric",month:"short"})+", "+e.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}a(),setInterval(a,2e4)}window.toggleSidebarCollapse=()=>{const s=document.getElementById("app-sidebar");s&&s.classList.toggle("collapsed")};window.openMobileSidebar=()=>{const s=document.getElementById("app-sidebar"),a=document.getElementById("mobile-sidebar-backdrop");s&&s.classList.add("mobile-open"),a&&a.classList.add("show")};window.closeMobileSidebar=()=>{const s=document.getElementById("app-sidebar"),a=document.getElementById("mobile-sidebar-backdrop");s&&s.classList.remove("mobile-open"),a&&a.classList.remove("show")};window.updateNotificationBadge=()=>{const s=c.getState(),a=s.notifications.filter(r=>!r.read).length,e=document.getElementById("notif-badge-counter");e&&(e.textContent=a,e.style.display=a>0?"inline-block":"none");const t=s.orders.filter(r=>r.status==="Pending"||r.status==="Confirmed").length,i=document.getElementById("sb-badge-orders");i&&(i.textContent=t,i.style.display=t>0?"inline-block":"none");const n=s.bookings.filter(r=>r.status==="Pending").length,l=document.getElementById("sb-badge-bookings");l&&(l.textContent=n,l.style.display=n>0?"inline-block":"none")};async function ye(){if(b.getCurrentUser()){document.querySelectorAll(".sb-item[data-route]").forEach(a=>{const e=a.getAttribute("data-route"),t=b.hasPermission(e,"view");a.style.display=t?"flex":"none"});try{const a=await ve();a&&be(a)}catch{}if(document.querySelectorAll(".sb-nav-wrap .sb-section-label").forEach(a=>{let e=a.nextElementSibling,t=!1;for(;e&&!e.classList.contains("sb-section-label");){if(e.classList.contains("sb-item")&&e.style.display!=="none"){t=!0;break}e=e.nextElementSibling}a.style.display=t?"block":"none"}),$.currentRoute&&!b.hasPermission($.currentRoute,"view")){const e=["dashboard","orders","bookings","tables","menu","notifications"].find(t=>b.hasPermission(t,"view"))||"orders";$.navigate(e)}}}window.updateSidebarVisibility=ye;function ae(){const s=b.getCurrentUser(),a=document.getElementById("sb-user-name"),e=document.getElementById("sb-user-role"),t=document.getElementById("sb-user-avatar"),i=document.getElementById("topbar-role-select");s&&(a&&(a.textContent=s.name),e&&(e.textContent=`${s.role} Account`),t&&(t.textContent=s.avatarInitials||"AS"),i&&(i.value=s.role)),ye()}window.showAuthModal=()=>{const s=document.getElementById("auth-screen");s&&(s.style.display="flex")};window.hideAuthModal=()=>{const s=document.getElementById("auth-screen");s&&(s.style.display="none")};window.handleLoginSubmit=async s=>{s.preventDefault();const a=document.getElementById("login-email").value.trim(),e=document.getElementById("login-password").value,t=document.getElementById("login-remember").checked,i=document.getElementById("login-error-msg"),n=document.getElementById("btn-login-submit");i.style.display="none",n.disabled=!0,n.textContent="Verifying credentials...";try{const l=await b.login(a,e,t);u.success(`Welcome back, ${l.name}! Logged in as ${l.role}.`),window.hideAuthModal(),ae(),$.navigate($.currentRoute||"dashboard")}catch(l){i.textContent=l.message||"Login failed. Please check credentials.",i.style.display="block"}finally{n.disabled=!1,n.textContent="Sign In to Dashboard"}};window.quickLoginAs=async s=>{const a=await b.loginAs(s);u.success(`Switched role to: ${a.name} (${a.role})`),window.hideAuthModal(),ae(),$.navigate($.currentRoute||"dashboard")};window.handleLogout=()=>{p.confirm({title:"Sign Out",message:"Are you sure you want to end your dashboard session?",confirmText:"Sign Out",isDanger:!0,onConfirm:async()=>{await b.logout(),u.info("You have signed out successfully."),window.showAuthModal()}})};window.openForgotPasswordModal=()=>{let s=document.getElementById("modal-forgot-password");s||(s=document.createElement("div"),s.id="modal-forgot-password",s.className="modal-backdrop",document.body.appendChild(s)),s.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">Password Recovery</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-forgot-password')">✕</button>
      </div>
      <form onsubmit="window.submitForgotPassword(event)">
        <div class="modal-body">
          <p style="font-size:13px; color:var(--muted); margin-bottom:14px;">
            Enter your registered admin or staff email address. We will dispatch a password reset authorization code.
          </p>
          <div class="form-group">
            <label class="form-label">Email Address *</label>
            <input type="email" class="form-input" id="forgot-email" required placeholder="e.g. manager@brewandco.com">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-forgot-password')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Send Reset Instructions</button>
        </div>
      </form>
    </div>
  `,p.open("modal-forgot-password")};window.submitForgotPassword=async s=>{s.preventDefault();const a=document.getElementById("forgot-email").value.trim();try{const e=await b.forgotPassword(a);p.close("modal-forgot-password"),u.success(e.message),window.openResetPasswordModal(a)}catch(e){u.error(e.message)}};window.openResetPasswordModal=s=>{let a=document.getElementById("modal-reset-password");a||(a=document.createElement("div"),a.id="modal-reset-password",a.className="modal-backdrop",document.body.appendChild(a)),a.innerHTML=`
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">Set New Password</div>
        <button class="modal-close-btn" onclick="window.modal.close('modal-reset-password')">✕</button>
      </div>
      <form onsubmit="window.submitResetPassword(event, '${s}')">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Reset Authorization Token *</label>
            <input type="text" class="form-input" id="reset-token" required value="CAFE-RESET-2026">
          </div>
          <div class="form-group">
            <label class="form-label">New Password *</label>
            <input type="password" class="form-input" id="reset-new-pass" required placeholder="At least 6 characters">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-reset-password')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save New Password</button>
        </div>
      </form>
    </div>
  `,p.open("modal-reset-password")};window.submitResetPassword=async(s,a)=>{s.preventDefault();const e=document.getElementById("reset-token").value.trim(),t=document.getElementById("reset-new-pass").value;try{const i=await b.resetPassword(a,e,t);p.close("modal-reset-password"),u.success(i.message)}catch(i){u.error(i.message)}};document.addEventListener("DOMContentLoaded",async()=>{Le(),ae(),window.updateNotificationBadge(),await Ne(),c.subscribe(()=>{window.updateNotificationBadge(),ye()}),b.onAuthChange(s=>{ae(),s?window.hideAuthModal():window.showAuthModal()}),b.isAuthenticated()?(window.hideAuthModal(),$.init()):window.showAuthModal()});
