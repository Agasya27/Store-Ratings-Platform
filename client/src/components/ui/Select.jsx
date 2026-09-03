import { cn } from '../../utils/cn';

export default function Select({ className, label, hint, error, id, children, ...props }) {
  const selectId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'h-11 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20',
          error ? 'border-danger' : 'border-border',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
