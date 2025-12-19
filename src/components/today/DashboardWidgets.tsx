import React from 'react';
import { Task, Deadline, Priority } from '../../types';
import { Check, Clock, Book, Pencil, Code, FileText, Sun, Moon, Monitor, TrendingUp } from 'lucide-react';

// --- Hero Component ---
export const DashboardHero: React.FC = () => {
  return (
    <div className="bg-[#1a1c2e] rounded-2xl p-8 text-white flex justify-between items-start relative overflow-hidden shadow-xl">
      <div className="relative z-10 max-w-lg mt-2">
        <div className="flex items-center gap-3 mb-2">
            <Moon className="size-6 text-blue-300" />
            <h2 className="text-2xl font-bold">Good Afternoon</h2>
        </div>
        <p className="text-gray-400 text-sm mb-10">Sunday, November 30, 2025</p>
        <blockquote className="italic text-gray-300 text-lg border-l-4 border-blue-500 pl-4 py-1">
          "The secret of getting ahead is getting started."
        </blockquote>
      </div>
      
      {/* Right Side: Toggle and Stats */}
      <div className="flex flex-col items-center gap-6 z-10">
        {/* Theme Toggle */}
        <div className="flex bg-[#25283d] rounded-lg p-1 gap-1 border border-white/5">
            <div className="p-1.5 px-2 hover:bg-white/5 rounded-md cursor-pointer transition-colors text-gray-400 hover:text-gray-200">
                <Sun className="size-4" />
            </div>
            <div className="p-1.5 px-2 bg-white/10 rounded-md text-white shadow-sm">
                <Moon className="size-4" />
            </div>
            <div className="p-1.5 px-2 hover:bg-white/5 rounded-md cursor-pointer transition-colors text-gray-400 hover:text-gray-200">
                <Monitor className="size-4" />
            </div>
        </div>

        {/* Progress Circle & Stats */}
        <div className="flex flex-col items-center">
            <div className="relative size-24">
            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <path
                className="text-gray-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                />
                <path
                className="text-blue-500"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="20, 100"
                strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold">20%</span>
            </div>
            </div>
            <span className="text-xs text-gray-400 mt-2">Tasks Complete</span>
        </div>
      </div>
    </div>
  );
};

// --- Helpers for Task Card Styling ---
const getIconForType = (type: string) => {
    switch (type) {
        case 'Pset': return <Pencil className="size-3 mr-1.5" />;
        case 'Coding': return <Monitor className="size-3 mr-1.5" />;
        case 'Reading': return <Book className="size-3 mr-1.5" />;
        case 'Writing': return <FileText className="size-3 mr-1.5" />;
        default: return <FileText className="size-3 mr-1.5" />;
    }
}

const getTypeStyle = (type: string) => {
    switch(type) {
        case 'Coding': return 'bg-gray-900 text-white border-gray-900';
        case 'Pset': return 'bg-white border-gray-200 text-gray-600 shadow-sm';
        case 'Reading': return 'bg-gray-100 border-gray-100 text-gray-600'; 
        case 'Writing': return 'bg-yellow-50 border-yellow-100 text-yellow-700';
        default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
}

const getPriorityStyle = (priority?: string | Priority) => {
    switch (priority) {
        case Priority.HIGH:
        case 'high': return 'bg-rose-100 text-rose-700';
        case Priority.MEDIUM:
        case 'medium': return 'bg-amber-100 text-amber-700';
        case Priority.LOW:
        case 'low': return 'bg-emerald-100 text-emerald-700';
        default: return 'bg-gray-100 text-gray-600';
    }
}

const getSubjectStyle = (subject: string | undefined) => {
    if (!subject) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    if (subject.includes('Computer')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (subject.includes('Web')) return 'text-pink-600 bg-pink-50 border-pink-200';
    if (subject.includes('Machine')) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (subject.includes('Math')) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (subject.includes('English')) return 'text-rose-600 bg-rose-50 border-rose-200';
    if (subject.includes('Physics')) return 'text-purple-600 bg-purple-50 border-purple-200';
    return 'text-indigo-600 bg-indigo-50 border-indigo-200';
}

// --- Task Item Component ---
export const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <div className={`group p-4 border border-gray-100 rounded-xl mb-3 flex items-start gap-4 transition-all hover:border-gray-300 hover:shadow-md bg-white ${task.completed ? 'opacity-50' : ''}`}>
      {/* Checkbox */}
      <div className={`mt-1 size-5 shrink-0 rounded-[5px] border flex items-center justify-center cursor-pointer transition-colors duration-200 ${
          task.completed 
            ? 'bg-gray-700 border-gray-700 text-white' 
            : 'border-gray-300 text-transparent hover:border-gray-400'
        }`}>
        <Check className="size-3.5" strokeWidth={3} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={`text-[15px] font-medium text-gray-900 mb-2.5 ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2">
            {/* Type Tag */}
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold border ${getTypeStyle(task.type)}`}>
                {getIconForType(task.type)}
                {task.type}
            </span>

            {/* Priority Tag */}
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold ${getPriorityStyle(task.priority)}`}>
                {task.priority} Priority
            </span>

            {/* Subject Tag */}
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium border ${getSubjectStyle(task.subject)}`}>
                <Book className="size-3 mr-1.5 opacity-60" />
                {task.subject}
            </span>

            {/* Duration */}
            <span className="inline-flex items-center text-xs text-gray-400 font-medium ml-1">
                <Clock className="size-3.5 mr-1" />
                {task.durationMinutes} min
            </span>
        </div>
      </div>
    </div>
  );
};

// --- Deadline Item Component ---
export const DeadlineCard: React.FC<{ deadline: Deadline }> = ({ deadline }) => {
    const priorityColor = deadline.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' : deadline.priority === 'medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 'bg-gray-50 text-gray-600 border-gray-100';

    return (
        <div className="p-4 bg-gray-50 rounded-xl mb-3 border border-gray-100 hover:bg-white hover:shadow-sm transition-all group">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">{deadline.title}</h4>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${priorityColor}`}>
                    {deadline.priority}
                </span>
            </div>
            <div className={`text-xs font-medium mb-2 ${getSubjectStyle(deadline.subject).split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>
                {deadline.subject}
            </div>
            <div className="flex items-center text-xs text-gray-500">
                <Clock className="size-3 mr-1" />
                In {deadline.daysLeft} days
            </div>
        </div>
    )
}

// --- Stat Card Component ---
export const StatCard: React.FC<{ 
    icon: React.ElementType, 
    value: string, 
    label: string,
    iconColor: string,
    bgColor: string
}> = ({ icon: Icon, value, label, iconColor, bgColor }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <div className={`size-10 rounded-lg ${bgColor} flex items-center justify-center mb-2`}>
                <Icon className={`size-5 ${iconColor}`} />
            </div>
            <div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
        </div>
    )
}
