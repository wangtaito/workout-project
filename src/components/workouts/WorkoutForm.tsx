import React from 'react';
import { WorkoutType } from '../../types/workout';

interface WorkoutFormProps {
  selectedDate: Date;
  onSubmit: (workout: {
    type: WorkoutType;
    duration: number;
    notes: string;
  }) => void;
  onClose: () => void;
}

export function WorkoutForm({ selectedDate, onSubmit, onClose }: WorkoutFormProps) {
  const [type, setType] = React.useState<WorkoutType>('跑步');
  const [duration, setDuration] = React.useState('30');
  const [notes, setNotes] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      duration: parseInt(duration),
      notes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            新增運動記錄 - {selectedDate.toLocaleDateString('zh-TW')}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                運動類型
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as WorkoutType)}
                className="w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="跑步">跑步</option>
                <option value="健身">健身</option>
                <option value="游泳">游泳</option>
                <option value="瑜伽">瑜伽</option>
                <option value="其他">其他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                運動時長（分鐘）
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                備註
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}