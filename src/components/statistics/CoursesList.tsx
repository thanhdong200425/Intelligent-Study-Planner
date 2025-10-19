'use client';

import React, { useState, useCallback } from 'react';
import { Course } from '@/types';
import { CourseApiService } from '@/services/courseApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Edit2, Plus, Save, X, Loader2 } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Input,
} from '@heroui/react';

export const CoursesList: React.FC = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; color: string }>({
    name: '',
    color: '#3b82f6',
  });

  const queryClient = useQueryClient();

  // Fetch courses
  const {
    data: courses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: CourseApiService.getCourses,
  });

  // Create course mutation
  const createMutation = useMutation({
    mutationFn: CourseApiService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setEditForm({ name: '', color: '#3b82f6' });
    },
    onError: error => {
      console.error('Failed to create course:', error);
      alert('Failed to create course. Please try again.');
    },
  });

  // Update course mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name?: string; color?: string };
    }) => CourseApiService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setEditingId(null);
      setEditForm({ name: '', color: '#3b82f6' });
    },
    onError: error => {
      console.error('Failed to update course:', error);
      alert('Failed to update course. Please try again.');
    },
  });

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: CourseApiService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: error => {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course. Please try again.');
    },
  });

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setEditForm({ name: course.name, color: course.color });
  };

  const handleAdd = () => {
    setEditForm({ name: '', color: '#3b82f6' });
    setEditingId(null);
  };

  const handleSave = () => {
    if (!editForm.name.trim()) return;

    if (createMutation.isPending) {
      createMutation.mutate({
        name: editForm.name.trim(),
        color: editForm.color,
      });
    } else if (editingId) {
      updateMutation.mutate({
        id: editingId,
        data: {
          name: editForm.name.trim(),
          color: editForm.color,
        },
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ name: '', color: '#3b82f6' });
  };

  const handleDelete = useCallback(
    (id: number) => {
      if (window.confirm('Are you sure you want to delete this course?')) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  const columns = [
    { name: 'Course Name', uid: 'name', sortable: true },
    { name: 'Color', uid: 'color' },
    { name: 'Actions', uid: 'actions' },
  ];

  const renderCell = useCallback(
    (course: Course, columnKey: React.Key) => {
      const cellValue = course[columnKey as keyof Course];

      switch (columnKey) {
        case 'name':
          return (
            <div className='flex flex-col'>
              <p className='text-bold text-sm capitalize'>{course.name}</p>
            </div>
          );
        case 'color':
          return (
            <div className='flex items-center space-x-2'>
              <div
                className='w-6 h-6 rounded border border-gray-300'
                style={{ backgroundColor: course.color }}
              />
              <span className='text-sm text-gray-600'>{course.color}</span>
            </div>
          );
        case 'actions':
          return (
            <div className='flex justify-center items-center gap-2'>
              <Button
                isIconOnly
                size='sm'
                variant='light'
                onPress={() => handleEdit(course)}
                isDisabled={deleteMutation.isPending}
              >
                <Edit2 className='w-4 h-4 text-blue-600' />
              </Button>
              <Button
                isIconOnly
                size='sm'
                variant='light'
                onPress={() => handleDelete(course.id)}
                isDisabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className='w-4 h-4 text-red-600 animate-spin' />
                ) : (
                  <Trash2 className='w-4 h-4 text-red-600' />
                )}
              </Button>
            </div>
          );
        default:
          return cellValue instanceof Date
            ? cellValue.toLocaleDateString()
            : cellValue;
      }
    },
    [deleteMutation.isPending, handleDelete]
  );

  const topContent = React.useMemo(() => {
    return (
      <div className='flex justify-between gap-3 items-end'>
        <div className='flex gap-3'>
          <h3 className='text-lg font-semibold'>Courses Management</h3>
          {isLoading && <Loader2 className='w-5 h-5 animate-spin' />}
        </div>
        <div className='flex gap-3'>
          <Button
            color='primary'
            endContent={<Plus className='w-4 h-4' />}
            onPress={handleAdd}
            isDisabled={isLoading}
          >
            Add Course
          </Button>
        </div>
      </div>
    );
  }, [isLoading]);

  // Show error message if there's an error
  if (error) {
    return (
      <div className='space-y-4'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <h3 className='text-lg font-semibold text-red-800'>
            Error Loading Courses
          </h3>
          <p className='text-red-600'>
            {error instanceof Error
              ? error.message
              : 'Failed to load courses. Please try again.'}
          </p>
          <Button
            color='primary'
            size='sm'
            className='mt-2'
            onPress={() =>
              queryClient.invalidateQueries({ queryKey: ['courses'] })
            }
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Add Course Form Modal/Inline */}
      {createMutation.isPending && (
        <div className='bg-white rounded-lg border border-gray-200 p-4 space-y-4'>
          <h4 className='text-md font-semibold'>Add New Course</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              type='text'
              label='Course Name'
              value={editForm.name}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              placeholder='Course name'
              autoFocus
            />
            <div className='flex items-center space-x-2'>
              <label className='text-sm font-medium'>Color:</label>
              <input
                type='color'
                value={editForm.color}
                onChange={e =>
                  setEditForm({ ...editForm, color: e.target.value })
                }
                className='w-12 h-8 border border-gray-300 rounded cursor-pointer'
              />
            </div>
          </div>
          <div className='flex space-x-2'>
            <Button
              color='success'
              size='sm'
              onPress={handleSave}
              startContent={
                createMutation.isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Save className='w-4 h-4' />
                )
              }
              isDisabled={createMutation.isPending || !editForm.name.trim()}
            >
              {createMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button
              color='default'
              variant='bordered'
              size='sm'
              onPress={handleCancel}
              startContent={<X className='w-4 h-4' />}
              isDisabled={createMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Edit Course Form Modal/Inline */}
      {editingId && (
        <div className='bg-white rounded-lg border border-gray-200 p-4 space-y-4'>
          <h4 className='text-md font-semibold'>Edit Course</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              type='text'
              label='Course Name'
              value={editForm.name}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              autoFocus
            />
            <div className='flex items-center space-x-2'>
              <label className='text-sm font-medium'>Color:</label>
              <input
                type='color'
                value={editForm.color}
                onChange={e =>
                  setEditForm({ ...editForm, color: e.target.value })
                }
                className='w-12 h-8 border border-gray-300 rounded cursor-pointer'
              />
            </div>
          </div>
          <div className='flex space-x-2'>
            <Button
              color='success'
              size='sm'
              onPress={handleSave}
              startContent={
                updateMutation.isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Save className='w-4 h-4' />
                )
              }
              isDisabled={updateMutation.isPending || !editForm.name.trim()}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button
              color='default'
              variant='bordered'
              size='sm'
              onPress={handleCancel}
              startContent={<X className='w-4 h-4' />}
              isDisabled={updateMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Table
        aria-label='Courses table with custom cells'
        topContent={topContent}
        topContentPlacement='outside'
        isStriped
        removeWrapper={false}
      >
        <TableHeader columns={columns}>
          {column => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={courses}
          emptyContent={
            isLoading ? (
              <div className='text-center py-8 text-gray-500'>
                <Loader2 className='w-6 h-6 animate-spin mx-auto mb-2' />
                Loading courses...
              </div>
            ) : courses.length === 0 && !createMutation.isPending ? (
              <div className='text-center py-8 text-gray-500'>
                No courses found. Click "Add Course" to create your first
                course.
              </div>
            ) : undefined
          }
        >
          {item => (
            <TableRow key={item.id}>
              {columnKey => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
