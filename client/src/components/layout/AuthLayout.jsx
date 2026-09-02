import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-dvh bg-surface-muted lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-slate-900 px-10 py-16 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-teal-300">Store Ratings Platform</p>
          <h1 className="mt-6 max-w-md text-balance text-4xl font-semibold leading-tight">
            Discover stores. Share honest ratings. Manage with confidence.
          </h1>
          <p className="mt-4 max-w-md text-pretty text-slate-300">
            A role-based platform for admins, store owners, and everyday users to collaborate on store
            quality.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-slate-300">
          <li>Secure JWT authentication</li>
          <li>Role-aware dashboards</li>
          <li>Fast search and filtering</li>
        </ul>
      </section>

      <section className="flex min-h-dvh flex-col justify-center px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-lg font-semibold">
              <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand text-sm text-white">
                SR
              </span>
              Store Ratings
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-balance text-2xl font-semibold text-foreground">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>

          {children}
          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </div>
      </section>
    </div>
  );
}
