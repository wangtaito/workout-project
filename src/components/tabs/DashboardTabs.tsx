import React from 'react';

interface TabProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * DashboardTabs 组件
 *
 * @param activeTab 当前激活的标签页 ID
 * @param onTabChange 标签页改变时的回调函数
 * @returns 返回包含标签页的 JSX 元素
 */
export function DashboardTabs({ activeTab, onTabChange }: TabProps) {
  const tabs = [
    { id: 'workout', name: '運動概覽' },
    { id: 'diet', name: '飲食概覽' },
    { id: 'messages', name: '教練留言' }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-4 px-2 border-b-2 font-medium text-sm
              ${activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}