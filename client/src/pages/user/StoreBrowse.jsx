import { useEffect, useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { listStores } from '../../api/stores';
import { submitRating, updateRating } from '../../api/ratings';
import { getApiError } from '../../utils/apiError';

function RatingControl({ store, onRated }) {
  const [value, setValue] = useState(store.user_rating || 3);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      if (store.user_rating) {
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
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <select
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="h-10 rounded-lg border border-border bg-white px-3 text-sm"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} star{n > 1 ? 's' : ''}
          </option>
        ))}
      </select>
      <Button type="button" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : store.user_rating ? 'Update rating' : 'Submit rating'}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function StoreBrowse() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [error, setError] = useState('');

  async function loadStores() {
    setError('');
    try {
      const res = await listStores(filters);
      setStores(res.data.stores);
    } catch (err) {
      setError(getApiError(err));
    }
  }

  useEffect(() => {
    loadStores();
  }, []);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm font-medium text-brand">Stores</p>
        <h1 className="mt-1 text-balance text-3xl font-semibold">Browse and rate stores</h1>
        <p className="mt-2 text-pretty text-muted">Search by name or address, then submit your rating.</p>
      </div>

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

      {error && <Alert>{error}</Alert>}

      <div className="grid gap-4">
        {stores.map((store) => (
          <Card key={store.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold">{store.name}</h2>
                <p className="mt-1 text-sm text-muted">{store.address || 'No address listed'}</p>
                <div className="mt-3 flex gap-4 text-sm">
                  <span>
                    Avg rating: <strong className="tabular-nums">{store.average_rating}</strong>
                  </span>
                  <span>
                    Your rating:{' '}
                    <strong className="tabular-nums">{store.user_rating ?? 'Not rated'}</strong>
                  </span>
                </div>
              </div>
              <RatingControl store={store} onRated={loadStores} />
            </div>
          </Card>
        ))}
        {stores.length === 0 && (
          <Card>
            <p className="text-center text-muted">No stores found. Try a different search.</p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
