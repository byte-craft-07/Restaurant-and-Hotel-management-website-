# Premium UI Rules

Use this design language for customer-facing and premium pages by default.

- Light luxury theme with `#f8f6f2` background and slate text.
- Glass cards with soft white borders, blur, and warm orange shadows.
- Soft orange/amber accents for primary actions, active states, and highlights.
- Subtle 3D hover tilt on premium cards and visitor-facing panels.
- Cursor-follow glow where useful, but keep it low opacity and mobile-safe.
- Animated lucide icons and buttons with small, polished motion.
- Smooth page/card transitions through `framer-motion`.
- Mobile-safe spacing first: no overlap, no cramped buttons, no clipped text.
- Admin operations should stay clean and readable; customer pages can feel richer.

Reusable code lives in:

- `src/index.css` for global premium utility classes.
- `src/design/premiumTheme.js` for shared class and motion presets.
