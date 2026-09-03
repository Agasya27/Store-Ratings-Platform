import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import Banner from '../components/ui/Banner';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import { useValidatedField } from '../hooks/useValidatedFields';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../utils/apiError';
import { validateEmail } from '../utils/validators';
import { getHomePath } from '../utils/routes';

function validateRequired(value) {
  return value ? { valid: true } : { valid: false, error: 'Password is required.' };
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const emailField = useValidatedField('', validateEmail);
  const passwordField = useValidatedField('', validateRequired);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const emailOk = emailField.validate();
    const passwordOk = passwordField.validate();
    if (!emailOk || !passwordOk) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const loggedInUser = await login(emailField.value, passwordField.value);
      navigate(getHomePath(loggedInUser.role));
    } catch (err) {
      setSubmitError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your dashboard"
      footer={
        <>
          No account?{' '}
          <Link to="/signup" className="font-medium text-brand hover:text-brand-hover">
            Create one
          </Link>
        </>
      }
    >
      <Card>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            name="email"
            type="email"
            value={emailField.value}
            onChange={(e) => emailField.change(e.target.value)}
            onBlur={emailField.blur}
            error={emailField.error}
            autoComplete="email"
            placeholder="you@example.com"
          />
          <PasswordInput
            label="Password"
            name="password"
            value={passwordField.value}
            onChange={(e) => passwordField.change(e.target.value)}
            onBlur={passwordField.blur}
            error={passwordField.error}
            autoComplete="current-password"
            placeholder="Enter your password"
          />
          {submitError && <Banner variant="error">{submitError}</Banner>}
          <Button type="submit" className="w-full" loading={submitting} disabled={submitting}>
            Sign in
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
