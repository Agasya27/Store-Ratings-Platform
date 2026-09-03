import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, PageShell } from '../../components/admin/AdminLayout';
import Banner from '../../components/ui/Banner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import SortHeader from '../../components/ui/SortHeader';
import { Table, TableBody, TableCell, TableData, TableHead, TableRow } from '../../components/ui/Table';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useSort } from '../../hooks/useSort';
import { useValidatedFields } from '../../hooks/useValidatedFields';
import { createStore, deleteStore, listStores, listUsers } from '../../api/admin';
import { getApiError } from '../../utils/apiError';
import {
  validateAddress,
  validateEmail,
  validateOwnerId,
  validateStoreBody,
  validateStoreName,
} from '../../utils/validators';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [ownersLoading, setOwnersLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const { sortBy, sortOrder, toggleSort } = useSort('name', 'asc');
  const form = useValidatedFields(
    { name: '', email: '', address: '', ownerId: '' },
    {
      name: (v) => validateStoreName(v),
      email: (v) => (v ? validateEmail(v) : { valid: true }),
      address: validateAddress,
      ownerId: validateOwnerId,
    }
  );
  const [listError, setListError] = useState('');
  const [banner, setBanner] = useState(null);
  const [listBanner, setListBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadOwnerOptions() {
    setOwnersLoading(true);
    try {
      const [ownersRes, normalsRes] = await Promise.all([
        listUsers({ role: 'OWNER', sortBy: 'name', sortOrder: 'asc', limit: 100 }),
        listUsers({ role: 'NORMAL', sortBy: 'name', sortOrder: 'asc', limit: 100 }),
      ]);
      const combined = [...ownersRes.data.users, ...normalsRes.data.users];
      const byId = new Map(combined.map((u) => [u.id, u]));
      setOwnerOptions([...byId.values()].sort((a, b) => a.name.localeCompare(b.name)));
    } catch {
      setOwnerOptions([]);
    } finally {
      setOwnersLoading(false);
    }
  }

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
    loadOwnerOptions();
  }, []);

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
        ownerId: Number(form.values.ownerId),
      });
      form.reset({ name: '', email: '', address: '', ownerId: '' });
      setBanner({ variant: 'success', message: 'Store created successfully.' });
      await loadStores();
      await loadOwnerOptions();
    } catch (err) {
      setBanner({ variant: 'error', message: getApiError(err) });
    } finally {
      setSubmitting(false);
    }
  }

  const canCreateStore = ownerOptions.length > 0 && !ownersLoading;

  async function handleDelete(store) {
    const confirmed = window.confirm(
      `Delete "${store.name}"? All ratings for this store will be removed permanently.`
    );
    if (!confirmed) return;

    setDeletingId(store.id);
    setListBanner(null);
    try {
      await deleteStore(store.id);
      setListBanner({ variant: 'success', message: `"${store.name}" was deleted.` });
      await loadStores();
      await loadOwnerOptions();
    } catch (err) {
      setListBanner({ variant: 'error', message: getApiError(err) });
    } finally {
      setDeletingId(null);
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
            <Select
              label="Store owner"
              hint="Required — normal users will be promoted to OWNER when assigned"
              value={form.values.ownerId}
              onChange={(e) => form.setField('ownerId', e.target.value)}
              onBlur={() => form.blurField('ownerId')}
              error={form.errors.ownerId}
              disabled={ownersLoading || ownerOptions.length === 0}
              required
            >
              <option value="">
                {ownersLoading ? 'Loading users...' : 'Select a store owner'}
              </option>
              {ownerOptions.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email}) — {user.role}
                </option>
              ))}
            </Select>
            {!ownersLoading && ownerOptions.length === 0 && (
              <p className="text-sm text-muted">
                No users available.{' '}
                <Link to="/admin/users" className="font-medium text-brand hover:text-brand-hover">
                  Create an OWNER user first
                </Link>
              </p>
            )}
            <Button type="submit" loading={submitting} disabled={submitting || !canCreateStore}>
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
        {listBanner && (
          <div className="mb-4">
            <Banner variant={listBanner.variant} onDismiss={() => setListBanner(null)}>
              {listBanner.message}
            </Banner>
          </div>
        )}
        {listError && <ErrorState message={listError} onRetry={loadStores} />}
        {!listError && loading && <TableSkeleton rows={6} cols={5} />}
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
                <TableCell className="font-medium text-muted">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableData className="font-medium">{store.name}</TableData>
                  <TableData>{store.email || '—'}</TableData>
                  <TableData>{store.address || '—'}</TableData>
                  <TableData className="tabular-nums">{store.average_rating}</TableData>
                  <TableData>
                    <Button
                      type="button"
                      variant="danger"
                      className="h-8 px-3"
                      loading={deletingId === store.id}
                      disabled={deletingId !== null}
                      onClick={() => handleDelete(store)}
                    >
                      Delete
                    </Button>
                  </TableData>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </PageShell>
  );
}
