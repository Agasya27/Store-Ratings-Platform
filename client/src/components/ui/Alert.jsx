import { cn } from '../../utils/cn';

export default function Alert({ variant = 'error', children }) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border px-3 py-2 text-sm',
        variant === 'error' && 'border-red-200 bg-red-50 text-red-700',
        variant === 'success' && 'border-green-200 bg-green-50 text-green-700'
      )}
    >
      {children}
    </div>
  );
}
