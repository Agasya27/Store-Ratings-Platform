import { cn } from '../../utils/cn';

export default function Spinner({ className, size = 'md' }) {
  const sizes = {
    sm: 'size-4 border-2',
    md: 'size-5 border-2',
    lg: 'size-8 border-[3px]',
  };

  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        sizes[size],
        className
      )}
      aria-hidden="true"
    />
  );
}
