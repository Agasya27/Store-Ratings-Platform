import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';
import { getApiError } from '../utils/apiError';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getMe()
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      async login(email, password) {
        const res = await authApi.login(email, password);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data.user;
      },
      async signup(form) {
        const res = await authApi.signup(form);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data.user;
      },
      async logout() {
        try {
          await authApi.logout();
        } catch (err) {
          throw new Error(getApiError(err));
        } finally {
          localStorage.removeItem('token');
          setUser(null);
        }
      },
      async changePassword(currentPassword, newPassword) {
        await authApi.changePassword(currentPassword, newPassword);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
