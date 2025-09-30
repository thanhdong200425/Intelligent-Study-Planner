'use client';

import React from 'react';
import Image from 'next/image';
import {
  Home,
  CheckSquare,
  Heart,
  BookOpen,
  BarChart3,
  Settings,
  Timer,
} from 'lucide-react';
import { Button } from '@heroui/react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed = false,
}) => {
  const menuItems = [
    { id: 'calendar', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'habits', label: 'Habits', icon: Heart },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div
      className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Logo */}
      <div
        className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-gray-200`}
      >
        <div
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
        >
          <div className='w-8 h-8 flex items-center justify-center flex-shrink-0'>
            <Image
              src='/logo-transparent.svg'
              alt='StudyGo Logo'
              width={100}
              height={50}
              className='w-full h-full object-contain'
            />
          </div>
          {!isCollapsed && (
            <span className='text-xl font-bold text-gray-900 transition-opacity duration-300'>
              StudyGo
            </span>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <ul className='space-y-2'>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? 'flat' : 'light'}
                  color={isActive ? 'primary' : 'default'}
                  className={`w-full h-11 ${
                    isCollapsed
                      ? 'justify-center px-2 min-w-0'
                      : 'justify-start px-3'
                  } ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onPress={() => onTabChange(item.id)}
                  startContent={
                    !isCollapsed ? <Icon className='w-5 h-5' /> : undefined
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  {isCollapsed ? <Icon className='w-5 h-5' /> : item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
