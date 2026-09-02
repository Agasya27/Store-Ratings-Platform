import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const linkButton =
  'inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="border-b border-border bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand text-sm text-white">
            SR
          </span>
          Store Ratings
        </Link>

        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-muted sm:inline">{user.email}</span>
              <button
                type="button"
                onClick={handleLogout}
                className={cn(linkButton, 'border border-border bg-white hover:bg-slate-50')}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={cn(linkButton, 'text-muted hover:bg-slate-100 hover:text-foreground')}
              >
                Login
              </Link>
              <Link to="/signup" className={cn(linkButton, 'bg-brand text-white hover:bg-brand-hover')}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
