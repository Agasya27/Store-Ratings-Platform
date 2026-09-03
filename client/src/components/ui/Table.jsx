import { cn } from '../../utils/cn';

export function Table({ className, children, minWidth = '640px' }) {
  return (
    <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
      <table className={cn('w-full text-left text-sm', className)} style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }) {
  return (
    <thead className="sticky top-0 z-10 border-b border-border bg-surface-muted/95 backdrop-blur-sm">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return (
    <tbody className="[&_tr:nth-child(even)]:bg-surface-muted/40 [&_tr:hover]:bg-surface-muted/70">
      {children}
    </tbody>
  );
}

export function TableRow({ children, className }) {
  return <tr className={cn('border-b border-border-subtle transition-colors', className)}>{children}</tr>;
}

export function TableCell({ children, className }) {
  return <th className={cn('px-4 py-3', className)}>{children}</th>;
}

export function TableData({ children, className }) {
  return <td className={cn('px-4 py-3', className)}>{children}</td>;
}
