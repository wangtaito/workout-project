import React, { useState } from 'react';
import { WorkoutSummary } from '../components/dashboard/WorkoutSummary';
import { MealSummary } from '../components/dashboard/MealSummary';
import { WorkoutCalendar } from '../components/calendar/WorkoutCalendar';
import { DashboardTabs } from '../components/tabs/DashboardTabs';
import { CoachMessages } from '../components/dashboard/CoachMessages';
import { useWorkout } from '../contexts/WorkoutContext';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState('workout');
  const { events } = useWorkout();

  /**
   * 根据当前激活的标签渲染对应的组件内容
   *
   * @returns 返回对应的组件实例或 null
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'workout':
        return <WorkoutSummary />;
      case 'diet':
        return <MealSummary />;
      case 'messages':
        return <CoachMessages />;
      default:
        return null;
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="grid gap-6 lg:grid-cols-2 min-h-[calc(100vh-12rem)]">
        {/* 左側日曆 - 增加響應式陰影和圓角 */}
        <div className="flex flex-col bg-white rounded-xl shadow-md transition-shadow hover:shadow-lg">
          <div className="flex-1 p-4 sm:p-6">
            <WorkoutCalendar events={events} />
          </div>
        </div>
        
        {/* 右側頁籤內容 - 改善間距和視覺層次 */}
        <div className="flex flex-col bg-white rounded-xl shadow-md">
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 p-4 sm:p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}