export const DEMO_RESTAURANT = {
  name: "DineLink OS",
  tagline: "AI-powered ultra-fast QR ordering experience.",
  tableLabel: "Table T1",
};

export const DEMO_QR_TOKEN = "demo-table-t1";
export const DEMO_VERIFICATION_CODE = "123456";
export const DEMO_KITCHEN_ORDERS_KEY = "dineLinkDemoKitchenOrders";

export const isDemoQrToken = (token) => token === DEMO_QR_TOKEN;

export const createDemoOrderFromCart = ({
  cartItems,
  numberOfPeople = 1,
  note = "",
  totalAmount = 0,
  tableContext,
}) => ({
  _id: `demo-live-${Date.now()}`,
  tableRoom: tableContext || { type: "table", number: "T1" },
  numberOfPeople,
  status: "pending",
  totalAmount,
  finalAmount: totalAmount,
  note,
  createdAt: new Date().toISOString(),
  items: cartItems.map((item) => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  })),
});

export const DEMO_CATEGORIES = [
  { _id: "demo-burgers", name: "Burgers" },
  { _id: "demo-pizza", name: "Pizza" },
  { _id: "demo-indian-main", name: "Indian Main Course" },
  { _id: "demo-rice-biryani", name: "Rice & Biryani" },
  { _id: "demo-snacks", name: "Snacks" },
  { _id: "demo-healthy", name: "Healthy Meals" },
  { _id: "demo-protein", name: "Protein Meals" },
  { _id: "demo-vegan", name: "Vegan Options" },
  { _id: "demo-desserts", name: "Desserts" },
  { _id: "demo-beverages", name: "Beverages" },
  { _id: "demo-combos", name: "Combo Meals" },
  { _id: "demo-kids", name: "Kids Specials" },
];

export const DEMO_MENU_ITEMS = [
  {
    _id: "demo-paneer-burger",
    name: "Spicy Paneer Burger",
    description: "Crispy paneer, chilli mayo, fresh lettuce, toasted bun.",
    price: 220,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[0],
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    tags: ["spicy", "vegetarian", "best-seller", "quick-bite", "burger"],
    spiceLevel: "spicy",
    popularity: 94,
  },
  {
    _id: "demo-chicken-burger",
    name: "Classic Chicken Burger",
    description: "Grilled chicken patty, cheese, pickles, lettuce, house sauce.",
    price: 260,
    isVeg: false,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[0],
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
    tags: ["non-veg", "high-protein", "best-seller", "quick-bite", "burger"],
    spiceLevel: "mild",
    popularity: 91,
  },
  {
    _id: "demo-veggie-crunch-burger",
    name: "Veggie Crunch Burger",
    description: "Crispy veg patty, tomato, onion, mint mayo, soft bun.",
    price: 190,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[0],
    image:
      "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80",
    tags: ["vegetarian", "budget", "mild", "quick-bite", "burger"],
    spiceLevel: "mild",
    popularity: 82,
  },
  {
    _id: "demo-margherita-pizza",
    name: "Margherita Pizza",
    description: "Classic tomato sauce, mozzarella, basil and olive oil.",
    price: 280,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[1],
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
    tags: ["vegetarian", "mild", "kids", "best-seller", "pizza"],
    spiceLevel: "mild",
    popularity: 90,
  },
  {
    _id: "demo-peri-peri-chicken-pizza",
    name: "Peri Peri Chicken Pizza",
    description: "Spicy chicken, peppers, mozzarella and peri peri drizzle.",
    price: 360,
    isVeg: false,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[1],
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
    tags: ["non-veg", "spicy", "premium", "best-seller", "pizza"],
    spiceLevel: "spicy",
    popularity: 93,
  },
  {
    _id: "demo-farmhouse-veg-pizza",
    name: "Farmhouse Veg Pizza",
    description: "Capsicum, onion, corn, mushroom and mozzarella cheese.",
    price: 330,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[1],
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=80",
    tags: ["vegetarian", "mild", "premium", "pizza"],
    spiceLevel: "mild",
    popularity: 84,
  },
  {
    _id: "demo-cold-coffee",
    name: "Cold Coffee",
    description: "Cafe-style chilled coffee with a smooth creamy finish.",
    price: 140,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[9],
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
    tags: ["beverage", "coffee", "cold", "sweet", "budget"],
    spiceLevel: "none",
    popularity: 88,
  },
  {
    _id: "demo-paneer-butter",
    name: "Paneer Butter Masala",
    description: "Creamy tomato gravy, soft paneer cubes, rich masala finish.",
    price: 260,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[2],
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80",
    tags: ["vegetarian", "mild", "best-seller", "indian", "paneer"],
    spiceLevel: "mild",
    popularity: 95,
  },
  {
    _id: "demo-butter-chicken",
    name: "Butter Chicken",
    description: "Tender chicken simmered in a rich tomato butter gravy.",
    price: 340,
    isVeg: false,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[2],
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
    tags: ["non-veg", "premium", "best-seller", "indian", "high-protein"],
    spiceLevel: "mild",
    popularity: 96,
  },
  {
    _id: "demo-dal-tadka",
    name: "Dal Tadka",
    description: "Yellow lentils, cumin tempering, ghee and coriander.",
    price: 210,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[2],
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    tags: ["vegetarian", "healthy", "budget", "mild", "indian"],
    spiceLevel: "mild",
    popularity: 79,
  },
  {
    _id: "demo-veg-biryani",
    name: "Veg Biryani",
    description: "Aromatic basmati rice, vegetables, saffron and raita.",
    price: 240,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[3],
    image:
      "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?auto=format&fit=crop&w=900&q=80",
    tags: ["vegetarian", "spicy", "budget", "rice", "indian"],
    spiceLevel: "spicy",
    popularity: 86,
  },
  {
    _id: "demo-chicken-biryani",
    name: "Chicken Biryani",
    description: "Dum-cooked chicken, basmati rice, whole spices and salan.",
    price: 320,
    isVeg: false,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[3],
    image:
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=80",
    tags: ["non-veg", "spicy", "best-seller", "high-protein", "rice"],
    spiceLevel: "spicy",
    popularity: 94,
  },
  {
    _id: "demo-jeera-rice-bowl",
    name: "Jeera Rice Bowl",
    description: "Cumin rice with dal, salad and pickle on the side.",
    price: 180,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[3],
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
    tags: ["vegetarian", "budget", "mild", "quick-bite", "rice"],
    spiceLevel: "mild",
    popularity: 72,
  },
  {
    _id: "demo-lemon-soda",
    name: "Lemon Soda",
    description: "Sparkling lemon cooler with mint and a light salt kick.",
    price: 90,
    isVeg: true,
    isVegan: true,
    isAvailable: true,
    category: DEMO_CATEGORIES[9],
    image:
      "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?auto=format&fit=crop&w=900&q=80",
    tags: ["beverage", "soda", "refreshing", "vegan", "budget"],
    spiceLevel: "none",
    popularity: 85,
  },
  {
    _id: "demo-kebab",
    name: "Smoky Kebab Platter",
    description: "Char-grilled kebabs with roasted peppers and house chutney.",
    price: 320,
    isVeg: false,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[2],
    image:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80",
    tags: ["non-veg", "spicy", "grill", "premium", "high-protein"],
    spiceLevel: "spicy",
    popularity: 87,
  },
  {
    _id: "demo-fries",
    name: "Masala Fries",
    description: "Crisp fries tossed with chef masala and garlic dip.",
    price: 130,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[4],
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80",
    tags: ["snack", "spicy", "budget", "quick-bite", "kids"],
    spiceLevel: "spicy",
    popularity: 89,
  },
  {
    _id: "demo-garlic-bread",
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter, herbs and cheese.",
    price: 150,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[4],
    image:
      "https://images.unsplash.com/photo-1619535860434-cf9b613c55a3?auto=format&fit=crop&w=900&q=80",
    tags: ["snack", "vegetarian", "mild", "quick-bite", "kids"],
    spiceLevel: "mild",
    popularity: 80,
  },
  {
    _id: "demo-crispy-corn-chaat",
    name: "Crispy Corn Chaat",
    description: "Crunchy corn tossed with lime, chilli and chaat masala.",
    price: 170,
    isVeg: true,
    isVegan: true,
    isAvailable: true,
    category: DEMO_CATEGORIES[4],
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
    tags: ["snack", "vegan", "spicy", "budget", "quick-bite"],
    spiceLevel: "spicy",
    popularity: 81,
  },
  {
    _id: "demo-millet-veg-bowl",
    name: "Millet Veg Bowl",
    description: "Millets, roasted vegetables, sprouts and lemon dressing.",
    price: 260,
    isVeg: true,
    isVegan: true,
    isAvailable: true,
    category: DEMO_CATEGORIES[5],
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    tags: ["healthy", "vegan", "vegetarian", "budget", "bowl"],
    spiceLevel: "mild",
    popularity: 84,
  },
  {
    _id: "demo-grilled-tofu-salad",
    name: "Grilled Tofu Salad",
    description: "Grilled tofu, greens, cucumber, seeds and sesame dressing.",
    price: 300,
    isVeg: true,
    isVegan: true,
    isAvailable: true,
    category: DEMO_CATEGORIES[5],
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80",
    tags: ["healthy", "vegan", "high-protein", "premium", "salad"],
    spiceLevel: "mild",
    popularity: 78,
  },
  {
    _id: "demo-sprout-paneer-bowl",
    name: "Sprout & Paneer Bowl",
    description: "Paneer, sprouts, cucumber, brown rice and mint yoghurt.",
    price: 290,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[5],
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    tags: ["healthy", "high-protein", "vegetarian", "bowl", "gym"],
    spiceLevel: "mild",
    popularity: 83,
  },
  {
    _id: "demo-chicken-protein-bowl",
    name: "Grilled Chicken Protein Bowl",
    description: "Grilled chicken, brown rice, greens and yoghurt dressing.",
    price: 360,
    isVeg: false,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[6],
    image:
      "https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=900&q=80",
    tags: ["high-protein", "healthy", "non-veg", "gym", "premium"],
    spiceLevel: "mild",
    popularity: 88,
  },
  {
    _id: "demo-egg-white-omelette",
    name: "Egg White Omelette Plate",
    description: "Egg whites, sauteed vegetables, toast and fresh salad.",
    price: 240,
    isVeg: false,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[6],
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
    tags: ["high-protein", "healthy", "budget", "gym", "breakfast"],
    spiceLevel: "mild",
    popularity: 76,
  },
  {
    _id: "demo-paneer-protein-bowl",
    name: "Paneer Protein Bowl",
    description: "Grilled paneer, quinoa, beans, greens and tandoori yoghurt.",
    price: 320,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[6],
    image:
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=900&q=80",
    tags: ["high-protein", "healthy", "vegetarian", "premium", "gym"],
    spiceLevel: "mild",
    popularity: 82,
  },
  {
    _id: "demo-vegan-buddha-bowl",
    name: "Vegan Buddha Bowl",
    description: "Hummus, chickpeas, greens, quinoa and roasted vegetables.",
    price: 310,
    isVeg: true,
    isVegan: true,
    isAvailable: true,
    category: DEMO_CATEGORIES[7],
    image:
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=900&q=80",
    tags: ["vegan", "healthy", "high-protein", "premium", "bowl"],
    spiceLevel: "mild",
    popularity: 80,
  },
  {
    _id: "demo-tofu-tikka-wrap",
    name: "Tofu Tikka Wrap",
    description: "Spiced tofu tikka, onion, lettuce and mint chutney wrap.",
    price: 230,
    isVeg: true,
    isVegan: true,
    isAvailable: true,
    category: DEMO_CATEGORIES[7],
    image:
      "https://images.unsplash.com/photo-1562059390-a761a084768e?auto=format&fit=crop&w=900&q=80",
    tags: ["vegan", "spicy", "budget", "quick-bite", "healthy"],
    spiceLevel: "spicy",
    popularity: 79,
  },
  {
    _id: "demo-vegan-chocolate-mousse",
    name: "Vegan Chocolate Mousse",
    description: "Dark chocolate mousse made with coconut cream.",
    price: 210,
    isVeg: true,
    isVegan: true,
    isAvailable: true,
    category: DEMO_CATEGORIES[7],
    image:
      "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=900&q=80",
    tags: ["vegan", "sweet", "dessert", "budget"],
    spiceLevel: "none",
    popularity: 75,
  },
  {
    _id: "demo-gulab-jamun-cheesecake",
    name: "Gulab Jamun Cheesecake",
    description: "Creamy cheesecake layered with gulab jamun and saffron.",
    price: 240,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[8],
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
    tags: ["sweet", "dessert", "premium", "vegetarian", "chef-special"],
    spiceLevel: "none",
    popularity: 90,
  },
  {
    _id: "demo-brownie-sundae",
    name: "Brownie Sundae",
    description: "Warm brownie, vanilla ice cream and chocolate sauce.",
    price: 220,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[8],
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",
    tags: ["sweet", "dessert", "kids", "best-seller"],
    spiceLevel: "none",
    popularity: 92,
  },
  {
    _id: "demo-mango-kulfi",
    name: "Mango Kulfi",
    description: "Slow-set mango kulfi with pistachio crumble.",
    price: 160,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[8],
    image:
      "https://images.unsplash.com/photo-1629385697093-57be2cc97fa6?auto=format&fit=crop&w=900&q=80",
    tags: ["sweet", "dessert", "budget", "kids", "vegetarian"],
    spiceLevel: "none",
    popularity: 86,
  },
  {
    _id: "demo-watermelon-juice",
    name: "Fresh Watermelon Juice",
    description: "Cold-pressed watermelon, mint and a hint of lime.",
    price: 130,
    isVeg: true,
    isVegan: true,
    isAvailable: true,
    category: DEMO_CATEGORIES[9],
    image:
      "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=80",
    tags: ["beverage", "healthy", "vegan", "budget", "refreshing"],
    spiceLevel: "none",
    popularity: 83,
  },
  {
    _id: "demo-burger-fries-coke-combo",
    name: "Burger + Fries + Coke Combo",
    description: "Veggie burger, masala fries and a chilled cola.",
    price: 330,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[10],
    image:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=80",
    tags: ["combo", "quick-bite", "budget", "vegetarian", "best-seller"],
    spiceLevel: "mild",
    popularity: 93,
  },
  {
    _id: "demo-pizza-garlic-bread-combo",
    name: "Pizza + Garlic Bread Combo",
    description: "Margherita pizza served with cheesy garlic bread.",
    price: 410,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[10],
    image:
      "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=900&q=80",
    tags: ["combo", "vegetarian", "premium", "kids", "pizza"],
    spiceLevel: "mild",
    popularity: 87,
  },
  {
    _id: "demo-protein-bowl-juice-combo",
    name: "Protein Bowl + Juice Combo",
    description: "Paneer protein bowl paired with fresh watermelon juice.",
    price: 430,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[10],
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80",
    tags: ["combo", "healthy", "high-protein", "premium", "gym"],
    spiceLevel: "mild",
    popularity: 85,
  },
  {
    _id: "demo-family-dinner-combo",
    name: "Family Dinner Combo",
    description: "Paneer butter masala, dal tadka, biryani, breads and dessert.",
    price: 890,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[10],
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    tags: ["combo", "premium", "vegetarian", "family", "chef-special"],
    spiceLevel: "mild",
    popularity: 89,
  },
  {
    _id: "demo-mini-cheese-pizza",
    name: "Mini Cheese Pizza",
    description: "Kid-size cheese pizza with mild tomato sauce.",
    price: 180,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[11],
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
    tags: ["kids", "mild", "vegetarian", "budget", "pizza"],
    spiceLevel: "mild",
    popularity: 81,
  },
  {
    _id: "demo-kids-burger-meal",
    name: "Kids Burger Meal",
    description: "Mini veg burger, smiley fries and a small juice.",
    price: 230,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[11],
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
    tags: ["kids", "mild", "combo", "budget", "quick-bite"],
    spiceLevel: "mild",
    popularity: 83,
  },
  {
    _id: "demo-chocolate-pancake-bites",
    name: "Chocolate Pancake Bites",
    description: "Mini pancakes with chocolate drizzle and banana slices.",
    price: 170,
    isVeg: true,
    isVegan: false,
    isAvailable: true,
    category: DEMO_CATEGORIES[11],
    image:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=80",
    tags: ["kids", "sweet", "dessert", "budget", "mild"],
    spiceLevel: "none",
    popularity: 78,
  },
];

const normalizeDemoKey = (value = "") =>
  value.toString().trim().toLowerCase().replace(/\s+/g, " ");

export const buildDemoBackedMenu = ({
  menuItems = [],
  categories = [],
  minimumDemoItems = 24,
} = {}) => {
  const shouldSupplement = menuItems.length < minimumDemoItems;

  if (!shouldSupplement) {
    return { menuItems, categories };
  }

  const categoryMap = new Map();
  [...categories, ...DEMO_CATEGORIES].forEach((category) => {
    if (!category?._id) return;
    categoryMap.set(category._id, category);
  });

  const existingNames = new Set(
    menuItems.map((item) => normalizeDemoKey(item.name))
  );

  const missingDemoItems = DEMO_MENU_ITEMS.filter(
    (item) => !existingNames.has(normalizeDemoKey(item.name))
  );

  return {
    menuItems: [...menuItems, ...missingDemoItems],
    categories: Array.from(categoryMap.values()),
  };
};

export const DEMO_ORDERS = [
  {
    _id: "demo-order-1",
    tableRoom: { type: "table", number: "T4" },
    numberOfPeople: 3,
    status: "pending",
    totalAmount: 660,
    finalAmount: 660,
    note: "Less spicy for one burger.",
    createdAt: new Date().toISOString(),
    items: [
      { name: "Spicy Paneer Burger", price: 220, quantity: 2 },
      { name: "Cold Coffee", price: 140, quantity: 1 },
    ],
  },
  {
    _id: "demo-order-2",
    tableRoom: { type: "room", number: "R101" },
    numberOfPeople: 2,
    status: "accepted",
    totalAmount: 520,
    finalAmount: 520,
    note: "Send cutlery.",
    createdAt: new Date().toISOString(),
    items: [{ name: "Paneer Butter Masala", price: 260, quantity: 2 }],
  },
  {
    _id: "demo-order-3",
    tableRoom: { type: "table", number: "T7" },
    numberOfPeople: 4,
    status: "preparing",
    totalAmount: 640,
    finalAmount: 640,
    note: "",
    createdAt: new Date().toISOString(),
    items: [
      { name: "Smoky Kebab Platter", price: 320, quantity: 1 },
      { name: "Lemon Soda", price: 90, quantity: 2 },
      { name: "Masala Fries", price: 130, quantity: 1 },
    ],
  },
];

const hasToken = (item, token) =>
  [item.name, item.description, item.category?.name, item.spiceLevel, ...(item.tags || [])]
    .join(" ")
    .toLowerCase()
    .includes(token);

const pickItem = (menuItems, token, fallbackIndex = 0) =>
  menuItems.find((item) => hasToken(item, token)) ||
  menuItems[fallbackIndex % Math.max(menuItems.length, 1)];

export const getDemoAiSpotlights = (menuItems = []) => {
  const availableItems = menuItems.filter((item) => item.isAvailable !== false);
  if (availableItems.length === 0) return [];

  const popular =
    [...availableItems].sort((a, b) => (b.popularity || 0) - (a.popularity || 0))[0] ||
    availableItems[0];
  const healthy = pickItem(availableItems, "healthy", 0);
  const chefSpecial = pickItem(availableItems, "chef-special", 1);
  const combo = pickItem(availableItems, "combo", 2);

  const spotlightMap = new Map();

  [
    {
      label: "Popular today",
      title: popular?.name,
      subtitle: "Guests keep choosing this one today.",
      prompt: `I want ${popular?.name}`,
    },
    {
      label: "Healthy picks",
      title: healthy?.name,
      subtitle: "A lighter choice that still feels satisfying.",
      prompt: "Show healthy food",
    },
    {
      label: "Chef special",
      title: chefSpecial?.name,
      subtitle: "Premium, polished and perfect for a dinner order.",
      prompt: "Premium dinner",
    },
    {
      label: "Combo deal",
      title: combo?.name,
      subtitle: "A complete order with less decision-making.",
      prompt: "Cheap combo",
    },
  ].forEach((item) => {
    if (item.title && !spotlightMap.has(item.title)) {
      spotlightMap.set(item.title, item);
    }
  });

  return Array.from(spotlightMap.values());
};
