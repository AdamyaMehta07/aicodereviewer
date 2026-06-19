import { Link } from 'react-router-dom';
import { GitBranch } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-line-800/60 bg-base-950">
      <div className="container-page grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-ink-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-violet/15 text-accent-violet">
              <GitBranch size={18} />
            </span>
            AiCodeReviewer
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            AI-generated code reviews that turn your repos into recruiter-ready portfolio pieces.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-100">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link to="/features" className="hover:text-ink-100">Features</Link></li>
            <li><Link to="/register" className="hover:text-ink-100">Get Started</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-100">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><a href="#" className="hover:text-ink-100">About</a></li>
            <li><a href="#" className="hover:text-ink-100">Blog</a></li>
            <li><a href="#" className="hover:text-ink-100">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-100">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><a href="#" className="hover:text-ink-100">Privacy</a></li>
            <li><a href="#" className="hover:text-ink-100">Terms</a></li>
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-col items-center justify-between gap-3 border-t border-line-800/60 py-6 text-xs text-ink-700 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} AiCodeReviewer. All rights reserved.</p>
        <p>Built for developers, by developers.</p>
      </div>
    </footer>
  );
}
