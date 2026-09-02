import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../utils/apiError';
import { validatePassword } from '../utils/validators';

function LoadingSkeleton() {
  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    </AppShell>
  );
}

export default function Home() {
  const { user, loading, isAuthenticated, changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <LoadingSkeleton />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  async function handleChangePassword(e) {
    e.preventDefault();
    const check = validatePassword(newPassword);
    if (!check.valid) {
      setError(check.error);
      setMessage('');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await changePassword(currentPassword, newPassword);
      setMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(getApiError(err));
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm font-medium text-brand">Dashboard</p>
        <h1 className="mt-1 text-balance text-3xl font-semibold text-foreground">Welcome back, {user.name}</h1>
        <p className="mt-2 text-pretty text-muted">Manage your account and security settings.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Profile</h2>
              <p className="mt-1 text-sm text-muted">Your account details</p>
            </div>
            <Badge role={user.role} />
          </div>

          <dl className="mt-6 space-y-4">
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">Email</dt>
              <dd className="mt-1 text-sm font-medium">{user.email}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">Address</dt>
              <dd className="mt-1 text-sm font-medium">{user.address || 'Not provided'}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">Member since</dt>
              <dd className="mt-1 text-sm font-medium tabular-nums">
                {new Date(user.created_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Security</h2>
          <p className="mt-1 text-sm text-muted">Update your password regularly</p>

          <form className="mt-6 space-y-4" onSubmit={handleChangePassword}>
            <Input
              label="Current password"
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label="New password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              hint="8-16 chars, one uppercase, one special character"
            />
            {error && <Alert>{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
