import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStores from './pages/admin/Stores';
import AdminUsers from './pages/admin/Users';
import UserDetail from './pages/admin/UserDetail';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StoreBrowse from './pages/user/StoreBrowse';
import OwnerDashboard from './pages/owner/Dashboard';
import { getHomePath } from './utils/routes';

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={getHomePath(user.role)} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeRedirect />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute roles={['ADMIN']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <RoleRoute roles={['ADMIN']}>
                <AdminStores />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleRoute roles={['ADMIN']}>
                <AdminUsers />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/users/:id"
            element={
              <RoleRoute roles={['ADMIN']}>
                <UserDetail />
              </RoleRoute>
            }
          />

          <Route
            path="/stores"
            element={
              <RoleRoute roles={['NORMAL']}>
                <StoreBrowse />
              </RoleRoute>
            }
          />

          <Route
            path="/owner/dashboard"
            element={
              <RoleRoute roles={['OWNER']}>
                <OwnerDashboard />
              </RoleRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
