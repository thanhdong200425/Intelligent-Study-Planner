import React, { useState } from 'react';
import { 
    HomeIcon, 
    PlannerIcon, 
    TasksIcon, 
    HabitsIcon, 
    CoursesIcon, 
    SessionIcon, 
    AnalyticsIcon, 
    ProfileIcon, 
    CollapseIcon 
} from './icons/Icons';

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
        ? 'bg-slate-100 text-slate-800'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
    }`}
    aria-current={active ? 'page' : undefined}
  >
    {icon}
    <span className={`ml-4 ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
  </li>
);


const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Today');
  
  const navItems = [
    { id: 'Today', icon: <HomeIcon />, label: 'Today' },
    { id: 'Planner', icon: <PlannerIcon />, label: 'Planner' },
    { id: 'Tasks', icon: <TasksIcon />, label: 'Tasks' },
    { id: 'Habits', icon: <HabitsIcon />, label: 'Habits' },
    { id: 'Courses', icon: <CoursesIcon />, label: 'Courses' },
    { id: 'Session', icon: <SessionIcon />, label: 'Session' },
    { id: 'Analytics', icon: <AnalyticsIcon />, label: 'Analytics' },
    { id: 'Profile', icon: <ProfileIcon />, label: 'Profile' },
  ];

  return (
    <div className="w-64 bg-white p-6 shrink-0 hidden md:flex flex-col justify-between border-r border-slate-200">
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
        <button className="flex items-center p-3 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors">
            <CollapseIcon />
            <span className="ml-4 font-medium">Collapse</span>
        </button>
    </div>
  );
};

export default Sidebar;