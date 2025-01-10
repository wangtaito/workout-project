import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/user';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password, role);
    if (success) {
      navigate('/');
    } else {
      setError('用戶名或密碼錯誤');
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-12 min-h-screen bg-gray-50 sm:px-6 lg:px-8">
      <div className="space-y-8 w-full max-w-md">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            歡迎來到健身工廠，<br />請登入您的帳號
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">用戶名</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block relative px-3 py-2 w-full placeholder-gray-500 text-gray-900 rounded-t-md border border-gray-300 appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="用戶名"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">密碼</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block relative px-3 py-2 w-full placeholder-gray-500 text-gray-900 border border-gray-300 appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="密碼"
              />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">用戶類型</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="block relative px-3 py-2 w-full text-gray-900 rounded-b-md border border-gray-300 appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="user">使用者</option>
                <option value="trainer">教練</option>
                <option value="admin">管理員</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="text-sm text-center text-red-500">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="flex relative justify-center px-4 py-2 w-full text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              登入
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}