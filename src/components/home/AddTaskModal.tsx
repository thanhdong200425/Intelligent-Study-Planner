import React, { useState } from 'react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: { title: string; startTime: string; endTime: string }) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (!title || !startTime || !endTime) {
      alert('Please fill in all fields.');
      return;
    }
    onSave({ title, startTime, endTime });
    setTitle('');
    setStartTime('');
    setEndTime('');
    onClose();
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTimeInput = (currentValue: string, previousValue: string, setter: (value: string) => void) => {
    // Allows backspace to work naturally.
    if (currentValue.length < previousValue.length) {
        setter(currentValue);
        return;
    }

    // Get only digits from the current input value.
    let digits = currentValue.replace(/\D/g, '');

    // Limit to 4 digits (HHMM).
    if (digits.length > 4) {
        digits = digits.slice(0, 4);
    }
    
    // Validate hours part.
    if (digits.length >= 2) {
        let hours = parseInt(digits.slice(0, 2), 10);
        if (hours > 23) {
            digits = '23' + digits.slice(2);
        }
    }
    
    // Validate minutes part.
    if (digits.length === 4) {
        let minutes = parseInt(digits.slice(2, 4), 10);
        if (minutes > 59) {
            digits = digits.slice(0, 2) + '59';
        }
    }

    // Format the final value
    let formattedValue = digits;
    if (digits.length > 2) {
        formattedValue = `${digits.slice(0, 2)}:${digits.slice(2)}`;
    } else if (digits.length === 2 && currentValue.endsWith(':')) {
        // This is the main fix: if user types a colon after 2 digits, keep it.
        formattedValue = `${digits}:`;
    }

    setter(formattedValue);
  };


  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={handleBackdropClick}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Task</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Work on the design system"
              className="w-full bg-white text-gray-800 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="start-time"
                  value={startTime}
                  onChange={(e) => handleTimeInput(e.target.value, startTime, setStartTime)}
                  placeholder="__:__"
                  className="w-full bg-white text-gray-800 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <div className="relative">
                  <input
                    type="text"
                    id="end-time"
                    value={endTime}
                    onChange={(e) => handleTimeInput(e.target.value, endTime, setEndTime)}
                    placeholder="__:__"
                    className="w-full bg-white text-gray-800 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;