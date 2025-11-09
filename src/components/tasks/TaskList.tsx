import { Task } from '@/types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  searchQuery?: string;
  handleToggleComplete: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  searchQuery,
  handleToggleComplete,
}) => {
  if (tasks.length === 0) {
    return (
      <div className='bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] rounded-[14px] p-8 text-center'>
        <p className='text-gray-500'>
          {searchQuery
            ? 'No tasks found matching your search.'
            : 'No tasks yet. Click "Add Task" to create your first task!'}
        </p>
      </div>
    );
  }

  return (
    <>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={handleToggleComplete}
        />
      ))}
    </>
  );
};

export default TaskList;
