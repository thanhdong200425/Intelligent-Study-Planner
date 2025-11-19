import React from 'react';
import { SidebarNav, HeaderBar } from '@/components';
import { FocusTimer } from '@/components/focus/FocusTimer';
import { SessionHistory } from '@/components/focus/SessionHistory';

// TODO: Complete the settings modal
// TODO: Implement the start button logic

export default function FocusPage() {
  return (
    <div className='flex h-screen bg-gray-50 text-gray-800 font-sans'>
      <SidebarNav />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <HeaderBar
          title='Focus'
          isShowSearchBar={false}
          isShowNotification={true}
        />
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8'>
          <div className='max-w-7xl mx-auto space-y-6'>
            {/* Timer Section */}
            <FocusTimer />

            {/* Session History Section */}
            <SessionHistory />
          </div>
        </main>
      </div>
    </div>
  );
}
