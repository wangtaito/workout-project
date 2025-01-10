import React from 'react';

interface DietRecord {
  id: string;
  date: Date;
  meals: {
    type: '早餐' | '午餐' | '晚餐' | '點心';
    calories: number;
    notes: string;
  }[];
}

export function DietSummary() {
  // 這裡之後可以通過 Context 獲取實際的飲食記錄
  const dietRecords: DietRecord[] = [];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900">飲食概覽</h2>
      <div className="mt-4 space-y-4">
        {dietRecords.length > 0 ? (
          dietRecords.map(record => (
            <div key={record.id} className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {new Date(record.date).toLocaleDateString('zh-TW')}
                </span>
                <span className="text-sm text-gray-500">
                  總熱量: {record.meals.reduce((sum, meal) => sum + meal.calories, 0)} 卡路里
                </span>
              </div>
              <div className="mt-2 space-y-1">
                {record.meals.map((meal, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {meal.type}: {meal.calories} 卡路里
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">暫無飲食記錄</p>
            <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-500">
              + 添加今日飲食記錄
            </button>
          </div>
        )}
      </div>
    </div>
  );
}