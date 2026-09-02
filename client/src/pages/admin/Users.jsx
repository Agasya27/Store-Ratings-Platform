import { useEffect, useState } from 'react';
import { PageHeader, PageShell } from '../../components/admin/AdminLayout';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { createUser, listUsers } from '../../api/admin';
import { getApiError } from '../../utils/apiError';
import { validateAdminUserBody } from '../../utils/validators';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'NORMAL',
  });
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadUsers() {
    try {
      const res = await listUsers(filters);
      setUsers(res.data.users);
    } catch (err) {
      setError(getApiError(err));
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    const validation = validateAdminUserBody(form);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      await createUser(form);
      setForm({ name: '', email: '', password: '', address: '', role: 'NORMAL' });
      setMessage('User created successfully.');
      await loadUsers();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <PageHeader title="Users" subtitle="Create and manage platform users" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Create user</h2>
          <form className="mt-4 space-y-4" onSubmit={handleCreate}>
            <Input label="Full name" value={form.name} onChange={(e) => updateForm('name', e.target.value)} hint="20-60 characters" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
            <Input label="Password" type="password" value={form.password} onChange={(e) => updateForm('password', e.target.value)} />
            <Input label="Address" value={form.address} onChange={(e) => updateForm('address', e.target.value)} />
            <Select label="Role" value={form.role} onChange={(e) => updateForm('role', e.target.value)}>
              <option value="NORMAL">NORMAL</option>
              <option value="ADMIN">ADMIN</option>
              <option value="OWNER">OWNER</option>
            </Select>
            {error && <Alert>{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create user'}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Filter users</h2>
          <div className="mt-4 space-y-3">
            <Input label="Name" value={filters.name} onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))} />
            <Input label="Email" value={filters.email} onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))} />
            <Input label="Address" value={filters.address} onChange={(e) => setFilters((f) => ({ ...f, address: e.target.value }))} />
            <Select label="Role" value={filters.role} onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}>
              <option value="">All roles</option>
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

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-2 py-3 font-medium">Name</th>
              <th className="px-2 py-3 font-medium">Email</th>
              <th className="px-2 py-3 font-medium">Role</th>
              <th className="px-2 py-3 font-medium">Address</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border/70">
                <td className="px-2 py-3 font-medium">{user.name}</td>
                <td className="px-2 py-3">{user.email}</td>
                <td className="px-2 py-3">
                  <Badge role={user.role} />
                </td>
                <td className="px-2 py-3">{user.address || '—'}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-2 py-8 text-center text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </PageShell>
  );
}
