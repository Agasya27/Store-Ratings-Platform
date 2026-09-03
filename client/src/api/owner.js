import client from './client';

export function getOwnerDashboard(params) {
  return client.get('/owner/dashboard', { params });
}
