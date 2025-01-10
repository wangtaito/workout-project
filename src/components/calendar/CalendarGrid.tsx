import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { WorkoutEvent } from '../../types/workout';

interface CalendarGridProps {
  currentDate: Date;
  events: WorkoutEvent[];
  onDateClick: (date: Date) => void;
}

export function CalendarGrid({ currentDate, events, onDateClick }: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className="py-2 text-sm font-semibold text-center bg.custom-bg-color {
  background-color: #777777; /* 替换为你的颜色 */
}-gray-50"><div className="grid grid-cols-7 gap-px px-4 bg-gray-200">
  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
    <div key={day} className="py-2 text-sm font-semibold text-center bg-gray-50">
      {day}
    </div>
  ))}
  {days.map((day) => {
    const dayEvents = events.filter(event => 
      format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );

    return (
      <button
        key={day.toString()}
        onClick={() => onDateClick(day)}
        className={`
          min-h-[100px] p-2 bg-white
          ${!isSameMonth(day, currentDate) ? 'text-gray-400' : ''}
          ${isToday(day) ? 'bg-blue-50' : ''}`}
      >
        <div className="text-right">{format(day, 'd')}</div>
        {dayEvents.map(event => (
          <div
            key={event.id}
            className="p-1 mt-1 text-xs text-indigo-700 bg-indigo-100 rounded"
          >
            {event.type} - {event.duration}min
          </div>
        ))}
      </button>
    );
  })}
</div>
          {day}
        </div>
      ))}
      {days.map((day) => {
        const dayEvents = events.filter(event => 
          format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        );

        return (
          <button
            key={day.toString()}
            onClick={() => onDateClick(day)}
            className={`
              min-h-[100px] p-2 bg-white
              ${!isSameMonth(day, currentDate) ? 'text-gray-400' : ''}
              ${isToday(day) ? 'bg-blue-50' : ''}`}
          >
            <div className="text-right">{format(day, 'd')}</div>
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="p-1 mt-1 text-xs text-indigo-700 bg-indigo-100 rounded"
              >
                {event.type} - {event.duration}min
              </div>
            ))}
          </button>
        );
      })}
    </div>
  );
}