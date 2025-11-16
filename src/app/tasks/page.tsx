import SidebarNav from '@/components/layout/SidebarNav';
import { TaskStatsCards } from '@/components/tasks/TaskStatsCards';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskModal, HeaderBar, TaskList } from '@/components';

export default async function TasksPage() {
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
            {/* Statistics Cards */}
            <TaskStatsCards />

            {/* Filters */}
            <TaskFilters activeFilter={'all'} />

            {/* Task List */}
            <TaskList />
          </div>
        </main>
      </div>
    </div>
  );
}
