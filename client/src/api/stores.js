import client from './client';

export function listStores(params) {
  return client.get('/stores', { params });
}

export function getStore(id) {
  return client.get(`/stores/${id}`);
}
