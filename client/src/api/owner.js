import client from './client';

export function getOwnerDashboard() {
  return client.get('/owner/dashboard');
}
