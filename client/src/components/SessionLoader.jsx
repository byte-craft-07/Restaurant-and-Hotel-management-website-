const SessionLoader = () => {
  return (
    <div className="min-h-screen bg-[#f8f6f2] p-5 md:p-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-xl backdrop-blur-2xl md:p-8">
        <div className="flex items-center gap-4">
          <div className="premium-shimmer h-16 w-16 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <div className="premium-shimmer h-6 w-52 rounded-full" />
            <div className="premium-shimmer h-4 w-72 max-w-full rounded-full" />
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-[1.5rem] border border-orange-50 bg-white/70 p-4"
            >
              <div className="premium-shimmer h-36 rounded-[1.25rem]" />
              <div className="mt-4 space-y-3">
                <div className="premium-shimmer h-5 w-2/3 rounded-full" />
                <div className="premium-shimmer h-4 w-full rounded-full" />
                <div className="premium-shimmer h-4 w-1/2 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionLoader;
