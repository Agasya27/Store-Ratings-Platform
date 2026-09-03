import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader, PageShell } from '../../components/admin/AdminLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ErrorState from '../../components/ui/ErrorState';
import { CardGridSkeleton } from '../../components/ui/Skeleton';
import { getUser } from '../../api/admin';
import { getApiError } from '../../utils/apiError';

export default function UserDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setError('');
    setLoading(true);
    try {
      const res = await getUser(id);
      setDetail(res.data);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  return (
    <PageShell>
      <PageHeader
        section="Admin"
        title="User detail"
        subtitle={`Profile for user #${id}`}
        action={
          <Link to="/admin/users">
            <Button type="button" variant="secondary">← Back to users</Button>
          </Link>
        }
      />

      {loading && <CardGridSkeleton count={2} />}
      {error && !loading && <ErrorState message={error} onRetry={load} />}

      {detail && !loading && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold">{detail.user.name}</h2>
                <p className="mt-1 text-sm text-muted">{detail.user.email}</p>
              </div>
              <Badge role={detail.user.role} />
            </div>
            <dl className="mt-6 space-y-4">
              <div className="rounded-lg bg-surface-muted px-4 py-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">Address</dt>
                <dd className="mt-1 text-sm">{detail.user.address || 'Not provided'}</dd>
              </div>
              <div className="rounded-lg bg-surface-muted px-4 py-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">Member since</dt>
                <dd className="mt-1 text-sm tabular-nums">
                  {new Date(detail.user.created_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </Card>

          {detail.user.role === 'OWNER' && (
            <Card>
              <h2 className="font-display text-lg font-semibold">Owned store</h2>
              {detail.ownedStore ? (
                <dl className="mt-4 space-y-4">
                  <div className="rounded-lg bg-surface-muted px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">Store</dt>
                    <dd className="mt-1 text-sm font-medium">{detail.ownedStore.name}</dd>
                  </div>
                  <div className="rounded-lg bg-surface-muted px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">Average rating</dt>
                    <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                      {detail.ownedStore.average_rating}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-surface-muted px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted">Total ratings</dt>
                    <dd className="mt-1 text-sm tabular-nums">{detail.ownedStore.rating_count}</dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-4 text-sm text-muted">No store assigned to this owner yet.</p>
              )}
            </Card>
          )}
        </div>
      )}
    </PageShell>
  );
}
