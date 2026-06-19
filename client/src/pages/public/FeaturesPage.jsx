import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Gauge,
  FileSearch,
  Layers,
  BookOpen,
  TrendingUp,
  Users,
  FileText,
} from 'lucide-react';

const categories = [
  { icon: FileSearch, title: 'Code Quality', desc: 'Readability, consistency, and adherence to language idioms across your codebase.' },
  { icon: Layers, title: 'Architecture', desc: 'How well your project is structured, separated into layers, and organized for growth.' },
  { icon: ShieldCheck, title: 'Security', desc: 'Common vulnerability patterns, secrets handling, and dependency risk flags.' },
  { icon: Gauge, title: 'Performance', desc: 'Bottlenecks, inefficient patterns, and opportunities to speed things up.' },
  { icon: TrendingUp, title: 'Scalability', desc: 'How your design choices hold up as data, traffic, or team size grows.' },
  { icon: BookOpen, title: 'Documentation', desc: 'README quality, inline comments, and onboarding friction for new contributors.' },
  { icon: Users, title: 'Recruiter Perspective', desc: 'A plain-language read on how a hiring manager would size up this project.' },
  { icon: FileText, title: 'Resume Summary', desc: 'A ready-to-paste project description tuned for resumes and portfolios.' },
];

export default function FeaturesPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-eyebrow">Everything in one review</p>
        <h1 className="mt-3 text-3xl font-bold text-ink-100 sm:text-4xl">
          Nine angles on your project, generated in one pass
        </h1>
        <p className="mt-4 text-ink-300">
          Every submission runs through the same structured analysis, so you can compare
          projects apples-to-apples and track improvement over time.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 4) * 0.07 }}
            className="glass-panel p-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-violet/15 text-accent-violet">
              <Icon size={20} />
            </span>
            <h3 className="mt-4 text-base font-semibold text-ink-100">{title}</h3>
            <p className="mt-2 text-sm text-ink-500">{desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 glass-panel flex flex-col items-center gap-4 p-8 text-center sm:p-12">
        <h2 className="text-xl font-bold text-ink-100 sm:text-2xl">
          See it on your own repository
        </h2>
        <p className="max-w-md text-sm text-ink-300">
          Submit a public GitHub URL and watch the dashboard populate in real time.
        </p>
        <a href="/register" className="btn-primary px-6 py-3 text-base">
          Get Started
        </a>
      </div>
    </div>
  );
}
