import React, { useState } from 'react';
import { MealRecord } from '../../types/meal';
import { MealRecordForm } from './MealRecordForm';
import { calculateTotalCalories } from '../../utils/calorieCalculator';

interface MealDetailModalProps {
  record: MealRecord;
  onClose: () => void;
}

function MealDetailModal({ record, onClose }: MealDetailModalProps) {
  const calories = calculateTotalCalories(
    record.vegetables,
    record.protein,
    record.starch
  );

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {record.mealType} 詳情
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {record.date} {record.time}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 rounded-full hover:text-gray-500 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* 卡路里信息 */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="mb-2 text-sm font-medium text-blue-900">卡路里估算</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700">蔬菜：{Math.round(calories.vegetablesCalories)} 千卡</p>
                <p className="text-blue-700">蛋白質：{Math.round(calories.proteinCalories)} 千卡</p>
                <p className="text-blue-700">主食：{Math.round(calories.starchCalories)} 千卡</p>
              </div>
              <div className="flex justify-end items-end">
                <p className="text-lg font-semibold text-blue-900">
                  總計：{Math.round(calories.totalCalories)} 千卡
                </p>
              </div>
            </div>
          </div>

          {/* 蔬菜部分 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">兩份蔬菜</h4>
            {record.vegetables.map((veg, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">第 {index + 1} 份：{veg.type}</p>
                <div className="grid grid-cols-2 gap-2 mt-1 text-sm text-gray-500">
                  <p>烹飪方式：{veg.cookingMethod}</p>
                  <p>份量：{veg.portion}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 蛋白質部分 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">蛋白質</h4>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">{record.protein.type}</p>
              <div className="grid grid-cols-2 gap-2 mt-1 text-sm text-gray-500">
                <p>烹飪方式：{record.protein.cookingMethod}</p>
                <p>份量：{record.protein.portion}</p>
              </div>
            </div>
          </div>

          {/* 主食部分 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">主食</h4>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">{record.starch.type}</p>
              <div className="grid grid-cols-2 gap-2 mt-1 text-sm text-gray-500">
                <p>烹飪方式：{record.starch.cookingMethod}</p>
                <p>份量：{record.starch.portion}</p>
              </div>
            </div>
          </div>

          {/* 飲品和額外添加物 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">飲品</h4>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">{record.beverage.type}</p>
                <p className="mt-1 text-sm text-gray-500">數量：{record.beverage.amount}</p>
              </div>
            </div>
            {record.additionals && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">額外添加物</h4>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">{record.additionals}</p>
                </div>
              </div>
            )}
          </div>

          {/* 評價 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">飽腹感</h4>
              <p className="text-sm text-gray-700">{record.satietyLevel}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">滿意度</h4>
              <p className="text-sm text-gray-700">{record.satisfaction}/5</p>
            </div>
          </div>

          {/* 備註 */}
          {record.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">備註</h4>
              <p className="text-sm text-gray-700">{record.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MealSummary() {
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealRecord | null>(null);
  const [editingMeal, setEditingMeal] = useState<MealRecord | null>(null);
  const [meals, setMeals] = useState<MealRecord[]>(() => {
    const savedMeals = localStorage.getItem('mealRecords');
    return savedMeals ? JSON.parse(savedMeals) : [];
  });

  const handleAddMeal = (record: MealRecord) => {
    setMeals(prev => {
      const newMeals = [...prev, record];
      localStorage.setItem('mealRecords', JSON.stringify(newMeals));
      return newMeals;
    });
    setIsAddingMeal(false);
  };

  const handleEditMeal = (record: MealRecord) => {
    setMeals(prev => {
      const newMeals = prev.map(meal => 
        meal.id === record.id ? record : meal
      );
      localStorage.setItem('mealRecords', JSON.stringify(newMeals));
      return newMeals;
    });
    setEditingMeal(null);
  };

  const handleDeleteMeal = (id: string) => {
    if (window.confirm('確定要刪除這條記錄嗎？')) {
      setMeals(prev => {
        const newMeals = prev.filter(meal => meal.id !== id);
        localStorage.setItem('mealRecords', JSON.stringify(newMeals));
        return newMeals;
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-TW', {
      month: 'long',
      day: 'numeric'
    });
  };

  // 按日期和時間排序的記錄
  const sortedMeals = meals.sort((a, b) => {
    // 先比較日期
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // 如果日期相同，比較時間
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    return (timeB[0] * 60 + timeB[1]) - (timeA[0] * 60 + timeA[1]);
  });

  // 按日期分組的記錄
  const groupedMeals = sortedMeals.reduce((groups, meal) => {
    const date = meal.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(meal);
    return groups;
  }, {} as Record<string, MealRecord[]>);

  return (
    <div className="flex flex-col h-[calc(100vh-20rem)] bg-white rounded-lg shadow-sm">
      {/* 頂部固定部分 */}
      <div className="flex-none p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">飲食記錄</h2>
          <button
            onClick={() => setIsAddingMeal(true)}
            className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            添加記錄
          </button>
        </div>
      </div>

      {/* 可捲動的記錄列表 */}
      <div className="overflow-y-auto flex-1 min-h-0">
        <div className="p-4 space-y-6">
          {Object.entries(groupedMeals).map(([date, dayMeals]) => (
            <div key={date} className="space-y-3">
              <h3 className="sticky top-0 py-2 text-sm font-medium text-gray-500 bg-white">
                {formatDate(date)}
              </h3>
              {dayMeals.map(meal => {
                const calories = calculateTotalCalories(
                  meal.vegetables,
                  meal.protein,
                  meal.starch
                );

                return (
                  <div
                    key={meal.id}
                    className="p-3 bg-gray-50 rounded-md transition-colors hover:bg-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {meal.mealType}
                          </span>
                          <span className="text-sm text-gray-500">
                            {meal.time}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          {meal.vegetables.map(v => v.type).join('、')}
                          {' + '}
                          {meal.protein.type}
                          {' + '}
                          {meal.starch.type}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-blue-600">
                        {Math.round(calories.totalCalories)} 千卡
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>飽腹感: {meal.satietyLevel}</span>
                        <span>滿意度: {meal.satisfaction}/5</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMeal(meal);
                          }}
                          className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          查看
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingMeal(meal);
                          }}
                          className="px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          修改
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMeal(meal.id);
                          }}
                          className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {meals.length === 0 && (
            <div className="py-6 text-center">
              <p className="text-sm text-gray-500">暫無飲食記錄</p>
              <p className="mt-1 text-xs text-gray-400">
                點擊上方按鈕添加記錄
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 添加記錄表單 */}
      {isAddingMeal && (
        <MealRecordForm
          onSubmit={handleAddMeal}
          onCancel={() => setIsAddingMeal(false)}
        />
      )}

      {/* 編輯記錄表單 */}
      {editingMeal && (
        <MealRecordForm
          record={editingMeal}
          onSubmit={handleEditMeal}
          onCancel={() => setEditingMeal(null)}
        />
      )}

      {/* 記錄詳情模態框 */}
      {selectedMeal && (
        <MealDetailModal
          record={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </div>
  );
} 