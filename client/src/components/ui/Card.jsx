import { cn } from '../../utils/cn';

export default function Card({ className, children }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-surface p-6 shadow-sm shadow-slate-200/50',
        className
      )}
    >
      {children}
    </div>
  );
}
