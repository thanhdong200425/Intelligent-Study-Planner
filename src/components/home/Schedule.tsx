import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizIcon, ChevronDownIcon } from './icons/Icons';
import AddTaskModal from './AddTaskModal';

const days = [
    { day: 'mon', date: 3 },
    { day: 'tue', date: 4, active: true },
    { day: 'wed', date: 5 },
    { day: 'thu', date: 6 },
    { day: 'fri', date: 7 },
    { day: 'sat', date: 8 },
];

const scheduleItems = [
    { time: '10:00am - 12:00pm', title: 'UI Motion', color: 'border-[#4AD09F]' },
    { time: '12:00pm - 01:00pm', title: 'UI Design', color: 'border-[#E5B873]' },
];

const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

const Schedule: React.FC = () => {
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('September');
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setIsMonthDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setIsMonthDropdownOpen(false);
      }
    };
    if (isMonthDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMonthDropdownOpen]);


  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="relative" ref={monthDropdownRef}>
              <button 
                onClick={() => setIsMonthDropdownOpen(prev => !prev)}
                className="flex items-center space-x-1.5 text-gray-800 hover:text-violet-700 transition-colors group"
                aria-haspopup="listbox"
                aria-expanded={isMonthDropdownOpen}
              >
                <h3 className="text-lg font-bold">{selectedMonth}</h3>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 group-hover:text-violet-700 transition-transform duration-200 ${isMonthDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMonthDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-xl z-10 border border-gray-100 py-1 max-h-60 overflow-y-auto" role="listbox">
                      {months.map((month) => (
                          <button
                              key={month}
                              onClick={() => handleMonthSelect(month)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100"
                              role="option"
                              aria-selected={selectedMonth === month}
                          >
                              {month}
                          </button>
                      ))}
                  </div>
              )}
          </div>
          <button onClick={() => setIsAddTaskModalOpen(true)} className="text-sm font-medium text-violet-600 bg-violet-100 px-3 py-1.5 rounded-lg hover:bg-violet-200 transition-all duration-200">+ Add Task</button>
        </div>
        
        <div className="flex justify-around mb-6">
          {days.map(d => (
            <div key={d.date} className="text-center">
              <p className="text-xs text-gray-400 capitalize">{d.day}</p>
              <button className={`w-8 h-8 mt-1 rounded-full text-sm font-semibold flex items-center justify-center ${d.active ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                {d.date}
              </button>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          {scheduleItems.map(item => (
              <div key={item.title} className="flex items-center">
                  <div className="w-24 text-xs text-right text-gray-400 pr-4">
                      <p>{item.time.split(' - ')[0]}</p>
                      <p>{item.time.split(' - ')[1]}</p>
                  </div>
                  <div className={`flex-1 p-4 rounded-lg bg-white shadow-sm border-l-4 ${item.color}`}>
                      <div className="flex justify-between items-start">
                          <div>
                              <p className="font-semibold">{item.title}</p>
                              <p className="text-xs text-gray-500">{item.time}</p>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizIcon />
                          </button>
                      </div>
                  </div>
              </div>
          ))}
        </div>
      </div>
      <AddTaskModal 
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      />
    </>
  );
};

export default Schedule;