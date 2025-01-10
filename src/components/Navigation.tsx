import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ChartBarIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Workouts', href: '/workouts', icon: ChartBarIcon },
  { name: 'Videos', href: '/videos', icon: VideoCameraIcon },
];

export function Navigation() {
  return (
    <nav className="bg-indigo-600">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">FitTrack</span>
            <div className="flex items-baseline ml-10 space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-2 py-2 text-sm font-medium text-white rounded-md hover:bg-indigo-500"
                >
                  <item.icon className="inline-block mr-1 w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}