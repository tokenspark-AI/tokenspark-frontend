import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';

interface PartnerGuardProps {
  children: ReactNode;
}

export function PartnerGuard({ children }: PartnerGuardProps) {
  const { isAuthenticated, userDashboardType } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userDashboardType !== 'partner') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
