import { useEffect, useState } from 'react';
import { PageHeader, PageShell } from '../../components/admin/AdminLayout';
import Banner from '../../components/ui/Banner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Input from '../../components/ui/Input';
import SortHeader from '../../components/ui/SortHeader';
import { Table, TableBody, TableCell, TableData, TableHead, TableRow } from '../../components/ui/Table';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useSort } from '../../hooks/useSort';
import { useValidatedFields } from '../../hooks/useValidatedFields';
import { createStore, listStores } from '../../api/admin';
import { getApiError } from '../../utils/apiError';
import { validateAddress, validateEmail, validateStoreBody } from '../../utils/validators';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const { sortBy, sortOrder, toggleSort } = useSort('name', 'asc');
  const form = useValidatedFields(
    { name: '', email: '', address: '', ownerId: '' },
    {
      name: (v) => validateStoreBody({ name: v, email: '', address: '' }),
      email: (v) => (v ? validateEmail(v) : { valid: true }),
      address: validateAddress,
    }
  );
  const [listError, setListError] = useState('');
  const [banner, setBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadStores() {
    setListError('');
    setLoading(true);
    try {
      const res = await listStores({ ...filters, sortBy, sortOrder });
      setStores(res.data.stores);
    } catch (err) {
      setListError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStores();
  }, [sortBy, sortOrder]);

  async function handleCreate(e) {
    e.preventDefault();
    const validation = validateStoreBody(form.values);
    if (!validation.valid) {
      setBanner({ variant: 'error', message: validation.error });
      return;
    }

    setSubmitting(true);
    setBanner(null);
    try {
      await createStore({
        name: form.values.name,
        email: form.values.email || undefined,
        address: form.values.address || undefined,
        ownerId: form.values.ownerId ? Number(form.values.ownerId) : undefined,
      });
      form.reset({ name: '', email: '', address: '', ownerId: '' });
      setBanner({ variant: 'success', message: 'Store created successfully.' });
      await loadStores();
    } catch (err) {
      setBanner({ variant: 'error', message: getApiError(err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <PageHeader section="Admin" title="Stores" subtitle="Create and manage stores" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg font-semibold">Create store</h2>
          <form className="mt-4 space-y-4" onSubmit={handleCreate} noValidate>
            {banner && (
              <Banner variant={banner.variant} onDismiss={() => setBanner(null)}>
                {banner.message}
              </Banner>
            )}
            <Input
              label="Store name"
              value={form.values.name}
              onChange={(e) => form.setField('name', e.target.value)}
              onBlur={() => form.blurField('name')}
              error={form.errors.name}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.values.email}
              onChange={(e) => form.setField('email', e.target.value)}
              onBlur={() => form.blurField('email')}
              error={form.errors.email}
            />
            <Input
              label="Address"
              value={form.values.address}
              onChange={(e) => form.setField('address', e.target.value)}
              onBlur={() => form.blurField('address')}
              error={form.errors.address}
            />
            <Input
              label="Owner user ID"
              hint="Optional — assigns an existing user as store owner"
              value={form.values.ownerId}
              onChange={(e) => form.setField('ownerId', e.target.value)}
            />
            <Button type="submit" loading={submitting} disabled={submitting}>
              Create store
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-semibold">Filter stores</h2>
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

      <Card className="mt-6">
        {listError && <ErrorState message={listError} onRetry={loadStores} />}
        {!listError && loading && <TableSkeleton rows={6} cols={4} />}
        {!listError && !loading && stores.length === 0 && (
          <EmptyState title="No stores found" description="Create a store above or adjust your filters." />
        )}
        {!listError && !loading && stores.length > 0 && (
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
                  <SortHeader label="Address" column="address" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                </TableCell>
                <TableCell>
                  <SortHeader label="Avg rating" column="average_rating" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableData className="font-medium">{store.name}</TableData>
                  <TableData>{store.email || '—'}</TableData>
                  <TableData>{store.address || '—'}</TableData>
                  <TableData className="tabular-nums">{store.average_rating}</TableData>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </PageShell>
  );
}
