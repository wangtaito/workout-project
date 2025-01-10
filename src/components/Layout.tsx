import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import React from 'react';

/**
 * 布局组件
 *
 * 返回整个页面的布局结构，包含导航栏和主要内容区域
 *
 * @returns 返回包含导航栏和主要内容区域的 JSX 元素
 */
export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navigation />
      <main className="container flex-grow px-4 py-8 mx-auto">
        <Outlet />
      </main>
    </div>
  );
}