import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, UserRole } from '../types/user';
import { getUsers, createUser, deleteUser } from '../api/users';

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user' as UserRole
  });

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      setError('請使用管理員帳號進入！');
      return;
    }
    fetchUsers();
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('獲取用戶列表失敗');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
        username: formData.username,
        password: formData.password,
        role: formData.role
      });
      await fetchUsers();
      setFormData({ username: '', password: '', role: 'user' });
    } catch (err) {
      setError('創建用戶失敗');
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const success = await deleteUser(userId);
      if (success) {
        await fetchUsers();
      } else {
        setError('刪除用戶失敗');
      }
    } catch (err) {
      setError('刪除用戶失敗');
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-6 text-xl md:text-2xl font-bold">用戶管理</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">用戶名：
              <input
                type="text"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </label>
          </div>
          
          <div>
            <label className="block mb-2">密碼：
              <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </label>
          </div>
          
          <div>
            <label className="block mb-2">角色：
              <select
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="user">使用者</option>
                <option value="trainer">教練</option>
                <option value="admin">管理員</option>
              </select>
            </label>
          </div>
        </div>

        <button type="submit" className="w-full md:w-auto px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          新增用戶
        </button>
      </form>

      {/* 移動端卡片式列表 */}
      <div className="block md:hidden space-y-4">
        {users.map(user => (
          <div key={user.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{user.username}</span>
              <span className="text-sm text-gray-500">{user.role}</span>
            </div>
            <button
              onClick={() => handleDelete(user.id)}
              className="w-full mt-2 px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
            >
              刪除
            </button>
          </div>
        ))}
      </div>

      {/* 桌面端表格 */}
      <div className="hidden md:block">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">用戶名</th>
              <th className="p-2 border">角色</th>
              <th className="p-2 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 