import { cn } from '../../utils/cn';

const styles = {
  ADMIN: 'bg-foreground text-surface',
  NORMAL: 'bg-brand-subtle text-brand',
  OWNER: 'bg-accent-subtle text-accent-hover',
};

export default function Badge({ role }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
        styles[role] || 'bg-surface-muted text-muted'
      )}
    >
      {role}
    </span>
  );
}
