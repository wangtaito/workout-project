import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

/**
 * Layout 函数组件，用于创建应用的整体布局。
 *
 * @returns 返回应用的整体布局 JSX 元素。
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