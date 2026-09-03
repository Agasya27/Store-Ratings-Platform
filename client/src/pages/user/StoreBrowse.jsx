import { useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import RatingPill from '../../components/ui/RatingPill';
import SortHeader from '../../components/ui/SortHeader';
import StarRating, { StarDisplay } from '../../components/ui/StarRating';
import { Table, TableBody, TableCell, TableData, TableHead, TableRow } from '../../components/ui/Table';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useSort } from '../../hooks/useSort';
import { listStores } from '../../api/stores';
import { submitRating, updateRating } from '../../api/ratings';
import { getApiError } from '../../utils/apiError';

function RatingControl({ store, onRated }) {
  const [value, setValue] = useState(store.user_rating || 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const hasRated = Boolean(store.user_rating);

  async function handleSave() {
    if (value < 1 || value > 5) {
      setError('Please select a rating between 1 and 5 stars.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (hasRated) {
        await updateRating(store.id, value);
      } else {
        await submitRating(store.id, value);
      }
      onRated();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 min-w-[180px]">
      <StarRating value={value} onChange={setValue} size="sm" />
      <Button
        type="button"
        variant={hasRated ? 'outline' : 'primary'}
        onClick={handleSave}
        loading={saving}
        disabled={saving || value === 0}
        className="w-full sm:w-auto"
      >
        {hasRated ? 'Update rating' : 'Submit rating'}
      </Button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

function StoreMobileCard({ store, onRated }) {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="font-display font-semibold text-foreground">{store.name}</h3>
        <p className="mt-1 text-sm text-muted">{store.address || 'No address listed'}</p>
      </div>
      <div className="flex flex-wrap gap-4">
        <RatingPill label="Community average" value={store.average_rating} variant="overall" />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Your rating</span>
          <div className="inline-flex items-center gap-2 rounded-lg border border-brand/20 bg-brand-subtle px-3 py-1.5">
            {store.user_rating ? (
              <>
                <StarDisplay value={store.user_rating} />
                <span className="text-sm font-semibold tabular-nums text-brand">{store.user_rating}</span>
              </>
            ) : (
              <span className="text-sm text-muted">Not rated yet</span>
            )}
          </div>
        </div>
      </div>
      <RatingControl store={store} onRated={onRated} />
    </Card>
  );
}

export default function StoreBrowse() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const { sortBy, sortOrder, toggleSort } = useSort('name', 'asc');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadStores() {
    setError('');
    setLoading(true);
    try {
      const res = await listStores({ ...filters, sortBy, sortOrder });
      setStores(res.data.stores);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStores();
  }, [sortBy, sortOrder]);

  return (
    <AppShell>
      <PageHeader
        section="Stores"
        title="Browse and rate stores"
        subtitle="Search by name or address, then submit your rating."
      />

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Store name" value={filters.name} onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))} />
          <Input label="Address" value={filters.address} onChange={(e) => setFilters((f) => ({ ...f, address: e.target.value }))} />
          <div className="flex items-end">
            <Button type="button" className="w-full md:w-auto" onClick={loadStores}>
              Search
            </Button>
          </div>
        </div>
      </Card>

      {error && <ErrorState message={error} onRetry={loadStores} />}

      {loading && (
        <Card>
          <TableSkeleton rows={5} cols={5} />
        </Card>
      )}

      {!loading && !error && stores.length === 0 && (
        <Card>
          <EmptyState
            icon={Store}
            title="No stores found"
            description="Try a different search or check back when new stores are added."
          />
        </Card>
      )}

      {!loading && !error && stores.length > 0 && (
        <>
          <div className="space-y-4 md:hidden">
            {stores.map((store) => (
              <StoreMobileCard key={store.id} store={store} onRated={loadStores} />
            ))}
          </div>

          <Card className="hidden md:block">
            <Table minWidth="800px">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <SortHeader label="Store name" column="name" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                  </TableCell>
                  <TableCell>
                    <SortHeader label="Address" column="address" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                  </TableCell>
                  <TableCell>
                    <SortHeader label="Community avg." column="average_rating" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                  </TableCell>
                  <TableCell className="font-medium text-muted">Your rating</TableCell>
                  <TableCell className="font-medium text-muted">Rate store</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id} className="align-top">
                    <TableData className="font-medium">{store.name}</TableData>
                    <TableData>{store.address || '—'}</TableData>
                    <TableData>
                      <div className="flex items-center gap-2">
                        <StarDisplay value={Number(store.average_rating)} />
                        <span className="tabular-nums font-medium">{store.average_rating}</span>
                      </div>
                    </TableData>
                    <TableData>
                      {store.user_rating ? (
                        <div className="flex items-center gap-2">
                          <StarDisplay value={store.user_rating} />
                          <span className="tabular-nums font-semibold text-brand">{store.user_rating}</span>
                        </div>
                      ) : (
                        <span className="text-muted">Not rated</span>
                      )}
                    </TableData>
                    <TableData>
                      <RatingControl store={store} onRated={loadStores} />
                    </TableData>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </AppShell>
  );
}
