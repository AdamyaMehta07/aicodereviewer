import { motion } from 'framer-motion';
import { Check, Share2 } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import ScoreCard from '../../components/common/ScoreCard.jsx';
import { mockProjects } from '../../utils/mockData.js';

export default function PortfolioBuilderPage() {
  const featured = mockProjects.filter((p) => p.overallScore >= 70);
  const portfolioScore = Math.round(
    featured.reduce((a, p) => a + p.overallScore, 0) / featured.length
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">Portfolio Builder</h1>
          <p className="mt-1 text-sm text-ink-500">Curate your strongest projects into a shareable portfolio.</p>
        </div>
        <button className="btn-primary">
          <Share2 size={16} /> Share Portfolio
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center lg:col-span-1">
          <ScoreCard score={portfolioScore} label="Portfolio Score" size={180} />
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-ink-100">Generated Portfolio Description</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">
            Adamya Mehta is a full-stack developer with demonstrated strength in real-time
            systems and API design, evidenced by a project portfolio spanning Node.js backends,
            React front ends, and infrastructure-aware architecture decisions. Projects show
            consistent attention to maintainability, with room to grow in automated testing coverage.
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-semibold text-ink-100">Featured Projects</h2>
        <p className="mt-1 text-sm text-ink-500">
          Projects scoring 70+ are automatically eligible. Toggle which ones appear on your public page.
        </p>

        <div className="mt-5 flex flex-col divide-y divide-line-800">
          {mockProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-start justify-between gap-3 py-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink-100">{project.title}</p>
                <p className="text-xs text-ink-500">{project.category} · Score {project.overallScore}</p>
              </div>
              <label className="flex items-center gap-2 text-sm text-ink-300">
                <input
                  type="checkbox"
                  defaultChecked={project.overallScore >= 70}
                  className="h-4 w-4 rounded border-line-700 bg-base-900 text-accent-violet focus:ring-accent-violet/40"
                />
                Featured
              </label>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-cyan/15 text-accent-cyan">
            <Check size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-100">Your public portfolio is ready</p>
            <p className="text-xs text-ink-500">aicodereviewer.app/p/adamya-mehta</p>
          </div>
        </div>
        <button className="btn-secondary">Copy Link</button>
      </Card>
    </div>
  );
}
