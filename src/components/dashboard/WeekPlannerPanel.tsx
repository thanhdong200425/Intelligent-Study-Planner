"use client";

import React, { useState, useEffect } from "react";
import { WeeklyScheduler } from "@/lib/scheduler";
import { Button } from "@/components/ui/Button";
import { format, addWeeks, subWeeks } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Zap,
  Database,
  AlertCircle,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { TaskStorage, CourseStorage, AvailabilityStorage } from "@/lib/storage";
import { addToast } from "@heroui/react";

interface WeekPlannerPanelProps {
  currentWeek: Date;
  onWeekChange: (week: Date) => void;
  onPlanGenerated: () => void;
}

export const WeekPlannerPanel: React.FC<WeekPlannerPanelProps> = ({
  currentWeek,
  onWeekChange,
  onPlanGenerated,
}) => {
  const [dataStats, setDataStats] = useState({
    courses: 0,
    tasks: 0,
    availability: 0,
  });

  useEffect(() => {
    updateDataStats();
  }, []);

  const updateDataStats = () => {
    setDataStats({
      courses: CourseStorage.getAll().length,
      tasks: TaskStorage.getAll().filter((t) => !t.completed).length,
      availability: AvailabilityStorage.getAll().length,
    });
  };

  const { mutate: generateWeeklyPlan, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      try {
        const scheduler = new WeeklyScheduler({ weekStart: currentWeek });
        const blocks = scheduler.generateWeeklySchedule();
        return blocks;
      } catch (error: unknown) {
        // Check if it's a date-related error
        if (
          error instanceof Error &&
          (error.message?.includes("getTime") ||
            error.message?.includes("Date"))
        ) {
          throw new Error("Data corruption detected. Try resetting your data.");
        }
        throw error;
      }
    },
    onSuccess: (blocks) => {
      onPlanGenerated();
      updateDataStats();
      addToast({
        title: "Plan Generated",
        description: `Successfully generated ${blocks.length} time blocks!`,
        color: "success",
      });
    },
    onError: (error: unknown) => {
      console.error("Error generating weekly plan:", error);
      const isDataCorruption =
        error instanceof Error &&
        error.message?.includes("Data corruption detected");
      if (isDataCorruption) {
        addToast({
          title: "Data Corruption Detected",
          description: "Please reset your data and try again.",
          color: "danger",
        });
      } else {
        addToast({
          title: "Plan Generation Failed",
          description: "Failed to generate schedule. Please check your data.",
          color: "danger",
        });
      }
    },
  });

  const previousWeek = () => {
    onWeekChange(subWeeks(currentWeek, 1));
  };

  const nextWeek = () => {
    onWeekChange(addWeeks(currentWeek, 1));
  };

  const currentWeekEnd = addWeeks(currentWeek, 1);
  currentWeekEnd.setDate(currentWeekEnd.getDate() - 1);

  const hasRequiredData =
    dataStats.courses > 0 && dataStats.tasks > 0 && dataStats.availability > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900">Week Planner</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={previousWeek}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[200px] text-center">
              {format(currentWeek, "MMM d")} -{" "}
              {format(currentWeekEnd, "MMM d, yyyy")}
            </span>
            <button
              onClick={nextWeek}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => generateWeeklyPlan()}
            disabled={isGenerating || !hasRequiredData}
            variant="primary"
            className="flex items-center space-x-2"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>{isGenerating ? "Generating..." : "Generate Week"}</span>
          </Button>
        </div>
      </div>

      {/* Data Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-lg font-semibold text-gray-900">
            {dataStats.courses}
          </div>
          <div className="text-xs text-gray-500">Courses</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-lg font-semibold text-gray-900">
            {dataStats.tasks}
          </div>
          <div className="text-xs text-gray-500">Active Tasks</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-lg font-semibold text-gray-900">
            {dataStats.availability}
          </div>
          <div className="text-xs text-gray-500">Time Slots</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          How it works:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Add your courses, tasks, and availability in the &quot;Add
            Data&quot; tab
          </li>
          <li>
            • Click &quot;Generate Week&quot; to create time blocks for your
            tasks
          </li>
          <li>• Drag and drop blocks in the calendar to reschedule</li>
          <li>• Use the timer to track actual time spent</li>
        </ul>
      </div>
    </div>
  );
};
