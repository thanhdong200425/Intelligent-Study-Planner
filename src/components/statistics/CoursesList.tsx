'use client';

import React, { useState, useCallback } from 'react';
import { Course } from '@/types';
import { CourseStorage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Edit2, Plus, Save, X } from 'lucide-react';
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

interface CoursesListProps {
  courses: Course[];
  onDataChange: () => void;
}

export const CoursesList: React.FC<CoursesListProps> = ({
  courses,
  onDataChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<{ name: string; color: string }>({
    name: '',
    color: '#3b82f6',
  });

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setEditForm({ name: course.name, color: course.color });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditForm({ name: '', color: '#3b82f6' });
    setEditingId(null);
  };

  const handleSave = () => {
    if (!editForm.name.trim()) return;

    if (isAdding) {
      const newCourse: Course = {
        id: uuidv4(),
        name: editForm.name.trim(),
        color: editForm.color,
      };
      CourseStorage.add(newCourse);
    } else if (editingId) {
      const updatedCourse: Course = {
        id: editingId,
        name: editForm.name.trim(),
        color: editForm.color,
      };
      CourseStorage.update(updatedCourse);
    }

    setEditingId(null);
    setIsAdding(false);
    setEditForm({ name: '', color: '#3b82f6' });
    onDataChange();
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditForm({ name: '', color: '#3b82f6' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      CourseStorage.remove(id);
      onDataChange();
    }
  };

  const columns = [
    { name: 'Course Name', uid: 'name', sortable: true },
    { name: 'Color', uid: 'color' },
    { name: 'Actions', uid: 'actions' },
  ];

  const renderCell = useCallback((course: Course, columnKey: React.Key) => {
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
            >
              <Edit2 className='w-4 h-4 text-blue-600' />
            </Button>
            <Button
              isIconOnly
              size='sm'
              variant='light'
              onPress={() => handleDelete(course.id)}
            >
              <Trash2 className='w-4 h-4 text-red-600' />
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className='flex justify-between gap-3 items-end'>
        <div className='flex gap-3'>
          <h3 className='text-lg font-semibold'>Courses Management</h3>
        </div>
        <div className='flex gap-3'>
          <Button
            color='primary'
            endContent={<Plus className='w-4 h-4' />}
            onPress={handleAdd}
          >
            Add Course
          </Button>
        </div>
      </div>
    );
  }, []);

  return (
    <div className='space-y-4'>
      {/* Add Course Form Modal/Inline */}
      {isAdding && (
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
              startContent={<Save className='w-4 h-4' />}
            >
              Save
            </Button>
            <Button
              color='default'
              variant='bordered'
              size='sm'
              onPress={handleCancel}
              startContent={<X className='w-4 h-4' />}
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
              startContent={<Save className='w-4 h-4' />}
            >
              Save
            </Button>
            <Button
              color='default'
              variant='bordered'
              size='sm'
              onPress={handleCancel}
              startContent={<X className='w-4 h-4' />}
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
            courses.length === 0 && !isAdding ? (
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
