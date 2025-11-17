import SidebarNav from '@/components/layout/SidebarNav';
import { TaskModal, HeaderBar, TaskWrapper } from '@/components';

export default function TasksPage() {
  return (
    <div className='flex h-screen bg-gray-50 text-gray-800 font-sans'>
      <SidebarNav />
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <HeaderBar title='Tasks'>
          <TaskModal />
        </HeaderBar>

        {/* Main Content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8'>
          <div className='max-w-7xl mx-auto space-y-6'>
            <TaskWrapper />
          </div>
        </main>
      </div>
    </div>
  );
}
