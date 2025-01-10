import React, { useState } from 'react';
import { 
  MealRecord, 
  MealType, 
  Vegetable,
  VegetableType, 
  CookingMethod, 
  ProteinType, 
  StarchType, 
  BeverageType, 
  SatietyLevel, 
  Portion 
} from '../../types/meal';

interface MealRecordFormProps {
  record?: MealRecord;
  onSubmit: (record: MealRecord) => void;
  onCancel: () => void;
}

const FOOD_OPTIONS = {
  vegetables: ['無', '菠菜', '西蘭花', '胡蘿蔔', '生菜', '青椒', '茄子', '其他'],
  proteins: ['無', '雞肉', '魚肉', '豆腐', '雞蛋', '牛肉', '豬肉', '其他'],
  starches: ['無', '米飯', '麵條', '土豆', '紅薯', '全麥麵包', '其他']
};

export function MealRecordForm({ record, onSubmit, onCancel }: MealRecordFormProps) {
  const [formData, setFormData] = useState<MealRecord>(() => {
    if (record) {
      return { ...record };
    }
    return {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].slice(0, 5),
      mealType: '午餐',
      vegetables: [
        { type: '菠菜', cookingMethod: '清炒', portion: '適中' },
        { type: '西蘭花', cookingMethod: '蒸煮', portion: '適中' }
      ] as [Vegetable, Vegetable],
      protein: { type: '雞肉', cookingMethod: '煎炸', portion: '適中' },
      starch: { type: '米飯', cookingMethod: '蒸煮', portion: '適中' },
      additionals: '',
      beverage: { type: '水', amount: '一杯' },
      satietyLevel: '適中',
      satisfaction: 3,
      notes: ''
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // 通用的選擇項渲染函數
  const renderFoodSection = (
    label: string,
    type: string,
    cookingMethod: string,
    portion: string,
    onChange: (field: 'type' | 'cookingMethod' | 'portion', value: string) => void,
    options: string[]
  ) => (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">種類</label>
        <select
          value={type}
          onChange={(e) => onChange('type', e.target.value)}
          className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">烹飪方式</label>
        <select
          value={cookingMethod}
          onChange={(e) => onChange('cookingMethod', e.target.value)}
          className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {['清炒', '蒸煮', '生食', '燉煮', '烤製', '煎炸'].map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">份量</label>
        <select
          value={portion}
          onChange={(e) => onChange('portion', e.target.value)}
          className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {['少量', '適中', '較多'].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const handleVegetableChange = (index: number, field: 'type' | 'cookingMethod' | 'portion', value: string) => {
    const newVegetables = [...formData.vegetables];
    newVegetables[index] = {
      ...newVegetables[index],
      [field]: value,
      ...(field === 'type' && value === '無' ? {
        cookingMethod: '清炒',
        portion: '適中'
      } : {})
    };
    setFormData(prev => ({ 
      ...prev, 
      vegetables: newVegetables as [Vegetable, Vegetable] 
    }));
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">添加飲食記錄</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">日期</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">時間</label>
              <input
                type="time"
                value={formData.time}
                onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">餐次</label>
              <select
                value={formData.mealType}
                onChange={e => setFormData(prev => ({ ...prev, mealType: e.target.value as MealType }))}
                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {['早餐', '午餐', '晚餐', '加餐'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 蔬菜部分 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">兩份蔬菜</h3>
            {formData.vegetables.map((veg, index) => (
              <div key={index}>
                <p className="mb-2 text-sm text-gray-500">第 {index + 1} 份蔬菜</p>
                {renderFoodSection(
                  `蔬菜 ${index + 1}`,
                  veg.type,
                  veg.cookingMethod,
                  veg.portion,
                  (field, value) => handleVegetableChange(index, field, value as any),
                  FOOD_OPTIONS.vegetables
                )}
              </div>
            ))}
          </div>

          {/* 蛋白質部分 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">蛋白質</h3>
            {renderFoodSection(
              '蛋白質',
              formData.protein.type,
              formData.protein.cookingMethod,
              formData.protein.portion,
              (field, value) => {
                setFormData(prev => ({
                  ...prev,
                  protein: {
                    ...prev.protein,
                    [field]: value,
                    ...(field === 'type' && value === '無' ? {
                      cookingMethod: '清炒',
                      portion: '適中'
                    } : {})
                  }
                }));
              },
              FOOD_OPTIONS.proteins
            )}
          </div>

          {/* 主食部分 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">主食</h3>
            {renderFoodSection(
              '主食',
              formData.starch.type,
              formData.starch.cookingMethod,
              formData.starch.portion,
              (field, value) => {
                setFormData(prev => ({
                  ...prev,
                  starch: {
                    ...prev.starch,
                    [field]: value,
                    ...(field === 'type' && value === '無' ? {
                      cookingMethod: '清炒',
                      portion: '適中'
                    } : {})
                  }
                }));
              },
              FOOD_OPTIONS.starches
            )}
          </div>

          {/* 額外添加物 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">額外添加物</label>
            <input
              type="text"
              value={formData.additionals}
              onChange={e => setFormData(prev => ({ ...prev, additionals: e.target.value }))}
              placeholder="例如：醬料、調味料等"
              className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* 飲品 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">飲品種類</label>
              <select
                value={formData.beverage.type}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  beverage: { ...prev.beverage, type: e.target.value as BeverageType }
                }))}
                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {['水', '茶', '咖啡', '果汁', '奶類', '其他'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">飲品量</label>
              <input
                type="text"
                value={formData.beverage.amount}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  beverage: { ...prev.beverage, amount: e.target.value }
                }))}
                placeholder="例：一杯、500ml"
                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* 主觀評價 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">飽腹感</label>
              <select
                value={formData.satietyLevel}
                onChange={e => setFormData(prev => ({ ...prev, satietyLevel: e.target.value as SatietyLevel }))}
                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {['非常飽', '適中', '仍感飢餓'].map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">滿意度</label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.satisfaction}
                onChange={e => setFormData(prev => ({ ...prev, satisfaction: parseInt(e.target.value) }))}
                className="block mt-1 w-full"
              />
            </div>
          </div>

          {/* 備註 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">備註</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="任何特別需要注意的地方..."
            />
          </div>

          {/* 按鈕 */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 