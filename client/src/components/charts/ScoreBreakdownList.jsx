const colorMap = {
  high: 'bg-accent-cyan',
  mid:  'bg-accent-amber',
  low:  'bg-accent-rose',
};

function tier(score) {
  if (score >= 80) return 'high';
  if (score >= 60) return 'mid';
  return 'low';
}

export default function ScoreBreakdownList({ items }) {
  return (
    <div className="flex flex-col gap-5">
      {items.map(({ label, score, category }) => {
        const displayLabel = label || category;
        return (
          <div key={displayLabel}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-ink-100">{displayLabel}</span>
              <span className={`font-bold ${
                tier(score) === 'high' ? 'text-accent-cyan' :
                tier(score) === 'mid'  ? 'text-accent-amber' :
                'text-accent-rose'
              }`}>{score}/100</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-base-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ${colorMap[tier(score)]}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
