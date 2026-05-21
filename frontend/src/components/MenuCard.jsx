import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";

const MenuCard = ({ item }) => {
  const { addToCart } = useCart();

  const cardX = useMotionValue(0.5);
  const cardY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(cardY, [0, 1], [9, -9]), {
    stiffness: 180,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(cardX, [0, 1], [-10, 10]), {
    stiffness: 180,
    damping: 20,
  });
  const imageX = useSpring(useTransform(cardX, [0, 1], [-10, 10]), {
    stiffness: 160,
    damping: 18,
  });
  const imageY = useSpring(useTransform(cardY, [0, 1], [-8, 8]), {
    stiffness: 160,
    damping: 18,
  });
  const glowX = useTransform(cardX, (value) => `${value * 100}%`);
  const glowY = useTransform(cardY, (value) => `${value * 100}%`);
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(251, 146, 60, 0.32), rgba(253, 186, 116, 0.10) 32%, transparent 58%)`;

  const imageSrc = item.image?.startsWith("/uploads")
    ? `http://localhost:5000${item.image}`
    : item.image;
  const isVegan = item.isVegan || item.tags?.includes("vegan");
  const dietaryBadge = isVegan ? "Vegan" : item.isVeg ? "Veg" : "Non-Veg";
  const dietaryClass = isVegan
    ? "bg-emerald-50 text-emerald-600"
    : item.isVeg
    ? "bg-green-50 text-green-600"
    : "bg-red-50 text-red-500";
  const highlightTags = [
    item.tags?.includes("best-seller") && "Best seller",
    item.tags?.includes("healthy") && "Healthy",
    item.tags?.includes("high-protein") && "Protein",
    item.tags?.includes("budget") && "Budget",
    item.tags?.includes("kids") && "Kids",
    item.spiceLevel === "spicy" && "Spicy",
  ]
    .filter(Boolean)
    .slice(0, 2);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    cardX.set((event.clientX - rect.left) / rect.width);
    cardY.set((event.clientY - rect.top) / rect.height);
  };

  const handlePointerLeave = () => {
    cardX.set(0.5);
    cardY.set(0.5);
  };

  return (
    <motion.div
      layout
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      whileHover={{
        y: -12,
        scale: 1.018,
        boxShadow: "0 28px 70px rgba(15, 23, 42, 0.14)",
      }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-xl shadow-orange-100/50 backdrop-blur-xl"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />

      <div className="relative h-56 overflow-hidden bg-orange-50">
        <motion.div
          className="absolute inset-0"
          style={{ x: imageX, y: imageY, scale: 1.08 }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={item.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              No Image
            </div>
          )}
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/35 to-transparent" />

        <motion.span
          animate={{ y: [0, -5, 0], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-xs font-bold text-orange-500 shadow-lg backdrop-blur-xl"
        >
          <Sparkles size={13} />
          Fresh
        </motion.span>
      </div>

      <div className="relative z-20 p-5" style={{ transform: "translateZ(32px)" }}>
        <div className="flex justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-900">{item.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
              {item.description}
            </p>
          </div>

          <motion.span
            whileHover={{ scale: 1.08 }}
            className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${dietaryClass}`}
          >
            {dietaryBadge}
          </motion.span>
        </div>

        {highlightTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {highlightTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-orange-100 bg-orange-50/80 px-3 py-1 text-xs font-black text-orange-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-2xl font-black text-orange-500">
            Rs. {item.price}
          </p>

          <motion.button
            whileHover={{ scale: item.isAvailable ? 1.06 : 1 }}
            whileTap={{ scale: item.isAvailable ? 0.94 : 1 }}
            onClick={() => addToCart(item)}
            disabled={!item.isAvailable}
            className="flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:bg-slate-300 disabled:shadow-none"
          >
            <Plus size={18} />
            {item.isAvailable ? "Add" : "Unavailable"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;
