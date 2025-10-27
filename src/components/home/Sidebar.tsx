import React, { useState } from 'react';
import { HomeIcon, CalendarIcon, TaskIcon, HabitsIcon, AnalyticsIcon } from './icons/Icons';

// FIX: Explicitly typing NavItem as a React.FC with its props interface resolves the type error, as it allows TypeScript to correctly handle React-specific props like `key` during JSX transformation.
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <a
    href="#"
    onClick={(e) => {
        e.preventDefault();
        onClick();
    }}
    className={`flex items-center space-x-4 px-5 py-3.5 rounded-xl transition-all duration-300 ${
      isActive
        ? 'bg-violet-100 text-violet-600 shadow-md'
        : 'bg-white shadow-sm hover:shadow-md text-gray-700 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span className="font-semibold">{label}</span>
  </a>
);

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Today');

  const navItems = [
    { label: 'Today', icon: <HomeIcon /> },
    { label: 'Planner', icon: <CalendarIcon /> },
    { label: 'Tasks', icon: <TaskIcon /> },
    { label: 'Habits', icon: <HabitsIcon /> },
    { label: 'Analytics', icon: <AnalyticsIcon /> },
  ];

  return (
    <aside className="w-64 bg-white p-6 border-r border-gray-200 hidden lg:block">
      <div className="flex flex-col h-full">
        <nav className="space-y-5 pt-10">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.label}
              onClick={() => setActiveItem(item.label)}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;