export const HOTEL_BRAND = {
  name: "Hotel Saffron Suites",
  shortName: "HSS",
  tagline: "Premium in-room dining and guest service",
  logoText: "HS",
  accentColor: "#f97316",
  accentSoft: "#ffedd5",
  bannerImage:
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1800&q=85",
  cuisineTags: ["Room Service", "All-day Dining", "Events", "Fast Service"],
  status: "Busy",
  statusMessage: "High demand right now. Room orders are moving in 18-22 min.",
  prepTimeMinutes: "18-22",
};

export const RESTAURANT_BRAND = HOTEL_BRAND;

export const statusStyles = {
  Open: "border-green-100 bg-green-50 text-green-700",
  Busy: "border-amber-100 bg-amber-50 text-amber-700",
  Closed: "border-red-100 bg-red-50 text-red-700",
};

export const getBrandCssVars = (brand = HOTEL_BRAND) => ({
  "--hotel-accent": brand.accentColor,
  "--hotel-accent-soft": brand.accentSoft,
  "--restaurant-accent": brand.accentColor,
  "--restaurant-accent-soft": brand.accentSoft,
});

export const getRoomDisplay = (roomContext) => {
  if (!roomContext) return "Ordering for your room";

  const type = "room";
  const number = roomContext.number || "";

  return `Ordering for ${type.charAt(0).toUpperCase()}${type.slice(1)} ${number}`;
};

export const getTableDisplay = getRoomDisplay;
