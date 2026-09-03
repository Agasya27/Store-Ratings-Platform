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

export function deleteStore(id) {
  return client.delete(`/admin/stores/${id}`);
}

export function getUser(id) {
  return client.get(`/admin/users/${id}`);
}

export function deleteUser(id) {
  return client.delete(`/admin/users/${id}`);
}
