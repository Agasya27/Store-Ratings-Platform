import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { getHomePath } from '../../utils/routes';
import Button from '../ui/Button';

const navLinkClass = (active) =>
  cn(
    'inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors',
    active ? 'bg-brand-subtle text-brand' : 'text-muted hover:bg-surface-muted hover:text-foreground'
  );

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/stores', label: 'Stores' },
    { to: '/admin/users', label: 'Users' },
  ];

  const roleLinks =
    user?.role === 'ADMIN'
      ? adminLinks
      : user?.role === 'NORMAL'
        ? [{ to: '/stores', label: 'Browse stores' }]
        : user?.role === 'OWNER'
          ? [{ to: '/owner/dashboard', label: 'My store' }]
          : [];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to={isAuthenticated ? getHomePath(user.role) : '/login'}
          className="flex items-center gap-2 font-display text-lg font-semibold text-foreground"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand text-sm text-white">
            SR
          </span>
          <span className="hidden sm:inline">Store Ratings</span>
        </Link>

        {isAuthenticated && (
          <nav className="hidden items-center gap-1 md:flex">
            {roleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={navLinkClass(location.pathname.startsWith(link.to))}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/account" className={navLinkClass(location.pathname === '/account')}>
              Account
            </Link>
            <span className="mx-2 hidden h-6 w-px bg-border lg:block" />
            <span className="hidden max-w-[180px] truncate text-sm text-muted lg:inline">{user.email}</span>
            <Button type="button" variant="secondary" onClick={handleLogout} className="ml-1">
              Logout
            </Button>
          </nav>
        )}

        {!isAuthenticated && (
          <nav className="hidden items-center gap-2 md:flex">
            <Link to="/login" className={navLinkClass(location.pathname === '/login')}>Login</Link>
            <Link to="/signup">
              <Button type="button" variant="primary">Sign up</Button>
            </Link>
          </nav>
        )}

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {isAuthenticated ? (
              <>
                {roleLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={navLinkClass(location.pathname.startsWith(link.to))}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className={navLinkClass(location.pathname === '/account')}
                >
                  Account
                </Link>
                <p className="px-3 py-2 text-xs text-muted truncate">{user.email}</p>
                <Button type="button" variant="secondary" className="mt-2 w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className={navLinkClass(false)}>
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className={navLinkClass(false)}>
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
