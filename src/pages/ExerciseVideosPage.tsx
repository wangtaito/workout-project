import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import exerciseData from '../data/exerciseVideos.json';

interface ExerciseVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  category: string;
  level: string;
}

interface AddVideoFormProps {
  onSubmit: (video: Omit<ExerciseVideo, 'id'>) => void;
  onClose: () => void;
}

// 添加 YouTube URL 解析函數
function getYoutubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// 添加縮圖 URL 生成函數
function generateThumbnailUrl(videoUrl: string): string {
  const videoId = getYoutubeVideoId(videoUrl);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
}

function AddVideoForm({ onSubmit, onClose }: AddVideoFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: '',
    duration: '',
    category: exerciseData.categories[1],
    level: '初級'
  });

  // 當視頻 URL 改變時自動更新縮圖
  const handleVideoUrlChange = (url: string) => {
    const thumbnailUrl = generateThumbnailUrl(url);
    setFormData(prev => ({
      ...prev,
      videoUrl: url,
      thumbnailUrl: thumbnailUrl || prev.thumbnailUrl
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
      <div className="p-6 w-full max-w-2xl bg-white rounded-lg">
        <h2 className="mb-4 text-xl font-semibold">添加新視頻</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">標題</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">分類</label>
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {exerciseData.categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">難度</label>
              <select
                value={formData.level}
                onChange={e => setFormData(prev => ({ ...prev, level: e.target.value }))}
                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="初級">初級</option>
                <option value="中級">中級</option>
                <option value="高級">高級</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">描述</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">視頻URL</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={e => handleVideoUrlChange(e.target.value)}
                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">縮略圖URL</label>
              <input
                type="url"
                value={formData.thumbnailUrl}
                onChange={e => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                placeholder="自動從YouTube獲取，也可手動輸入"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">時長 (格式: MM:SS)</label>
            <input
              type="text"
              value={formData.duration}
              onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="30:00"
              pattern="[0-9]{2}:[0-9]{2}"
              className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ExerciseVideosPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<ExerciseVideo[]>(() => {
    // 從 localStorage 讀取保存的視頻
    const savedVideos = localStorage.getItem('exerciseVideos');
    return savedVideos 
      ? JSON.parse(savedVideos)
      : exerciseData.videos;
  });
  
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { categories } = exerciseData;

  // 監聽滾動事件
  useEffect(() => {
    const handleScroll = () => {
      // 當滾動超過 300px 時顯示按鈕
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 返回頂部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 添加表單驗證
  const validateForm = (data: Omit<ExerciseVideo, 'id'>): string[] => {
    const errors: string[] = [];
    
    if (!data.title.trim()) errors.push('請輸入標題');
    if (!data.description.trim()) errors.push('請輸入描述');
    if (!data.videoUrl.trim()) errors.push('請輸入視頻URL');
    if (!/^([0-5][0-9]):([0-5][0-9])$/.test(data.duration)) {
      errors.push('請輸入正確的時長格式 (MM:SS)');
    }
    
    return errors;
  };

  // 在 handleAddVideo 中添加驗證
  const handleAddVideo = async (videoData: Omit<ExerciseVideo, 'id'>) => {
    try {
      const errors = validateForm(videoData);
      if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
      }

      const newVideo: ExerciseVideo = {
        ...videoData,
        id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      // 使用函數式更新確保數據一致性
      setVideos(prevVideos => {
        const updatedVideos = [...prevVideos, newVideo];
        localStorage.setItem('exerciseVideos', JSON.stringify(updatedVideos));
        return updatedVideos;
      });

      setIsAddingVideo(false);
      alert('視頻添加成功！');
    } catch (error) {
      console.error('Error adding video:', error);
      alert('添加視頻失敗，請稍後重試');
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">運動視頻庫</h1>
          {user?.username === 'admin' ? (
            <button
              onClick={() => setIsAddingVideo(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              添加視頻
            </button>
          ) : (
            <p className="text-sm text-gray-500">請使用admin帳號添加視頻</p>
          )}
        </div>
        
        <div className="mb-6 max-w-xl">
          <input
            type="text"
            placeholder="搜索視頻..."
            className="block px-4 py-2 w-full text-gray-900 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 分類標籤 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors
                ${selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 添加視頻表單 */}
      {isAddingVideo && (
        <AddVideoForm
          onSubmit={handleAddVideo}
          onClose={() => setIsAddingVideo(false)}
        />
      )}

      {/* 視頻列表 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVideos.map(video => (
          <div
            key={video.id}
            className="overflow-hidden bg-white rounded-lg shadow-sm transition-shadow hover:shadow-md"
          >
            {/* 可點擊的視頻縮略圖區域 */}
            <div 
              className="relative h-48 bg-gray-200 cursor-pointer group"
              onClick={() => window.open(video.videoUrl, '_blank')}
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              {/* 時長標籤 */}
              <span className="absolute right-2 bottom-2 px-2 py-1 text-xs font-medium text-white bg-black bg-opacity-75 rounded">
                {video.duration}
              </span>
              {/* 播放按鈕覆蓋層 */}
              <div className="flex absolute inset-0 justify-center items-center bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-30">
                <svg 
                  className="w-16 h-16 text-white opacity-0 transition-opacity group-hover:opacity-100" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded">
                  {video.category}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  {video.level}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">沒有找到符合條件的視頻</p>
        </div>
      )}

      {/* 返回頂部按鈕 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-8 bottom-8 p-3 text-white bg-indigo-600 rounded-full shadow-lg transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="返回頂部"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
} 