"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Task, Course, Deadline, TaskType } from "@/types";
import { TaskStorage, CourseStorage, DeadlineStorage } from "@/lib/storage";
import { Controller, useForm } from "react-hook-form";
import { Input, Select, SelectItem, Button, addToast } from "@heroui/react";

interface TaskFormProps {
  onSubmit?: (task: Task) => void;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const {
    control,
    setValue,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Task>({
    defaultValues: {
      title: "",
      courseId: "",
      type: "reading",
      estimateMinutes: 60,
      deadlineId: "",
    },
    mode: "onBlur",
  });

  const selectedCourseId = watch("courseId");

  useEffect(() => {
    const loadData = () => {
      const allCourses = CourseStorage.getAll();
      const allDeadlines = DeadlineStorage.getAll();
      setCourses(allCourses);
      setDeadlines(allDeadlines);

      if (allCourses.length > 0 && !selectedCourseId) {
        setValue("courseId", allCourses[0].id);
      }
    };

    loadData();
  }, [setValue, selectedCourseId]);

  const onSubmitHandler = (data: Task) => {
    const task: Task = {
      id: uuidv4(),
      title: data.title.trim(),
      courseId: data.courseId,
      type: data.type,
      estimateMinutes: data.estimateMinutes,
      deadlineId: data.deadlineId || undefined,
    };

    TaskStorage.add(task);
    onSubmit?.(task);

    addToast({
      title: "Task Added",
      color: "success",
      timeout: 3000,
      shouldShowTimeoutProgress: true,
    });

    // Reset form
    reset({
      title: "",
      courseId: courses[0]?.id || "",
      type: "reading",
      estimateMinutes: 60,
      deadlineId: "",
    });
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

  const courseOptions = courses.map((course) => ({
    value: course.id,
    label: course.name,
  }));

  const typeOptions = [
    { value: "reading", label: "Reading" },
    { value: "coding", label: "Coding" },
    { value: "writing", label: "Writing" },
    { value: "pset", label: "Problem Set" },
  ];

  const availableDeadlines = deadlines.filter(
    (d) => d.courseId === selectedCourseId
  );
  const deadlineOptions = [
    { value: "", label: "No deadline" },
    ...availableDeadlines.map((deadline) => ({
      value: deadline.id,
      label: deadline.title,
    })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <Controller
        control={control}
        name="title"
        rules={{
          required: {
            value: true,
            message: "Task title is required",
          },
        }}
        render={({ field }) => (
          <Input
            {...field}
            label="Task Title"
            isInvalid={!!errors.title?.message}
            errorMessage={errors.title?.message}
            placeholder="e.g., Read Chapter 5, Complete Assignment 2"
            size="sm"
          />
        )}
      />

      <Controller
        control={control}
        name="courseId"
        rules={{ required: { value: true, message: "Course is required" } }}
        render={({ field }) => (
          <Select
            {...field}
            isInvalid={!!errors.courseId?.message}
            placeholder="Select a course"
            errorMessage={errors.courseId?.message}
            label="Course"
          >
            {courseOptions.map((course) => (
              <SelectItem key={course.value}>{course.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        control={control}
        name="type"
        rules={{ required: { value: true, message: "Task type is required" } }}
        render={({ field }) => (
          <Select
            {...field}
            isInvalid={!!errors.type?.message}
            placeholder="Select task type"
            errorMessage={errors.type?.message}
            label="Task Type"
          >
            {typeOptions.map((type) => (
              <SelectItem key={type.value}>{type.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        control={control}
        name="estimateMinutes"
        rules={{
          required: {
            value: true,
            message: "Estimated minutes is required",
          },
          min: {
            value: 1,
            message: "Estimate must be greater than 0",
          },
        }}
        render={({ field }) => (
          <Input
            {...field}
            label="Estimated Minutes"
            type="number"
            min="1"
            value={field.value?.toString() || ""}
            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            isInvalid={!!errors.estimateMinutes?.message}
            errorMessage={errors.estimateMinutes?.message}
            size="sm"
          />
        )}
      />

      <Controller
        control={control}
        name="deadlineId"
        render={({ field }) => (
          <Select
            {...field}
            placeholder="Select deadline (optional)"
            label="Associated Deadline (Optional)"
          >
            {deadlineOptions.map((deadline) => (
              <SelectItem key={deadline.value}>{deadline.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      <div className="flex gap-2">
        <Button type="submit" color="primary">
          Add Task
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
