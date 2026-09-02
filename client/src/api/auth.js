import client from './client';

export function login(email, password) {
  return client.post('/auth/login', { email, password });
}

export function signup(data) {
  return client.post('/auth/signup', data);
}

export function logout() {
  return client.post('/auth/logout');
}

export function getMe() {
  return client.get('/auth/me');
}

export function changePassword(currentPassword, newPassword) {
  return client.post('/auth/change-password', { currentPassword, newPassword });
}
