import React, { useState } from 'react';
import { WorkoutEvent } from '../../types/workout';

interface WorkoutBarChartProps {
  events: WorkoutEvent[];
}

export function WorkoutBarChart({ events }: WorkoutBarChartProps) {
  const [chartType, setChartType] = useState<'duration' | 'weight'>('duration');
  const [durationFilter, setDurationFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  const dailyStats = events.reduce((acc, event) => {
    const date = new Date(event.date).toLocaleDateString('zh-TW');
    if (!acc[date]) {
      acc[date] = {
        completed: 0,
        incomplete: 0,
        totalDuration: 0,
        weight: event.record?.weight || 0,
        hasWeight: !!event.record?.weight
      };
    }
    
    if (event.completed) {
      acc[date].completed += event.duration;
    } else {
      acc[date].incomplete += event.duration;
    }
    acc[date].totalDuration += event.duration;
    
    if (event.record?.weight) {
      acc[date].weight = event.record.weight;
      acc[date].hasWeight = true;
    }
    
    return acc;
  }, {} as Record<string, {
    completed: number;
    incomplete: number;
    totalDuration: number;
    weight: number;
    hasWeight: boolean;
  }>);

  const maxDuration = Math.max(...Object.values(dailyStats).map(stat => stat.totalDuration));
  const maxWeight = Math.max(...Object.values(dailyStats).filter(stat => stat.hasWeight).map(stat => stat.weight));

  return (
    <div className="p-3 mb-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('duration')}
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              chartType === 'duration' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            運動時長
          </button>
          <button
            onClick={() => setChartType('weight')}
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              chartType === 'weight' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            體重變化
          </button>
        </div>
        {chartType === 'duration' && (
          <div className="flex space-x-1">
            <button
              onClick={() => setDurationFilter('all')}
              className={`px-2 py-1 text-xs font-medium rounded-md ${
                durationFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setDurationFilter('completed')}
              className={`px-2 py-1 text-xs font-medium rounded-md ${
                durationFilter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              已完成
            </button>
            <button
              onClick={() => setDurationFilter('incomplete')}
              className={`px-2 py-1 text-xs font-medium rounded-md ${
                durationFilter === 'incomplete' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              未完成
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        {Object.entries(dailyStats).map(([date, stats]) => {
          if (chartType === 'duration') {
            let showBar = false;
            if (durationFilter === 'all') showBar = true;
            else if (durationFilter === 'completed' && stats.completed > 0) showBar = true;
            else if (durationFilter === 'incomplete' && stats.incomplete > 0) showBar = true;

            if (!showBar) return null;

            return (
              <div key={date} className="text-xs">
                <div className="flex justify-between mb-0.5">
                  <span className="text-gray-600">{date}</span>
                  <span className="text-gray-900">{stats.totalDuration}分</span>
                </div>
                <div className="flex h-3 bg-gray-100 rounded-sm overflow-hidden">
                  {durationFilter !== 'incomplete' && stats.completed > 0 && (
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${(stats.completed / maxDuration) * 100}%`,
                      }}
                    />
                  )}
                  {durationFilter !== 'completed' && stats.incomplete > 0 && (
                    <div
                      className="bg-yellow-500"
                      style={{
                        width: `${(stats.incomplete / maxDuration) * 100}%`,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          } else {
            if (!stats.hasWeight) return null;
            return (
              <div key={date} className="text-xs">
                <div className="flex justify-between mb-0.5">
                  <span className="text-gray-600">{date}</span>
                  <span className="text-gray-900">{stats.weight}kg</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${(stats.weight / maxWeight) * 100}%`,
                    }}
                  />
                </div>
              </div>
            );
          }
        })}
      </div>

      {chartType === 'duration' && durationFilter === 'all' && (
        <div className="flex mt-2 space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-2 h-2 mr-1 bg-green-500 rounded-sm" />
            <span className="text-gray-600">已完成</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 mr-1 bg-yellow-500 rounded-sm" />
            <span className="text-gray-600">未完成</span>
          </div>
        </div>
      )}
    </div>
  );
} 