import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '../../features/auth/types/auth.types';
import { useAuthStore } from '../store/authStore';

type RoleRouteProps = {
  allowedRoles: UserRole[];
};

function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p style={{ color: 'var(--text-muted)' }}>Checking permissions...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;