import React from 'react';
import { CheckIcon } from './icons/Icons';

const assignments = [
  { title: 'Colour Theory', date: '01 Sep 2022', grade: '86/100', status: 'Grade', completed: true },
  { title: 'Design system', date: '01 Sep 2022', grade: '90/100', status: 'Grade', completed: true },
  { title: 'User persona', date: '03 Sep 2022', grade: '0/100', status: 'To Do', completed: false },
  { title: 'Prototyping', date: '06 Sep 2022', grade: '0/100', status: 'To Do', completed: false },
];

// FIX: Explicitly typing AssignmentItem as a React.FC allows TypeScript to correctly handle React-specific props like `key` during JSX transformation, resolving the type error.
const AssignmentItem: React.FC<typeof assignments[0]> = ({ title, date, grade, status, completed }) => (
    <div className="flex items-center justify-between py-2">
        <div className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                {completed && <CheckIcon className="text-white w-3 h-3"/>}
            </div>
            <div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-gray-400">{date}</p>
            </div>
        </div>
        <div>
            <p className={`font-semibold text-sm ${status === 'Grade' ? 'text-gray-800' : 'text-gray-400'}`}>{grade}</p>
            <p className="text-xs text-gray-400 text-right">{status}</p>
        </div>
    </div>
);

const Assignments: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Assignments (12)</h3>
            <div className="flex items-center space-x-2 text-xs text-cyan-600">
                <div className="w-4 h-4 rounded bg-cyan-100 flex items-center justify-center">
                    <CheckIcon className="w-2.5 h-2.5" />
                </div>
                <span>2/5 completed</span>
            </div>
        </div>
        <div className="space-y-2">
            {assignments.map(item => <AssignmentItem key={item.title} {...item} />)}
        </div>
    </div>
  );
};

export default Assignments;
