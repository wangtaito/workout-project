import React, { useState, useRef } from 'react';
import { useWorkout } from '../../contexts/WorkoutContext';
import { WorkoutEvent, WorkoutType } from '../../types/workout';
import { saveImage } from '../../utils/imageUtils';

interface WorkoutRecord {
  id: string;
  workoutId: string;
  date: Date;
  weight: number;
  duration: number;
  heartRate: {
    min: number;
    max: number;
    avg: number;
  };
  notes: string;
  photoUrls: string[];
}

export function WorkoutSummary() {
  const { events, toggleCompletion, deleteEvent, addEvent, addWorkoutRecord } = useWorkout();
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutEvent | null>(null);
  const [recordNotes, setRecordNotes] = useState('');
  const [recordPhotos, setRecordPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recordForm, setRecordForm] = useState({
    weight: '',
    duration: '',
    heartRate: {
      min: '',
      max: '',
      avg: ''
    },
    notes: '',
    photoUrls: [] as string[]
  });
  const [newWorkout, setNewWorkout] = useState({
    type: '跑步' as WorkoutType,
    duration: '30',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const workoutEvent: WorkoutEvent = {
      id: Date.now().toString(),
      type: newWorkout.type,
      duration: parseInt(newWorkout.duration),
      notes: newWorkout.notes,
      date: new Date(newWorkout.date),
      completed: false
    };
    addEvent(workoutEvent);
    setIsAddingWorkout(false);
    setNewWorkout({
      type: '跑步',
      duration: '30',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const filteredWorkouts = React.useMemo(() => {
    return events
      .filter(event => {
        if (filter === 'completed') return event.completed;
        if (filter === 'incomplete') return !event.completed;
        return true;
      })
      .map(event => ({
        ...event,
        date: new Date(event.date)
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [events, filter]);

  const formatDate = (date: Date) => {
    try {
      return new Date(date).toLocaleDateString('zh-TW', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '日期錯誤';
    }
  };

  const handleToggleCompletion = (eventId: string) => {
    if (window.confirm('您確定要標記此活動為完成/未完成嗎？')) {
      toggleCompletion(eventId);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      try {
        // 保存預覽
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPhotoPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        
        // 保存文件
        setRecordPhotos(prev => [...prev, ...files]);

        // 保存到 public/person-images
        const savedPaths = await Promise.all(files.map(file => saveImage(file)));
        setRecordForm(prev => ({
          ...prev,
          photoUrls: [...(prev.photoUrls || []), ...savedPaths]
        }));
      } catch (error) {
        console.error('Error uploading photos:', error);
        // 這裡可以添加錯誤提示
      }
    }
  };

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkout) return;

    const record = {
      weight: parseFloat(recordForm.weight),
      duration: parseInt(recordForm.duration),
      heartRate: {
        min: parseInt(recordForm.heartRate.min),
        max: parseInt(recordForm.heartRate.max),
        avg: parseInt(recordForm.heartRate.avg)
      },
      notes: recordForm.notes,
      photoUrls: recordForm.photoUrls || [] // 使用保存的照片路徑
    };

    addWorkoutRecord(selectedWorkout.id, record);
    
    // 清理預覽 URL
    photoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    
    // 重置表單
    setIsAddingRecord(false);
    setRecordForm({
      weight: '',
      duration: '',
      heartRate: { min: '', max: '', avg: '' },
      notes: '',
      photoUrls: []
    });
    setRecordPhotos([]);
    setPhotoPreviewUrls([]);
    setSelectedWorkout(null);
  };

  const removePhoto = (index: number) => {
    setRecordPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">近期運動</h2>
        <button
          onClick={() => setIsAddingWorkout(true)}
          className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          新增活動
        </button>
      </div>

      {isAddingWorkout && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              新增運動活動
            </h3>
            <form onSubmit={handleAddWorkout} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  日期
                </label>
                <input
                  type="date"
                  value={newWorkout.date}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, date: e.target.value }))}
                  className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  運動類型
                </label>
                <select
                  value={newWorkout.type}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, type: e.target.value as WorkoutType }))}
                  className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="跑步">跑步</option>
                  <option value="健身">健身</option>
                  <option value="游泳">游泳</option>
                  <option value="瑜伽">瑜伽</option>
                  <option value="其他">其他</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  時長（分鐘）
                </label>
                <input
                  type="number"
                  value={newWorkout.duration}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, duration: e.target.value }))}
                  className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  備註
                </label>
                <textarea
                  value={newWorkout.notes}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, notes: e.target.value }))}
                  className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end pt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingWorkout(false)}
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
      )}

      {isAddingRecord && selectedWorkout && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="p-6 w-full max-w-2xl bg-white rounded-lg shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  運動記錄 - {selectedWorkout.type}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {formatDate(selectedWorkout.date)}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddingRecord(false);
                  setRecordForm({
                    weight: '',
                    duration: '',
                    heartRate: { min: '', max: '', avg: '' },
                    notes: '',
                    photoUrls: [] 
                  });
                  setRecordPhotos([]);
                  setPhotoPreviewUrls([]);
                  setSelectedWorkout(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">計劃時長</label>
                    <p className="text-gray-900">{selectedWorkout.duration} 分鐘</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">備註</label>
                    <p className="text-gray-900">{selectedWorkout.notes || '無'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    體重 (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={recordForm.weight}
                    onChange={(e) => setRecordForm(prev => ({ ...prev, weight: e.target.value }))}
                    className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="例：65.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    實際時長 (分鐘)
                  </label>
                  <input
                    type="number"
                    value={recordForm.duration}
                    onChange={(e) => setRecordForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`計劃：${selectedWorkout.duration}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    最低心率 (bpm)
                  </label>
                  <input
                    type="number"
                    value={recordForm.heartRate.min}
                    onChange={(e) => setRecordForm(prev => ({
                      ...prev,
                      heartRate: { ...prev.heartRate, min: e.target.value }
                    }))}
                    className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="例：60"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    最高心率 (bpm)
                  </label>
                  <input
                    type="number"
                    value={recordForm.heartRate.max}
                    onChange={(e) => setRecordForm(prev => ({
                      ...prev,
                      heartRate: { ...prev.heartRate, max: e.target.value }
                    }))}
                    className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="例：150"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    平均心率 (bpm)
                  </label>
                  <input
                    type="number"
                    value={recordForm.heartRate.avg}
                    onChange={(e) => setRecordForm(prev => ({
                      ...prev,
                      heartRate: { ...prev.heartRate, avg: e.target.value }
                    }))}
                    className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="例：120"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  運動感受與記錄
                </label>
                <textarea
                  value={recordForm.notes}
                  onChange={(e) => setRecordForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                  placeholder="記錄您的運動感受、成果等..."
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  上傳照片
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  選擇照片
                </button>

                {/* 照片預覽區域 */}
                {photoPreviewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {photoPreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`預覽 ${index + 1}`}
                          className="object-cover w-full h-24 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="flex absolute top-1 right-1 justify-center items-center w-5 h-5 text-xs text-white bg-red-500 rounded-full"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingRecord(false);
                    setRecordForm({
                      weight: '',
                      duration: '',
                      heartRate: { min: '', max: '', avg: '' },
                      notes: '',
                      photoUrls: []
                    });
                    setRecordPhotos([]);
                    setPhotoPreviewUrls([]);
                    setSelectedWorkout(null);
                  }}
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
      )}

      <div className="flex justify-between items-center mt-4 mb-2">
        <div className="space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              filter === 'all' ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            完成
          </button>
          <button
            onClick={() => setFilter('incomplete')}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              filter === 'incomplete' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            未完成
          </button>
        </div>
      </div>
      <div className="overflow-y-auto mt-4 space-y-3 h-[calc(100vh-28rem)]">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map(workout => (
            <div 
              key={workout.id} 
              className="p-3 bg-gray-50 rounded-md transition-colors hover:bg-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-900">
                    {workout.type}
                  </span>
                  {workout.notes && (
                    <p className="mt-1 text-sm text-gray-500">
                      {workout.notes}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">
                    {formatDate(workout.date)}
                  </span>
                  <p className="mt-1 text-sm font-medium text-gray-600">
                    {workout.duration} 分鐘
                  </p>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleToggleCompletion(workout.id)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    workout.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {workout.completed ? '完成' : '未完成'}
                </button>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setSelectedWorkout(workout);
                      setIsAddingRecord(true);
                    }}
                    className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    記錄
                  </button>
                  {!workout.completed && (
                    <button
                      onClick={() => deleteEvent(workout.id)}
                      className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      刪除
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-gray-500">暫無運動記錄</p>
            <p className="mt-1 text-xs text-gray-400">
              點擊日曆來添加新的運動記錄
            </p>
          </div>
        )}
      </div>
    </div>
  );
}