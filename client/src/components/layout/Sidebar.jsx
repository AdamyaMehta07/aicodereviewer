import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderGit2,
  FilePlus2,
  UserCircle2,
  Settings,
  GitBranch,
  X,
} from 'lucide-react';

const links = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Submit Project', to: '/submit-project', icon: FilePlus2 },
  { label: 'My Projects', to: '/my-projects', icon: FolderGit2 },
  { label: 'Portfolio Builder', to: '/portfolio-builder', icon: GitBranch },
  { label: 'Profile', to: '/profile', icon: UserCircle2 },
  { label: 'Settings', to: '/settings', icon: Settings },
];

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {links.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-accent-violet/15 text-accent-violet'
                : 'text-ink-300 hover:bg-base-800/60 hover:text-ink-100'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-line-800/60 bg-base-900/60 lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2 px-5 font-display text-lg font-semibold text-ink-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-violet/15 text-accent-violet">
            <GitBranch size={18} />
          </span>
          AiCodeReviewer
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <NavItems />
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col bg-base-900 border-r border-line-800/60 lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-5">
                <div className="flex items-center gap-2 font-display text-lg font-semibold text-ink-100">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-violet/15 text-accent-violet">
                    <GitBranch size={18} />
                  </span>
                  AiCodeReviewer
                </div>
                <button onClick={onClose} className="text-ink-300 hover:text-ink-100" aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <NavItems onNavigate={onClose} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
