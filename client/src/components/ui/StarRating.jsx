import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function StarRating({ value, onChange, size = 'md' }) {
  const sizes = { sm: 'size-5', md: 'size-7', lg: 'size-8' };

  return (
    <div className="flex gap-0.5" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onClick={() => onChange(star)}
          className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <Star
            className={cn(
              sizes[size],
              star <= value ? 'fill-accent text-accent' : 'fill-transparent text-border'
            )}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

export function StarDisplay({ value, size = 'sm' }) {
  const sizes = { sm: 'size-3.5', md: 'size-4' };
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizes[size],
            star <= Math.round(value) ? 'fill-accent text-accent' : 'fill-transparent text-border'
          )}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
