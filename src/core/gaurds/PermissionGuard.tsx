import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermissions: string[];
  requireAll?: boolean; // If true, user must have all permissions; if false, any one
  redirectTo?: string;
}

export function PermissionGuard({
  children,
  requiredPermissions,
  requireAll = true,
  redirectTo = '/unauthorized'
}: PermissionGuardProps) {
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
    return <Navigate to="/login" replace />;
  }

  const userPermissions = user.permissions || [];

  const hasPermission = requireAll
    ? requiredPermissions.every(perm => userPermissions.includes(perm))
    : requiredPermissions.some(perm => userPermissions.includes(perm));

  if (!hasPermission) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}