import { cn } from '../../utils/cn';

export default function Input({ className, label, hint, error, id, ...props }) {
  const inputId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20',
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-border',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
