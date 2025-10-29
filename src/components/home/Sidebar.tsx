import React, { useState } from 'react';
import { HomeIcon, CalendarIcon, CheckIcon, ChartBarIcon, AnalyticsIcon, ChevronLeftIcon } from './icons/Icons';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
      active
        ? 'bg-indigo-50 text-indigo-600'
        : 'text-gray-600 hover:bg-gray-200'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </li>
);


const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Today');
  
  const navItems = [
    { id: 'Today', icon: <HomeIcon />, label: 'Today' },
    { id: 'Planner', icon: <CalendarIcon />, label: 'Planner' },
    { id: 'Tasks', icon: <CheckIcon />, label: 'Tasks' },
    { id: 'Habits', icon: <ChartBarIcon />, label: 'Habits' },
    { id: 'Analytics', icon: <AnalyticsIcon />, label: 'Analytics' },
  ];

  return (
    <div className="w-64 bg-white p-6 shrink-0 hidden md:flex flex-col justify-between border-r border-gray-200">
        <div>
            <nav>
                <ul>
                    {navItems.map((item) => (
                        <NavItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            active={activeItem === item.id}
                            onClick={() => setActiveItem(item.id)}
                        />
                    ))}
                </ul>
            </nav>
        </div>
        <button className="flex items-center p-3 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            <ChevronLeftIcon />
            <span className="ml-4 font-medium">Collapse</span>
        </button>
    </div>
  );
};

export default Sidebar;