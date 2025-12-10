// src/api/auth.ts
import { http } from './axios';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  ApiResponse
} from '../types/user';

export const authApi = {
  /**
   * 用户登录
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await http.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * 用户注册
   */
  register: async (data: RegisterData): Promise<ApiResponse> => {
    const response = await http.post<ApiResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * 刷新Token
   */
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await http.post<{ accessToken: string }>('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * 用户登出
   */
  logout: async (refreshToken?: string): Promise<ApiResponse> => {
    const response = await http.post<ApiResponse>('/auth/logout', { refreshToken });
    return response.data;
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await http.get<User>('/auth/me');
    return response.data;
  },

  /**
   * 获取用户权限（如果需要）
   */
  getUserPermissions: async (userId: string): Promise<string[]> => {
    // 这里根据你的后端API调整
    const response = await http.get<string[]>(`/users/${userId}/permissions`);
    return response.data;
  },

  /**
   * 更新用户信息
   */
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await http.put<User>(`/users/${userId}`, data);
    return response.data;
  },
};
