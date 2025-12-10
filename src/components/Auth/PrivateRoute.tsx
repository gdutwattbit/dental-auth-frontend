// src/components/Auth/PrivateRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';
import { UserRole } from '../../types/user';
import LoadingSpinner from '../common/LoadingSpinner';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login',
}) => {
  const location = useLocation();
  const {
    isAuthenticated,
    isLoading,
    user,
    checkAuth,
    hasAnyRole,
  } = useAuthStore();

  useEffect(() => {
    // 检查认证状态
    checkAuth();
  }, [checkAuth]);

  // 显示加载状态
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 如果未认证，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 检查角色权限
  if (allowedRoles && user && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
