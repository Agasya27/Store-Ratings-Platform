import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Banner from '../components/ui/Banner';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PasswordInput from '../components/ui/PasswordInput';
import PageHeader from '../components/ui/PageHeader';
import { CardGridSkeleton } from '../components/ui/Skeleton';
import { useValidatedField } from '../hooks/useValidatedFields';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../utils/apiError';
import { validatePassword } from '../utils/validators';

function validateCurrentPassword(value) {
  return value ? { valid: true } : { valid: false, error: 'Current password is required.' };
}

export default function Home() {
  const { user, loading, isAuthenticated, changePassword } = useAuth();
  const currentPassword = useValidatedField('', validateCurrentPassword);
  const newPassword = useValidatedField('', validatePassword);
  const [banner, setBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <AppShell>
        <CardGridSkeleton count={2} />
      </AppShell>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  async function handleChangePassword(e) {
    e.preventDefault();
    const currentOk = currentPassword.validate();
    const newOk = newPassword.validate();
    if (!currentOk || !newOk) return;

    setSubmitting(true);
    setBanner(null);
    try {
      await changePassword(currentPassword.value, newPassword.value);
      setBanner({ variant: 'success', message: 'Password updated successfully.' });
      currentPassword.setValue('');
      newPassword.setValue('');
    } catch (err) {
      setBanner({ variant: 'error', message: getApiError(err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        section="Account"
        title={`Welcome back, ${user.name}`}
        subtitle="Manage your profile and security settings."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold">Profile</h2>
              <p className="mt-1 text-sm text-muted">Your account details</p>
            </div>
            <Badge role={user.role} />
          </div>

          <dl className="mt-6 space-y-4">
            <div className="rounded-lg bg-surface-muted px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">Email</dt>
              <dd className="mt-1 text-sm font-medium">{user.email}</dd>
            </div>
            <div className="rounded-lg bg-surface-muted px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">Address</dt>
              <dd className="mt-1 text-sm font-medium">{user.address || 'Not provided'}</dd>
            </div>
            <div className="rounded-lg bg-surface-muted px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">Member since</dt>
              <dd className="mt-1 text-sm font-medium tabular-nums">
                {new Date(user.created_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-semibold">Security</h2>
          <p className="mt-1 text-sm text-muted">Update your password regularly</p>

          <form className="mt-6 space-y-4" onSubmit={handleChangePassword} noValidate>
            {banner && (
              <Banner
                variant={banner.variant}
                onDismiss={() => setBanner(null)}
              >
                {banner.message}
              </Banner>
            )}
            <PasswordInput
              label="Current password"
              name="currentPassword"
              value={currentPassword.value}
              onChange={(e) => currentPassword.change(e.target.value)}
              onBlur={currentPassword.blur}
              error={currentPassword.error}
            />
            <PasswordInput
              label="New password"
              name="newPassword"
              value={newPassword.value}
              onChange={(e) => newPassword.change(e.target.value)}
              onBlur={newPassword.blur}
              error={newPassword.error}
              hint="8-16 chars, one uppercase, one special character"
            />
            <Button type="submit" loading={submitting} disabled={submitting}>
              Update password
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
