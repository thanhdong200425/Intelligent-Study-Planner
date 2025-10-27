import React, { useState, useEffect, useRef } from 'react';
import { ClockIconSmall } from './icons/Icons';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
        setTaskName('');
        setTaskTime('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 w-full max-w-md m-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Task</h2>
        <form>
          <div className="space-y-4">
            <div>
              <label htmlFor="taskName" className="block text-sm font-medium text-gray-600 mb-1">
                Name of task
              </label>
              <input
                type="text"
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g. Design meeting"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
            <div>
              <label htmlFor="taskTime" className="block text-sm font-medium text-gray-600 mb-1">
                Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="taskTime"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  placeholder="07:00 AM"
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ClockIconSmall className="text-gray-400 h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => {
                  e.preventDefault();
                  // Here you would handle the task addition
                  console.log({ taskName, taskTime });
                  onClose(); // Close modal on submission
              }}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fadeInScale {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AddTaskModal;