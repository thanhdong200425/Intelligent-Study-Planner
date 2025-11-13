
import React from 'react';

import { SearchIcon, BellIcon } from './icons/Icons';

const ProfileHeader: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account and preferences</p>
      </div>
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search settings..."
            className="pl-10 pr-4 py-2 w-full md:w-auto bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition">
          <BellIcon />
        </button>
      </div>
    </header>
  );
};

export default ProfileHeader;
