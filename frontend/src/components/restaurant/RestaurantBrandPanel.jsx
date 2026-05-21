import { motion } from "framer-motion";
import { Clock3, MapPin, Sparkles } from "lucide-react";
import {
  RESTAURANT_BRAND,
  getBrandCssVars,
  getTableDisplay,
  statusStyles,
} from "../../services/restaurantBranding";

const RestaurantBrandPanel = ({
  brand = RESTAURANT_BRAND,
  tableContext,
  compact = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      style={getBrandCssVars(brand)}
      className={`relative overflow-hidden border border-white/80 bg-white/75 shadow-xl shadow-orange-100/50 backdrop-blur-2xl ${
        compact ? "rounded-[1.5rem] p-4" : "rounded-[2rem] p-5 md:p-6"
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-12"
        style={{ backgroundImage: `url(${brand.bannerImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/60" />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-[var(--restaurant-accent)] text-xl font-black text-white shadow-lg shadow-orange-500/25"
          >
            {brand.logoText}
          </motion.div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black text-slate-950">
                {brand.name}
              </h2>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-black ${
                  statusStyles[brand.status] || statusStyles.Open
                }`}
              >
                {brand.status}
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {brand.tagline}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {brand.cuisineTags.slice(0, compact ? 2 : 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-2 text-sm sm:min-w-56">
          <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 font-black text-slate-800 shadow-sm">
            <MapPin size={17} className="text-orange-500" />
            {getTableDisplay(tableContext)}
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 font-bold text-slate-600 shadow-sm">
            {brand.status === "Busy" ? (
              <Clock3 size={17} className="text-amber-500" />
            ) : (
              <Sparkles size={17} className="text-orange-500" />
            )}
            {brand.statusMessage}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantBrandPanel;
