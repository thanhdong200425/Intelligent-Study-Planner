'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Deadline, Course } from '@/types';
import { DeadlineStorage, CourseStorage } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface DeadlineFormProps {
  onSubmit?: (deadline: Deadline) => void;
  onCancel?: () => void;
}

export const DeadlineForm: React.FC<DeadlineFormProps> = ({ onSubmit, onCancel }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadCourses = () => {
      const allCourses = CourseStorage.getAll();
      setCourses(allCourses);
      if (allCourses.length > 0 && !formData.courseId) {
        setFormData(prev => ({ ...prev, courseId: allCourses[0].id }));
      }
    };

    loadCourses();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Deadline title is required';
    }
    
    if (!formData.courseId) {
      newErrors.courseId = 'Please select a course';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const deadline: Deadline = {
      id: uuidv4(),
      title: formData.title.trim(),
      courseId: formData.courseId,
      dueDate: new Date(formData.dueDate),
      priority: formData.priority,
    };

    DeadlineStorage.add(deadline);
    onSubmit?.(deadline);

    // Reset form
    setFormData({
      title: '',
      courseId: courses[0]?.id || '',
      dueDate: '',
      priority: 'medium',
    });
    setErrors({});
  };

  if (courses.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-800">
          Please add at least one course before creating deadlines.
        </p>
      </div>
    );
  }

  const courseOptions = courses.map(course => ({
    value: course.id,
    label: course.name,
  }));

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Deadline Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={errors.title}
        placeholder="e.g., Final Project, Midterm Exam"
      />

      <Select
        label="Course"
        value={formData.courseId}
        onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
        options={courseOptions}
        error={errors.courseId}
      />

      <Input
        label="Due Date"
        type="datetime-local"
        value={formData.dueDate}
        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        error={errors.dueDate}
      />

      <Select
        label="Priority"
        value={formData.priority}
        onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
        options={priorityOptions}
      />

      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          Add Deadline
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};