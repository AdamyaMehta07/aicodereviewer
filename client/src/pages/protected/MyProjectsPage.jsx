import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Github, Trash2, FolderGit2, Loader2 } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import { PageLoader, InlineError } from '../../components/common/Spinner.jsx';
import { useProjects, useDeleteProject } from '../../hooks/useProjects.js';

function scoreColor(score) {
  if (score >= 80) return 'text-accent-cyan bg-accent-cyan/15';
  if (score >= 60) return 'text-accent-amber bg-accent-amber/15';
  return 'text-accent-rose bg-accent-rose/15';
}

function statusBadge(status) {
  const map = {
    pending:   'bg-base-800 text-ink-500',
    analyzing: 'bg-accent-violet/15 text-accent-violet',
    completed: 'bg-accent-cyan/15 text-accent-cyan',
    failed:    'bg-accent-rose/15 text-accent-rose',
  };
  return map[status] || map.pending;
}

export default function MyProjectsPage() {
  const { data: projects = [], isLoading, isError } = useProjects();
  const deleteProject = useDeleteProject();

  if (isLoading) return <PageLoader />;
  if (isError)   return <InlineError message="Failed to load projects." />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">My Projects</h1>
          <p className="mt-1 text-sm text-ink-500">{projects.length} projects submitted</p>
        </div>
        <Link to="/submit-project" className="btn-primary">
          <Plus size={16} /> Submit Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 py-16 text-center">
          <FolderGit2 size={40} className="text-ink-700" />
          <div>
            <p className="text-base font-semibold text-ink-100">No projects yet</p>
            <p className="mt-1 text-sm text-ink-500">Submit a public GitHub repo to get your first AI review.</p>
          </div>
          <Link to="/submit-project" className="btn-primary">Submit Your First Project</Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div key={project._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-ink-100">{project.title}</h3>
                  {project.review ? (
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${scoreColor(project.review.overallScore)}`}>
                      {project.review.overallScore}
                    </span>
                  ) : (
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusBadge(project.status)}`}>
                      {project.status}
                    </span>
                  )}
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-ink-500">{project.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.techStack.map(tech => (
                    <span key={tech} className="rounded-md bg-base-800/80 px-2 py-1 text-xs text-ink-300">{tech}</span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line-800 pt-4">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-100">
                    <Github size={14} /> Repository
                  </a>
                  <div className="flex items-center gap-3">
                    <button onClick={() => deleteProject.mutate(project._id)}
                      disabled={deleteProject.isPending}
                      className="text-ink-700 hover:text-accent-rose transition-colors">
                      {deleteProject.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                    {project.status === 'completed' && (
                      <Link to={`/project/${project._id}`} className="text-sm font-medium text-accent-violet hover:underline">
                        View Review
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
