import { Task, Course } from '@/types';
import SidebarNav from '@/components/layout/SidebarNav';
import { TaskStatsCards } from '@/components/tasks/TaskStatsCards';
import { TaskFilters, TaskFilter } from '@/components/tasks/TaskFilters';
import { TaskCard } from '@/components/tasks/TaskCard';
// import { Input, Button } from '@heroui/react';
import { Search, Plus, Clock } from 'lucide-react';
import { TaskForm } from '@/components/forms/TaskForm';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import { TaskList } from '@/components';
import { getAllTasks } from '@/services';

// export default async function TasksPage() {
//   const allTasks = await getAllTasks();

//   if (allTasks.length === 0) {
//     return (
//       <div className='flex h-screen bg-gray-50 text-gray-800 font-sans'>
//         <SidebarNav />
//         <div className='flex-1 flex flex-col overflow-hidden'>
//           <div className='max-w-7xl mx-auto space-y-6'>
//             <div className='bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] rounded-[14px] p-8 text-center'>
//               <p className='text-gray-500'>
//                 No tasks yet. Click "Add Task" to create your first task!
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const handleToggleComplete = (task: Task) => {};

//   return (
//     <div className='flex h-screen bg-gray-50 text-gray-800 font-sans'>
//       <SidebarNav />
//       <div className='flex-1 flex flex-col overflow-hidden'>
//         {/* Header */}
//         <header className='bg-white border-b border-gray-200 px-8 pt-4 pb-4'>
//           <div className='flex items-center justify-between h-12'>
//             <div>
//               <h1 className='text-base text-gray-900 font-normal'>Tasks</h1>
//               <div className='flex items-center gap-2 text-sm text-[#4a5565] mt-1'>
//                 <span>
//                   {allTasks.length} of {allTasks.length} completed
//                 </span>
//                 <span className='text-[#99a1af]'>•</span>
//                 <Clock className='w-4 h-4' />
//                 <span>{allTasks.length} remaining</span>
//               </div>
//             </div>
//             <div className='flex items-center gap-3'>
//               <div className='relative'>
//                 {/* <Input
//                   aria-label='Search tasks'
//                   placeholder='Search tasks...'
//                   value={searchQuery}
//                   onValueChange={setSearchQuery}
//                   startContent={<Search className='w-4 h-4 text-gray-500' />}
//                   className='w-64'
//                   variant='bordered'
//                   radius='md'
//                 /> */}
//               </div>
//               {/* <Button
//                 color='default'
//                 className='bg-[#101828] text-white'
//                 startContent={<Plus className='w-4 h-4' />}
//                 onPress={() => setIsAddTaskModalOpen(true)}
//               >
//                 Add Task
//               </Button> */}
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8'>
//           <div className='max-w-7xl mx-auto space-y-6'>
//             {/* Statistics Cards */}
//             <TaskStatsCards tasks={allTasks} />

//             {/* Filters */}
//             {/* <TaskFilters
//               activeFilter={activeFilter}
//               onFilterChange={setActiveFilter}
//             /> */}

//             {/* Task List */}
//             <TaskList
//               tasks={allTasks}
//               handleToggleComplete={handleToggleComplete}
//             />
//           </div>
//         </main>

//         {/* Add Task Modal */}
//         {/* <Modal
//           isOpen={isAddTaskModalOpen}
//           onClose={() => setIsAddTaskModalOpen(false)}
//           size='2xl'
//           scrollBehavior='inside'
//         >
//           <ModalContent>
//             <ModalHeader>Add New Task</ModalHeader>
//             <ModalBody>
//               <TaskForm onSubmit={handleAddTask} />
//             </ModalBody>
//           </ModalContent>
//         </Modal> */}
//       </div>
//     </div>
//   );
// }

export default async function TasksPage() {
  const tasks = await getAllTasks();
  console.log(tasks);
  return (
    <div>
      <h1>Tasks</h1>
    </div>
  );
}
