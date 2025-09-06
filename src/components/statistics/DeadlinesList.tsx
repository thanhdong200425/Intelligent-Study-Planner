'use client';

import React, { useState, useCallback } from 'react';
import { Deadline, Course } from '@/types';
import { DeadlineStorage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Edit2, Plus, Save, X, Clock, AlertCircle } from 'lucide-react';
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

interface DeadlinesListProps {
  deadlines: Deadline[];
  courses: Course[];
  onDataChange: () => void;
}

export const DeadlinesList: React.FC<DeadlinesListProps> = ({
  deadlines,
  courses,
  onDataChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    courseId: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const handleEdit = (deadline: Deadline) => {
    setEditingId(deadline.id);
    setEditForm({
      title: deadline.title,
      courseId: deadline.courseId,
      dueDate: new Date(deadline.dueDate).toISOString().slice(0, 16),
      priority: deadline.priority,
    });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditForm({
      title: '',
      courseId: courses[0]?.id || '',
      dueDate: '',
      priority: 'medium',
    });
    setEditingId(null);
  };

  const handleSave = () => {
    if (!editForm.title.trim() || !editForm.dueDate) return;

    if (isAdding) {
      const newDeadline: Deadline = {
        id: uuidv4(),
        title: editForm.title.trim(),
        courseId: editForm.courseId,
        dueDate: new Date(editForm.dueDate),
        priority: editForm.priority,
      };
      DeadlineStorage.add(newDeadline);
    } else if (editingId) {
      const updatedDeadline: Deadline = {
        id: editingId,
        title: editForm.title.trim(),
        courseId: editForm.courseId,
        dueDate: new Date(editForm.dueDate),
        priority: editForm.priority,
      };
      DeadlineStorage.update(updatedDeadline);
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
      dueDate: '',
      priority: 'medium',
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this deadline?')) {
      DeadlineStorage.remove(id);
      onDataChange();
    }
  };

  const toggleComplete = (deadline: Deadline) => {
    const updated = { ...deadline, completed: !deadline.completed };
    DeadlineStorage.update(updated);
    onDataChange();
  };

  const formatDate = (date: Date) => {
    return (
      new Date(date).toLocaleDateString() +
      ' ' +
      new Date(date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const isOverdue = (date: Date) =>
    new Date(date) < new Date() &&
    new Date(date).toDateString() !== new Date().toDateString();

  const getCourse = (courseId: string) => courses.find(c => c.id === courseId);

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold'>Deadlines Management</h3>
        <button
          onClick={handleAdd}
          disabled={courses.length === 0}
          className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400'
        >
          <Plus className='w-4 h-4' />
          <span>Add Deadline</span>
        </button>
      </div>

      {courses.length === 0 && (
        <div className='bg-yellow-50 border border-yellow-200 rounded-md p-4'>
          <p className='text-yellow-800'>
            Please add at least one course before creating deadlines.
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
                  Due Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Priority
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
                      placeholder='Deadline title'
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
                    <input
                      type='datetime-local'
                      value={editForm.dueDate}
                      onChange={e =>
                        setEditForm({ ...editForm, dueDate: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </td>
                  <td className='px-6 py-4'>
                    <select
                      value={editForm.priority}
                      onChange={e =>
                        setEditForm({
                          ...editForm,
                          priority: e.target.value as 'low' | 'medium' | 'high',
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='low'>Low</option>
                      <option value='medium'>Medium</option>
                      <option value='high'>High</option>
                    </select>
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
              {deadlines.map(deadline => (
                <tr
                  key={deadline.id}
                  className={deadline.completed ? 'bg-gray-50' : ''}
                >
                  <td className='px-6 py-4'>
                    <input
                      type='checkbox'
                      checked={deadline.completed || false}
                      onChange={() => toggleComplete(deadline)}
                      className='rounded border-gray-300'
                    />
                  </td>
                  <td className='px-6 py-4'>
                    {editingId === deadline.id ? (
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
                      <div className='flex items-center space-x-2'>
                        <span
                          className={`text-sm font-medium ${deadline.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                        >
                          {deadline.title}
                        </span>
                        {isOverdue(deadline.dueDate) && !deadline.completed && (
                          <AlertCircle className='w-4 h-4 text-red-500' />
                        )}
                      </div>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    {editingId === deadline.id ? (
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
                        {getCourse(deadline.courseId)?.name || 'Unknown Course'}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    {editingId === deadline.id ? (
                      <input
                        type='datetime-local'
                        value={editForm.dueDate}
                        onChange={e =>
                          setEditForm({ ...editForm, dueDate: e.target.value })
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    ) : (
                      <div className='flex items-center space-x-2'>
                        <Clock className='w-4 h-4 text-gray-400' />
                        <span
                          className={`text-sm ${isOverdue(deadline.dueDate) && !deadline.completed ? 'text-red-600 font-medium' : 'text-gray-600'}`}
                        >
                          {formatDate(deadline.dueDate)}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    {editingId === deadline.id ? (
                      <select
                        value={editForm.priority}
                        onChange={e =>
                          setEditForm({
                            ...editForm,
                            priority: e.target.value as
                              | 'low'
                              | 'medium'
                              | 'high',
                          })
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      >
                        <option value='low'>Low</option>
                        <option value='medium'>Medium</option>
                        <option value='high'>High</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(deadline.priority)}`}
                      >
                        {deadline.priority.charAt(0).toUpperCase() +
                          deadline.priority.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    {editingId === deadline.id ? (
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
                          onClick={() => handleEdit(deadline)}
                          className='p-1 text-blue-600 hover:text-blue-800'
                        >
                          <Edit2 className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleDelete(deadline.id)}
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

      {deadlines.length === 0 && !isAdding && courses.length > 0 && (
        <div className='text-center py-8 text-gray-500'>
          No deadlines found. Click "Add Deadline" to create your first
          deadline.
        </div>
      )}
    </div>
  );
};
