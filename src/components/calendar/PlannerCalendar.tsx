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
import { useMemo, useState } from 'react';
import { format, lastDayOfMonth } from 'date-fns';

interface Time {
  month: number;
  year: number;
}

export default function PlannerCalendar() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [currentMonthYear, setCurrentMonthYear] = useState<Time>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const currentDate = useMemo<Date>(() => new Date(), []);
  const grid = Array.from({ length: 5 }, () =>
    Array.from({ length: 7 }, () => null)
  );
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'study',
    notes: '',
  });
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const firstDayIndex = useMemo<number>(
    () =>
      new Date(currentMonthYear.year, currentMonthYear.month - 1, 1).getDay(),
    [currentMonthYear]
  );

  const lastDayInMonth = useMemo<number>(
    () =>
      lastDayOfMonth(
        new Date(currentMonthYear.year, currentMonthYear.month - 1, 1)
      ).getDate(),
    [currentMonthYear]
  );

  const gridDays = useMemo<{ day: number; isOutside: boolean }[]>(() => {
    const prevMonth =
      currentMonthYear.month === 1 ? 12 : currentMonthYear.month - 1;
    const prevYear =
      currentMonthYear.month === 1
        ? currentMonthYear.year - 1
        : currentMonthYear.year;
    const prevLastDay = lastDayOfMonth(
      new Date(prevYear, prevMonth - 1, 1)
    ).getDate();

    return Array.from({ length: 35 }, (_, i) => {
      const relativeDay = i - firstDayIndex + 1;
      if (relativeDay < 1) {
        return { day: prevLastDay + relativeDay, isOutside: true };
      }
      if (relativeDay > lastDayInMonth) {
        return { day: relativeDay - lastDayInMonth, isOutside: true };
      }
      return { day: relativeDay, isOutside: false };
    });
  }, [currentMonthYear, firstDayIndex, lastDayInMonth]);

  const handleNextMonth = () => {
    if (currentMonthYear.month === 12) {
      setCurrentMonthYear({ month: 1, year: currentMonthYear.year + 1 });
      return;
    }
    setCurrentMonthYear({
      month: currentMonthYear.month + 1,
      year: currentMonthYear.year,
    });
  };

  const handlePreviousMonth = () => {
    if (currentMonthYear.month === 1) {
      setCurrentMonthYear({ month: 12, year: currentMonthYear.year - 1 });
      return;
    }
    setCurrentMonthYear({
      month: currentMonthYear.month - 1,
      year: currentMonthYear.year,
    });
  };

  const handleToday = () => {
    setCurrentMonthYear({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  };

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

      <div className='mt-4 grid grid-cols-7 text-center text-sm text-gray-500'>
        {days.map(d => (
          <div key={d} className='py-2'>
            {d}
          </div>
        ))}
      </div>
      <div className='grid grid-cols-7 grid-rows-5 gap-2 mt-2 flex-1 min-h-0'>
        {grid.flatMap((row, r) =>
          row.map((_, c) => {
            const idx = r * 7 + c;
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
                className={containerClass}
              >
                <span className={dayClass}>{dayLabel}</span>
                {r === 0 && c === 4 && (
                  <div className='mt-2 bg-blue-600 text-white text-xs rounded px-1 py-0.5'>
                    UI Design
                  </div>
                )}
                {r === 0 && c === 5 && (
                  <div className='mt-2 bg-red-600 text-white text-xs rounded px-1 py-0.5'>
                    Math Exam
                  </div>
                )}
                {r === 0 && c === 6 && (
                  <div className='mt-2 bg-amber-500 text-white text-xs rounded px-1 py-0.5'>
                    Research Paper
                  </div>
                )}
                {r === 2 && c === 1 && (
                  <div className='mt-2 bg-blue-600 text-white text-xs rounded px-1 py-0.5'>
                    Study Group
                  </div>
                )}
                {r === 3 && c === 2 && (
                  <div className='mt-2 bg-red-600 text-white text-xs rounded px-1 py-0.5'>
                    Physics Test
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <AddEventModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onOpenChange={setIsAddOpen}
      />
      <DayDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
      <div className='flex items-center gap-6 border-t border-gray-100 pt-3 mt-4 text-sm text-gray-600'>
        <div className='flex items-center gap-2'>
          <span className='size-3 rounded bg-blue-600 inline-block' /> Study
          Session
        </div>
        <div className='flex items-center gap-2'>
          <span className='size-3 rounded bg-red-600 inline-block' /> Exam
        </div>
        <div className='flex items-center gap-2'>
          <span className='size-3 rounded bg-amber-500 inline-block' />{' '}
          Assignment
        </div>
      </div>
    </Card>
  );
}
