import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Github } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import { mockProjects } from '../../utils/mockData.js';

function scoreColor(score) {
  if (score >= 80) return 'text-accent-cyan bg-accent-cyan/15';
  if (score >= 60) return 'text-accent-amber bg-accent-amber/15';
  return 'text-accent-rose bg-accent-rose/15';
}

export default function MyProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">My Projects</h1>
          <p className="mt-1 text-sm text-ink-500">{mockProjects.length} projects submitted</p>
        </div>
        <Link to="/submit-project" className="btn-primary">
          <Plus size={16} /> Submit Project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-ink-100">{project.title}</h3>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${scoreColor(project.overallScore)}`}>
                  {project.overallScore}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-ink-500">{project.description}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span key={tech} className="rounded-md bg-base-800/80 px-2 py-1 text-xs text-ink-300">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line-800 pt-4">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-100"
                >
                  <Github size={14} /> Repository
                </a>
                <Link to={`/project/${project.id}`} className="text-sm font-medium text-accent-violet hover:underline">
                  View Review
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
