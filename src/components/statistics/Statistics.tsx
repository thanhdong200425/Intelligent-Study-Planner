"use client";

import React, { useState, useEffect } from "react";
import { CoursesList } from "./CoursesList";
import { DeadlinesList } from "./DeadlinesList";
import { TasksList } from "./TasksList";
import { StatisticsCard } from "./StatisticsCard";
import { Course, Deadline, Task } from "@/types";
import { CourseStorage, DeadlineStorage, TaskStorage } from "@/lib/storage";
import { BookOpen, Calendar, CheckSquare, BarChart3 } from "lucide-react";

interface ActiveViewProps {
    activeView: "overview" | "courses" | "deadlines" | "tasks";
}

export const Statistics: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeView, setActiveView] = useState<ActiveViewProps["activeView"]>("overview");

  const loadData = () => {
    setCourses(CourseStorage.getAll());
    setDeadlines(DeadlineStorage.getAll());
    setTasks(TaskStorage.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const completedTasks = tasks.filter(task => task.completed).length;
  const completedDeadlines = deadlines.filter(deadline => deadline.completed).length;
  const upcomingDeadlines = deadlines.filter(deadline => 
    !deadline.completed && new Date(deadline.dueDate) > new Date()
  ).length;
  const overdueDealines = deadlines.filter(deadline => 
    !deadline.completed && new Date(deadline.dueDate) < new Date()
  ).length;

  const viewButtons = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "deadlines", label: "Deadlines", icon: Calendar },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
  ];

  const renderContent = () => {
    switch (activeView) {
      case "courses":
        return <CoursesList courses={courses} onDataChange={loadData} />;
      case "deadlines":
        return <DeadlinesList deadlines={deadlines} courses={courses} onDataChange={loadData} />;
      case "tasks":
        return <TasksList tasks={tasks} courses={courses} onDataChange={loadData} />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatisticsCard
              title="Total Courses"
              value={courses.length}
              icon={BookOpen}
              color="blue"
            />
            <StatisticsCard
              title="Total Tasks"
              value={tasks.length}
              subtitle={`${completedTasks} completed`}
              icon={CheckSquare}
              color="green"
            />
            <StatisticsCard
              title="Total Deadlines"
              value={deadlines.length}
              subtitle={`${completedDeadlines} completed`}
              icon={Calendar}
              color="purple"
            />
            <StatisticsCard
              title="Upcoming Deadlines"
              value={upcomingDeadlines}
              subtitle={`${overdueDealines} overdue`}
              icon={Calendar}
              color="orange"
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* View Navigation */}
      <div className="flex flex-wrap gap-2">
        {viewButtons.map((button) => {
          const Icon = button.icon;
          return (
            <button
              key={button.id}
              onClick={() => setActiveView(button.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeView === button.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{button.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};
