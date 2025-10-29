import React from 'react';
import { CalendarIcon, BellIcon } from './icons/Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
      <div className="flex items-center text-gray-600">
        <CalendarIcon />
        <span className="ml-2 font-semibold">Monday, 4th September</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden sm:block">
          <input
            type="text"
            placeholder="Search here..."
            className="px-4 py-2 w-64 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
            <BellIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
