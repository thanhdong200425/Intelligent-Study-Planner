'use client';
import { Card, CardHeader, CardBody, Chip } from '@heroui/react';
import { CalendarDays, Clock3, ExternalLink } from 'lucide-react';
import { BaseButton } from '../buttons';
import { useEvents } from '@/hooks/useEvent';
import { format } from 'date-fns';

interface UpcomingEventsProps {
  maxItems?: number;
}

export default function UpcomingEvents({ maxItems = 5 }: UpcomingEventsProps) {
  const { data: events, isLoading } = useEvents();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents =
    events
      ?.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);

        if (aDate.getTime() !== bDate.getTime()) {
          return aDate.getTime() - bDate.getTime();
        }

        const aStart = new Date(a.startTime);
        const bStart = new Date(b.startTime);
        return aStart.getTime() - bStart.getTime();
      })
      .slice(0, maxItems) ?? [];

  return (
    <Card className='rounded-2xl'>
      <CardHeader className='flex items-center justify-between px-6 pt-6 pb-0'>
        <h3 className='text-base text-gray-900'>Upcoming Events</h3>
        <BaseButton className='w-auto' content='See All' />
      </CardHeader>
      <CardBody className='px-6 pb-6 pt-4 space-y-3'>
        {isLoading && (
          <p className='text-sm text-gray-500'>Loading upcoming events…</p>
        )}

        {!isLoading && upcomingEvents.length === 0 && (
          <p className='text-sm text-gray-500'>
            You have no upcoming events. Create one from the calendar.
          </p>
        )}

        {!isLoading &&
          upcomingEvents.map(event => {
            const date = new Date(event.date);
            const start = new Date(event.startTime);
            const end = new Date(event.endTime);

            const dateLabel = format(date, 'MMM d, yyyy');
            const timeLabel = `${format(start, 'HH:mm')} - ${format(
              end,
              'HH:mm'
            )}`;

            const hasEventType = !!event.eventType?.name;

            return (
              <div
                key={event.id}
                className='border border-gray-100 rounded-xl p-3 flex items-start gap-3'
              >
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <p className='text-sm text-gray-900'>{event.title}</p>
                    {/* <ExternalLink className='size-4 text-gray-400' /> */}
                  </div>
                  <div className='flex items-center gap-4 text-sm text-gray-500 mt-1'>
                    <div className='flex items-center gap-1'>
                      <CalendarDays className='size-4' /> {dateLabel}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Clock3 className='size-4' /> {timeLabel}
                    </div>
                  </div>
                </div>
                {hasEventType && event.eventType && (
                  <Chip
                    size='sm'
                    radius='full'
                    className='capitalize'
                    variant='flat'
                    style={{
                      backgroundColor: `${event.eventType.color}1A`,
                      color: event.eventType.color,
                    }}
                  >
                    {event.eventType.name}
                  </Chip>
                )}
              </div>
            );
          })}
      </CardBody>
    </Card>
  );
}
