const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export function validateName(name) {
  if (typeof name !== 'string' || name.length < 20 || name.length > 60) {
    return { valid: false, error: 'Name must be between 20 and 60 characters.' };
  }
  return { valid: true };
}

export function validateEmail(email) {
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Email must be a valid email address.' };
  }
  return { valid: true };
}

export function validateAddress(address) {
  if (address == null || address === '') return { valid: true };
  if (typeof address !== 'string' || address.length > 400) {
    return { valid: false, error: 'Address must be at most 400 characters.' };
  }
  return { valid: true };
}

export function validatePassword(password) {
  if (typeof password !== 'string' || !PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      error:
        'Password must be 8-16 characters with at least one uppercase letter and one special character.',
    };
  }
  return { valid: true };
}

export function validateAdminUserBody({ name, email, password, address, role }) {
  const checks = [validateName(name), validateEmail(email), validatePassword(password), validateAddress(address)];
  const failed = checks.find((c) => !c.valid);
  if (failed) return failed;
  if (!['ADMIN', 'NORMAL', 'OWNER'].includes(role)) {
    return { valid: false, error: 'Role must be ADMIN, NORMAL, or OWNER.' };
  }
  return { valid: true };
}
