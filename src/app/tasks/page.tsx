import { Task, Course } from '@/types';
import SidebarNav from '@/components/layout/SidebarNav';
import { TaskStatsCards } from '@/components/tasks/TaskStatsCards';
import { TaskFilters, TaskFilter } from '@/components/tasks/TaskFilters';
import { TaskCard } from '@/components/tasks/TaskCard';
// import { Input, Button } from '@heroui/react';
import { Search, Plus, Clock } from 'lucide-react';
import { TaskForm } from '@/components/forms/TaskForm';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import { TaskModal, HeaderBar, TaskList } from '@/components';
import { getAllTasks } from '@/services';
import { revalidatePath } from 'next/cache';

export default async function TasksPage() {
  const allTasks = await getAllTasks();

  const handleToggleComplete = (task: Task) => {};

  return (
    <div className='flex h-screen bg-gray-50 text-gray-800 font-sans'>
      <SidebarNav />
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <HeaderBar title='Tasks' description={`${allTasks.length} tasks`}>
          <TaskModal />
        </HeaderBar>

        {/* Main Content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8'>
          <div className='max-w-7xl mx-auto space-y-6'>
            {/* Statistics Cards */}
            <TaskStatsCards tasks={allTasks} />

            {/* Filters */}
            <TaskFilters activeFilter={'all'} />

            {/* Task List */}
            <TaskList
              tasks={allTasks}
              handleToggleComplete={handleToggleComplete}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
