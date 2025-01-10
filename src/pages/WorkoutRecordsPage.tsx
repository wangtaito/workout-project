import React, { useState, useMemo } from 'react';
import { useWorkout } from '../contexts/WorkoutContext';
import { WorkoutType } from '../types/workout';
import { getImageUrl } from '../utils/imageUtils';
import { WorkoutBarChart } from '../components/charts/WorkoutBarChart';

type SortType = 'date-desc' | 'date-asc' | 'type';

// 定義每頁顯示的記錄數量
const ITEMS_PER_PAGE = 9;

// 定義顏色數組
const cardColors = [
  'bg-blue-50',
  'bg-green-50',
  'bg-purple-50',
  'bg-pink-50',
  'bg-yellow-50',
  'bg-indigo-50',
  'bg-orange-50',
];

export function WorkoutRecordsPage() {
  const { events } = useWorkout();
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [sortBy, setSortBy] = useState<SortType>('date-desc');
  const [selectedType, setSelectedType] = useState<WorkoutType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const workoutTypes: WorkoutType[] = ['跑步', '健身', '游泳', '瑜伽', '其他'];

  // 排序和過濾記錄
  const sortedAndFilteredEvents = useMemo(() => {
    let filtered = [...events];
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      switch (sortBy) {
        case 'date-desc':
          return dateB - dateA;
        case 'date-asc':
          return dateA - dateB;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });
  }, [events, sortBy, selectedType]);

  // 計算總頁數
  const totalPages = Math.ceil(sortedAndFilteredEvents.length / ITEMS_PER_PAGE);

  // 獲取當前頁的記錄
  const currentRecords = sortedAndFilteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 生成頁碼數組
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  // 處理頁面變更
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 為每個唯一日期分配顏色
  const dateColors = useMemo(() => {
    const uniqueDates = [...new Set(sortedAndFilteredEvents.map(event => 
      new Date(event.date).toLocaleDateString('zh-TW')
    ))];
    
    return Object.fromEntries(
      uniqueDates.map((date, index) => [
        date,
        cardColors[index % cardColors.length]
      ])
    );
  }, [sortedAndFilteredEvents]);

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">我的運動記錄</h1>
        
        <div className="flex space-x-4">
          {/* 排序選擇 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="date-desc">時間（新到舊）</option>
            <option value="date-asc">時間（舊到新）</option>
            <option value="type">運動類型</option>
          </select>

          {/* 類型篩選 */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as WorkoutType | 'all')}
            className="px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">所有類型</option>
            {workoutTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 添加長條圖 */}
      <WorkoutBarChart events={events} />

      {/* 顯示篩選結果數量和分頁信息 */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          共 {sortedAndFilteredEvents.length} 條記錄
        </span>
        <span className="text-sm text-gray-500">
          第 {currentPage} 頁，共 {totalPages} 頁
        </span>
      </div>

      {/* 記錄列表 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentRecords.map(event => {
          const eventDate = new Date(event.date).toLocaleDateString('zh-TW');
          const cardColor = dateColors[eventDate];
          
          return (
            <div
              key={event.id}
              className={`p-4 rounded-lg shadow-sm transition-shadow hover:shadow-md ${cardColor}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{event.type}</h3>
                  <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  event.completed 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.completed ? '已完成' : '進行中'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">計劃時長</span>
                  <span className="text-sm font-medium">{event.duration} 分鐘</span>
                </div>
                
                {event.notes && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{event.notes}</p>
                  </div>
                )}

                {/* 如果有運動記錄，顯示記錄信息 */}
                {event.record && (
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <h4 className="mb-2 text-sm font-medium text-gray-900">運動記錄</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">實際時長</span>
                        <span className="text-sm">{event.record.duration} 分鐘</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">體重</span>
                        <span className="text-sm">{event.record.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">平均心率</span>
                        <span className="text-sm">{event.record.heartRate.avg} bpm</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedRecord(event)}
                  className="px-4 py-2 mt-3 w-full text-sm font-medium text-indigo-600 bg-white bg-opacity-75 rounded-md hover:bg-opacity-100"
                >
                  查看詳情
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 分頁控制器 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            上一頁
          </button>
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                currentPage === number
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            下一頁
          </button>
        </div>
      )}

      {/* 如果沒有記錄 */}
      {sortedAndFilteredEvents.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">沒有找到符合條件的運動記錄</p>
        </div>
      )}

      {/* 詳情模態框 */}
      {selectedRecord && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="relative p-6 w-full max-w-2xl bg-white rounded-lg shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  運動詳情
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {formatDate(selectedRecord.date)}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 text-gray-400 rounded-full hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* 基本信息 */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">運動類型</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRecord.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">狀態</label>
                    <p className={`mt-1 text-sm ${
                      selectedRecord.completed ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedRecord.completed ? '已完成' : '進行中'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">計劃時長</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRecord.duration} 分鐘</p>
                  </div>
                  {selectedRecord.notes && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-500">備註</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRecord.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 運動記錄 */}
              {selectedRecord.record && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="mb-3 text-sm font-medium text-gray-900">運動記錄</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">實際時長</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedRecord.record.duration} 分鐘
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">體重</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedRecord.record.weight} kg
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">心率範圍</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedRecord.record.heartRate.min} - {selectedRecord.record.heartRate.max} bpm
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">平均心率</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedRecord.record.heartRate.avg} bpm
                      </p>
                    </div>
                    {selectedRecord.record.notes && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-500">運動感受</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.record.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* 照片展示 */}
                  {selectedRecord.record?.photoUrls && selectedRecord.record.photoUrls.length > 0 && (
                    <div className="mt-4">
                      <label className="block mb-2 text-sm font-medium text-gray-500">運動照片</label>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedRecord.record.photoUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={getImageUrl(url)}
                              alt={`運動照片 ${index + 1}`}
                              className="object-cover w-full h-24 rounded cursor-pointer hover:opacity-90"
                              onClick={() => window.open(getImageUrl(url), '_blank')}
                            />
                            <div className="flex absolute inset-0 justify-center items-center bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-20">
                              <span className="text-white opacity-0 group-hover:opacity-100">
                                點擊查看
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 