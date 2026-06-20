const SkeletonBlock = ({ className = "" }) => (
  <div className={`premium-shimmer rounded-2xl ${className}`} />
);

export const CardSkeletonGrid = ({
  count = 3,
  className = "",
  cardClassName = "h-80",
}) => (
  <div className={`grid gap-4 md:grid-cols-2 xl:grid-cols-3 ${className}`}>
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className={`premium-shimmer rounded-[2rem] shadow-lg ${cardClassName}`}
      />
    ))}
  </div>
);

export const ListSkeleton = ({ count = 4, className = "" }) => (
  <div className={`grid gap-3 ${className}`}>
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="rounded-3xl border border-white bg-white/80 p-4 shadow-sm"
      >
        <div className="flex gap-4">
          <SkeletonBlock className="h-20 w-24 shrink-0" />
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-6 w-2/3" />
            <SkeletonBlock className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const DetailSkeleton = () => (
  <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
    <div className="overflow-hidden rounded-[1.75rem] border border-white bg-white/90 shadow-xl shadow-slate-900/5">
      <SkeletonBlock className="h-72 w-full rounded-none" />
      <div className="space-y-4 p-6">
        <SkeletonBlock className="h-9 w-44 rounded-full" />
        <SkeletonBlock className="h-10 w-2/3" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <div className="grid gap-3 sm:grid-cols-2">
          <SkeletonBlock className="h-28" />
          <SkeletonBlock className="h-28" />
        </div>
      </div>
    </div>
    <div className="rounded-[1.75rem] border border-white bg-white/90 p-6 shadow-xl shadow-slate-900/5">
      <div className="space-y-4">
        <SkeletonBlock className="h-10 w-56" />
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonBlock key={index} className="h-14 w-full" />
        ))}
        <SkeletonBlock className="h-24 w-full" />
        <SkeletonBlock className="h-14 w-full" />
      </div>
    </div>
  </div>
);

export default SkeletonBlock;
