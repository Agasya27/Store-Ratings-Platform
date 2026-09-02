import { useEffect, useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Alert from '../../components/ui/Alert';
import Card from '../../components/ui/Card';
import { getOwnerDashboard } from '../../api/owner';
import { getApiError } from '../../utils/apiError';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getOwnerDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(getApiError(err)));
  }, []);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm font-medium text-brand">Owner</p>
        <h1 className="mt-1 text-balance text-3xl font-semibold">Store dashboard</h1>
        <p className="mt-2 text-pretty text-muted">See who rated your store and your average score.</p>
      </div>

      {error && <Alert>{error}</Alert>}

      {data && !data.store && (
        <Card>
          <p className="text-muted">{data.message || 'No store assigned to your account yet.'}</p>
        </Card>
      )}

      {data?.store && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-sm text-muted">Store</p>
              <p className="mt-2 text-lg font-semibold">{data.store.name}</p>
            </Card>
            <Card>
              <p className="text-sm text-muted">Average rating</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{data.store.average_rating}</p>
            </Card>
            <Card>
              <p className="text-sm text-muted">Total ratings</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{data.store.rating_count}</p>
            </Card>
          </div>

          <Card className="overflow-x-auto">
            <h2 className="text-lg font-semibold">Users who rated your store</h2>
            <table className="mt-4 w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="px-2 py-3 font-medium">Name</th>
                  <th className="px-2 py-3 font-medium">Email</th>
                  <th className="px-2 py-3 font-medium">Rating</th>
                  <th className="px-2 py-3 font-medium">Rated on</th>
                </tr>
              </thead>
              <tbody>
                {data.raters.map((rater) => (
                  <tr key={`${rater.id}-${rater.created_at}`} className="border-b border-border/70">
                    <td className="px-2 py-3 font-medium">{rater.name}</td>
                    <td className="px-2 py-3">{rater.email}</td>
                    <td className="px-2 py-3 tabular-nums">{rater.rating}</td>
                    <td className="px-2 py-3 tabular-nums">
                      {new Date(rater.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {data.raters.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-2 py-8 text-center text-muted">
                      No ratings yet for your store.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </AppShell>
  );
}
