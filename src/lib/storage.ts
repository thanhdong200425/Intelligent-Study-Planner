import {
  Course,
  Deadline,
  Task,
  AvailabilityWindow,
  TimeBlock,
  Habit,
  HabitCompletion,
  WeeklySummary,
  TimerSession,
} from '@/types';

const STORAGE_KEYS = {
  COURSES: 'courses',
  DEADLINES: 'deadlines',
  TASKS: 'tasks',
  AVAILABILITY: 'availability',
  TIME_BLOCKS: 'timeBlocks',
  HABITS: 'habits',
  HABIT_COMPLETIONS: 'habitCompletions',
  WEEKLY_SUMMARIES: 'weeklySummaries',
  TIMER_SESSIONS: 'timerSessions',
} as const;

// Utility functions for localStorage operations
export class Storage {
  static get<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  static set<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  static add<T extends { id: string }>(key: string, item: T): void {
    const items = this.get<T>(key);
    items.push(item);
    this.set(key, items);
  }

  static update<T extends { id: string }>(key: string, updatedItem: T): void {
    const items = this.get<T>(key);
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      this.set(key, items);
    }
  }

  static remove<T extends { id: string }>(key: string, id: string): void {
    const items = this.get<T>(key);
    const filtered = items.filter(item => item.id !== id);
    this.set(key, filtered);
  }
}

// Course operations
export const CourseStorage = {
  getAll: (): Course[] => Storage.get<Course>(STORAGE_KEYS.COURSES),
  add: (course: Course) => Storage.add(STORAGE_KEYS.COURSES, course),
  update: (course: Course) => Storage.update(STORAGE_KEYS.COURSES, course),
  remove: (id: string) => Storage.remove(STORAGE_KEYS.COURSES, id),
  getById: (id: string): Course | undefined =>
    Storage.get<Course>(STORAGE_KEYS.COURSES).find(c => c.id === id),
};

// Deadline operations
export const DeadlineStorage = {
  getAll: (): Deadline[] => {
    const deadlines = Storage.get<Deadline>(STORAGE_KEYS.DEADLINES);
    return deadlines.map(deadline => ({
      ...deadline,
      dueDate: new Date(deadline.dueDate),
    }));
  },
  add: (deadline: Deadline) => Storage.add(STORAGE_KEYS.DEADLINES, deadline),
  update: (deadline: Deadline) =>
    Storage.update(STORAGE_KEYS.DEADLINES, deadline),
  remove: (id: string) => Storage.remove(STORAGE_KEYS.DEADLINES, id),
  getByCourse: (courseId: string): Deadline[] =>
    DeadlineStorage.getAll().filter(d => d.courseId === courseId),
};

// Task operations
export const TaskStorage = {
  getAll: (): Task[] => Storage.get<Task>(STORAGE_KEYS.TASKS),
  add: (task: Task) => Storage.add(STORAGE_KEYS.TASKS, task),
  update: (task: Task) => Storage.update(STORAGE_KEYS.TASKS, task),
  remove: (id: string) => Storage.remove(STORAGE_KEYS.TASKS, id),
  getByCourse: (courseId: string): Task[] =>
    Storage.get<Task>(STORAGE_KEYS.TASKS).filter(t => t.courseId === courseId),
};

// Availability operations
export const AvailabilityStorage = {
  getAll: (): AvailabilityWindow[] =>
    Storage.get<AvailabilityWindow>(STORAGE_KEYS.AVAILABILITY),
  add: (window: AvailabilityWindow) =>
    Storage.add(STORAGE_KEYS.AVAILABILITY, window),
  update: (window: AvailabilityWindow) =>
    Storage.update(STORAGE_KEYS.AVAILABILITY, window),
  remove: (id: string) => Storage.remove(STORAGE_KEYS.AVAILABILITY, id),
};

// Time block operations
export const TimeBlockStorage = {
  getAll: (): TimeBlock[] => {
    const blocks = Storage.get<TimeBlock>(STORAGE_KEYS.TIME_BLOCKS);
    return blocks.map(block => ({
      ...block,
      startTime: new Date(block.startTime),
      endTime: new Date(block.endTime),
    }));
  },
  add: (timeBlock: TimeBlock) =>
    Storage.add(STORAGE_KEYS.TIME_BLOCKS, timeBlock),
  update: (timeBlock: TimeBlock) =>
    Storage.update(STORAGE_KEYS.TIME_BLOCKS, timeBlock),
  remove: (id: string) => Storage.remove(STORAGE_KEYS.TIME_BLOCKS, id),
  getByWeek: (weekStart: Date): TimeBlock[] => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return TimeBlockStorage.getAll().filter(tb => {
      const blockDate = new Date(tb.startTime);
      return blockDate >= weekStart && blockDate < weekEnd;
    });
  },
};

// Habit operations
export const HabitStorage = {
  getAll: (): Habit[] => {
    const habits = Storage.get<Habit>(STORAGE_KEYS.HABITS);
    return habits.map(habit => ({
      ...habit,
      completions: habit.completions.map(date => new Date(date)),
    }));
  },
  add: (habit: Habit) => Storage.add(STORAGE_KEYS.HABITS, habit),
  update: (habit: Habit) => Storage.update(STORAGE_KEYS.HABITS, habit),
  remove: (id: string) => Storage.remove(STORAGE_KEYS.HABITS, id),
};

// Habit completion operations
export const HabitCompletionStorage = {
  getAll: (): HabitCompletion[] => {
    const completions = Storage.get<HabitCompletion>(
      STORAGE_KEYS.HABIT_COMPLETIONS
    );
    return completions.map(completion => ({
      ...completion,
      date: new Date(completion.date),
    }));
  },
  add: (completion: HabitCompletion) =>
    Storage.add(STORAGE_KEYS.HABIT_COMPLETIONS, completion),
  update: (completion: HabitCompletion) =>
    Storage.update(STORAGE_KEYS.HABIT_COMPLETIONS, completion),
  remove: (id: string) => Storage.remove(STORAGE_KEYS.HABIT_COMPLETIONS, id),
  getByHabit: (habitId: string): HabitCompletion[] =>
    HabitCompletionStorage.getAll().filter(hc => hc.habitId === habitId),
};

// Weekly summary operations
export const WeeklySummaryStorage = {
  getAll: (): WeeklySummary[] => {
    const summaries = Storage.get<WeeklySummary>(STORAGE_KEYS.WEEKLY_SUMMARIES);
    return summaries.map(summary => ({
      ...summary,
      weekStart: new Date(summary.weekStart),
      weekEnd: new Date(summary.weekEnd),
    }));
  },
  add: (summary: WeeklySummary) =>
    Storage.add(STORAGE_KEYS.WEEKLY_SUMMARIES, summary),
  update: (summary: WeeklySummary) =>
    Storage.update(STORAGE_KEYS.WEEKLY_SUMMARIES, summary),
  remove: (weekStart: string) => {
    const summaries = Storage.get<WeeklySummary>(STORAGE_KEYS.WEEKLY_SUMMARIES);
    const filtered = summaries.filter(
      s => s.weekStart.toString() !== weekStart
    );
    Storage.set(STORAGE_KEYS.WEEKLY_SUMMARIES, filtered);
  },
};

// Timer session operations
export const TimerSessionStorage = {
  getAll: (): TimerSession[] => {
    const sessions = Storage.get<TimerSession>(STORAGE_KEYS.TIMER_SESSIONS);
    return sessions.map(session => ({
      ...session,
      startTime: new Date(session.startTime),
      endTime: session.endTime ? new Date(session.endTime) : undefined,
    }));
  },
  add: (session: TimerSession) =>
    Storage.add(STORAGE_KEYS.TIMER_SESSIONS, session),
  update: (session: TimerSession) =>
    Storage.update(STORAGE_KEYS.TIMER_SESSIONS, session),
  remove: (id: string) => Storage.remove(STORAGE_KEYS.TIMER_SESSIONS, id),
  getActive: (): TimerSession | undefined =>
    TimerSessionStorage.getAll().find(s => s.isActive),
};
