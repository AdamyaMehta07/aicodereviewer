import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ArrowRight, FolderGit2, TrendingUp, Star } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import ScoreCard from '../../components/common/ScoreCard.jsx';
import { PageLoader, InlineError } from '../../components/common/Spinner.jsx';
import { useProjects } from '../../hooks/useProjects.js';
import { useAuth } from '../../context/AuthContext.jsx';

function scoreColor(score) {
  if (score >= 80) return 'text-accent-cyan bg-accent-cyan/15';
  if (score >= 60) return 'text-accent-amber bg-accent-amber/15';
  return 'text-accent-rose bg-accent-rose/15';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: projects = [], isLoading, isError } = useProjects();

  const completed = projects.filter(p => p.status === 'completed');
  const avgScore = completed.length
    ? Math.round(completed.reduce((a, p) => a + (p.review?.overallScore || 0), 0) / completed.length)
    : 0;
  const bestScore = completed.length
    ? Math.max(...completed.map(p => p.review?.overallScore || 0))
    : 0;

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderGit2 },
    { label: 'Avg Score',      value: avgScore,         icon: TrendingUp },
    { label: 'Best Score',     value: bestScore,        icon: Star },
  ];

  if (isLoading) return <PageLoader />;
  if (isError)   return <InlineError message="Failed to load dashboard." />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-ink-500">Here's how your portfolio is looking.</p>
        </div>
        <Link to="/submit-project" className="btn-primary">
          <Plus size={16} /> Submit Project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
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
          <ScoreCard score={avgScore} label="Average Portfolio Score" size={180} />
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink-100">Recent Projects</h2>
            <Link to="/my-projects" className="flex items-center gap-1 text-sm font-medium text-accent-violet hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-3 py-8 text-center">
              <FolderGit2 size={32} className="text-ink-700" />
              <p className="text-sm text-ink-500">No projects yet. Submit your first GitHub repo!</p>
              <Link to="/submit-project" className="btn-primary">Submit Project</Link>
            </div>
          ) : (
            <div className="mt-4 flex flex-col divide-y divide-line-800">
              {projects.slice(0, 5).map((project) => (
                <Link key={project._id} to={`/project/${project._id}`}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-3.5 -mx-2 transition-colors hover:bg-base-800/40">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-100">{project.title}</p>
                    <p className="truncate text-xs text-ink-500">{project.category} · {project.status}</p>
                  </div>
                  {project.review ? (
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${scoreColor(project.review.overallScore)}`}>
                      {project.review.overallScore}
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-base-800 px-2.5 py-1 text-xs text-ink-500">
                      {project.status}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
