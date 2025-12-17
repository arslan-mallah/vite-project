import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UserRouteGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export function UserRouteGuard({
  children,
  requiredRole,
  redirectTo = '/login'
}: UserRouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <p style={{ color: '#666' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}