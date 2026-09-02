import { cn } from '../../utils/cn';

const styles = {
  ADMIN: 'bg-slate-900 text-white',
  NORMAL: 'bg-teal-100 text-teal-800',
  OWNER: 'bg-amber-100 text-amber-800',
};

export default function Badge({ role }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
        styles[role] || 'bg-slate-100 text-slate-700'
      )}
    >
      {role}
    </span>
  );
}
