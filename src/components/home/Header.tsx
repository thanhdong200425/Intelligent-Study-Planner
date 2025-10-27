import React from 'react';
import { HeaderCalendarIcon, BellIcon, SearchIcon } from './icons/Icons';

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-gray-500">
          <HeaderCalendarIcon />
          <span className="font-medium">Monday, 4th September</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700 relative">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-violet-500 rounded-full"></span>
        </button>
      </div>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search here..."
          className="pl-10 pr-4 py-2 w-64 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </div>
    </div>
  );
};

export default Header;
