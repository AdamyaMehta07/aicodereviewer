import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Github, ShieldCheck, Gauge, FileSearch, Sparkles } from 'lucide-react';

const steps = [
  { title: 'Connect your repo', desc: 'Paste a GitHub URL and we fetch the metadata, file tree, and source files automatically.' },
  { title: 'AI reads your code', desc: 'Groq-powered analysis scores quality, security, architecture, and more in seconds.' },
  { title: 'Get a portfolio asset', desc: 'Walk away with a recruiter-ready summary and a dashboard you can share.' },
];

const features = [
  { icon: FileSearch, title: 'Deep Code Analysis', desc: 'Architecture, performance, and maintainability scoring across your whole repo.' },
  { icon: ShieldCheck, title: 'Security Recommendations', desc: 'Catch risky patterns before a recruiter or teammate does.' },
  { icon: Gauge, title: 'Portfolio Readiness', desc: 'Know exactly how your project reads to someone hiring for your role.' },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-aurora" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-grid-fade" />

      <section className="container-page flex flex-col items-center pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-eyebrow mb-5 flex items-center gap-2 rounded-full border border-line-800 bg-base-900/60 px-4 py-1.5"
        >
          <Sparkles size={14} /> AI Code Review, in your pocket
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl text-4xl font-bold leading-tight text-ink-100 sm:text-5xl lg:text-6xl"
        >
          Turn your GitHub repos into a{' '}
          <span className="bg-gradient-to-r from-accent-violet to-accent-cyan bg-clip-text text-transparent">
            recruiter-ready portfolio
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-xl text-base text-ink-300 sm:text-lg"
        >
          Submit a repository, get an AI-generated review covering code quality, security,
          architecture, and recruiter perspective — all in one dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Review my project <ArrowRight size={18} />
          </Link>
          <Link to="/features" className="btn-secondary px-6 py-3 text-base">
            See how it works
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-panel mt-16 w-full max-w-3xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 border-b border-line-800 pb-3">
            <Github size={16} className="text-ink-500" />
            <span className="text-sm text-ink-500">github.com/adamyamehta/realtime-chat</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {['Code Quality', 'Security', 'Architecture', 'Portfolio'].map((label, i) => (
              <div key={label} className="rounded-lg bg-base-900/60 p-3 text-left">
                <p className="text-xs text-ink-500">{label}</p>
                <p className="mt-1 font-display text-xl font-bold text-accent-cyan">
                  {[88, 76, 91, 84][i]}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <p className="section-eyebrow text-center">How it works</p>
        <h2 className="mt-3 text-center text-2xl font-bold text-ink-100 sm:text-3xl">
          From repo link to portfolio piece
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <Card key={step.title} index={i} {...step} />
          ))}
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <p className="section-eyebrow text-center">What you get</p>
        <h2 className="mt-3 text-center text-2xl font-bold text-ink-100 sm:text-3xl">
          A complete picture of your project
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-panel p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-violet/15 text-accent-violet">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink-100">{title}</h3>
              <p className="mt-2 text-sm text-ink-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="glass-panel flex flex-col items-center gap-5 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-ink-100 sm:text-3xl">Ready to see your score?</h2>
          <p className="max-w-md text-sm text-ink-300 sm:text-base">
            Submit a public repo and your first review is ready in under two minutes.
          </p>
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Card({ title, desc, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel p-6"
    >
      <span className="font-display text-sm font-semibold text-accent-violet">
        0{index + 1}
      </span>
      <h3 className="mt-3 text-lg font-semibold text-ink-100">{title}</h3>
      <p className="mt-2 text-sm text-ink-500">{desc}</p>
    </motion.div>
  );
}
