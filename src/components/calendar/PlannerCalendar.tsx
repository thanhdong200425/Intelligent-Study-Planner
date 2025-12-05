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
import { useEventTypes } from '@/hooks/useEventType';
import { useEvents } from '@/hooks/useEvent';
import { Event } from '@/types';
import { useDeleteEventMutation } from '@/mutations/event';

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [formKey, setFormKey] = useState(0);
  const { data: eventTypes } = useEventTypes();
  const { data: events } = useEvents();
  const { mutate: deleteEvent } = useDeleteEventMutation({});

  const openCreateModal = () => {
    setMode('create');
    setEventToEdit(null);
    setFormKey(prev => prev + 1); // ensure form resets when switching from edit to create
    setIsAddOpen(true);
  };

  const eventsForSelectedDay: Event[] =
    selectedDate && events
      ? events.filter(event => {
          const eventDate = new Date(event.date);
          return (
            eventDate.getFullYear() === selectedDate.getFullYear() &&
            eventDate.getMonth() === selectedDate.getMonth() &&
            eventDate.getDate() === selectedDate.getDate()
          );
        })
      : [];

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
            onPress={openCreateModal}
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
            const cell = gridDays[idx];
            const dayLabel = cell?.day ?? '';
            const isOutside = cell?.isOutside;

            const cellDate =
              !isOutside && dayLabel
                ? new Date(
                    currentMonthYear.year,
                    currentMonthYear.month - 1,
                    dayLabel
                  )
                : null;

            const isToday =
              !isOutside &&
              dayLabel === currentDate.getDate() &&
              currentMonthYear.month === currentDate.getMonth() + 1 &&
              currentMonthYear.year === currentDate.getFullYear();

            const dayClass = isOutside ? 'text-gray-300' : 'text-gray-700';
            const containerClass = `border rounded-lg p-2 h-full text-sm ${
              isOutside ? 'border-gray-100' : 'border-gray-300'
            }`;

            const eventsForDay =
              cellDate && events
                ? events.filter(event => {
                    const eventDate = new Date(event.date);
                    return (
                      eventDate.getFullYear() === cellDate.getFullYear() &&
                      eventDate.getMonth() === cellDate.getMonth() &&
                      eventDate.getDate() === cellDate.getDate()
                    );
                  })
                : [];

            return (
              <div
                onClick={() => {
                  if (!cellDate) return;
                  setSelectedDate(cellDate);
                  setIsDetailOpen(true);
                }}
                key={`${r}-${c}`}
                className={containerClass}
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

                {/* Events for this day */}
                <div className='mt-2 space-y-1'>
                  {eventsForDay.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className='rounded px-1 py-0.5 text-[12px] font-medium text-white truncate'
                      style={{
                        backgroundColor: event.eventType?.color || '#4b5563',
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {eventsForDay.length > 3 && (
                    <div className='text-[10px] text-gray-500'>
                      +{eventsForDay.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add event modal */}
      <AddEventModal
        key={formKey}
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEventToEdit(null);
          setMode('create');
        }}
        onOpenChange={setIsAddOpen}
        mode={mode}
        eventToEdit={eventToEdit}
      />

      {/* Day detail modal */}
      <DayDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        date={selectedDate}
        events={eventsForSelectedDay}
        onEditEvent={event => {
          setEventToEdit(event);
          setMode('edit');
          setIsDetailOpen(false);
          setIsAddOpen(true);
        }}
        onDeleteEvent={event => deleteEvent(event.id)}
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
