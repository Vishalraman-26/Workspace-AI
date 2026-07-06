export default function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`wa-card p-3 ${className}`}>
      <div className="wa-skeleton mb-3" style={{ height: 20, width: '40%' }} />
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="wa-skeleton mb-2"
          style={{ height: 14, width: `${90 - index * 15}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="d-flex flex-column gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} lines={2} />
      ))}
    </div>
  );
}
