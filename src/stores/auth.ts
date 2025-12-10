// src/stores/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types/user';
import { authApi } from '../api/auth';

interface AuthState {
  // 状态
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  clearAuth: () => void;
  checkAuth: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 用户登录
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.login({ email, password });
          
          // 保存token到localStorage（如果使用localStorage）
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || '登录失败',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // 用户注册
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.register(userData);
          
          // 注册成功后自动登录
          if (response.success) {
            await get().login(userData.email, userData.password);
          }
        } catch (error: any) {
          set({
            error: error.message || '注册失败',
            isLoading: false,
          });
          throw error;
        }
      },

      // 用户登出
      logout: async () => {
        set({ isLoading: true });
        
        try {
          const refreshToken = get().refreshToken;
          await authApi.logout(refreshToken || undefined);
        } catch (error) {
          console.error('登出失败:', error);
        } finally {
          // 清除本地存储
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
          // 重置状态
          get().clearAuth();
          
          set({ isLoading: false });
        }
      },

      // 刷新认证
      refreshAuth: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) {
          get().clearAuth();
          return;
        }

        try {
          const response = await authApi.refreshToken(refreshToken);
          
          localStorage.setItem('accessToken', response.accessToken);
          
          set({
            accessToken: response.accessToken,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('刷新token失败:', error);
          get().clearAuth();
        }
      },

      // 设置用户
      setUser: (user) => {
        set({ user });
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      },

      // 设置token
      setTokens: (tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });
      },

      // 清除认证信息
      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // 检查认证状态
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const accessToken = localStorage.getItem('accessToken');
          const userStr = localStorage.getItem('user');
          
          if (!accessToken || !userStr) {
            get().clearAuth();
            set({ isLoading: false });
            return;
          }

          try {
            // 验证token是否有效
            const user = JSON.parse(userStr);
            
            // 如果需要，可以调用API验证token
            // const currentUser = await authApi.getCurrentUser();
            
            set({
              user,
              accessToken,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            console.error('检查认证状态失败:', error);
            get().clearAuth();
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('checkAuth 错误:', error);
          get().clearAuth();
          set({ isLoading: false });
        }
      },

      // 检查是否有指定角色
      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;
        
        if (Array.isArray(role)) {
          return role.includes(user.role);
        }
        return user.role === role;
      },

      // 检查是否有任意指定角色
      hasAnyRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role);
      },
    }),
    {
      name: 'auth-storage', // localStorage中的key
      partialize: (state) => ({
        // 只持久化这些字段
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
