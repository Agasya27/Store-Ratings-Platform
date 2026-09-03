import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export default function QuickActionCard({ to, icon: Icon, title, description, accent = 'brand' }) {
  const accents = {
    brand: 'bg-brand-subtle text-brand group-hover:bg-brand group-hover:text-white',
    accent: 'bg-accent-subtle text-accent group-hover:bg-accent group-hover:text-white',
    muted: 'bg-surface-muted text-muted group-hover:bg-foreground group-hover:text-surface',
  };

  return (
    <Link
      to={to}
      className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm shadow-slate-200/40 transition-all hover:border-brand/30 hover:shadow-md"
    >
      <div
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors',
          accents[accent]
        )}
      >
        <Icon className="size-5" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="font-display font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
    </Link>
  );
}
