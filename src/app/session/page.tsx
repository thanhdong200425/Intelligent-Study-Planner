import React from 'react';
import { SidebarNav, HeaderBar } from '@/components';
import FocusSessionWrapper from '@/components/focus/FocusSessionWrapper';

// TODO: When user click into view all, show all sessions

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
          <FocusSessionWrapper />
        </main>
      </div>
    </div>
  );
}
