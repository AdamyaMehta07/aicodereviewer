import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Share2, Copy, CheckCheck } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import ScoreCard from '../../components/common/ScoreCard.jsx';
import { PageLoader, InlineError } from '../../components/common/Spinner.jsx';
import { usePortfolio, useUpdatePortfolio } from '../../hooks/usePortfolio.js';
import { useProjects } from '../../hooks/useProjects.js';

export default function PortfolioBuilderPage() {
  const { data: portfolio, isLoading: portfolioLoading, isError: portfolioError } = usePortfolio();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const updatePortfolio = useUpdatePortfolio();
  const [copied, setCopied] = useState(false);

  if (portfolioLoading || projectsLoading) return <PageLoader />;
  if (portfolioError) return <InlineError message="Failed to load portfolio." />;

  const featured = (portfolio?.featuredProjects || []).map(p => p._id || p);

  const toggleProject = (projectId) => {
    const current = featured.map(id => id.toString());
    const updated = current.includes(projectId.toString())
      ? current.filter(id => id !== projectId.toString())
      : [...current, projectId];
    updatePortfolio.mutate(updated);
  };

  const publicUrl = `aicodereviewer.app/p/${portfolio?.publicSlug || 'adamya-mehta'}`;

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedProjects = projects.filter(p => p.status === 'completed');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">Portfolio Builder</h1>
          <p className="mt-1 text-sm text-ink-500">Curate your strongest projects into a shareable portfolio.</p>
        </div>
        <button className="btn-primary" onClick={copyLink}>
          <Share2 size={16} /> Share Portfolio
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center lg:col-span-1">
          <ScoreCard score={portfolio?.portfolioScore || 0} label="Portfolio Score" size={180} />
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-ink-100">Portfolio Description</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">
            {portfolio?.generatedDescription ||
              'Adamya Mehta is a full-stack developer with demonstrated strength in real-time systems and API design. Submit and feature projects to generate a custom description.'}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-semibold text-ink-100">Your Projects</h2>
        <p className="mt-1 text-sm text-ink-500">Toggle which projects appear on your public portfolio page.</p>

        {completedProjects.length === 0 ? (
          <div className="mt-6 py-8 text-center">
            <p className="text-sm text-ink-500">No completed reviews yet. Submit a project to get started.</p>
          </div>
        ) : (
          <div className="mt-5 flex flex-col divide-y divide-line-800">
            {completedProjects.map((project, i) => {
              const isFeatured = featured.map(id => id.toString()).includes(project._id.toString());
              return (
                <motion.div key={project._id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex flex-col items-start justify-between gap-3 py-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-100">{project.title}</p>
                    <p className="text-xs text-ink-500">
                      {project.category} · Score {project.review?.overallScore || 0}
                    </p>
                  </div>
                  <button onClick={() => toggleProject(project._id)}
                    disabled={updatePortfolio.isPending}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isFeatured
                        ? 'border-accent-violet/50 bg-accent-violet/15 text-accent-violet'
                        : 'border-line-700 bg-base-800/60 text-ink-300 hover:text-ink-100'
                    }`}>
                    {isFeatured ? <><Check size={12} /> Featured</> : 'Add to Portfolio'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-cyan/15 text-accent-cyan">
            <Check size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-100">Your public portfolio is ready</p>
            <p className="text-xs text-ink-500">{publicUrl}</p>
          </div>
        </div>
        <button onClick={copyLink} className="btn-secondary">
          {copied ? <><CheckCheck size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
        </button>
      </Card>
    </div>
  );
}
