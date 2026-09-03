import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import Banner from '../components/ui/Banner';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import { useValidatedFields } from '../hooks/useValidatedFields';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../utils/apiError';
import { validateAddress, validateEmail, validateName, validatePassword } from '../utils/validators';
import { getHomePath } from '../utils/routes';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { values, errors, setField, blurField, validateAll } = useValidatedFields(
    { name: '', email: '', password: '', address: '' },
    {
      name: validateName,
      email: validateEmail,
      password: validatePassword,
      address: validateAddress,
    }
  );
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const newUser = await signup(values);
      navigate(getHomePath(newUser.role));
    } catch (err) {
      setSubmitError(getApiError(err));
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
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            label="Full name"
            name="name"
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            onBlur={() => blurField('name')}
            error={errors.name}
            hint="Must be 20-60 characters"
            placeholder="Your full display name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            onBlur={() => blurField('email')}
            error={errors.email}
            placeholder="you@example.com"
          />
          <PasswordInput
            label="Password"
            name="password"
            value={values.password}
            onChange={(e) => setField('password', e.target.value)}
            onBlur={() => blurField('password')}
            error={errors.password}
            autoComplete="new-password"
            hint="8-16 chars, one uppercase, one special character"
            placeholder="Create a strong password"
          />
          <Input
            label="Address"
            name="address"
            value={values.address}
            onChange={(e) => setField('address', e.target.value)}
            onBlur={() => blurField('address')}
            error={errors.address}
            hint="Optional, max 400 characters"
            placeholder="Street, city, country"
          />
          {submitError && <Banner variant="error">{submitError}</Banner>}
          <Button type="submit" className="w-full" loading={submitting} disabled={submitting}>
            Create account
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
