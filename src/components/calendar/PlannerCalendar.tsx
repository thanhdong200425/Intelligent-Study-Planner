'use client';
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Textarea,
  Select,
  SelectItem,
} from '@heroui/react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { AddEventModal, BaseButton, DayDetailModal } from '@/components';
import { useState } from 'react';
import { format } from 'date-fns';
import { usePlannerCalendar } from '@/hooks/usePlannerCalendar';
import { DAYS_OF_WEEK } from '@/utils/constants';
import { useTasks } from '@/hooks/useTask';
import { useEventType, useEventTypes } from '@/hooks/useEventType';

export default function PlannerCalendar() {
  const {
    currentMonthYear,
    currentDate,
    grid,
    gridDays,
    handleNextMonth,
    handlePreviousMonth,
    handleToday,
  } = usePlannerCalendar();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { data: eventTypes } = useEventTypes();

  return (
    <Card className='p-6 rounded-2xl h-full flex flex-col'>
      <div className='flex items-center justify-between'>
        <h2 className='text-base text-gray-900'>
          {format(
            new Date(currentMonthYear.year, currentMonthYear.month - 1, 1),
            'MMMM yyyy'
          )}
        </h2>
        <div className='flex items-center gap-2'>
          {currentMonthYear.month !== currentDate.getMonth() + 1 ||
          currentMonthYear.year !== currentDate.getFullYear() ? (
            <Button
              isIconOnly
              variant='bordered'
              radius='sm'
              aria-label='today'
              onPress={handleToday}
            >
              <Calendar className='size-4' />
            </Button>
          ) : null}
          <Button
            isIconOnly
            variant='bordered'
            radius='sm'
            aria-label='prev'
            onPress={handlePreviousMonth}
          >
            <ChevronLeft className='size-4' />
          </Button>
          <Button
            isIconOnly
            variant='bordered'
            radius='sm'
            aria-label='next'
            onPress={handleNextMonth}
          >
            <ChevronRight className='size-4' />
          </Button>
          <BaseButton
            startContent={<Plus className='size-4' />}
            content='Add Event'
            onPress={() => setIsAddOpen(true)}
          />
        </div>
      </div>
      {/* Days of the week */}
      <div className='mt-4 grid grid-cols-7 text-center text-sm text-gray-500'>
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className='py-2'>
            {d}
          </div>
        ))}
      </div>

      {/* Grid of the months */}
      <div className='grid grid-cols-7 grid-rows-5 gap-2 mt-2 flex-1 min-h-0'>
        {grid.flatMap((row, r) =>
          row.map((_, c) => {
            const idx = r * 7 + c;
            const isToday = idx === currentDate.getDay();
            const cell = gridDays[idx];
            const dayLabel = cell?.day ?? '';
            const dayClass = cell?.isOutside
              ? 'text-gray-300'
              : 'text-gray-700';
            const containerClass = `border rounded-lg p-2 h-full text-sm ${cell?.isOutside ? 'border-gray-100' : 'border-gray-300'}`;
            return (
              <div
                onClick={() => setIsDetailOpen(true)}
                key={`${r}-${c}`}
                className={`${containerClass}`}
              >
                <span
                  className={dayClass}
                  style={
                    isToday
                      ? {
                          backgroundColor: '#4e8df5',
                          color: 'white',
                          padding: '7px 10px',
                          borderRadius: '50%',
                        }
                      : {}
                  }
                >
                  {dayLabel}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Add event modal */}
      <AddEventModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onOpenChange={setIsAddOpen}
      />

      {/* Day detail modal */}
      <DayDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Event types */}
      <div className='flex items-center gap-6 border-t border-gray-100 pt-3 mt-4 text-sm text-gray-600'>
        {eventTypes &&
          eventTypes.length > 0 &&
          eventTypes.map(eventType => (
            <div key={eventType.id} className='flex items-center gap-2'>
              <span
                className='size-3 rounded inline-block'
                style={{ backgroundColor: eventType.color }}
              />{' '}
              {eventType.name}
            </div>
          ))}
      </div>
    </Card>
  );
}
