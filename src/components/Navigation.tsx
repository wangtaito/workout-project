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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white font-bold text-xl">FitTrack</span>
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <item.icon className="h-5 w-5 inline-block mr-1" />
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