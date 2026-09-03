import { useEffect, useState } from 'react';
import { Star, Store, Users } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import PageHeader from '../../components/ui/PageHeader';
import SortHeader from '../../components/ui/SortHeader';
import StatCard from '../../components/ui/StatCard';
import { Table, TableBody, TableCell, TableData, TableHead, TableRow } from '../../components/ui/Table';
import { StatCardsSkeleton, TableSkeleton } from '../../components/ui/Skeleton';
import { useSort } from '../../hooks/useSort';
import { getOwnerDashboard } from '../../api/owner';
import { getApiError } from '../../utils/apiError';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { sortBy, sortOrder, toggleSort } = useSort('created_at', 'desc');

  async function load() {
    setError('');
    setLoading(true);
    try {
      const res = await getOwnerDashboard({ sortBy, sortOrder });
      setData(res.data);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [sortBy, sortOrder]);

  return (
    <AppShell>
      <PageHeader
        section="Owner"
        title="Store dashboard"
        subtitle="See who rated your store and your average score."
      />

      {loading && (
        <>
          <StatCardsSkeleton count={3} />
          <Card className="mt-6">
            <TableSkeleton rows={5} cols={4} />
          </Card>
        </>
      )}

      {error && !loading && <ErrorState message={error} onRetry={load} />}

      {data && !loading && !error && !data.store && (
        <Card>
          <EmptyState
            icon={Store}
            title="No store assigned"
            description={data.message || 'No store is assigned to your account yet. Contact an administrator.'}
          />
        </Card>
      )}

      {data?.store && !loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Your store" value={data.store.name} icon={Store} accent="muted" compact />
            <StatCard label="Average rating" value={data.store.average_rating} icon={Star} accent="accent" />
            <StatCard label="Total ratings" value={data.store.rating_count} icon={Users} accent="brand" />
          </div>

          <Card className="mt-6">
            <h2 className="font-display text-lg font-semibold">Users who rated your store</h2>

            {data.raters.length === 0 && (
              <EmptyState
                icon={Users}
                title="No ratings yet"
                description="When customers rate your store, they'll appear here."
              />
            )}

            {data.raters.length > 0 && (
              <>
                <div className="mt-4 space-y-4 md:hidden">
                  {data.raters.map((rater) => (
                    <div
                      key={`${rater.id}-${rater.created_at}`}
                      className="rounded-lg border border-border-subtle bg-surface-muted/50 p-4"
                    >
                      <p className="font-medium">{rater.name}</p>
                      <p className="text-sm text-muted">{rater.email}</p>
                      <div className="mt-2 flex justify-between text-sm">
                        <span className="tabular-nums font-semibold text-accent">{rater.rating} ★</span>
                        <span className="tabular-nums text-muted">
                          {new Date(rater.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 hidden md:block">
                  <Table minWidth="640px">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <SortHeader label="Name" column="name" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                        </TableCell>
                        <TableCell>
                          <SortHeader label="Email" column="email" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                        </TableCell>
                        <TableCell>
                          <SortHeader label="Rating" column="rating" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                        </TableCell>
                        <TableCell>
                          <SortHeader label="Rated on" column="created_at" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.raters.map((rater) => (
                        <TableRow key={`${rater.id}-${rater.created_at}`}>
                          <TableData className="font-medium">{rater.name}</TableData>
                          <TableData>{rater.email}</TableData>
                          <TableData className="tabular-nums font-semibold text-accent">{rater.rating}</TableData>
                          <TableData className="tabular-nums text-muted">
                            {new Date(rater.created_at).toLocaleDateString()}
                          </TableData>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </Card>
        </>
      )}
    </AppShell>
  );
}
