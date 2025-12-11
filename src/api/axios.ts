import axios from 'axios';
import { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

// 创建axios实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    timeout: 10000, // 10秒超时
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 从localStorage获取token（如果使用localStorage存储token）
      const token = localStorage.getItem('accessToken');
      
      // 如果token存在，添加到请求头
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // 显示加载状态（可选）
      // store.dispatch(setLoading(true));
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 隐藏加载状态
      // store.dispatch(setLoading(false));
      
      // 处理成功的响应 - 直接返回响应体
      return response;
    },
    async (error: AxiosError) => {
      // 隐藏加载状态
      // store.dispatch(setLoading(false));
      
      const originalRequest = error.config as any;
      
      // 处理401错误（未授权/Token过期）
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // 尝试刷新token
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (refreshToken) {
            const { data } = await axios.post(
              `/auth/refresh`,
              { refreshToken },
              { withCredentials: true }
            );
            
            // 保存新的access token
            localStorage.setItem('accessToken', data.accessToken);
            
            // 更新请求头的Authorization
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            }
            
            // 重试原始请求
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // 刷新token失败，清除用户状态并跳转到登录页
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          message.error('会话已过期，请重新登录');
          return Promise.reject(refreshError);
        }
      }
      
      // 处理其他错误
      const errorMessage = getErrorMessage(error);
      message.error(errorMessage);
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// 错误信息处理
const getErrorMessage = (error: AxiosError): string => {
  if (error.response) {
    // 服务器返回错误
    const data = error.response.data as any;
    return data.message || `服务器错误: ${error.response.status}`;
  } else if (error.request) {
    // 请求已发出但没有收到响应
    return '网络错误，请检查网络连接';
  } else {
    // 请求配置出错
    return '请求失败，请稍后重试';
  }
};

// 导出配置好的axios实例
export const api = createAxiosInstance();

// 导出常用的HTTP方法
export const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.get<T>(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<T>(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.put<T>(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.delete<T>(url, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.patch<T>(url, data, config),
};
