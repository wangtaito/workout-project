import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow">
      <nav className="container flex justify-between items-center px-4 py-3 mx-auto">
        <Link to="/" className="text-xl font-bold">健身教練系統</Link>
        
        <div className="flex items-center space-x-4">
          {user?.role === 'admin' && (
            <Link 
              to="/user-management" 
              className="text-gray-600 hover:text-gray-900"
            >
              用戶管理
            </Link>
          )}
          {/* 其他导航项... */}
        </div>
      </nav>
    </header>
  );
} 