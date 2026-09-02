import { cn } from '../../utils/cn';

const variants = {
  primary:
    'bg-brand text-white hover:bg-brand-hover focus-visible:ring-brand/30 disabled:bg-brand/60',
  secondary:
    'border border-border bg-white text-foreground hover:bg-slate-50 focus-visible:ring-slate-300',
  ghost: 'text-muted hover:bg-slate-100 hover:text-foreground focus-visible:ring-slate-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300',
};

export default function Button({ className, variant = 'primary', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
