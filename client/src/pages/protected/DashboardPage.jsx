import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ArrowRight, FolderGit2, TrendingUp, Star } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import ScoreCard from '../../components/common/ScoreCard.jsx';
import { mockProjects } from '../../utils/mockData.js';

const stats = [
  { label: 'Total Projects', value: mockProjects.length, icon: FolderGit2 },
  { label: 'Avg Score', value: Math.round(mockProjects.reduce((a, p) => a + p.overallScore, 0) / mockProjects.length), icon: TrendingUp },
  { label: 'Best Score', value: Math.max(...mockProjects.map((p) => p.overallScore)), icon: Star },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-500">Here's how your portfolio is looking.</p>
        </div>
        <Link to="/submit-project" className="btn-primary">
          <Plus size={16} /> Submit Project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-violet/15 text-accent-violet">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-xs text-ink-500">{label}</p>
                <p className="font-display text-2xl font-bold text-ink-100">{value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center lg:col-span-1">
          <ScoreCard score={stats[1].value} label="Average Portfolio Score" size={180} />
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink-100">Recent Projects</h2>
            <Link to="/my-projects" className="flex items-center gap-1 text-sm font-medium text-accent-violet hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-4 flex flex-col divide-y divide-line-800">
            {mockProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="flex items-center justify-between gap-3 py-3.5 transition-colors hover:bg-base-800/40 rounded-lg px-2 -mx-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-100">{project.title}</p>
                  <p className="truncate text-xs text-ink-500">{project.category}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    project.overallScore >= 80
                      ? 'bg-accent-cyan/15 text-accent-cyan'
                      : project.overallScore >= 60
                      ? 'bg-accent-amber/15 text-accent-amber'
                      : 'bg-accent-rose/15 text-accent-rose'
                  }`}
                >
                  {project.overallScore}
                </span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
