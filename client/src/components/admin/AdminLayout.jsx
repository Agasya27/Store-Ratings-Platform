import AppShell from '../../components/layout/AppShell';
import PageHeader from '../../components/ui/PageHeader';

export function PageShell({ children }) {
  return <AppShell>{children}</AppShell>;
}

export { default as PageHeader } from '../../components/ui/PageHeader';
export { default as StatCard } from '../../components/ui/StatCard';
