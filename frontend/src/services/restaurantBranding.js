export const RESTAURANT_BRAND = {
  name: "Saffron & Sage",
  shortName: "S&S",
  tagline: "Modern Indian comfort dining",
  logoText: "SS",
  accentColor: "#f97316",
  accentSoft: "#ffedd5",
  bannerImage:
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1800&q=85",
  cuisineTags: ["Modern Indian", "Cafe", "Family Dining", "Fast Service"],
  status: "Busy",
  statusMessage: "High demand right now. Orders are moving in 18-22 min.",
  prepTimeMinutes: "18-22",
};

export const statusStyles = {
  Open: "border-green-100 bg-green-50 text-green-700",
  Busy: "border-amber-100 bg-amber-50 text-amber-700",
  Closed: "border-red-100 bg-red-50 text-red-700",
};

export const getBrandCssVars = (brand = RESTAURANT_BRAND) => ({
  "--restaurant-accent": brand.accentColor,
  "--restaurant-accent-soft": brand.accentSoft,
});

export const getTableDisplay = (tableContext) => {
  if (!tableContext) return "Ordering for your table";

  const type = tableContext.type || "table";
  const number = tableContext.number || "";

  return `Ordering for ${type.charAt(0).toUpperCase()}${type.slice(1)} ${number}`;
};
