import { useEffect, useRef } from "react";

const INTERACTIVE_CONTROL_SELECTOR =
  "input, textarea, select, [contenteditable='true']";

const getClassName = (element) =>
  typeof element.className === "string" ? element.className : "";

const isButtonSurface = (element) =>
  element.matches(".premium-primary-button, button.premium-primary-button");

const isSoftButtonSurface = (element) =>
  element.matches(".premium-soft-button, a.premium-soft-button");

const isExplicitSurface = (element) =>
  element.matches("[data-premium-hover], .premium-card, .premium-hover-card");

const isLuxuryRoundedSurface = (element) => {
  const className = getClassName(element);

  return (
    className.includes("rounded-[2rem]") &&
    (className.includes("shadow") ||
      className.includes("border") ||
      className.includes("bg-white"))
  );
};

const isHoverSurface = (element) =>
  element instanceof HTMLElement &&
  (isButtonSurface(element) ||
    isSoftButtonSurface(element) ||
    isExplicitSurface(element) ||
    isLuxuryRoundedSurface(element));

const shouldSkipSurface = (element) => {
  if (!(element instanceof HTMLElement)) return true;

  if (element.dataset.premiumHover === "off") return true;
  if (element.dataset.premiumHover === "true") return false;

  const tagName = element.tagName.toLowerCase();
  if (["input", "textarea", "select", "option"].includes(tagName)) return true;

  const className = getClassName(element);
  if (className.includes("fixed bottom")) return true;

  const containsFormControl = element.querySelector(
    INTERACTIVE_CONTROL_SELECTOR
  );

  return Boolean(containsFormControl && !isButtonSurface(element));
};

const findSurface = (event) => {
  const path = event.composedPath();

  for (const target of path) {
    if (!(target instanceof HTMLElement)) continue;
    if (!isHoverSurface(target)) continue;
    if (shouldSkipSurface(target)) continue;

    return target;
  }

  return null;
};

const resetSurface = (surface) => {
  if (!surface) return;

  surface.dataset.premiumActive = "false";
  surface.style.setProperty("--premium-rotate-x", "0deg");
  surface.style.setProperty("--premium-rotate-y", "0deg");
  surface.style.setProperty("--premium-hover-x", "50%");
  surface.style.setProperty("--premium-hover-y", "50%");
};

const activateSurface = (surface, event) => {
  const rect = surface.getBoundingClientRect();
  const x = rect.width ? (event.clientX - rect.left) / rect.width : 0.5;
  const y = rect.height ? (event.clientY - rect.top) / rect.height : 0.5;
  const className = getClassName(surface);
  const isButton = isButtonSurface(surface);
  const isSoftButton = isSoftButtonSurface(surface);

  surface.dataset.premiumHoverTarget = "true";
  surface.dataset.premiumActive = "true";
  surface.dataset.premiumKind = isButton
    ? "button"
    : isSoftButton
    ? "soft-button"
    : "surface";

  surface.style.setProperty("--premium-hover-x", `${x * 100}%`);
  surface.style.setProperty("--premium-hover-y", `${y * 100}%`);

  if (!isButton && !isSoftButton && !className.includes("transform-gpu")) {
    surface.style.setProperty("--premium-rotate-x", `${(0.5 - y) * 8}deg`);
    surface.style.setProperty("--premium-rotate-y", `${(x - 0.5) * 10}deg`);
  }
};

const PremiumHoverProvider = ({ children }) => {
  const activeSurfaceRef = useRef(null);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") return;

      const surface = findSurface(event);

      if (!surface) {
        resetSurface(activeSurfaceRef.current);
        activeSurfaceRef.current = null;
        return;
      }

      if (activeSurfaceRef.current && activeSurfaceRef.current !== surface) {
        resetSurface(activeSurfaceRef.current);
      }

      activeSurfaceRef.current = surface;
      activateSurface(surface, event);
    };

    const handlePointerOut = (event) => {
      const surface = activeSurfaceRef.current;
      if (!surface) return;

      const relatedTarget = event.relatedTarget;
      if (relatedTarget instanceof Node && surface.contains(relatedTarget)) {
        return;
      }

      resetSurface(surface);
      activeSurfaceRef.current = null;
    };

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("pointerout", handlePointerOut, {
      passive: true,
    });

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerout", handlePointerOut);
    };
  }, []);

  return children;
};

export default PremiumHoverProvider;
