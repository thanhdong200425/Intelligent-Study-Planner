'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TimeBlock, Task, Course } from '@/types';
import { TimeBlockStorage, TaskStorage, CourseStorage } from '@/lib/storage';
import { format, addDays, startOfWeek, addMinutes } from 'date-fns';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { CalendarTimeBlock } from './CalendarTimeBlock';
import { DroppableTimeSlot } from './DroppableTimeSlot';
import { ContextMenu, ContextMenuItem } from '@/components/ui/ContextMenu';
import { FocusSessionModal } from '@/components/timer/FocusSessionModal';
import { Clock } from 'lucide-react';

interface CalendarGridProps {
  weekStart?: Date;
  onTimeBlockUpdate?: (timeBlock: TimeBlock) => void;
  onTimeBlockDelete?: (id: string) => void;
  onClickTimeBlock?: (id: string) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }),
  onTimeBlockUpdate,
  onTimeBlockDelete,
  ...props
}) => {
  const router = useRouter();
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeBlock, setActiveBlock] = useState<TimeBlock | null>(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    timeBlock: TimeBlock | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    timeBlock: null,
  });

  // Focus session modal state
  const [focusModal, setFocusModal] = useState<{
    isOpen: boolean;
    timeBlock: TimeBlock | null;
  }>({
    isOpen: false,
    timeBlock: null,
  });

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 10 PM

  const loadData = useCallback(() => {
    const blocks = TimeBlockStorage.getByWeek(weekStart);
    const allTasks = TaskStorage.getAll();
    const allCourses = CourseStorage.getAll();

    setTimeBlocks(blocks);
    setTasks(allTasks);
    setCourses(allCourses);
  }, [weekStart]);

  useEffect(() => {
    loadData();
  }, [weekStart, loadData]);

  const handleDragStart = (event: DragStartEvent) => {
    const block = timeBlocks.find(b => b.id === event.active.id);
    setActiveBlock(block || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;

    if (!over || !activeBlock) {
      setActiveBlock(null);
      return;
    }

    const [dayIndex, hour] = over.id.toString().split('-').map(Number);
    const targetDate = addDays(weekStart, dayIndex);
    const newStartTime = new Date(targetDate);
    newStartTime.setHours(hour, 0, 0, 0);

    const duration =
      activeBlock.endTime.getTime() - activeBlock.startTime.getTime();
    const newEndTime = new Date(newStartTime.getTime() + duration);

    const updatedBlock: TimeBlock = {
      ...activeBlock,
      startTime: newStartTime,
      endTime: newEndTime,
    };

    TimeBlockStorage.update(updatedBlock);
    onTimeBlockUpdate?.(updatedBlock);
    loadData();
    setActiveBlock(null);
  };

  const getBlocksForTimeSlot = (dayIndex: number, hour: number) => {
    const dayStart = addDays(weekStart, dayIndex);
    const slotStart = new Date(dayStart);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = addMinutes(slotStart, 60);

    return timeBlocks.filter(block => {
      const blockStart = new Date(block.startTime);
      const blockEnd = new Date(block.endTime);

      return (
        (blockStart >= slotStart && blockStart < slotEnd) ||
        (blockEnd > slotStart && blockEnd <= slotEnd) ||
        (blockStart <= slotStart && blockEnd >= slotEnd)
      );
    });
  };

  const getTaskForBlock = (block: TimeBlock): Task | undefined => {
    return tasks.find(t => t.id === block.taskId);
  };

  const getCourseForTask = (task: Task): Course | undefined => {
    return courses.find(c => c.id === task.courseId);
  };

  const handleDeleteBlock = (blockId: string) => {
    TimeBlockStorage.remove(blockId);
    onTimeBlockDelete?.(blockId);
    loadData();
  };

  const handleBlockRightClick = (
    event: React.MouseEvent,
    timeBlock: TimeBlock
  ) => {
    event.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      timeBlock,
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      timeBlock: null,
    });
  };

  const handleStartFocusSession = () => {
    if (contextMenu.timeBlock) {
      setFocusModal({
        isOpen: true,
        timeBlock: contextMenu.timeBlock,
      });
      handleContextMenuClose();
    }
  };

  const handleFocusModalClose = () => {
    setFocusModal({
      isOpen: false,
      timeBlock: null,
    });
  };

  const handleStartSession = () => {
    if (focusModal.timeBlock) {
      router.push(`/timer?timeBlockId=${focusModal.timeBlock.id}`);
    }
    handleFocusModalClose();
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        {/* Header */}
        <div className='grid grid-cols-8 bg-gray-50 border-b'>
          <div className='p-3 text-sm font-medium text-gray-500'>Time</div>
          {days.map((day, index) => {
            const date = addDays(weekStart, index);
            return (
              <div key={day} className='p-3 text-center'>
                <div className='text-sm font-medium text-gray-900'>{day}</div>
                <div className='text-xs text-gray-500'>
                  {format(date, 'MMM d')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className='grid grid-cols-8'>
          {hours.map(hour => (
            <React.Fragment key={hour}>
              {/* Time column */}
              <div className='p-2 text-xs text-gray-500 border-b border-r bg-gray-50'>
                {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
              </div>

              {/* Day columns */}
              {days.map((_, dayIndex) => {
                const blocksInSlot = getBlocksForTimeSlot(dayIndex, hour);

                return (
                  <DroppableTimeSlot
                    key={`${dayIndex}-${hour}`}
                    id={`${dayIndex}-${hour}`}
                    className='relative border-b border-r h-16 hover:bg-gray-50'
                  >
                    {blocksInSlot.map(block => {
                      const task = getTaskForBlock(block);
                      const course = task ? getCourseForTask(task) : undefined;

                      return (
                        <CalendarTimeBlock
                          key={block.id}
                          timeBlock={block}
                          task={task}
                          course={course}
                          onDelete={() => handleDeleteBlock(block.id)}
                          onRightClick={event =>
                            handleBlockRightClick(event, block)
                          }
                          onClick={() =>
                            props.onClickTimeBlock &&
                            props.onClickTimeBlock(block.id)
                          }
                        />
                      );
                    })}
                  </DroppableTimeSlot>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeBlock && (
          <div className='p-2 bg-blue-100 border border-blue-300 rounded shadow-lg'>
            <div className='text-xs font-medium'>
              {activeBlock.isBreak
                ? 'Break'
                : getTaskForBlock(activeBlock)?.title || 'Unknown Task'}
            </div>
          </div>
        )}
      </DragOverlay>

      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={handleContextMenuClose}
      >
        <ContextMenuItem
          onClick={handleStartFocusSession}
          icon={<Clock className='w-4 h-4' />}
        >
          Start Focus Session
        </ContextMenuItem>
      </ContextMenu>

      {/* Focus Session Modal */}
      <FocusSessionModal
        isOpen={focusModal.isOpen}
        onClose={handleFocusModalClose}
        onStartSession={handleStartSession}
        timeBlock={focusModal.timeBlock || undefined}
        task={
          focusModal.timeBlock
            ? getTaskForBlock(focusModal.timeBlock)
            : undefined
        }
        course={
          focusModal.timeBlock && getTaskForBlock(focusModal.timeBlock)
            ? getCourseForTask(getTaskForBlock(focusModal.timeBlock)!)
            : undefined
        }
      />
    </DndContext>
  );
};
