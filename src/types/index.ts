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

export type TaskType = 'reading' | 'coding' | 'writing' | 'pset' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high' | 'unknown';

export interface Task {
  id: string;
  title: string;
  courseId?: string;
  type: TaskType;
  estimateMinutes: number;
  deadlineId?: string;
  completed?: boolean;
  actualMinutes?: number;
  priority?: TaskPriority;
  course?: Course;
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
  id: number;
  type: 'focus' | 'break' | 'long_break';
  taskId: number | null;
  timeBlockId: number | null;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  status: 'active' | 'completed' | 'stopped';
  task?: Task;
}

export interface UserProfile {
  avatar: string | null;
  name: string;
  email: string;
  location: string;
  bio: string;
  focusDuration: number;
  breakDuration: number;
  dailyGoal: number;
}

export interface EventType {
  id: number;
  userId: number;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: number;
  userId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  title: string;
  note?: string;
  eventTypeId?: number;
  eventType?: EventType;
  taskId?: number;
  task?: Pick<Task, 'title'>;
  createdAt: Date;
  updatedAt: Date;
}
