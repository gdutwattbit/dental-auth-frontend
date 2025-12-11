export const UserRole = {
  ADMIN: 'ADMIN',
  DENTIST: 'DENTIST',
  TECHNICIAN: 'TECHNICIAN',
  VIEWER: 'VIEWER',
  CLINIC_ADMIN: 'CLINIC_ADMIN'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'passwordHash'>;
}
