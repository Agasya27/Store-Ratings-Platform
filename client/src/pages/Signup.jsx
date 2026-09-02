import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../utils/apiError';
import { validateAddress, validateEmail, validateName, validatePassword } from '../utils/validators';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const checks = [
      validateName(form.name),
      validateEmail(form.email),
      validatePassword(form.password),
      validateAddress(form.address),
    ];
    const failed = checks.find((c) => !c.valid);
    if (failed) {
      setError(failed.error);
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await signup(form);
      navigate('/');
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join as a normal user to browse stores and submit ratings"
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="font-medium text-brand hover:text-brand-hover">
            Sign in
          </Link>
        </>
      }
    >
      <Card>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Full name"
            name="name"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            hint="Must be 20-60 characters"
            placeholder="Your full display name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            autoComplete="new-password"
            hint="8-16 chars, one uppercase, one special character"
            placeholder="Create a strong password"
          />
          <Input
            label="Address"
            name="address"
            value={form.address}
            onChange={(e) => updateField('address', e.target.value)}
            hint="Optional, max 400 characters"
            placeholder="Street, city, country"
          />
          {error && <Alert>{error}</Alert>}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
