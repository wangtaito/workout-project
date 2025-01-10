export type UserRole = 'admin' | 'trainer' | 'user';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
} 