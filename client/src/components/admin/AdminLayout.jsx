import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';

export function StatCard({ label, value }) {
  return (
    <Card>
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">{value}</p>
    </Card>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-brand">Admin</p>
        <h1 className="mt-1 text-balance text-3xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-2 text-pretty text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageShell({ children }) {
  return <AppShell>{children}</AppShell>;
}
