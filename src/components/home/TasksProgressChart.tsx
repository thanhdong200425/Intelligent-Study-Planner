import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDownIcon } from './icons/Icons';

// Data for the chart
const data = [
  { name: 'Mon', spent: 4 },
  { name: 'Tue', spent: 3 },
  { name: 'Wed', spent: 5 },
  { name: 'Thu', spent: 2 },
  { name: 'Fri', spent: 6 },
  { name: 'Sat', spent: 3 },
  { name: 'Sun', spent: 4 },
];

const TimeSpentInfo = ({ time, label, percentage, bgColor, textColor }: { time: string, label: string, percentage: string, bgColor: string, textColor: string }) => (
    <div>
        <p className="text-sm text-gray-400">{label}</p>
        <div className="flex items-center space-x-3 mt-1">
            <p className="text-2xl font-bold text-gray-800">{time}</p>
            <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bgColor} ${textColor}`}>
                {percentage}
            </div>
        </div>
    </div>
);

const TasksProgressChart: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Weekly');
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const ranges = ['Daily', 'Weekly', 'Monthly'];

  const handleRangeSelect = (range: string) => {
    setSelectedRange(range);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Tasks Progress</h3>
        <div className="relative" ref={dropdownContainerRef}>
            <button 
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className="flex items-center space-x-2 text-sm text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 shadow-sm transition-colors"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <span>{selectedRange}</span>
              <ChevronDownIcon className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-10 border border-gray-100 py-1" role="listbox">
                    {ranges.map((range) => (
                        <button
                            key={range}
                            onClick={() => handleRangeSelect(range)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100"
                            role="option"
                            aria-selected={selectedRange === range}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Chart */}
        <div className="lg:w-3/4">
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 20,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} unit="h" ticks={[0, 2, 4, 6, 8]} domain={[0, 8]} />
                <Tooltip
                  cursor={{ fill: 'rgba(238, 242, 255, 0.6)' }}
                  contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                  formatter={(value: number) => [`${value} hours`, 'Spent']}
                />
                <Bar dataKey="spent" fill="#D1B077" radius={[10, 10, 10, 10]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Summary */}
        <div className="lg:w-1/4 flex flex-col pt-1">
          <div className="space-y-5">
            <TimeSpentInfo time="18h" label="Time spent" percentage="120%" bgColor="bg-green-100" textColor="text-green-700" />
            <TimeSpentInfo time="15h" label="Lesson Learnt" percentage="120%" bgColor="bg-green-100" textColor="text-green-700" />
            <TimeSpentInfo time="2h" label="Exams Passed" percentage="100%" bgColor="bg-cyan-100" textColor="text-cyan-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksProgressChart;