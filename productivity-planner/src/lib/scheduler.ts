import { Task, AvailabilityWindow, TimeBlock, Deadline } from '@/types';
import { TaskStorage, AvailabilityStorage, DeadlineStorage, TimeBlockStorage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { addDays, addMinutes, format, getDay, isAfter, isBefore, parseISO, startOfWeek } from 'date-fns';

interface SchedulingOptions {
  weekStart: Date;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  maxContinuousHours: number;
}

export class WeeklyScheduler {
  private options: SchedulingOptions;

  constructor(options: Partial<SchedulingOptions> = {}) {
    this.options = {
      weekStart: startOfWeek(new Date(), { weekStartsOn: 1 }), // Start on Monday
      shortBreakMinutes: 15,
      longBreakMinutes: 30,
      maxContinuousHours: 2,
      ...options,
    };
  }

  generateWeeklySchedule(): TimeBlock[] {
    const tasks = TaskStorage.getAll().filter(task => !task.completed);
    const availability = AvailabilityStorage.getAll();
    const deadlines = DeadlineStorage.getAll();

    // Clear existing schedule for this week
    this.clearWeekSchedule();

    // Sort tasks by priority (deadline-based and priority)
    const prioritizedTasks = this.prioritizeTasks(tasks, deadlines);
    
    // Generate availability slots for the week
    const availableSlots = this.generateAvailabilitySlots(availability);
    
    // Schedule tasks into available slots
    const scheduledBlocks = this.scheduleTasks(prioritizedTasks, availableSlots);
    
    // Save to storage
    scheduledBlocks.forEach(block => TimeBlockStorage.add(block));
    
    return scheduledBlocks;
  }

  private clearWeekSchedule(): void {
    const existingBlocks = TimeBlockStorage.getByWeek(this.options.weekStart);
    existingBlocks.forEach(block => TimeBlockStorage.remove(block.id));
  }

  private prioritizeTasks(tasks: Task[], deadlines: Deadline[]): Task[] {
    return tasks.sort((a, b) => {
      const deadlineA = deadlines.find(d => d.id === a.deadlineId);
      const deadlineB = deadlines.find(d => d.id === b.deadlineId);

      // Tasks with deadlines get higher priority
      if (deadlineA && !deadlineB) return -1;
      if (!deadlineA && deadlineB) return 1;

      // If both have deadlines, sort by due date
      if (deadlineA && deadlineB) {
        const dueDateComparison = new Date(deadlineA.dueDate).getTime() - new Date(deadlineB.dueDate).getTime();
        if (dueDateComparison !== 0) return dueDateComparison;

        // If same due date, sort by priority
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[deadlineB.priority] - priorityOrder[deadlineA.priority];
      }

      // Tasks without deadlines are sorted by estimated time (shorter first)
      return a.estimateMinutes - b.estimateMinutes;
    });
  }

  private generateAvailabilitySlots(availability: AvailabilityWindow[]): Array<{ start: Date; end: Date }> {
    const slots: Array<{ start: Date; end: Date }> = [];

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDay = addDays(this.options.weekStart, dayOffset);
      const dayOfWeek = getDay(currentDay);

      const dayAvailability = availability.filter(a => a.dayOfWeek === dayOfWeek);

      dayAvailability.forEach(window => {
        const [startHour, startMinute] = window.startTime.split(':').map(Number);
        const [endHour, endMinute] = window.endTime.split(':').map(Number);

        const start = new Date(currentDay);
        start.setHours(startHour, startMinute, 0, 0);

        const end = new Date(currentDay);
        end.setHours(endHour, endMinute, 0, 0);

        slots.push({ start, end });
      });
    }

    return slots.sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  private scheduleTasks(tasks: Task[], availableSlots: Array<{ start: Date; end: Date }>): TimeBlock[] {
    const scheduledBlocks: TimeBlock[] = [];
    let currentSlotIndex = 0;
    let currentSlotTime = availableSlots[0]?.start;

    for (const task of tasks) {
      let remainingTime = task.estimateMinutes;

      while (remainingTime > 0 && currentSlotIndex < availableSlots.length) {
        const currentSlot = availableSlots[currentSlotIndex];
        
        if (!currentSlotTime || currentSlotTime >= currentSlot.end) {
          // Move to next slot
          currentSlotIndex++;
          if (currentSlotIndex < availableSlots.length) {
            currentSlotTime = availableSlots[currentSlotIndex].start;
          }
          continue;
        }

        const slotRemainingTime = this.getMinutesBetween(currentSlotTime, currentSlot.end);
        const maxContinuousMinutes = this.options.maxContinuousHours * 60;
        
        // Determine how much time to schedule in this slot
        const timeToSchedule = Math.min(remainingTime, slotRemainingTime, maxContinuousMinutes);
        
        if (timeToSchedule >= 15) { // Minimum 15-minute blocks
          const blockStart = new Date(currentSlotTime);
          const blockEnd = addMinutes(blockStart, timeToSchedule);

          scheduledBlocks.push({
            id: uuidv4(),
            taskId: task.id,
            startTime: blockStart,
            endTime: blockEnd,
          });

          remainingTime -= timeToSchedule;
          currentSlotTime = blockEnd;

          // Add break if there's more work to do and we've worked for a while
          if (remainingTime > 0 && timeToSchedule >= 60) {
            const breakMinutes = timeToSchedule >= 120 ? this.options.longBreakMinutes : this.options.shortBreakMinutes;
            
            if (this.getMinutesBetween(currentSlotTime, currentSlot.end) >= breakMinutes) {
              const breakStart = new Date(currentSlotTime);
              const breakEnd = addMinutes(breakStart, breakMinutes);

              scheduledBlocks.push({
                id: uuidv4(),
                taskId: '',
                startTime: breakStart,
                endTime: breakEnd,
                isBreak: true,
                breakType: breakMinutes === this.options.shortBreakMinutes ? 'short' : 'long',
              });

              currentSlotTime = breakEnd;
            }
          }
        } else {
          // Move to next slot if remaining time in current slot is too small
          currentSlotIndex++;
          if (currentSlotIndex < availableSlots.length) {
            currentSlotTime = availableSlots[currentSlotIndex].start;
          }
        }
      }

      // If we couldn't schedule all the time for this task, create a partial schedule
      if (remainingTime > 0) {
        console.warn(`Could not fully schedule task "${task.title}". ${remainingTime} minutes remaining.`);
      }
    }

    return scheduledBlocks;
  }

  private getMinutesBetween(start: Date, end: Date): number {
    return Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60)));
  }

  getWeeklyStats(): {
    totalScheduledMinutes: number;
    totalTaskMinutes: number;
    totalBreakMinutes: number;
    schedulingEfficiency: number;
  } {
    const blocks = TimeBlockStorage.getByWeek(this.options.weekStart);
    const taskBlocks = blocks.filter(b => !b.isBreak);
    const breakBlocks = blocks.filter(b => b.isBreak);

    const totalTaskMinutes = taskBlocks.reduce((sum, block) => 
      sum + this.getMinutesBetween(block.startTime, block.endTime), 0);
    
    const totalBreakMinutes = breakBlocks.reduce((sum, block) => 
      sum + this.getMinutesBetween(block.startTime, block.endTime), 0);

    const totalScheduledMinutes = totalTaskMinutes + totalBreakMinutes;

    const allTasks = TaskStorage.getAll().filter(task => !task.completed);
    const totalTaskEstimate = allTasks.reduce((sum, task) => sum + task.estimateMinutes, 0);

    const schedulingEfficiency = totalTaskEstimate > 0 ? (totalTaskMinutes / totalTaskEstimate) * 100 : 0;

    return {
      totalScheduledMinutes,
      totalTaskMinutes,
      totalBreakMinutes,
      schedulingEfficiency: Math.round(schedulingEfficiency),
    };
  }
}