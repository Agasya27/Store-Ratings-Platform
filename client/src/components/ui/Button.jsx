import { cn } from '../../utils/cn';
import Spinner from './Spinner';

const variants = {
  primary:
    'bg-brand text-white hover:bg-brand-hover focus-visible:ring-brand/30 disabled:bg-brand/60',
  secondary:
    'border border-border bg-surface text-foreground hover:bg-surface-muted focus-visible:ring-slate-300',
  outline:
    'border-2 border-brand bg-transparent text-brand hover:bg-brand-subtle focus-visible:ring-brand/20',
  ghost: 'text-muted hover:bg-surface-muted hover:text-foreground focus-visible:ring-slate-300',
  danger: 'bg-danger text-white hover:bg-red-700 focus-visible:ring-red-300',
};

export default function Button({
  className,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      {loading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  );
}
