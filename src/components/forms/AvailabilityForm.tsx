"use client";

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { AvailabilityWindow } from "@/types";
import { AvailabilityStorage } from "@/lib/storage";
import { Controller, useForm } from "react-hook-form";
import { Input, Select, SelectItem, Button, addToast } from "@heroui/react";

interface AvailabilityFormProps {
  onSubmit?: (window: AvailabilityWindow) => void;
  onCancel?: () => void;
}

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AvailabilityWindow>({
    defaultValues: {
      dayOfWeek: 1, // Monday
      startTime: "09:00",
      endTime: "17:00",
    },
    mode: "onBlur",
  });

  const startTime = watch("startTime");

  const dayOptions = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
  ];

  const validateTime = (value: string) => {
    if (!value) return "Time is required";
    return true;
  };

  const validateEndTime = (value: string) => {
    if (!value) return "End time is required";
    if (startTime && value <= startTime) {
      return "End time must be after start time";
    }
    return true;
  };

  const onSubmitHandler = (data: AvailabilityWindow) => {
    const availabilityWindow: AvailabilityWindow = {
      id: uuidv4(),
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
    };

    AvailabilityStorage.add(availabilityWindow);
    onSubmit?.(availabilityWindow);

    addToast({
      title: "Availability Added",
      color: "success",
      timeout: 3000,
      shouldShowTimeoutProgress: true,
    });

    // Reset form
    reset({
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "17:00",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <Controller
        control={control}
        name="dayOfWeek"
        rules={{
          required: { value: true, message: "Day of week is required" },
        }}
        render={({ field }) => (
          <Select
            {...field}
            selectedKeys={field.value ? [field.value.toString()] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              field.onChange(parseInt(selectedKey));
            }}
            isInvalid={!!errors.dayOfWeek?.message}
            errorMessage={errors.dayOfWeek?.message}
            label="Day of Week"
          >
            {dayOptions.map((day) => (
              <SelectItem key={day.value}>{day.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        control={control}
        name="startTime"
        rules={{
          required: { value: true, message: "Start time is required" },
          validate: validateTime,
        }}
        render={({ field }) => (
          <Input
            {...field}
            label="Start Time"
            type="time"
            isInvalid={!!errors.startTime?.message}
            errorMessage={errors.startTime?.message}
            size="sm"
          />
        )}
      />

      <Controller
        control={control}
        name="endTime"
        rules={{
          required: { value: true, message: "End time is required" },
          validate: validateEndTime,
        }}
        render={({ field }) => (
          <Input
            {...field}
            label="End Time"
            type="time"
            isInvalid={!!errors.endTime?.message}
            errorMessage={errors.endTime?.message}
            size="sm"
          />
        )}
      />

      <div className="flex gap-2">
        <Button type="submit" color="primary">
          Add Availability
        </Button>
        {onCancel && (
          <Button type="button" color="secondary" onPress={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
