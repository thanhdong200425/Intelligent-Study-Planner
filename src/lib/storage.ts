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

// In-memory stores replacing prior localStorage usage
let coursesStore: Course[] = [];
let deadlinesStore: Deadline[] = [];
let tasksStore: Task[] = [];
let availabilityStore: AvailabilityWindow[] = [];
let timeBlocksStore: TimeBlock[] = [];
let habitsStore: Habit[] = [];
let habitCompletionsStore: HabitCompletion[] = [];
let weeklySummariesStore: WeeklySummary[] = [];
let timerSessionsStore: TimerSession[] = [];

// Course operations
export const CourseStorage = {
  getAll: (): Course[] => [...coursesStore],
  add: (course: Course) => {
    coursesStore = [...coursesStore, course];
  },
  update: (course: Course) => {
    coursesStore = coursesStore.map(c => (c.id === course.id ? course : c));
  },
  remove: (id: string) => {
    coursesStore = coursesStore.filter(c => c.id.toString() !== id);
  },
  getById: (id: string): Course | undefined =>
    coursesStore.find(c => c.id.toString() === id),
};

// Deadline operations
export const DeadlineStorage = {
  getAll: (): Deadline[] =>
    deadlinesStore.map(deadline => ({
      ...deadline,
      dueDate: new Date(deadline.dueDate),
    })),
  add: (deadline: Deadline) => {
    deadlinesStore = [...deadlinesStore, deadline];
  },
  update: (deadline: Deadline) => {
    deadlinesStore = deadlinesStore.map(d =>
      d.id === deadline.id ? deadline : d
    );
  },
  remove: (id: string) => {
    deadlinesStore = deadlinesStore.filter(d => d.id !== id);
  },
  getByCourse: (courseId: string): Deadline[] =>
    DeadlineStorage.getAll().filter(d => d.courseId === courseId),
};

// Task operations
export const TaskStorage = {
  getAll: (): Task[] => [...tasksStore],
  add: (task: Task) => {
    tasksStore = [...tasksStore, task];
  },
  update: (task: Task) => {
    tasksStore = tasksStore.map(t => (t.id === task.id ? task : t));
  },
  remove: (id: string) => {
    tasksStore = tasksStore.filter(t => t.id !== id);
  },
  getByCourse: (courseId: string): Task[] =>
    tasksStore.filter(t => t.courseId === courseId),
};

// Availability operations
export const AvailabilityStorage = {
  getAll: (): AvailabilityWindow[] => [...availabilityStore],
  add: (window: AvailabilityWindow) => {
    availabilityStore = [...availabilityStore, window];
  },
  update: (window: AvailabilityWindow) => {
    availabilityStore = availabilityStore.map(w =>
      w.id === window.id ? window : w
    );
  },
  remove: (id: string) => {
    availabilityStore = availabilityStore.filter(w => w.id !== id);
  },
};

// Time block operations
export const TimeBlockStorage = {
  getAll: (): TimeBlock[] =>
    timeBlocksStore.map(block => ({
      ...block,
      startTime: new Date(block.startTime),
      endTime: new Date(block.endTime),
    })),
  add: (timeBlock: TimeBlock) => {
    timeBlocksStore = [...timeBlocksStore, timeBlock];
  },
  update: (timeBlock: TimeBlock) => {
    timeBlocksStore = timeBlocksStore.map(tb =>
      tb.id === timeBlock.id ? timeBlock : tb
    );
  },
  remove: (id: string) => {
    timeBlocksStore = timeBlocksStore.filter(tb => tb.id !== id);
  },
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
  getAll: (): Habit[] =>
    habitsStore.map(habit => ({
      ...habit,
      completions: habit.completions.map(date => new Date(date)),
    })),
  add: (habit: Habit) => {
    habitsStore = [...habitsStore, habit];
  },
  update: (habit: Habit) => {
    habitsStore = habitsStore.map(h => (h.id === habit.id ? habit : h));
  },
  remove: (id: string) => {
    habitsStore = habitsStore.filter(h => h.id !== id);
  },
};

// Habit completion operations
export const HabitCompletionStorage = {
  getAll: (): HabitCompletion[] =>
    habitCompletionsStore.map(completion => ({
      ...completion,
      date: new Date(completion.date),
    })),
  add: (completion: HabitCompletion) => {
    habitCompletionsStore = [...habitCompletionsStore, completion];
  },
  update: (completion: HabitCompletion) => {
    habitCompletionsStore = habitCompletionsStore.map(c =>
      c.id === completion.id ? completion : c
    );
  },
  remove: (id: string) => {
    habitCompletionsStore = habitCompletionsStore.filter(c => c.id !== id);
  },
  getByHabit: (habitId: string): HabitCompletion[] =>
    HabitCompletionStorage.getAll().filter(hc => hc.habitId === habitId),
};

// Weekly summary operations
export const WeeklySummaryStorage = {
  getAll: (): WeeklySummary[] =>
    weeklySummariesStore.map(summary => ({
      ...summary,
      weekStart: new Date(summary.weekStart),
      weekEnd: new Date(summary.weekEnd),
    })),
  add: (summary: WeeklySummary) => {
    weeklySummariesStore = [...weeklySummariesStore, summary];
  },
  update: (summary: WeeklySummary) => {
    weeklySummariesStore = weeklySummariesStore.map(s =>
      s.weekStart.toString() === summary.weekStart.toString() ? summary : s
    );
  },
  remove: (weekStart: string) => {
    weeklySummariesStore = weeklySummariesStore.filter(
      s => s.weekStart.toString() !== weekStart
    );
  },
};

// Timer session operations
export const TimerSessionStorage = {
  getAll: (): TimerSession[] =>
    timerSessionsStore.map(session => ({
      ...session,
      // Keep as string (ISO format) as per TimerSession type
      startTime:
        typeof session.startTime === 'string'
          ? session.startTime
          : new Date(session.startTime).toISOString(),
      endTime: session.endTime
        ? typeof session.endTime === 'string'
          ? session.endTime
          : new Date(session.endTime).toISOString()
        : undefined,
    })),
  add: (session: TimerSession) => {
    timerSessionsStore = [...timerSessionsStore, session];
  },
  update: (session: TimerSession) => {
    timerSessionsStore = timerSessionsStore.map(s =>
      s.id === session.id ? session : s
    );
  },
  remove: (id: string) => {
    timerSessionsStore = timerSessionsStore.filter(s => s.id !== id);
  },
  getActive: (): TimerSession | undefined => {
    // Check if session has no endTime (active session)
    return TimerSessionStorage.getAll().find(s => !s.endTime);
  },
};
