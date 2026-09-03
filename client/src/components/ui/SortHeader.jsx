import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function SortHeader({ label, column, sortBy, sortOrder, onSort }) {
  const active = sortBy === column;

  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={cn(
        'inline-flex items-center gap-1 font-medium transition-colors hover:text-foreground',
        active ? 'text-foreground' : 'text-muted'
      )}
    >
      {label}
      {active ? (
        sortOrder === 'asc' ? (
          <ChevronUp className="size-4" aria-hidden />
        ) : (
          <ChevronDown className="size-4" aria-hidden />
        )
      ) : (
        <ChevronsUpDown className="size-4 opacity-50" aria-hidden />
      )}
    </button>
  );
}
