import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { getHomePath } from '../../utils/routes';

const linkClass =
  'inline-flex h-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors';

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
        <Link to={isAuthenticated ? getHomePath(user.role) : '/login'} className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand text-sm text-white">
            SR
          </span>
          Store Ratings
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {isAuthenticated && user.role === 'ADMIN' && (
            <>
              <Link to="/admin/dashboard" className={cn(linkClass, 'text-muted hover:bg-slate-100 hover:text-foreground')}>
                Dashboard
              </Link>
              <Link to="/admin/stores" className={cn(linkClass, 'text-muted hover:bg-slate-100 hover:text-foreground')}>
                Stores
              </Link>
              <Link to="/admin/users" className={cn(linkClass, 'text-muted hover:bg-slate-100 hover:text-foreground')}>
                Users
              </Link>
            </>
          )}

          {isAuthenticated && user.role === 'NORMAL' && (
            <Link to="/stores" className={cn(linkClass, 'text-muted hover:bg-slate-100 hover:text-foreground')}>
              Browse stores
            </Link>
          )}

          {isAuthenticated && user.role === 'OWNER' && (
            <Link to="/owner/dashboard" className={cn(linkClass, 'text-muted hover:bg-slate-100 hover:text-foreground')}>
              My store
            </Link>
          )}

          {isAuthenticated && (
            <>
              <Link to="/account" className={cn(linkClass, 'text-muted hover:bg-slate-100 hover:text-foreground')}>
                Account
              </Link>
              <span className="hidden text-sm text-muted lg:inline">{user.email}</span>
              <button
                type="button"
                onClick={handleLogout}
                className={cn(linkClass, 'border border-border bg-white hover:bg-slate-50')}
              >
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Link to="/login" className={cn(linkClass, 'text-muted hover:bg-slate-100 hover:text-foreground')}>
                Login
              </Link>
              <Link to="/signup" className={cn(linkClass, 'bg-brand text-white hover:bg-brand-hover')}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
