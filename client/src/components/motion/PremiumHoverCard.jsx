import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const PremiumHoverCard = ({ children, className = "", intensity = 11 }) => {
  const cardX = useMotionValue(0.5);
  const cardY = useMotionValue(0.5);
  const rotateX = useSpring(
    useTransform(cardY, [0, 1], [intensity, -intensity]),
    {
      stiffness: 180,
      damping: 20,
    }
  );
  const rotateY = useSpring(
    useTransform(cardX, [0, 1], [-intensity, intensity]),
    {
      stiffness: 180,
      damping: 20,
    }
  );
  const glowX = useTransform(cardX, (value) => `${value * 100}%`);
  const glowY = useTransform(cardY, (value) => `${value * 100}%`);
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(251, 146, 60, 0.28), rgba(253, 186, 116, 0.10) 32%, transparent 58%)`;

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
      data-premium-hover="off"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      whileHover={{
        y: -10,
        scale: 1.015,
        boxShadow: "0 28px 70px rgba(15, 23, 42, 0.14)",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={`premium-hover-card group relative overflow-hidden rounded-lg border border-white/80 bg-white/70 shadow-lg shadow-slate-900/5 backdrop-blur-2xl ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <div
        className="relative z-10 h-full"
        style={{ transform: "translateZ(34px)" }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default PremiumHoverCard;
