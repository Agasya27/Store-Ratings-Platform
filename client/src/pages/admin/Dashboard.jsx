import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Plus,
  Star,
  Store,
  UserPlus,
  Users,
} from 'lucide-react';
import { PageHeader, PageShell, StatCard } from '../../components/admin/AdminLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ErrorState from '../../components/ui/ErrorState';
import QuickActionCard from '../../components/ui/QuickActionCard';
import { Table, TableBody, TableCell, TableData, TableHead, TableRow } from '../../components/ui/Table';
import { CardGridSkeleton, StatCardsSkeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { getDashboard, listStores, listUsers } from '../../api/admin';
import { getApiError } from '../../utils/apiError';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentStores, setRecentStores] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setError('');
    setLoading(true);
    try {
      const [dashboardRes, usersRes, storesRes] = await Promise.all([
        getDashboard(),
        listUsers({ sortBy: 'created_at', sortOrder: 'desc', limit: 5 }),
        listStores({ sortBy: 'created_at', sortOrder: 'desc', limit: 5 }),
      ]);
      setStats(dashboardRes.data);
      setRecentUsers(usersRes.data.users);
      setRecentStores(storesRes.data.stores);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const ratingsPerStore =
    stats && stats.stores > 0 ? (stats.ratings / stats.stores).toFixed(1) : '0';

  return (
    <PageShell>
      <PageHeader section="Admin" title="Dashboard" subtitle="Platform-wide overview" />

      {loading && (
        <div className="space-y-6">
          <StatCardsSkeleton />
          <CardGridSkeleton count={2} />
        </div>
      )}

      {error && !loading && <ErrorState message={error} onRetry={load} />}

      {stats && !loading && (
        <div className="space-y-6">
          <Card className="border-brand/20 bg-gradient-to-br from-brand-subtle/80 via-surface to-surface">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-brand">Welcome back</p>
                <h2 className="mt-1 font-display text-xl font-semibold text-foreground sm:text-2xl">
                  {user?.name || 'Administrator'}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-muted">
                  You have <strong className="text-foreground">{stats.users}</strong> users across{' '}
                  <strong className="text-foreground">{stats.stores}</strong> stores with{' '}
                  <strong className="text-foreground">{stats.ratings}</strong> ratings submitted so far.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="primary" onClick={() => navigate('/admin/users')}>
                  <UserPlus className="size-4" />
                  Add user
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/admin/stores')}>
                  <Plus className="size-4" />
                  Add store
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total users" value={stats.users} icon={Users} accent="brand" />
            <StatCard label="Total stores" value={stats.stores} icon={Store} accent="muted" />
            <StatCard label="Total ratings" value={stats.ratings} icon={Star} accent="accent" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              to="/admin/users"
              icon={Users}
              title="Manage users"
              description="View, filter, and create platform accounts"
            />
            <QuickActionCard
              to="/admin/stores"
              icon={Store}
              title="Manage stores"
              description="Add stores and assign owners"
              accent="muted"
            />
            <QuickActionCard
              to="/admin/users"
              icon={UserPlus}
              title="Create user"
              description="Add admin, normal, or owner accounts"
              accent="brand"
            />
            <QuickActionCard
              to="/admin/stores"
              icon={Plus}
              title="Create store"
              description="Register a new store on the platform"
              accent="accent"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-lg font-semibold">Recent users</h2>
                <Link
                  to="/admin/users"
                  className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-hover"
                >
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              {recentUsers.length === 0 ? (
                <p className="mt-6 text-sm text-muted">No users yet. Create your first user to get started.</p>
              ) : (
                <div className="mt-4">
                  <Table minWidth="480px">
                    <TableHead>
                      <TableRow>
                        <TableCell className="font-medium text-muted">Name</TableCell>
                        <TableCell className="font-medium text-muted">Role</TableCell>
                        <TableCell className="font-medium text-muted">Joined</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableData>
                            <Link
                              to={`/admin/users/${u.id}`}
                              className="font-medium text-foreground hover:text-brand"
                            >
                              {u.name}
                            </Link>
                            <p className="text-xs text-muted">{u.email}</p>
                          </TableData>
                          <TableData><Badge role={u.role} /></TableData>
                          <TableData className="tabular-nums text-muted">
                            {new Date(u.created_at).toLocaleDateString()}
                          </TableData>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>

            <div className="space-y-6">
              <Card>
                <h2 className="font-display text-lg font-semibold">Platform snapshot</h2>
                <dl className="mt-4 space-y-4">
                  <div className="flex justify-between gap-4 rounded-lg bg-surface-muted px-4 py-3">
                    <dt className="text-sm text-muted">Avg. ratings / store</dt>
                    <dd className="text-sm font-semibold tabular-nums">{ratingsPerStore}</dd>
                  </div>
                  <div className="flex justify-between gap-4 rounded-lg bg-surface-muted px-4 py-3">
                    <dt className="text-sm text-muted">Users per store</dt>
                    <dd className="text-sm font-semibold tabular-nums">
                      {stats.stores > 0 ? (stats.users / stats.stores).toFixed(1) : '—'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 rounded-lg bg-surface-muted px-4 py-3">
                    <dt className="text-sm text-muted">Rating coverage</dt>
                    <dd className="text-sm font-semibold tabular-nums">
                      {stats.ratings > 0 ? 'Active' : 'No ratings yet'}
                    </dd>
                  </div>
                </dl>

                {stats.ratings === 0 && (
                  <p className="mt-4 rounded-lg border border-accent/30 bg-accent-subtle/50 px-4 py-3 text-sm text-foreground">
                    <Star className="mb-1 inline size-4 text-accent" />
                    Ratings will appear once normal users browse stores and submit scores.
                  </p>
                )}
              </Card>

              <Card>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-display text-lg font-semibold">Recent stores</h2>
                  <Link
                    to="/admin/stores"
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-hover"
                  >
                    View all
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                {recentStores.length === 0 ? (
                  <p className="mt-4 text-sm text-muted">No stores registered yet.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {recentStores.map((store) => (
                      <li
                        key={store.id}
                        className="rounded-lg border border-border-subtle bg-surface-muted/50 px-4 py-3"
                      >
                        <p className="font-medium text-foreground">{store.name}</p>
                        <div className="mt-1 flex items-center justify-between text-sm">
                          <span className="text-muted truncate">{store.address || 'No address'}</span>
                          <span className="shrink-0 tabular-nums font-medium text-accent">
                            {store.average_rating} ★
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
