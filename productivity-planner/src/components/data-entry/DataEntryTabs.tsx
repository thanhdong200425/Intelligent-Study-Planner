'use client';

import React, { useState } from 'react';
import { CourseForm } from '@/components/forms/CourseForm';
import { DeadlineForm } from '@/components/forms/DeadlineForm';
import { TaskForm } from '@/components/forms/TaskForm';
import { AvailabilityForm } from '@/components/forms/AvailabilityForm';
import { BookOpen, Calendar, CheckSquare, Clock } from 'lucide-react';

export const DataEntryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('courses');

  const tabs = [
    { id: 'courses', label: 'Courses', icon: BookOpen, component: CourseForm },
    { id: 'deadlines', label: 'Deadlines', icon: Calendar, component: DeadlineForm },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, component: TaskForm },
    { id: 'availability', label: 'Availability', icon: Clock, component: AvailabilityForm },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};