'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AvailabilityWindow } from '@/types';
import { AvailabilityStorage } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface AvailabilityFormProps {
  onSubmit?: (window: AvailabilityWindow) => void;
  onCancel?: () => void;
}

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '17:00',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const dayOptions = [
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const availabilityWindow: AvailabilityWindow = {
      id: uuidv4(),
      dayOfWeek: formData.dayOfWeek,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    AvailabilityStorage.add(availabilityWindow);
    onSubmit?.(availabilityWindow);

    // Reset form
    setFormData({
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Day of Week"
        value={formData.dayOfWeek.toString()}
        onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
        options={dayOptions}
      />

      <Input
        label="Start Time"
        type="time"
        value={formData.startTime}
        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
        error={errors.startTime}
      />

      <Input
        label="End Time"
        type="time"
        value={formData.endTime}
        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
        error={errors.endTime}
      />

      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          Add Availability
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