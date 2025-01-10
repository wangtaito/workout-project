import React, { useState } from 'react';

interface CoachMessage {
  id: string;
  coach: string;
  message: string;
  date: string;
}

export function CoachMessages() {
  const [messages, setMessages] = useState<CoachMessage[]>(() => {
    const saved = localStorage.getItem('coachMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<CoachMessage | null>(null);

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: CoachMessage = {
      id: Date.now().toString(),
      coach: 'David',
      message: newMessage.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    setMessages(prev => {
      const updated = [message, ...prev];
      localStorage.setItem('coachMessages', JSON.stringify(updated));
      return updated;
    });
    setNewMessage('');
  };

  const handleEditMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMessage || !editingMessage.message.trim()) return;

    setMessages(prev => {
      const updated = prev.map(msg => 
        msg.id === editingMessage.id ? editingMessage : msg
      );
      localStorage.setItem('coachMessages', JSON.stringify(updated));
      return updated;
    });
    setEditingMessage(null);
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('確定要刪除這條留言嗎？')) {
      setMessages(prev => {
        const updated = prev.filter(msg => msg.id !== id);
        localStorage.setItem('coachMessages', JSON.stringify(updated));
        return updated;
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-20rem)] bg-white rounded-lg shadow-sm">
      <div className="flex-none p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">教練留言</h2>
      </div>

      <div className="flex-none p-4 border-b border-gray-200">
        <form onSubmit={editingMessage ? handleEditMessage : handleAddMessage} className="space-y-3">
          <textarea
            value={editingMessage ? editingMessage.message : newMessage}
            onChange={(e) => 
              editingMessage 
                ? setEditingMessage({ ...editingMessage, message: e.target.value })
                : setNewMessage(e.target.value)
            }
            placeholder="輸入留言..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {editingMessage ? '保存修改' : '發送留言'}
            </button>
            {editingMessage && (
              <button
                type="button"
                onClick={() => setEditingMessage(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                取消修改
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="flex-1 p-4 overflow-y-auto min-h-0">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map(msg => (
              <div key={msg.id} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium text-gray-900">教練 {msg.coach}</p>
                      <span className="text-sm text-gray-500">{msg.date}</span>
                    </div>
                    <p className="text-sm text-gray-500">{msg.message}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingMessage(msg)}
                      className="p-1 text-indigo-600 hover:text-indigo-700 rounded"
                      title="修改"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-1 text-red-600 hover:text-red-700 rounded"
                      title="刪除"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">暫無留言</p>
              <p className="mt-1 text-xs text-gray-400">
                在上方輸入框添加新留言
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 