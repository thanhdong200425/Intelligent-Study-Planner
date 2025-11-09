import { Task, Course } from '@/types';
import SidebarNav from '@/components/layout/SidebarNav';
import { TaskStatsCards } from '@/components/tasks/TaskStatsCards';
import { TaskFilters, TaskFilter } from '@/components/tasks/TaskFilters';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Input, Button } from '@heroui/react';
import { Search, Plus, Clock } from 'lucide-react';
import { TaskForm } from '@/components/forms/TaskForm';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import { TaskList } from '@/components';
import { getAllTasks } from '@/services';

export default async function TasksPage() {
  const allTasks = await getAllTasks();

  const handleToggleComplete = (task: Task) => {};

  const handleAddTask = (task: Task) => {
    setIsAddTaskModalOpen(false);
    loadData();
  };

  const getCourseById = (courseId: string): Course | undefined => {
    return courses.find(c => c.id.toString() === courseId);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const remainingMinutes = tasks
    .filter(t => !t.completed)
    .reduce((sum, t) => sum + t.estimateMinutes, 0);
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;
  const remainingTimeText =
    remainingHours > 0
      ? `${remainingHours}h ${remainingMins}m`
      : `${remainingMins}m`;

  return (
    <div className='flex h-screen bg-gray-50 text-gray-800 font-sans'>
      <SidebarNav />
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header className='bg-white border-b border-gray-200 px-8 pt-4 pb-4'>
          <div className='flex items-center justify-between h-12'>
            <div>
              <h1 className='text-base text-gray-900 font-normal'>Tasks</h1>
              <div className='flex items-center gap-2 text-sm text-[#4a5565] mt-1'>
                <span>
                  {completedCount} of {totalCount} completed
                </span>
                <span className='text-[#99a1af]'>•</span>
                <Clock className='w-4 h-4' />
                <span>{remainingTimeText} remaining</span>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <Input
                  aria-label='Search tasks'
                  placeholder='Search tasks...'
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  startContent={<Search className='w-4 h-4 text-gray-500' />}
                  className='w-64'
                  variant='bordered'
                  radius='md'
                />
              </div>
              <Button
                color='default'
                className='bg-[#101828] text-white'
                startContent={<Plus className='w-4 h-4' />}
                onPress={() => setIsAddTaskModalOpen(true)}
              >
                Add Task
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8'>
          <div className='max-w-7xl mx-auto space-y-6'>
            {/* Statistics Cards */}
            <TaskStatsCards tasks={tasks} />

            {/* Filters */}
            <TaskFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Task List */}
            <TaskList
              tasks={filteredTasks}
              handleToggleComplete={handleToggleComplete}
            />
          </div>
        </main>

        {/* Add Task Modal */}
        <Modal
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          size='2xl'
          scrollBehavior='inside'
        >
          <ModalContent>
            <ModalHeader>Add New Task</ModalHeader>
            <ModalBody>
              <TaskForm onSubmit={handleAddTask} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
