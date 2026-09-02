import client from './client';

export function submitRating(storeId, value) {
  return client.post('/ratings', { storeId, value });
}

export function updateRating(storeId, value) {
  return client.put(`/ratings/${storeId}`, { value });
}
