import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-muted">
        <Icon className="size-6" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
    </div>
  );
}
