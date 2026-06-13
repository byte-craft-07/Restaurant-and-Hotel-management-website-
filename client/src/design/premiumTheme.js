export const premiumTheme = {
  page:
    "premium-page bg-[#f8f6f2] text-slate-900 relative overflow-hidden",
  content: "relative z-10",
  card: "premium-card",
  cardHover: "premium-card premium-card-hover",
  panel: "premium-soft-panel",
  primaryButton: "premium-primary-button px-5 py-3",
  softButton: "premium-soft-button px-5 py-3",
  input: "premium-input w-full px-4 py-4",
  labelPill: "premium-label-pill",
  iconFloat: "premium-icon-float",
  cursorGlow: "premium-cursor-glow",
};

export const premiumMotion = {
  page: {
    animate: { opacity: 1, y: 0 },
    initial: { opacity: 0, y: 20 },
    transition: { duration: 0.45 },
  },
  card: {
    transition: { damping: 18, stiffness: 220, type: "spring" },
    whileHover: { scale: 1.015, y: -6 },
  },
  button: {
    whileHover: { scale: 1.03, y: -2 },
    whileTap: { scale: 0.98 },
  },
};

export const premiumDesignRules = [
  "Light luxury base using #f8f6f2 with slate text.",
  "Glass cards with white transparency, soft borders, and amber/orange shadows.",
  "Soft orange/amber accents for primary action and active states.",
  "Subtle 3D hover tilt for visitor-facing and premium cards.",
  "Cursor-follow glow only where it helps, without blocking mobile readability.",
  "Animated lucide icons/buttons using small motion, not noisy movement.",
  "Smooth page/card transitions with mobile-safe spacing and no overlap.",
  "Admin operations stay clean and readable; customer-facing pages can be richer.",
];
