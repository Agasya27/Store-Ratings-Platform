export function getHomePath(role) {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'NORMAL':
      return '/stores';
    case 'OWNER':
      return '/owner/dashboard';
    default:
      return '/account';
  }
}
