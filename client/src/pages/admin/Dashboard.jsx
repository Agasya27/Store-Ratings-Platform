import { useEffect, useState } from 'react';
import { PageHeader, PageShell, StatCard } from '../../components/admin/AdminLayout';
import Alert from '../../components/ui/Alert';
import { getDashboard } from '../../api/admin';
import { getApiError } from '../../utils/apiError';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(getApiError(err)));
  }, []);

  return (
    <PageShell>
      <PageHeader title="Dashboard" subtitle="Platform-wide overview" />
      {error && <Alert>{error}</Alert>}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total users" value={stats.users} />
          <StatCard label="Total stores" value={stats.stores} />
          <StatCard label="Total ratings" value={stats.ratings} />
        </div>
      )}
    </PageShell>
  );
}
