import { cn } from '../../utils/cn';

export default function Card({ className, children, noPadding }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface shadow-sm shadow-slate-200/40',
        !noPadding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
