"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Course } from "@/types";
import { CourseStorage } from "@/lib/storage";
import { Button } from "@/components/ui/Button";
import { Input } from "@heroui/react";
import { useForm } from "react-hook-form";

interface CourseFormProps {
  onSubmit?: (course: Course) => void;
  onCancel?: () => void;
}

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];

export const CourseForm: React.FC<CourseFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
    getValues,
  } = useForm<Course>();

  const onSubmitHandler = (data: Course) => {
    const course: Course = {
      id: uuidv4(),
      name: data.name.trim(),
      color: data.color,
    };

    CourseStorage.add(course);
    onSubmit?.(course);

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <Input
        label="Course Name"
        {...(register("name"), { required: true, minLength: 1 })}
        placeholder="e.g., CS 101, Mathematics, Literature"
        isRequired
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Color
        </label>
        <div className="grid grid-cols-8 gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${
                getValues("color") === color
                  ? "border-gray-900"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setValue("color", color)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          Add Course
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
