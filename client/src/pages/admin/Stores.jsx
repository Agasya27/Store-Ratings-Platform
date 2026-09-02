import { useEffect, useState } from 'react';
import { PageHeader, PageShell } from '../../components/admin/AdminLayout';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { createStore, listStores } from '../../api/admin';
import { getApiError } from '../../utils/apiError';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [filters, setFilters] = useState({ name: '', email: '', address: '', sortBy: 'name', sortOrder: 'asc' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadStores() {
    try {
      const res = await listStores(filters);
      setStores(res.data.stores);
    } catch (err) {
      setError(getApiError(err));
    }
  }

  useEffect(() => {
    loadStores();
  }, [filters.sortBy, filters.sortOrder]);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      await createStore({
        name: form.name,
        email: form.email || undefined,
        address: form.address || undefined,
        ownerId: form.ownerId ? Number(form.ownerId) : undefined,
      });
      setForm({ name: '', email: '', address: '', ownerId: '' });
      setMessage('Store created successfully.');
      await loadStores();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <PageHeader title="Stores" subtitle="Create and manage stores" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Create store</h2>
          <form className="mt-4 space-y-4" onSubmit={handleCreate}>
            <Input label="Store name" value={form.name} onChange={(e) => updateForm('name', e.target.value)} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
            <Input label="Address" value={form.address} onChange={(e) => updateForm('address', e.target.value)} />
            <Input
              label="Owner user ID"
              hint="Optional — assigns an existing user as store owner"
              value={form.ownerId}
              onChange={(e) => updateForm('ownerId', e.target.value)}
            />
            {error && <Alert>{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create store'}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Filter stores</h2>
          <div className="mt-4 space-y-3">
            <Input label="Name" value={filters.name} onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))} />
            <Input label="Email" value={filters.email} onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))} />
            <Input label="Address" value={filters.address} onChange={(e) => setFilters((f) => ({ ...f, address: e.target.value }))} />
            <Button type="button" variant="secondary" onClick={loadStores}>
              Apply filters
            </Button>
          </div>
        </Card>
      </div>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-2 py-3 font-medium">Name</th>
              <th className="px-2 py-3 font-medium">Email</th>
              <th className="px-2 py-3 font-medium">Address</th>
              <th className="px-2 py-3 font-medium">Avg rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="border-b border-border/70">
                <td className="px-2 py-3 font-medium">{store.name}</td>
                <td className="px-2 py-3">{store.email || '—'}</td>
                <td className="px-2 py-3">{store.address || '—'}</td>
                <td className="px-2 py-3 tabular-nums">{store.average_rating}</td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr>
                <td colSpan={4} className="px-2 py-8 text-center text-muted">
                  No stores found. Create one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </PageShell>
  );
}
