import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  const navItems = [
    { path: '/', label: language === 'zh' ? '儀表板' : 'Dashboard' },
    { path: '/records', label: language === 'zh' ? '運動記錄' : 'Workout Records' },
    { path: '/videos', label: language === 'zh' ? '運動視頻' : 'Exercise Videos' },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <span className="text-xl font-bold text-indigo-600">
                {language === 'zh' ? '健身工廠' : 'Fitness Factory'}
              </span>
            </div>

            {/* 導航鏈接 */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    location.pathname === item.path
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 右側用戶信息和語言切換 */}
          <div className="flex items-center space-x-4">
            {/* 語言切換 */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'zh' | 'en')}
              className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>

            {/* 用戶名稱 */}
            <span className="text-sm text-gray-700">
              {language === 'zh' ? '歡迎，' : 'Welcome, '}{user?.username}
            </span>

            {/* 登出按鈕 */}
            <button
              onClick={logout}
              className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {language === 'zh' ? '登出' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 