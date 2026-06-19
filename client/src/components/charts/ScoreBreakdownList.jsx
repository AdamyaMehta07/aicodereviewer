const colorMap = {
  high: 'bg-accent-cyan',
  mid: 'bg-accent-amber',
  low: 'bg-accent-rose',
};

function tier(score) {
  if (score >= 80) return 'high';
  if (score >= 60) return 'mid';
  return 'low';
}

export default function ScoreBreakdownList({ items }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map(({ label, score }) => (
        <div key={label}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-ink-300">{label}</span>
            <span className="font-semibold text-ink-100">{score}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-base-800">
            <div
              className={`h-full rounded-full ${colorMap[tier(score)]}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
