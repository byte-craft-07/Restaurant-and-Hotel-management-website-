import { QrCode, Utensils } from "lucide-react";

const sizeMap = {
  sm: {
    mark: "h-10 w-10 rounded-2xl",
    title: "text-lg",
    subtitle: "text-[11px]",
    icon: 18,
  },
  md: {
    mark: "h-12 w-12 rounded-[1.15rem]",
    title: "text-2xl",
    subtitle: "text-xs",
    icon: 20,
  },
  lg: {
    mark: "h-16 w-16 rounded-[1.4rem]",
    title: "text-3xl",
    subtitle: "text-sm",
    icon: 26,
  },
};

const BrandLogo = ({
  className = "",
  size = "md",
  subtitle = "Premium QR Ordering",
  markOnly = false,
}) => {
  const styles = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${styles.mark} relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_34%)]" />
        <QrCode size={styles.icon} className="relative z-10" />
        <Utensils
          size={Math.max(12, styles.icon - 8)}
          className="absolute bottom-2 right-2 z-10 opacity-90"
        />
      </div>

      {!markOnly && (
        <div className="leading-none">
          <p className={`${styles.title} font-black tracking-tight text-slate-950`}>
            DineLink <span className="text-orange-500">OS</span>
          </p>
          <p className={`${styles.subtitle} mt-1 font-bold text-slate-500`}>
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
