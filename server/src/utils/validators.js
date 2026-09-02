const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

function validateName(name) {
  if (typeof name !== 'string' || name.length < 20 || name.length > 60) {
    return { valid: false, error: 'Name must be between 20 and 60 characters.' };
  }
  return { valid: true };
}

function validateEmail(email) {
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Email must be a valid email address.' };
  }
  return { valid: true };
}

function validateAddress(address) {
  if (address == null || address === '') return { valid: true };
  if (typeof address !== 'string' || address.length > 400) {
    return { valid: false, error: 'Address must be at most 400 characters.' };
  }
  return { valid: true };
}

function validatePassword(password) {
  if (typeof password !== 'string' || !PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      error:
        'Password must be 8-16 characters with at least one uppercase letter and one special character.',
    };
  }
  return { valid: true };
}

function validateSignupBody({ name, email, password, address }) {
  const checks = [
    validateName(name),
    validateEmail(email),
    validatePassword(password),
    validateAddress(address),
  ];
  const failed = checks.find((c) => !c.valid);
  return failed || { valid: true };
}

function validateLoginBody({ email, password }) {
  if (!email || !password) {
    return { valid: false, error: 'Email and password are required.' };
  }
  return validateEmail(email);
}

function validateChangePasswordBody({ currentPassword, newPassword }) {
  if (!currentPassword || !newPassword) {
    return { valid: false, error: 'Current password and new password are required.' };
  }
  return validatePassword(newPassword);
}

module.exports = {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
  validateSignupBody,
  validateLoginBody,
  validateChangePasswordBody,
};
