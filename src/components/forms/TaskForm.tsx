'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, Course, Deadline, TaskType } from '@/types';
import { TaskStorage, CourseStorage, DeadlineStorage } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface TaskFormProps {
  onSubmit?: (task: Task) => void;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    type: 'reading' as TaskType,
    estimateMinutes: 60,
    deadlineId: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadData = () => {
      const allCourses = CourseStorage.getAll();
      const allDeadlines = DeadlineStorage.getAll();
      setCourses(allCourses);
      setDeadlines(allDeadlines);
      
      if (allCourses.length > 0 && !formData.courseId) {
        setFormData(prev => ({ ...prev, courseId: allCourses[0].id }));
      }
    };

    loadData();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!formData.courseId) {
      newErrors.courseId = 'Please select a course';
    }
    
    if (formData.estimateMinutes <= 0) {
      newErrors.estimateMinutes = 'Estimate must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const task: Task = {
      id: uuidv4(),
      title: formData.title.trim(),
      courseId: formData.courseId,
      type: formData.type,
      estimateMinutes: formData.estimateMinutes,
      deadlineId: formData.deadlineId || undefined,
    };

    TaskStorage.add(task);
    onSubmit?.(task);

    // Reset form
    setFormData({
      title: '',
      courseId: courses[0]?.id || '',
      type: 'reading',
      estimateMinutes: 60,
      deadlineId: '',
    });
    setErrors({});
  };

  if (courses.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-800">
          Please add at least one course before creating tasks.
        </p>
      </div>
    );
  }

  const courseOptions = courses.map(course => ({
    value: course.id,
    label: course.name,
  }));

  const typeOptions = [
    { value: 'reading', label: 'Reading' },
    { value: 'coding', label: 'Coding' },
    { value: 'writing', label: 'Writing' },
    { value: 'pset', label: 'Problem Set' },
  ];

  const availableDeadlines = deadlines.filter(d => d.courseId === formData.courseId);
  const deadlineOptions = [
    { value: '', label: 'No deadline' },
    ...availableDeadlines.map(deadline => ({
      value: deadline.id,
      label: deadline.title,
    })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Task Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={errors.title}
        placeholder="e.g., Read Chapter 5, Complete Assignment 2"
      />

      <Select
        label="Course"
        value={formData.courseId}
        onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
        options={courseOptions}
        error={errors.courseId}
      />

      <Select
        label="Task Type"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value as TaskType })}
        options={typeOptions}
      />

      <Input
        label="Estimated Minutes"
        type="number"
        min="1"
        value={formData.estimateMinutes}
        onChange={(e) => setFormData({ ...formData, estimateMinutes: parseInt(e.target.value) || 0 })}
        error={errors.estimateMinutes}
      />

      <Select
        label="Associated Deadline (Optional)"
        value={formData.deadlineId}
        onChange={(e) => setFormData({ ...formData, deadlineId: e.target.value })}
        options={deadlineOptions}
      />

      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          Add Task
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