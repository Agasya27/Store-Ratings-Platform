import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, PageShell } from '../../components/admin/AdminLayout';
import Banner from '../../components/ui/Banner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Select from '../../components/ui/Select';
import SortHeader from '../../components/ui/SortHeader';
import { Table, TableBody, TableCell, TableData, TableHead, TableRow } from '../../components/ui/Table';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useSort } from '../../hooks/useSort';
import { useValidatedFields } from '../../hooks/useValidatedFields';
import { createUser, listUsers } from '../../api/admin';
import { getApiError } from '../../utils/apiError';
import { validateAddress, validateEmail, validateName, validatePassword, validateAdminUserBody } from '../../utils/validators';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const { sortBy, sortOrder, toggleSort } = useSort('name', 'asc');
  const form = useValidatedFields(
    { name: '', email: '', password: '', address: '', role: 'NORMAL' },
    {
      name: validateName,
      email: validateEmail,
      password: validatePassword,
      address: validateAddress,
    }
  );
  const [listError, setListError] = useState('');
  const [banner, setBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setListError('');
    setLoading(true);
    try {
      const res = await listUsers({ ...filters, sortBy, sortOrder });
      setUsers(res.data.users);
    } catch (err) {
      setListError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [sortBy, sortOrder]);

  async function handleCreate(e) {
    e.preventDefault();
    const validation = validateAdminUserBody(form.values);
    if (!validation.valid) {
      setBanner({ variant: 'error', message: validation.error });
      return;
    }

    setSubmitting(true);
    setBanner(null);
    try {
      await createUser(form.values);
      form.reset({ name: '', email: '', password: '', address: '', role: 'NORMAL' });
      setBanner({ variant: 'success', message: 'User created successfully.' });
      await loadUsers();
    } catch (err) {
      setBanner({ variant: 'error', message: getApiError(err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        section="Admin"
        title="Users"
        subtitle="Create and manage users. List defaults to normal and admin — filter by OWNER for store owners."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg font-semibold">Create user</h2>
          <form className="mt-4 space-y-4" onSubmit={handleCreate} noValidate>
            {banner && (
              <Banner variant={banner.variant} onDismiss={() => setBanner(null)}>
                {banner.message}
              </Banner>
            )}
            <Input
              label="Full name"
              value={form.values.name}
              onChange={(e) => form.setField('name', e.target.value)}
              onBlur={() => form.blurField('name')}
              error={form.errors.name}
              hint="20-60 characters"
            />
            <Input
              label="Email"
              type="email"
              value={form.values.email}
              onChange={(e) => form.setField('email', e.target.value)}
              onBlur={() => form.blurField('email')}
              error={form.errors.email}
            />
            <PasswordInput
              label="Password"
              value={form.values.password}
              onChange={(e) => form.setField('password', e.target.value)}
              onBlur={() => form.blurField('password')}
              error={form.errors.password}
            />
            <Input
              label="Address"
              value={form.values.address}
              onChange={(e) => form.setField('address', e.target.value)}
              onBlur={() => form.blurField('address')}
              error={form.errors.address}
            />
            <Select
              label="Role"
              value={form.values.role}
              onChange={(e) => form.setField('role', e.target.value)}
            >
              <option value="NORMAL">NORMAL</option>
              <option value="ADMIN">ADMIN</option>
              <option value="OWNER">OWNER</option>
            </Select>
            <Button type="submit" loading={submitting} disabled={submitting}>
              Create user
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-semibold">Filter users</h2>
          <div className="mt-4 space-y-3">
            <Input label="Name" value={filters.name} onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))} />
            <Input label="Email" value={filters.email} onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))} />
            <Input label="Address" value={filters.address} onChange={(e) => setFilters((f) => ({ ...f, address: e.target.value }))} />
            <Select label="Role" value={filters.role} onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}>
              <option value="">Normal & admin</option>
              <option value="ADMIN">ADMIN</option>
              <option value="NORMAL">NORMAL</option>
              <option value="OWNER">OWNER</option>
            </Select>
            <Button type="button" variant="secondary" onClick={loadUsers}>
              Apply filters
            </Button>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        {listError && <ErrorState message={listError} onRetry={loadUsers} />}
        {!listError && loading && <TableSkeleton rows={6} cols={5} />}
        {!listError && !loading && users.length === 0 && (
          <EmptyState title="No users found" description="Try adjusting your filters or create a new user." />
        )}
        {!listError && !loading && users.length > 0 && (
          <Table minWidth="720px">
            <TableHead>
              <TableRow>
                <TableCell>
                  <SortHeader label="Name" column="name" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                </TableCell>
                <TableCell>
                  <SortHeader label="Email" column="email" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                </TableCell>
                <TableCell>
                  <SortHeader label="Role" column="role" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                </TableCell>
                <TableCell>
                  <SortHeader label="Address" column="address" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                </TableCell>
                <TableCell className="font-medium text-muted">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableData className="font-medium">{user.name}</TableData>
                  <TableData>{user.email}</TableData>
                  <TableData><Badge role={user.role} /></TableData>
                  <TableData>{user.address || '—'}</TableData>
                  <TableData>
                    <Link to={`/admin/users/${user.id}`} className="text-sm font-medium text-brand hover:text-brand-hover">
                      View
                    </Link>
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
