'use client';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from '@heroui/react';
import { Event } from '@/types';
import { format } from 'date-fns';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  events: Event[];
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  date,
  events,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement='center'>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              {date ? format(date, 'EEEE, MMM d, yyyy') : 'Event Details'}
            </ModalHeader>
            <ModalBody>
              {date ? (
                <>
                  {events.length === 0 ? (
                    <div className='text-sm text-gray-600'>
                      No events scheduled for this day.
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      {events.map(event => {
                        const start = new Date(event.startTime);
                        const end = new Date(event.endTime);
                        const hasTask = !!event.task?.title;
                        const hasTime = !!event.startTime && !!event.endTime;
                        const hasEventType = !!event.eventType?.name;
                        const hasNote = !!event.note;

                        return (
                          <div
                            key={event.id}
                            className='border border-gray-100 rounded-lg p-3 text-sm'
                          >
                            <div className='flex items-center justify-between gap-2'>
                              <div className='flex items-center gap-2'>
                                {event.eventType && (
                                  <span
                                    className='inline-block w-2 h-2 rounded-full'
                                    style={{
                                      backgroundColor: event.eventType.color,
                                    }}
                                  />
                                )}
                                <span className='font-medium text-gray-900'>
                                  {event.title}
                                </span>
                              </div>
                              {hasTime && (
                                <span className='text-xs text-gray-500'>
                                  {format(start, 'HH:mm')} -{' '}
                                  {format(end, 'HH:mm')}
                                </span>
                              )}
                            </div>

                            <div className='mt-3 flex flex-wrap gap-2'>
                              {hasEventType && event.eventType && (
                                <span
                                  className='inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
                                  style={{
                                    backgroundColor: `${event.eventType.color}1A`,
                                    color: event.eventType.color,
                                  }}
                                >
                                  {event.eventType.name}
                                </span>
                              )}

                              {hasTask && (
                                <span className='inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600'>
                                  {event.task?.title}
                                </span>
                              )}

                              {hasTime && (
                                <span className='inline-flex items-center rounded-full px-2.5 py-0.5 text-xs bg-gray-100 text-gray-700'>
                                  {format(start, 'HH:mm')} -{' '}
                                  {format(end, 'HH:mm')}
                                </span>
                              )}

                              {hasNote && event.note && (
                                <span className='inline-flex items-center rounded-full px-2.5 py-0.5 text-xs bg-amber-50 text-amber-700'>
                                  Notes
                                </span>
                              )}
                            </div>

                            {hasNote && event.note && (
                              <p className='mt-2 text-xs text-gray-600'>
                                {event.note}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div className='text-sm text-gray-600'>No day selected.</div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color='primary' onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DayDetailModal;
