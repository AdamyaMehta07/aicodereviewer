import { motion } from 'framer-motion';

function getScoreColor(score) {
  if (score >= 80) return '#3FE0D0';
  if (score >= 60) return '#FFB454';
  return '#FF6B81';
}

export default function ScoreCard({ score = 0, label = 'Overall Score', size = 160 }) {
  const color = getScoreColor(score);
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1E2740"
            strokeWidth={12}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-3xl font-bold text-ink-100 sm:text-4xl"
          >
            {score}
          </motion.span>
          <span className="text-xs text-ink-500">/ 100</span>
        </div>
      </div>
      <p className="text-sm font-medium text-ink-300">{label}</p>
    </div>
  );
}
