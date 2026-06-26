import { motion } from 'framer-motion';
import { Github, Brain, FileSearch, CheckCircle2 } from 'lucide-react';

const stages = [
  { icon: Github,      label: 'Fetching repository files from GitHub...' },
  { icon: FileSearch,  label: 'Analyzing code structure and patterns...' },
  { icon: Brain,       label: 'Generating AI review with Groq...' },
  { icon: CheckCircle2, label: 'Saving your review...' },
];

export default function AnalysisProgress({ stage = 0 }) {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-violet/20"
      >
        <Brain size={28} className="text-accent-violet" />
      </motion.div>

      <div className="w-full max-w-sm space-y-3">
        {stages.map(({ icon: Icon, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: i <= stage ? 1 : 0.3 }}
            className="flex items-center gap-3"
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              i < stage
                ? 'bg-accent-cyan/20 text-accent-cyan'
                : i === stage
                ? 'bg-accent-violet/20 text-accent-violet'
                : 'bg-base-800 text-ink-700'
            }`}>
              <Icon size={16} />
            </span>
            <span className={`text-sm ${i <= stage ? 'text-ink-100' : 'text-ink-700'}`}>
              {label}
            </span>
            {i < stage && (
              <CheckCircle2 size={14} className="ml-auto text-accent-cyan" />
            )}
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-ink-500">
        This takes 15–30 seconds. Please don't close this page.
      </p>
    </div>
  );
}
