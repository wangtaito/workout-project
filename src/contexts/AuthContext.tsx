import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types/user';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  /**
   * 用户登录函数
   *
   * @param username 用户名
   * @param password 密码
   * @param role 用户角色
   * @returns 登录成功返回true，失败返回false
   */
  const login = async (username: string, password: string, role: UserRole) => {
    if (username === 'admin' && password === '123' && role === 'admin') {
      const user = {
        id: 'admin-id',
        username: 'admin',
        role: 'admin' as const,
        password: '',  // 不存储实际密码
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    if (username === 'trainer' && password === '123' && role === 'trainer') {
      const user = {
        id: 'trainer-id',
        username: 'trainer',
        role: 'trainer' as const,
        password: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    if (username === 'user' && password === '123' && role === 'user') {
      const user = {
        id: 'user-id',
        username: 'user',
        role: 'user' as const,
        password: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 