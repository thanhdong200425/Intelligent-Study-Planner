import React from 'react';
import { SidebarNav, HeaderBar } from '@/components';
import FocusSessionWrapper from '@/components/focus/FocusSessionWrapper';

// TODO: Show a small pop-up if user is not focused in "focus page" to ensure they can see the timer
// TODO: Load time focused and sessions quantity from backend
// TODO: Just show 5 recent sessions in the session history
// TODO: When user click into view all, redirect to the session history page

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
