// src/routes.tsx
import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { UserRole } from './types/user';
import LoadingSpinner from './components/common/LoadingSpinner';

// 懒加载页面组件
const Login = lazy(() => import('./pages/Login.tsx'));
const Register = lazy(() => import('./pages/Register.tsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.tsx'));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));
const Debug = lazy(() => import('./pages/Debug.tsx'));

// 私有路由组件
const PrivateRoute = lazy(() => import('./components/Auth/PrivateRoute.tsx'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      </Suspense>
    ),
  },
  {
    path: '/doctor',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PrivateRoute allowedRoles={[UserRole.DENTIST, UserRole.ADMIN]}>
          <DoctorDashboard />
        </PrivateRoute>
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
          <div>管理员页面</div>
        </PrivateRoute>
      </Suspense>
    ),
  },
  {
    path: '/technician',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PrivateRoute allowedRoles={[UserRole.TECHNICIAN, UserRole.ADMIN]}>
          <div>技师页面</div>
        </PrivateRoute>
      </Suspense>
    ),
  },
  {
    path: '/debug',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Debug />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
    ),
  },
];

// 根据用户角色生成侧边栏菜单
export const generateMenuItems = (userRole: UserRole) => {
  const baseItems = [
    {
      key: '/dashboard',
      label: '仪表盘',
      icon: '📊',
    },
  ];

  const roleBasedItems = {
    [UserRole.ADMIN]: [
      { key: '/admin/users', label: '用户管理', icon: '👥' },
      { key: '/admin/settings', label: '系统设置', icon: '⚙️' },
      { key: '/doctor', label: '医生工作台', icon: '👨‍⚕️' },
      { key: '/technician', label: '技师工作台', icon: '🔧' },
    ],
    [UserRole.DENTIST]: [
      { key: '/doctor', label: '工作台', icon: '👨‍⚕️' },
      { key: '/patients', label: '患者管理', icon: '👤' },
      { key: '/appointments', label: '预约管理', icon: '📅' },
    ],
    [UserRole.TECHNICIAN]: [
      { key: '/technician', label: '工作台', icon: '🔧' },
      { key: '/tasks', label: '任务列表', icon: '✅' },
      { key: '/reports', label: '报告', icon: '📋' },
    ],
    [UserRole.VIEWER]: [
      { key: '/reports', label: '查看报告', icon: '👀' },
    ],
    [UserRole.CLINIC_ADMIN]: [
      { key: '/clinic/settings', label: '诊所设置', icon: '🏥' },
      { key: '/clinic/staff', label: '员工管理', icon: '👥' },
      { key: '/clinic/finance', label: '财务管理', icon: '💰' },
    ],
  };

  return [...baseItems, ...(roleBasedItems[userRole] || [])];
};
