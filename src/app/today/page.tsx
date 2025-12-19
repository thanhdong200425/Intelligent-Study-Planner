import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SidebarNav from '@/components/layout/SidebarNav';

import { DashboardHero } from '@/components/today/DashboardWidgets';
import { TaskCard } from '@/components/tasks/TaskCard';
import { DeadlineCard } from '@/components/statistics/DeadlinesList';
import StatCard from '@/components/home/StatCard';

import type { Task, Deadline } from '@/types';

import { CheckSquare, Clock, Flame, Target } from 'lucide-react';


// --- Mock Data ---
const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Complete Chapter 5 exercises', subject: 'Computer Science 101', priority: 'high', durationMinutes: 90, estimateMinutes: 90, completed: false, type: 'pset' },
  { id: '2', title: 'Build portfolio website', subject: 'Web Development', priority: 'high', durationMinutes: 180, estimateMinutes: 180, completed: false, type: 'coding' },
  { id: '3', title: 'Read research paper on Neural Networks', subject: 'Machine Learning', priority: 'medium', durationMinutes: 60, estimateMinutes: 60, completed: false, type: 'reading' },
  { id: '4', title: 'Review calculus notes', subject: 'Mathematics', priority: 'medium', durationMinutes: 45, estimateMinutes: 45, completed: true, type: 'reading' },
  { id: '5', title: 'Write essay outline', subject: 'English Literature', priority: 'low', durationMinutes: 60, estimateMinutes: 60, completed: false, type: 'writing' },
];

const MOCK_DEADLINES: Deadline[] = [
    { id: '1', title: 'Final Project Submission', subject: 'Web Development', daysLeft: 2, priority: 'high', courseId: 'course1', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
    { id: '2', title: 'Midterm Exam', subject: 'Machine Learning', daysLeft: 3, priority: 'high', courseId: 'course2', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
    { id: '3', title: 'Lab Report', subject: 'Physics', daysLeft: 5, priority: 'medium', courseId: 'course3', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
];

const DashboardPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <DashboardHero />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Task Column */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <h3 className="text-gray-800 font-semibold">Today's Tasks</h3>
                            <p className="text-sm text-gray-500">4 tasks remaining</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none">
                            View All →
                        </button>
                    </div>

                    <div className="space-y-3">
                        {MOCK_TASKS.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                </div>

                {/* Sidebar Column (Deadlines) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2 h-[50px]">
                        <h3 className="text-gray-800 font-semibold">Upcoming Deadlines</h3>
                        <div className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-500">
                             <Clock className="size-4" />
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        {MOCK_DEADLINES.map(deadline => (
                            <DeadlineCard key={deadline.id} deadline={deadline} />
                        ))}
                        <button className="w-full mt-2 px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-100 hover:bg-gray-50 transition-colors focus:outline-none">
                            View Calendar
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
                <StatCard 
                    icon={<CheckSquare className="size-6" />} 
                    value="1/5" 
                    title="Tasks Completed" 
                    bgColor="bg-blue-50" 
                    iconColor="text-blue-600" 
                />
                <StatCard 
                    icon={<Clock className="size-6" />} 
                    value="6h 30m" 
                    title="Time Remaining" 
                    bgColor="bg-orange-50" 
                    iconColor="text-orange-600" 
                />
                <StatCard 
                    icon={<Target className="size-6" />} 
                    value="2" 
                    title="High Priority" 
                    bgColor="bg-red-50" 
                    iconColor="text-red-600" 
                />
                <StatCard 
                    icon={<Flame className="size-6" />} 
                    value="7" 
                    title="Day Streak" 
                    bgColor="bg-green-50" 
                    iconColor="text-green-600" 
                />
            </div>
        </div>
    );
};

const EmptyPage: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Target className="size-8" />
        </div>
        <h2 className="text-xl font-medium text-gray-600">{title}</h2>
        <p className="mt-2">This section is under construction.</p>
    </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="flex bg-gray-50 min-h-screen font-sans">
        <SidebarNav />
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto">
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/planner" element={<EmptyPage title="Planner" />} />
                    <Route path="/tasks" element={<EmptyPage title="All Tasks" />} />
                    <Route path="/habits" element={<EmptyPage title="Habit Tracker" />} />
                    <Route path="/courses" element={<EmptyPage title="Course Materials" />} />
                    <Route path="/session" element={<EmptyPage title="Focus Session" />} />
                    <Route path="/analytics" element={<EmptyPage title="Analytics" />} />
                    <Route path="/profile" element={<EmptyPage title="User Profile" />} />
                </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;