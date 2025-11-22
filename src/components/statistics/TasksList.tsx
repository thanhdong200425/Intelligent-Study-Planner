'use client';

import React, { useState, useCallback } from 'react';
import { Task, Course, TaskType } from '@/types';
import { TaskStorage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Edit2, Plus, Save, X, Clock } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Chip,
} from '@heroui/react';

interface TasksListProps {
  tasks: Task[];
  courses: Course[];
  onDataChange: () => void;
}

export const TasksList: React.FC<TasksListProps> = ({
  tasks,
  courses,
  onDataChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    courseId: '',
    type: 'reading' as TaskType,
    estimateMinutes: 30,
  });

  const handleEdit = (task: Task) => {
    setEditingId(task.id ?? null);
    setEditForm({
      title: task.title,
      courseId: task.courseId ?? '',
      type: task.type,
      estimateMinutes: task.estimateMinutes,
    });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditForm({
      title: '',
      courseId: courses[0]?.id?.toString() || '',
      type: 'reading',
      estimateMinutes: 30,
    });
    setEditingId(null);
  };

  const handleSave = () => {
    if (!editForm.title.trim()) return;

    if (isAdding) {
      const newTask: Task = {
        id: uuidv4(),
        title: editForm.title.trim(),
        courseId: editForm.courseId,
        type: editForm.type,
        estimateMinutes: editForm.estimateMinutes,
      };
      TaskStorage.add(newTask);
    } else if (editingId) {
      const updatedTask: Task = {
        id: editingId,
        title: editForm.title.trim(),
        courseId: editForm.courseId,
        type: editForm.type,
        estimateMinutes: editForm.estimateMinutes,
      };
      TaskStorage.update(updatedTask);
    }

    handleCancel();
    onDataChange();
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditForm({
      title: '',
      courseId: '',
      type: 'reading',
      estimateMinutes: 30,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      TaskStorage.remove(id);
      onDataChange();
    }
  };

  const toggleComplete = (task: Task) => {
    const updated = { ...task, completed: !task.completed };
    TaskStorage.update(updated);
    onDataChange();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTaskTypeColor = (type: TaskType) => {
    switch (type) {
      case 'reading':
        return 'text-blue-600 bg-blue-50';
      case 'coding':
        return 'text-green-600 bg-green-50';
      case 'writing':
        return 'text-purple-600 bg-purple-50';
      case 'pset':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getCourse = (courseId: string) =>
    courses.find(c => c.id.toString() === courseId);

  const taskTypes: TaskType[] = ['reading', 'coding', 'writing', 'pset'];

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold'>Tasks Management</h3>
        <button
          onClick={handleAdd}
          disabled={courses.length === 0}
          className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400'
        >
          <Plus className='w-4 h-4' />
          <span>Add Task</span>
        </button>
      </div>

      {courses.length === 0 && (
        <div className='bg-yellow-50 border border-yellow-200 rounded-md p-4'>
          <p className='text-yellow-800'>
            Please add at least one course before creating tasks.
          </p>
        </div>
      )}

      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Title
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Course
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Estimate
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {isAdding && (
                <tr>
                  <td className='px-6 py-4'>
                    <input
                      type='checkbox'
                      disabled
                      className='rounded border-gray-300'
                    />
                  </td>
                  <td className='px-6 py-4'>
                    <input
                      type='text'
                      value={editForm.title}
                      onChange={e =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='Task title'
                      autoFocus
                    />
                  </td>
                  <td className='px-6 py-4'>
                    <select
                      value={editForm.courseId}
                      onChange={e =>
                        setEditForm({ ...editForm, courseId: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='px-6 py-4'>
                    <select
                      value={editForm.type}
                      onChange={e =>
                        setEditForm({
                          ...editForm,
                          type: e.target.value as TaskType,
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      {taskTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='px-6 py-4'>
                    <input
                      type='number'
                      value={editForm.estimateMinutes}
                      onChange={e =>
                        setEditForm({
                          ...editForm,
                          estimateMinutes: parseInt(e.target.value) || 0,
                        })
                      }
                      min='1'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex space-x-2'>
                      <button
                        onClick={handleSave}
                        className='p-1 text-green-600 hover:text-green-800'
                      >
                        <Save className='w-4 h-4' />
                      </button>
                      <button
                        onClick={handleCancel}
                        className='p-1 text-gray-600 hover:text-gray-800'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {tasks.map(task => (
                <tr
                  key={task.id}
                  className={task.completed ? 'bg-gray-50' : ''}
                >
                  <td className='px-6 py-4'>
                    <input
                      type='checkbox'
                      checked={task.completed || false}
                      onChange={() => toggleComplete(task)}
                      className='rounded border-gray-300'
                    />
                  </td>
                  <td className='px-6 py-4'>
                    {editingId === task.id ? (
                      <input
                        type='text'
                        value={editForm.title}
                        onChange={e =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                      >
                        {task.title}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    {editingId === task.id ? (
                      <select
                        value={editForm.courseId}
                        onChange={e =>
                          setEditForm({ ...editForm, courseId: e.target.value })
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      >
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className='text-sm text-gray-600'>
                        {getCourse(task.courseId ?? '')?.name ||
                          'Unknown Course'}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    {editingId === task.id ? (
                      <select
                        value={editForm.type}
                        onChange={e =>
                          setEditForm({
                            ...editForm,
                            type: e.target.value as TaskType,
                          })
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      >
                        {taskTypes.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTaskTypeColor(task.type)}`}
                      >
                        {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    {editingId === task.id ? (
                      <input
                        type='number'
                        value={editForm.estimateMinutes}
                        onChange={e =>
                          setEditForm({
                            ...editForm,
                            estimateMinutes: parseInt(e.target.value) || 0,
                          })
                        }
                        min='1'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    ) : (
                      <div className='flex items-center space-x-1'>
                        <Clock className='w-4 h-4 text-gray-400' />
                        <span className='text-sm text-gray-600'>
                          {formatTime(task.estimateMinutes)}
                        </span>
                        {task.actualMinutes && (
                          <span className='text-xs text-gray-500 ml-2'>
                            (actual: {formatTime(task.actualMinutes)})
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    {editingId === task.id ? (
                      <div className='flex space-x-2'>
                        <button
                          onClick={handleSave}
                          className='p-1 text-green-600 hover:text-green-800'
                        >
                          <Save className='w-4 h-4' />
                        </button>
                        <button
                          onClick={handleCancel}
                          className='p-1 text-gray-600 hover:text-gray-800'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    ) : (
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => handleEdit(task)}
                          className='p-1 text-blue-600 hover:text-blue-800'
                        >
                          <Edit2 className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className='p-1 text-red-600 hover:text-red-800'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {tasks.length === 0 && !isAdding && courses.length > 0 && (
        <div className='text-center py-8 text-gray-500'>
          No tasks found. Click "Add Task" to create your first task.
        </div>
      )}
    </div>
  );
};
