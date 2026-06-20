import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BellRing,
  Eye,
  LogOut,
  MapPin,
  PartyPopper,
  ReceiptText,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import BrandLogo from "../../components/BrandLogo";
import RestaurantBrandPanel from "../../components/restaurant/RestaurantBrandPanel";
import api from "../../services/api";
import MenuCard from "../../components/MenuCard";
import CartDrawer from "../../components/CartDrawer";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import PageNavigation from "../../components/PageNavigation";

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
  const [menuError, setMenuError] = useState("");
  const [search, setSearch] = useState("");
  const [tableContext, setTableContext] = useState(null);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceMessage, setServiceMessage] = useState("");

  const { cartItems, totalAmount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sessionId = localStorage.getItem("verifiedSessionId");

  const fetchTableContext = async () => {
    const qrToken = localStorage.getItem("qrToken");
    if (!qrToken) return;

    try {
      const res = await api.get(`/rooms/context/${qrToken}`);
      setTableContext(res.data.tableRoom || null);
    } catch {
      setTableContext(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const requestWaiter = async () => {
    const qrToken = localStorage.getItem("qrToken");

    if (!qrToken) {
      setServiceMessage("Please scan your room QR first.");
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

      setServiceMessage("Service request sent. Hotel staff will acknowledge shortly.");
    } catch (error) {
      setServiceMessage(
        error.response?.data?.message || "Unable to send service request."
      );
    } finally {
      setServiceLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setMenuError("");

    try {
      const [menuResult, categoryResult] = await Promise.allSettled([
        api.get("/menu"),
        api.get("/categories"),
      ]);

      if (menuResult.status === "rejected") {
        throw menuResult.reason;
      }

      const fetchedItems = menuResult.value.data.menuItems || [];
      const fetchedCategories =
        categoryResult.status === "fulfilled"
          ? categoryResult.value.data.categories || []
          : Array.from(
              new Map(
                fetchedItems
                  .filter((item) => item.category?._id)
                  .map((item) => [item.category._id, item.category])
              ).values()
            );

      setMenuItems(fetchedItems);
      setCategories(fetchedCategories);
      fetchTableContext();
    } catch (error) {
      setMenuItems([]);
      setCategories([]);
      setMenuError(
        error.response?.data?.message ||
          "Menu load nahi ho paaya. Please refresh once."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const hasMenuItems = menuItems.length > 0;
  const hasActiveFilters =
    Boolean(search.trim()) ||
    activeCategory !== "all" ||
    activeQuickFilter !== "all";

  const resetMenuFilters = () => {
    setSearch("");
    setActiveCategory("all");
    setActiveQuickFilter("all");
  };

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
                  Room {tableContext.number}
                </motion.div>
              )}
            </div>

            <h1 className="mt-1 text-2xl font-black md:text-4xl">
              Choose your favorites
            </h1>

            <p className="text-sm text-slate-500">
              Fresh menu, fast ordering, verified room service.
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

                <PageNavigation backTo="/" />

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

                <Link
                  to="/events"
                  className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 font-bold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-500"
                >
                  <PartyPopper size={18} />
                  Events
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

            {tableContext && (
              <motion.button
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                onClick={requestWaiter}
                disabled={serviceLoading}
                className="flex items-center gap-2 rounded-2xl border border-orange-100 bg-white/80 px-4 py-3 font-bold text-orange-600 shadow-sm transition hover:bg-orange-50 disabled:opacity-70"
              >
                <BellRing size={18} />
                {serviceLoading ? "Calling..." : "Call Service"}
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

        {(loading || hasMenuItems) && (
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
        )}

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
              {hasMenuItems
                ? "No matching dishes yet"
                : menuError
                  ? "Menu could not be loaded"
                  : "Today's menu is being prepared"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {hasMenuItems
                ? "Search ya filters reset karke full menu dekh sakte ho."
                : menuError ||
                  "Please check again shortly or ask the hotel desk for today's available dishes."}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {hasMenuItems && hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetMenuFilters}
                  className="rounded-2xl bg-orange-500 px-5 py-3 font-black text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
                >
                  Show full menu
                </button>
              )}
              <button
                type="button"
                onClick={fetchData}
                className={`rounded-2xl px-5 py-3 font-black shadow-lg transition ${
                  hasMenuItems && hasActiveFilters
                    ? "border border-orange-200 bg-white text-orange-600 hover:bg-orange-50"
                    : "bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-600"
                }`}
              >
                Refresh menu
              </button>
            </div>
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
