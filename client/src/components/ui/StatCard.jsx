import { cn } from '../../utils/cn';

export default function StatCard({ label, value, icon: Icon, accent = 'brand', compact = false }) {
  const accents = {
    brand: 'bg-brand-subtle text-brand',
    accent: 'bg-accent-subtle text-accent',
    muted: 'bg-surface-muted text-muted',
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm shadow-slate-200/40">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">{label}</p>
          <p
            className={cn(
              'mt-2 font-display font-semibold text-foreground',
              compact ? 'text-lg truncate' : 'text-3xl tabular-nums'
            )}
          >
            {value}
          </p>
        </div>
        {Icon && (
          <div className={cn('flex size-10 items-center justify-center rounded-lg', accents[accent])}>
            <Icon className="size-5" strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
}
