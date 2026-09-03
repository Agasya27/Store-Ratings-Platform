import { cn } from '../../utils/cn';

export default function RatingPill({ label, value, variant = 'overall' }) {
  const variants = {
    overall: 'bg-surface-muted border-border text-foreground',
    yours: 'bg-brand-subtle border-brand/20 text-brand',
    none: 'bg-surface-muted border-border text-muted',
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold tabular-nums',
          variants[variant]
        )}
      >
        {value ?? '—'}
      </div>
    </div>
  );
}
