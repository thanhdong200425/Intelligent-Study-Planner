"use client";
import React, { useState } from 'react';
import AddTaskModal from './AddTaskModal';

const days = [
  { num: 3, day: 'mon' },
  { num: 4, day: 'tue' },
  { num: 5, day: 'wed' },
  { num: 6, day: 'thu' },
  { num: 7, day: 'fri' },
  { num: 8, day: 'sat' },
];

// Sample tasks for the day
const initialTasks = [
  { title: 'UI Motion', startTime: '09:00', endTime: '10:00' },
  { title: 'Learn English', startTime: '11:00', endTime: '12:00' },
];

const Schedule: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);

  const handleAddTask = (task: { title: string; startTime: string; endTime: string }) => {
    setTasks(prevTasks => [...prevTasks, task].sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  // Schedule display settings
  const startHour = 9;
  const endHour = 14;
  const hourHeight = 60; // pixels per hour

  // Generate hours from start to end inclusive for a complete grid
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return 0;
    return h * 60 + m;
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">September</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className={`text-sm font-semibold transition-all duration-200 px-3 py-1 rounded-lg ${isModalOpen
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'text-indigo-600 hover:bg-indigo-100'
              }`}
          >
            + Add Task
          </button>
        </div>
        <div className="flex justify-between mb-6">
          {days.map(({ num, day }) => (
            <div
              key={num}
              onClick={() => setSelectedDay(num)}
              className={`text-center cursor-pointer p-2 rounded-lg ${selectedDay === num ? 'bg-black text-white' : 'hover:bg-gray-100'
                }`}
            >
              <p className="font-bold">{num}</p>
              <p className="text-xs uppercase text-gray-500">{day}</p>
            </div>
          ))}
        </div>

        <div className="relative" style={{ height: `${(endHour - startHour) * hourHeight}px` }}>
          {/* Render timeline hours and lines with precise positioning */}
          {hours.map(hour => {
            const topPosition = (hour - startHour) * hourHeight;
            return (
              <div
                key={hour}
                className="absolute w-full"
                style={{ top: `${topPosition}px` }}
              >
                <div className="ml-16 border-t border-gray-200"></div>
                <p className="absolute top-0 left-0 w-16 -translate-y-1/2 text-right pr-4 text-xs text-gray-400">
                  {`${hour.toString().padStart(2, '0')}:00`}
                </p>
              </div>
            );
          })}

          {/* Render tasks */}
          {tasks.map((task, index) => {
            const startMinutes = timeToMinutes(task.startTime);
            const endMinutes = timeToMinutes(task.endTime);

            if (startMinutes === 0 || endMinutes === 0 || endMinutes <= startMinutes) return null;

            const top = ((startMinutes - startHour * 60) / 60) * hourHeight;
            const durationMinutes = endMinutes - startMinutes;
            const height = (durationMinutes / 60) * hourHeight;

            return (
              <div
                key={index}
                className="absolute bg-gray-800 text-white p-3 rounded-lg"
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  left: '72px', // width of time label (w-16 = 64px) + some margin
                  right: '0px',
                }}
              >
                <p className="font-semibold text-sm">{task.title}</p>
                <p className="text-xs text-gray-300">{task.startTime} - {task.endTime}</p>
              </div>
            );
          })}
        </div>
      </div>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTask}
      />
    </>
  );
};

export default Schedule;