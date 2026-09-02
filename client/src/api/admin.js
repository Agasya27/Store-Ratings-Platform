import client from './client';

export function getDashboard() {
  return client.get('/admin/dashboard');
}

export function listUsers(params) {
  return client.get('/admin/users', { params });
}

export function createUser(data) {
  return client.post('/admin/users', data);
}

export function listStores(params) {
  return client.get('/admin/stores', { params });
}

export function createStore(data) {
  return client.post('/admin/stores', data);
}

export function getUser(id) {
  return client.get(`/admin/users/${id}`);
}
