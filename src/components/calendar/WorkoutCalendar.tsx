import React, { useState } from 'react';
import { WorkoutEvent } from '../../types/workout';

interface WorkoutCalendarProps {
  events: WorkoutEvent[];
}

interface EventDetailsModalProps {
  event: WorkoutEvent;
  onClose: () => void;
}

function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">運動詳情</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">日期</label>
            <p className="mt-1 text-gray-900">
              {new Date(event.date).toLocaleDateString('zh-TW')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">運動類型</label>
            <p className="mt-1 text-gray-900">{event.type}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">時長</label>
            <p className="mt-1 text-gray-900">{event.duration} 分鐘</p>
          </div>
          {event.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-500">備註</label>
              <p className="mt-1 text-gray-900">{event.notes}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-500">狀態</label>
            <p className={`mt-1 ${event.completed ? 'text-green-600' : 'text-gray-600'}`}>
              {event.completed ? '已完成' : '未完成'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkoutCalendar({ events }: WorkoutCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<WorkoutEvent | null>(null);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(today);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const previousMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="w-full">
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {currentMonth.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 text-gray-600 hover:text-gray-900 text-xl"
          >
            ←
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 text-gray-600 hover:text-gray-900 text-xl"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} className="text-center py-2 text-base font-medium text-gray-600">
            {day}
          </div>
        ))}

        {previousMonthDays.map(day => (
          <div
            key={`prev-${day}`}
            className="aspect-square p-2 text-center text-gray-400"
          />
        ))}

        {days.map(day => {
          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );
          const dayEvents = getEventsForDate(date);
          const isToday = 
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

          return (
            <div
              key={day}
              className={`
                aspect-square p-2 text-sm relative
                ${isToday ? 'bg-indigo-50' : ''}
                ${dayEvents.length > 0 ? 'bg-indigo-50/50' : ''}
              `}
            >
              <span className={`
                block mb-2 text-base font-medium
                ${isToday ? 'text-indigo-600 font-semibold text-lg' : 'text-gray-900'}
              `}>
                {day}
              </span>
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-0 right-0 px-1">
                  <div className="flex flex-col gap-0.5">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`text-[11px] truncate rounded px-1 py-0.5 cursor-pointer
                          ${event.completed ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}
                          hover:opacity-80 transition-opacity
                        `}
                        title={`${event.type} - ${event.duration}分鐘`}
                      >
                        {event.type}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}