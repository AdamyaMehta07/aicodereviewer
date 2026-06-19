import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, ArrowLeft, CheckCircle2, XCircle, Lightbulb, Users, Briefcase } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import ScoreCard from '../../components/common/ScoreCard.jsx';
import RadarChart from '../../components/charts/RadarChart.jsx';
import ScoreBreakdownList from '../../components/charts/ScoreBreakdownList.jsx';
import { mockProjects, mockReview } from '../../utils/mockData.js';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const project = mockProjects.find((p) => p.id === id) || mockProjects[0];
  const review = mockReview;

  return (
    <div className="flex flex-col gap-6">
      <Link to="/my-projects" className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-100">
        <ArrowLeft size={16} /> Back to projects
      </Link>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">{project.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-500">{project.description}</p>
        </div>
        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary shrink-0">
          <Github size={16} /> View Repository
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center lg:col-span-1">
          <ScoreCard score={review.overallScore} label="Overall Score" size={180} />
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-ink-100">Score Radar</h2>
          <RadarChart data={review.scores} />
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-semibold text-ink-100">Score Breakdown</h2>
        <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
          <ScoreBreakdownList items={review.scores.slice(0, 4)} />
          <ScoreBreakdownList items={review.scores.slice(4)} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <FeedbackPanel
          icon={CheckCircle2}
          iconClass="text-accent-cyan bg-accent-cyan/15"
          title="Strengths"
          items={review.strengths}
        />
        <FeedbackPanel
          icon={XCircle}
          iconClass="text-accent-rose bg-accent-rose/15"
          title="Weaknesses"
          items={review.weaknesses}
        />
        <FeedbackPanel
          icon={Lightbulb}
          iconClass="text-accent-amber bg-accent-amber/15"
          title="Recommendations"
          items={review.recommendations}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-violet/15 text-accent-violet">
              <Users size={16} />
            </span>
            <h2 className="text-base font-semibold text-ink-100">Recruiter Insights</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">{review.recruiterFeedback}</p>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-cyan/15 text-accent-cyan">
              <Briefcase size={16} />
            </span>
            <h2 className="text-base font-semibold text-ink-100">Portfolio Insights</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">{review.portfolioFeedback}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-semibold text-ink-100">Resume-Ready Summary</h2>
        <p className="mt-3 rounded-lg bg-base-900/60 p-4 text-sm leading-relaxed text-ink-300">
          {review.aiSummary}
        </p>
      </Card>
    </div>
  );
}

function FeedbackPanel({ icon: Icon, iconClass, title, items }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="h-full">
        <div className="flex items-center gap-2">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}>
            <Icon size={16} />
          </span>
          <h2 className="text-base font-semibold text-ink-100">{title}</h2>
        </div>
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed text-ink-300">
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
}
