// src/utils/constants.ts
export const ROLES = {
  ADMIN: 'ADMIN',
  DENTIST: 'DENTIST',
  TECHNICIAN: 'TECHNICIAN',
  VIEWER: 'VIEWER',
  CLINIC_ADMIN: 'CLINIC_ADMIN',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  [ROLES.ADMIN]: '管理员',
  [ROLES.DENTIST]: '医生',
  [ROLES.TECHNICIAN]: '技师',
  [ROLES.VIEWER]: '查看者',
  [ROLES.CLINIC_ADMIN]: '诊所管理员',
};

export const ROLE_COLORS: Record<string, string> = {
  [ROLES.ADMIN]: 'red',
  [ROLES.DENTIST]: 'blue',
  [ROLES.TECHNICIAN]: 'green',
  [ROLES.VIEWER]: 'orange',
  [ROLES.CLINIC_ADMIN]: 'purple',
};

// src/utils/helpers.ts
/**
 * 格式化日期时间
 */
export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * 获取文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
