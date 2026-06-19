import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-line-800/60 bg-base-950/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3 sm:gap-4">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-300 hover:bg-base-800/60 hover:text-ink-100" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-violet/20 text-sm font-semibold text-accent-violet">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="hidden text-sm font-medium text-ink-100 sm:block">
            {user?.name || 'Adamya Mehta'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-300 hover:bg-base-800/60 hover:text-ink-100"
          aria-label="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
