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

function validateStoreName(name) {
  if (typeof name !== 'string' || name.trim().length < 1 || name.length > 255) {
    return { valid: false, error: 'Store name is required and must be at most 255 characters.' };
  }
  return { valid: true };
}

function validateOwnerId(ownerId) {
  const num = Number(ownerId);
  if (!Number.isInteger(num) || num < 1) {
    return { valid: false, error: 'A store owner is required.' };
  }
  return { valid: true };
}

function validateStoreBody({ name, email, address, ownerId }) {
  const checks = [validateStoreName(name), validateOwnerId(ownerId), validateAddress(address)];
  if (email) checks.splice(2, 0, validateEmail(email));
  const failed = checks.find((c) => !c.valid);
  return failed || { valid: true };
}

function validateAdminUserBody({ name, email, password, address, role }) {
  const checks = [
    validateName(name),
    validateEmail(email),
    validatePassword(password),
    validateAddress(address),
  ];
  const failed = checks.find((c) => !c.valid);
  if (failed) return failed;
  if (!['ADMIN', 'NORMAL', 'OWNER'].includes(role)) {
    return { valid: false, error: 'Role must be ADMIN, NORMAL, or OWNER.' };
  }
  return { valid: true };
}

function validateRatingValue(value) {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1 || num > 5) {
    return { valid: false, error: 'Rating must be an integer between 1 and 5.' };
  }
  return { valid: true };
}

module.exports = {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
  validateSignupBody,
  validateLoginBody,
  validateChangePasswordBody,
  validateStoreName,
  validateOwnerId,
  validateStoreBody,
  validateAdminUserBody,
  validateRatingValue,
};
