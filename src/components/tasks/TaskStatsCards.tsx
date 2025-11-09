'use client';

import React from 'react';
import { Task } from '@/types';
import { CheckSquare, Clock, AlertCircle, ListTodo } from 'lucide-react';

interface TaskStatsCardsProps {
  tasks: Task[];
}

export const TaskStatsCards: React.FC<TaskStatsCardsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const inProgressTasks = tasks.filter(t => !t.completed).length;
  const highPriorityTasks = tasks.filter(
    t => !t.completed && t.priority === 'high'
  ).length;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: ListTodo,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckSquare,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      bgColor: 'bg-[#fef9c2]',
      iconColor: 'text-[#a65f00]',
    },
    {
      label: 'High Priority',
      value: highPriorityTasks,
      icon: AlertCircle,
      bgColor: 'bg-[#ffe2e2]',
      iconColor: 'text-[#c10007]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] rounded-[14px] p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-[#4a5565]">{stat.label}</p>
                <p className="text-2xl font-normal text-[#101828]">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.bgColor} rounded-[10px] w-11 h-11 flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

