import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: language === 'zh' ? '儀表板' : 'Dashboard' },
    { path: '/records', label: language === 'zh' ? '運動記錄' : 'Workout Records' },
    { path: '/videos', label: language === 'zh' ? '運動視頻' : 'Exercise Videos' },
    ...(user?.role === 'admin' ? [{
      path: '/user-management',
      label: language === 'zh' ? '用戶管理' : 'User Management'
    }] : [])
  ];

  return (
    <nav className="bg-white shadow">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-indigo-600">
                {language === 'zh' ? '健身教練系統' : 'Fitness Tracker'}
              </span>
            </div>

            {/* 桌面端導航 */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.path
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 右側功能區 */}
          <div className="flex items-center">
            {/* 語言切換 */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'zh' | 'en')}
              className="hidden md:block px-2 py-1 mr-4 text-sm rounded-md border border-gray-300"
            >
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>

            {/* 用戶名稱 - 僅桌面端顯示 */}
            <span className="hidden md:block text-sm text-gray-700 mr-4">
              {language === 'zh' ? '歡迎，' : 'Welcome, '}{user?.username}
            </span>

            {/* 登出按鈕 */}
            <button
              onClick={logout}
              className="hidden md:block px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {language === 'zh' ? '登出' : 'Logout'}
            </button>

            {/* 移動端菜單按鈕 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* 移動端菜單 */}
        {isMenuOpen && (
          <div className="md:hidden py-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 space-y-2 px-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'zh' | 'en')}
                className="block w-full px-2 py-1 text-base rounded-md border border-gray-300"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
              <button
                onClick={logout}
                className="block w-full px-3 py-2 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {language === 'zh' ? '登出' : 'Logout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 