import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Eye,
  Flame,
  Lightbulb,
  LogOut,
  MapPin,
  PlusCircle,
  ReceiptText,
  Search,
  ShoppingCart,
  Sparkles,
  UserRound,
  WandSparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import BrandLogo from "../../components/BrandLogo";
import RestaurantBrandPanel from "../../components/restaurant/RestaurantBrandPanel";
import api from "../../services/api";
import MenuCard from "../../components/MenuCard";
import CartDrawer from "../../components/CartDrawer";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import {
  AI_ORDER_EXAMPLES,
  buildOrderFromText,
} from "../../services/aiOrderAssistant";
import {
  buildDemoBackedMenu,
  DEMO_CATEGORIES,
  DEMO_MENU_ITEMS,
  getDemoAiSpotlights,
  isDemoQrToken,
} from "../../services/demoExperience";

const QUICK_FILTERS = [
  { id: "all", label: "All picks" },
  { id: "popular", label: "Popular today" },
  { id: "healthy", label: "Healthy picks" },
  { id: "protein", label: "High protein" },
  { id: "vegan", label: "Vegan" },
  { id: "kids", label: "Kids" },
  { id: "budget", label: "Budget" },
  { id: "combo", label: "Combos" },
  { id: "chef", label: "Chef specials" },
];

const itemHasTag = (item, tag) =>
  Array.isArray(item.tags) &&
  item.tags.some((itemTag) => itemTag.toLowerCase() === tag);

const itemMatchesQuickFilter = (item, activeQuickFilter) => {
  if (activeQuickFilter === "all") return true;

  const categoryName = item.category?.name?.toLowerCase() || "";

  const matchers = {
    popular: () => itemHasTag(item, "best-seller") || (item.popularity || 0) >= 88,
    healthy: () => itemHasTag(item, "healthy"),
    protein: () => itemHasTag(item, "high-protein"),
    vegan: () => item.isVegan || itemHasTag(item, "vegan"),
    kids: () => itemHasTag(item, "kids"),
    budget: () => itemHasTag(item, "budget") || item.price <= 250,
    combo: () => itemHasTag(item, "combo") || categoryName.includes("combo"),
    chef: () =>
      itemHasTag(item, "chef-special") ||
      itemHasTag(item, "premium") ||
      (item.popularity || 0) >= 94,
  };

  return matchers[activeQuickFilter]?.() || true;
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeQuickFilter, setActiveQuickFilter] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tableContext, setTableContext] = useState(null);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceMessage, setServiceMessage] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const { cartItems, addToCart, totalAmount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sessionId = localStorage.getItem("verifiedSessionId");
  const demoGuestMode = isDemoQrToken(localStorage.getItem("qrToken")) && !user;

  const fetchTableContext = async () => {
    const qrToken = localStorage.getItem("qrToken");
    if (!qrToken) return;

    if (isDemoQrToken(qrToken)) {
      setTableContext({
        type: "table",
        number: "T1",
        label: "Hackathon demo table",
      });
      return;
    }

    try {
      const res = await api.get(`/table-rooms/context/${qrToken}`);
      setTableContext(res.data.tableRoom || null);
    } catch {
      setTableContext(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const requestWaiter = async () => {
    const qrToken = localStorage.getItem("qrToken");

    if (!qrToken) {
      setServiceMessage("Please scan your table QR first.");
      return;
    }

    try {
      setServiceLoading(true);
      setServiceMessage("");

      await api.post("/service-requests", {
        qrToken,
        type: "waiter",
        note: "Guest requested service from the digital menu.",
      });

      setServiceMessage("Waiter request sent. Staff will acknowledge shortly.");
    } catch (error) {
      setServiceMessage(
        error.response?.data?.message || "Unable to send waiter request."
      );
    } finally {
      setServiceLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [menuRes, categoryRes] = await Promise.all([
        api.get("/menu"),
        api.get("/categories"),
      ]);

      const fetchedItems = menuRes.data.menuItems || [];
      const fetchedCategories = categoryRes.data.categories || [];
      const demoModeEnabled = import.meta.env.VITE_ENABLE_DEMO_MODE !== "false";
      const demoMenu = demoModeEnabled
        ? buildDemoBackedMenu({
            menuItems: fetchedItems,
            categories: fetchedCategories,
          })
        : null;

      setMenuItems(
        fetchedItems.length > 0
          ? demoMenu?.menuItems || fetchedItems
          : DEMO_MENU_ITEMS
      );
      setCategories(
        fetchedCategories.length > 0
          ? demoMenu?.categories || fetchedCategories
          : DEMO_CATEGORIES
      );
      fetchTableContext();
    } catch {
      setMenuItems(DEMO_MENU_ITEMS);
      setCategories(DEMO_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const runAiAssistant = async (prompt = aiPrompt) => {
    const query = prompt.trim();

    if (!query) {
      setAiResult({
        status: "empty",
        message:
          "Tell me what you are craving and I will match it with the menu.",
        cartItems: [],
        suggestions: [],
      });
      return;
    }

    try {
      setAiLoading(true);

      const result = await buildOrderFromText({
        query,
        menuItems,
      });

      if (result.cartItems?.length > 0) {
        result.cartItems.forEach(({ item, quantity }) => {
          addToCart(item, quantity);
        });
        setCartOpen(true);
      }

      setAiResult(result);
    } catch {
      setAiResult({
        status: "empty",
        message:
          "I am not fully sure yet. Try a dish name, spice mood, or budget.",
        cartItems: [],
        suggestions: [],
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiExample = (example) => {
    setAiPrompt(example);
    runAiAssistant(example);
  };

  const addSuggestionToCart = (item) => {
    addToCart(item, 1);
    setAiResult((prev) =>
      prev
        ? {
            ...prev,
            message: `${item.name} added to your cart.`,
          }
        : prev
    );
  };

  const aiSpotlights = getDemoAiSpotlights(menuItems);

  const filteredItems = menuItems.filter((item) => {
    const categoryMatch =
      activeCategory === "all" || item.category?._id === activeCategory;
    const quickFilterMatch = itemMatchesQuickFilter(item, activeQuickFilter);

    const searchValue = search.toLowerCase();
    const searchableText = [
      item.name,
      item.description,
      item.category?.name,
      item.spiceLevel,
      ...(Array.isArray(item.tags) ? item.tags : []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const searchMatch = searchableText.includes(searchValue);

    return categoryMatch && quickFilterMatch && searchMatch;
  });

  return (
    <div className="safe-page relative min-h-screen overflow-hidden bg-[#f8f6f2] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#fb923c_0,transparent_28%),radial-gradient(circle_at_bottom_right,#fde68a_0,transparent_30%)] opacity-20" />

      <header className="sticky top-0 z-30 border-b border-white/70 bg-[#f8f6f2]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 md:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <BrandLogo size="sm" subtitle="Guest Menu" />

              {tableContext && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-full border border-orange-100 bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-wide text-orange-600 shadow-sm"
                >
                  <MapPin size={14} />
                  {tableContext.type} {tableContext.number}
                </motion.div>
              )}
            </div>

            <h1 className="mt-1 text-2xl font-black md:text-4xl">
              Choose your favorites
            </h1>

            <p className="text-sm text-slate-500">
              Fresh menu, fast ordering, verified table service.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user?.role === "customer" && (
              <>
                <div className="rounded-2xl border border-white/80 bg-white/70 px-4 py-2 shadow-sm">
                  <p className="text-sm font-bold text-slate-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user.customerId || "Customer"}
                  </p>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 font-bold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-500"
                >
                  <UserRound size={18} />
                  Profile
                </Link>

                <Link
                  to="/my-orders"
                  className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 font-bold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-500"
                >
                  <ReceiptText size={18} />
                  My Orders
                </Link>
              </>
            )}

            {user && user.role !== "customer" && (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-2 shadow-sm">
                <p className="flex items-center gap-2 text-sm font-black text-amber-700">
                  <Eye size={16} />
                  Preview Mode
                </p>
                <p className="text-xs font-semibold capitalize text-amber-600">
                  Signed in as {user.role}
                </p>
              </div>
            )}

            {demoGuestMode && (
              <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-2 shadow-sm">
                <p className="flex items-center gap-2 text-sm font-black text-orange-700">
                  <Eye size={16} />
                  Demo Guest
                </p>
                <p className="text-xs font-semibold text-orange-600">
                  Backend-safe preview mode
                </p>
              </div>
            )}

            {tableContext && (
              <motion.button
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                onClick={requestWaiter}
                disabled={serviceLoading}
                className="flex items-center gap-2 rounded-2xl border border-orange-100 bg-white/80 px-4 py-3 font-bold text-orange-600 shadow-sm transition hover:bg-orange-50 disabled:opacity-70"
              >
                <BellRing size={18} />
                {serviceLoading ? "Calling..." : "Call Waiter"}
              </motion.button>
            )}

            <motion.button
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              animate={
                cartItems.length > 0
                  ? { boxShadow: "0 18px 40px rgba(249, 115, 22, 0.34)" }
                  : { boxShadow: "0 12px 28px rgba(249, 115, 22, 0.20)" }
              }
              onClick={() => setCartOpen(true)}
              className="relative rounded-2xl bg-orange-500 p-4 text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              aria-label="Open cart"
            >
              <motion.span
                animate={cartItems.length > 0 ? { rotate: [0, -8, 8, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="block"
              >
                <ShoppingCart />
              </motion.span>

              {cartItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </motion.button>

            {user ? (
              <button
                onClick={handleLogout}
                className="rounded-2xl border border-white/80 bg-white/70 p-4 text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-500"
                aria-label="Logout"
              >
                <LogOut />
              </button>
            ) : (
              <Link
                to="/login?redirect=/menu"
                className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 font-bold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-500"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8">
        {serviceMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-[2rem] border border-orange-100 bg-white/80 p-4 text-sm font-semibold text-orange-700 shadow-lg backdrop-blur-2xl"
          >
            {serviceMessage}
          </motion.div>
        )}

        <div className="mb-8">
          <RestaurantBrandPanel tableContext={tableContext} />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          className="relative mb-8 overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/75 p-4 shadow-xl backdrop-blur-2xl md:rounded-[2rem] md:p-6"
        >
          <motion.div
            animate={{ x: ["-30%", "130%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-amber-100/70 to-transparent"
          />

          <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-black text-orange-600">
                <Sparkles size={17} />
                AI Order Assistant
              </div>

              <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
                Tell DineLink what you want
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Type naturally. I will match your sentence with available menu
                items and build your cart only when the match is clear.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm font-bold text-slate-600 shadow-sm">
              <Lightbulb size={18} className="text-amber-500" />
              Menu-aware, demo-ready
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              runAiAssistant();
            }}
            className="relative z-10 mt-5 grid gap-3 lg:grid-cols-[1fr_auto]"
          >
            <div className="relative">
              <WandSparkles
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
              />

              <input
                value={aiPrompt}
                onChange={(event) => setAiPrompt(event.target.value)}
                placeholder="Tell me what you want... e.g. 2 burgers and 1 cold coffee"
                aria-label="AI order assistant prompt"
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <motion.button
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={aiLoading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:bg-slate-300 disabled:shadow-none"
            >
              {aiLoading ? "Thinking..." : "Build My Order"}
              <ArrowRight size={19} />
            </motion.button>
          </form>

          <div className="relative z-10 mt-4 flex flex-wrap gap-2">
            {AI_ORDER_EXAMPLES.map((example) => (
              <motion.button
                key={example}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleAiExample(example)}
                className="shrink-0 rounded-full border border-orange-100 bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
              >
                {example}
              </motion.button>
            ))}
          </div>

          {aiSpotlights.length > 0 && (
            <div className="relative z-10 mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {aiSpotlights.map((card, index) => (
                <motion.button
                  key={card.title}
                  type="button"
                  whileHover={{ y: -6, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setAiPrompt(card.prompt);
                    runAiAssistant(card.prompt);
                  }}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/75 p-4 text-left shadow-sm backdrop-blur-xl transition hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/60"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600">
                      {card.label}
                    </span>

                    <motion.span
                      animate={{
                        y: [0, -4, 0],
                        rotate: index % 2 === 0 ? [0, 8, -8, 0] : [0, -8, 8, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-orange-500"
                    >
                      {index === 0 ? (
                        <Flame size={18} />
                      ) : index === 1 ? (
                        <BadgeCheck size={18} />
                      ) : (
                        <Lightbulb size={18} />
                      )}
                    </motion.span>
                  </div>

                  <h3 className="font-black text-slate-900">{card.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {card.subtitle}
                  </p>
                  <p className="mt-3 text-sm font-black text-orange-600">
                    Try this prompt
                  </p>
                </motion.button>
              ))}
            </div>
          )}

          <AnimatePresence>
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className={`relative z-10 mt-5 rounded-[1.5rem] border p-4 ${
                  aiResult.status === "cart"
                    ? "border-green-100 bg-green-50 text-green-800"
                    : aiResult.status === "suggestions"
                    ? "border-amber-100 bg-amber-50 text-amber-800"
                    : "border-orange-100 bg-orange-50 text-orange-800"
                }`}
              >
                <p className="font-bold">{aiResult.message}</p>

                {aiResult.cartItems?.length > 0 && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {aiResult.cartItems.map(({ item, quantity }) => (
                      <div
                        key={item._id}
                        className="rounded-2xl border border-white/80 bg-white/80 p-3 text-sm text-slate-700 shadow-sm"
                      >
                        <p className="font-black">{item.name}</p>
                        <p className="text-orange-600">
                          Qty {quantity} | Rs. {item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {aiResult.suggestions?.length > 0 && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {aiResult.suggestions.map(({ item, reason }) => (
                      <div
                        key={item._id}
                        className="rounded-2xl border border-white/80 bg-white/85 p-3 text-sm text-slate-700 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-black">{item.name}</p>
                            <p className="text-xs text-slate-500">{reason}</p>
                            <p className="mt-1 font-bold text-orange-600">
                              Rs. {item.price}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => addSuggestionToCart(item)}
                            className="flex items-center gap-1 rounded-xl bg-orange-500 px-3 py-2 text-xs font-black text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
                          >
                            <PlusCircle size={15} />
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {aiResult.status === "empty" && aiSpotlights.length > 0 && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {aiSpotlights.map((card) => (
                      <button
                        key={card.title}
                        type="button"
                        onClick={() => {
                          setAiPrompt(card.prompt);
                          runAiAssistant(card.prompt);
                        }}
                        className="rounded-2xl border border-white/80 bg-white/85 p-3 text-left text-sm font-bold text-slate-700 shadow-sm hover:text-orange-600"
                      >
                        {card.title}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          className="relative mb-8 overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/70 p-4 shadow-xl backdrop-blur-2xl md:rounded-[2rem] md:p-6"
        >
          <motion.div
            animate={{ x: ["-20%", "120%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-orange-100/60 to-transparent"
          />
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search paneer, biryani, drinks..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="text-sm font-semibold text-slate-500">
              {filteredItems.length} items available
            </div>
          </div>

          <div className="mobile-scroll flex gap-3 pt-5">
            <motion.button
              layout
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory("all")}
              className={`relative shrink-0 overflow-hidden whitespace-nowrap rounded-2xl border px-5 py-3 font-bold transition ${
                activeCategory === "all"
                  ? "border-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-orange-300"
              }`}
            >
              {activeCategory === "all" && (
                <motion.span
                  layoutId="active-menu-category"
                  className="absolute inset-0 bg-orange-500"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
              <span className="relative z-10">All</span>
            </motion.button>

            {categories.map((category) => (
              <motion.button
                layout
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                key={category._id}
                onClick={() => setActiveCategory(category._id)}
                className={`relative shrink-0 overflow-hidden whitespace-nowrap rounded-2xl border px-5 py-3 font-bold transition ${
                  activeCategory === category._id
                    ? "border-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "border-slate-200 bg-white text-slate-600 hover:border-orange-300"
                }`}
              >
                {activeCategory === category._id && (
                  <motion.span
                    layoutId="active-menu-category"
                    className="absolute inset-0 bg-orange-500"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{category.name}</span>
              </motion.button>
            ))}
          </div>

          <div className="mt-5 border-t border-orange-50 pt-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-black text-slate-700">
                Smart filters
              </p>
              <p className="text-xs font-semibold text-slate-500">
                Match mood, budget and dietary preference
              </p>
            </div>

            <div className="mobile-scroll flex gap-2">
              {QUICK_FILTERS.map((filter) => (
                <motion.button
                  key={filter.id}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveQuickFilter(filter.id)}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-black transition ${
                    activeQuickFilter === filter.id
                      ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                      : "border-orange-100 bg-white/80 text-slate-600 hover:border-orange-200 hover:text-orange-600"
                  }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="premium-shimmer h-96 rounded-[2rem] shadow-lg"
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.96 }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 22,
                    delay: Math.min(index * 0.03, 0.18),
                  }}
                >
                  <MenuCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/80 bg-white/75 p-10 text-center shadow-xl backdrop-blur-2xl"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-orange-50 text-orange-500">
              <Search size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              No matching dishes yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try a simpler search, switch category, or ask the AI assistant for
              something like spicy veg food under Rs. 300.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
                setActiveQuickFilter("all");
              }}
              className="mt-5 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
            >
              Show full menu
            </button>
          </motion.div>
        )}
      </main>

      {cartItems.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          onClick={() => setCartOpen(true)}
          className="fixed bottom-4 left-4 right-4 z-30 flex items-center justify-between rounded-[1.5rem] bg-slate-950 px-5 py-4 text-white shadow-2xl shadow-slate-900/30 sm:hidden"
        >
          <span>
            <span className="block text-xs font-bold text-orange-300">
              {cartItems.length} item{cartItems.length > 1 ? "s" : ""} in cart
            </span>
            <span className="text-lg font-black">Rs. {totalAmount}</span>
          </span>
          <span className="flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2 font-black">
            Review
            <ArrowRight size={17} />
          </span>
        </motion.button>
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        sessionId={sessionId}
        tableContext={tableContext}
      />
    </div>
  );
};

export default Menu;
