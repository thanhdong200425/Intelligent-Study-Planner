export interface Course {
  id: number;
  userId: number;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deadline {
  id: string;
  title: string;
  courseId: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  completed?: boolean;
}

export type TaskType = 'reading' | 'coding' | 'writing' | 'pset';

export interface Task {
  id: string;
  title: string;
  courseId: string;
  type: TaskType;
  estimateMinutes: number;
  deadlineId?: string;
  completed?: boolean;
  actualMinutes?: number;
}

export interface AvailabilityWindow {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

export interface TimeBlock {
  id: string;
  taskId: string;
  startTime: Date;
  endTime: Date;
  isBreak?: boolean;
  breakType?: 'short' | 'long';
  actualMinutes?: number;
  completed?: boolean;
}

export interface Habit {
  id: string;
  name: string;
  targetMinutes: number;
  currentStreak: number;
  longestStreak: number;
  completions: Date[];
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: Date;
  minutes: number;
}

export interface WeeklySummary {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  tasksCompleted: number;
  tasksOverdue: number;
  totalActualTime: number;
  totalPredictedTime: number;
  timePerCourse: { [courseId: string]: number };
  habitStreaks: { [habitId: string]: number };
  mostProductiveTimeSlot?: {
    day: string;
    timeRange: string;
    productivity: number;
  };
}

export interface TimerSession {
  id: string;
  timeBlockId: string;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  actualMinutes: number;
}

export interface UserProfile {
  fullName: string;
  email: string;
  location: string;
  bio: string;
  focusDuration: number;
  breakDuration: number;
  dailyGoal: number;
  joinedDate: string;
  updatedAt?: string;
  createdAt?: string;

}
