export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '2/3' }}>
      <div className="skeleton w-full h-full" />
    </div>
  );
}

export function SkeletonText({ width = 'w-full', height = 'h-4', className = '' }) {
  return <div className={`skeleton ${width} ${height} rounded-lg ${className}`} />;
}

export function SkeletonRow({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDetails() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="skeleton h-8 w-3/4 rounded-xl" />
      <div className="skeleton h-5 w-1/3 rounded-lg" />
      <div className="space-y-2 mt-6">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
      </div>
    </div>
  );
}
