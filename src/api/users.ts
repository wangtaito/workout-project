import { User } from '../types/user';

// 模拟数据库中的用户数据
let users: User[] = [
  {
    id: 'admin-id',
    username: 'admin',
    password: '123', // 实际应用中不应明文存储密码
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'trainer-id',
    username: 'trainer',
    password: '123',
    role: 'trainer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-id',
    username: 'user',
    password: '123',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// 获取用户列表
export async function getUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    // 模拟API延迟
    setTimeout(() => {
      resolve(users.map(user => ({...user, password: '******'})));
    }, 500);
  });
}

// 创建新用户
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  return new Promise((resolve) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    resolve({...newUser, password: '******'});
  });
}

// 删除用户
export async function deleteUser(userId: string): Promise<boolean> {
  return new Promise((resolve) => {
    const initialLength = users.length;
    users = users.filter(user => user.id !== userId);
    resolve(users.length !== initialLength);
  });
} 