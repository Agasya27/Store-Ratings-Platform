import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Banner({ variant = 'success', children, onDismiss, autoHideMs = 5000 }) {
  useEffect(() => {
    if (!onDismiss || !autoHideMs) return;
    const timer = setTimeout(onDismiss, autoHideMs);
    return () => clearTimeout(timer);
  }, [onDismiss, autoHideMs]);

  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3 text-sm',
        variant === 'success' && 'border-green-200 bg-success-subtle text-green-800',
        variant === 'error' && 'border-red-200 bg-danger-subtle text-red-800'
      )}
    >
      {variant === 'success' && <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
      <p className="flex-1">{children}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md p-0.5 opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
