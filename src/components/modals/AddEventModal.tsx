'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Spinner,
  DatePicker,
  addToast,
} from '@heroui/react';
import { parseDate } from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { Plus } from 'lucide-react';
import { differenceInMinutes } from 'date-fns';
import { useEventTypes } from '@/hooks/useEventType';
import { useTasks } from '@/hooks/useTask';
import {
  useCreateEventMutation,
  useUpdateEventMutation,
} from '@/mutations/event';
import { CreateEventRequest } from '@/services/event';
import CreateEventTypeModal from './CreateEventTypeModal';
import { Event } from '@/types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  mode?: 'create' | 'edit';
  eventToEdit?: Event | null;
}

const CREATE_NEW_KEY = '__create_new__';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  eventTypeId: z.string().optional(),
  taskId: z.string().optional(),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  mode = 'create',
  eventToEdit,
}) => {
  const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);
  const { data: eventTypes, isLoading: isEventTypesLoading } = useEventTypes();
  const { data: tasks, isLoading: isTasksLoading } = useTasks();

  const { mutate: createEvent } = useCreateEventMutation({
    onSuccess: () => {
      handleClose();
    },
    onError: error => {
      console.error('Failed to create event:', error);
    },
  });
  const { mutate: updateEvent } = useUpdateEventMutation({
    onSuccess: () => {
      handleClose();
    },
    onError: error => {
      console.error('Failed to update event:', error);
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      eventTypeId: '',
      taskId: '',
      note: '',
    },
  });

  const isEditMode = mode === 'edit' && !!eventToEdit;

  useEffect(() => {
    if (isEditMode && eventToEdit) {
      const start = new Date(eventToEdit.startTime);
      const end = new Date(eventToEdit.endTime);
      const date = new Date(eventToEdit.date);

      const pad = (val: number) => String(val).padStart(2, '0');

      reset({
        title: eventToEdit.title || '',
        date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
          date.getDate()
        )}`,
        startTime: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
        endTime: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
        eventTypeId: eventToEdit.eventTypeId
          ? String(eventToEdit.eventTypeId)
          : '',
        taskId: eventToEdit.taskId ? String(eventToEdit.taskId) : '',
        note: eventToEdit.note || '',
      });
    } else {
      reset();
    }
  }, [isEditMode, eventToEdit, reset]);

  const onCreate = async (data: FormData) => {
    const startDateTime = new Date(`1970-01-01T${data.startTime}`);
    const endDateTime = new Date(`1970-01-01T${data.endTime}`);

    if (differenceInMinutes(endDateTime, startDateTime) <= 0) {
      addToast({
        title: 'Start time must be earlier than end time',
        color: 'danger',
        timeout: 1500,
        shouldShowTimeoutProgress: true,
      });
      return;
    }

    const payload = {
      title: data.title,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      eventTypeId: data.eventTypeId
        ? parseInt(data.eventTypeId, 10)
        : undefined,
      taskId: data.taskId ? parseInt(data.taskId, 10) : undefined,
      note: data.note || undefined,
    };

    createEvent(payload);
  };

  const onUpdate = async () => {
    const dirtyFieldKeys = Object.keys(dirtyFields);

    if (dirtyFieldKeys.length === 0) {
      handleClose();
      return;
    }

    const data = getValues();

    // Validate time if either startTime or endTime is dirty
    if (dirtyFields.startTime || dirtyFields.endTime) {
      const startDateTime = new Date(`1970-01-01T${data.startTime}`);
      const endDateTime = new Date(`1970-01-01T${data.endTime}`);

      if (differenceInMinutes(endDateTime, startDateTime) <= 0) {
        addToast({
          title: 'Start time must be earlier than end time',
          color: 'danger',
          timeout: 1500,
          shouldShowTimeoutProgress: true,
        });
        return;
      }
    }

    // Build payload with only dirty fields
    const apiPayload: Partial<CreateEventRequest> = {};

    if (dirtyFields.title) {
      apiPayload.title = data.title;
    }
    if (dirtyFields.date) {
      apiPayload.date = data.date;
    }
    if (dirtyFields.startTime) {
      apiPayload.startTime = data.startTime;
    }
    if (dirtyFields.endTime) {
      apiPayload.endTime = data.endTime;
    }
    if (dirtyFields.eventTypeId) {
      apiPayload.eventTypeId = data.eventTypeId
        ? parseInt(data.eventTypeId, 10)
        : undefined;
    }
    if (dirtyFields.taskId) {
      apiPayload.taskId = data.taskId ? parseInt(data.taskId, 10) : null;
    }
    if (dirtyFields.note) {
      apiPayload.note = data.note || undefined;
    }

    if (eventToEdit) {
      updateEvent({ id: eventToEdit.id, data: apiPayload });
    }
  };

  const onSubmit = async (data: FormData) => {
    if (isEditMode && eventToEdit) {
      await onUpdate();
    } else {
      await onCreate(data);
    }
  };

  const handleEventTypeChange = (keys: 'all' | Set<React.Key>) => {
    if (keys === 'all') return;

    const selectedKey = Array.from(keys)[0] as string;

    if (selectedKey === CREATE_NEW_KEY) {
      setShowCreateTypeModal(true);
    } else {
      setValue('eventTypeId', selectedKey, { shouldValidate: true });
    }
  };

  const handleEventTypeCreated = (eventTypeId: number) => {
    setValue('eventTypeId', eventTypeId.toString(), { shouldValidate: true });
  };

  const handleClose = () => {
    reset();
    onClose();
    onOpenChange?.(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={handleClose}
        placement='center'
        size='lg'
      >
        <ModalContent>
          {() => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className='flex flex-col gap-1'>
                {isEditMode ? 'Edit Event' : 'Add Event'}
              </ModalHeader>
              <ModalBody>
                <Controller
                  name='title'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='Title'
                      isRequired
                      isInvalid={!!errors.title}
                      errorMessage={errors.title?.message}
                    />
                  )}
                />

                <div className='grid grid-cols-1 gap-3'>
                  <Controller
                    name='date'
                    control={control}
                    render={({ field }) => (
                      <I18nProvider locale='en-GB'>
                        <DatePicker
                          label='Date'
                          isRequired
                          isInvalid={!!errors.date}
                          errorMessage={errors.date?.message}
                          value={
                            field.value ? parseDate(field.value) : undefined
                          }
                          onChange={value => {
                            if (!value) {
                              field.onChange('');
                              return;
                            }
                            const year = String(value.year).padStart(4, '0');
                            const month = String(value.month).padStart(2, '0');
                            const day = String(value.day).padStart(2, '0');
                            field.onChange(`${year}-${month}-${day}`);
                          }}
                        />
                      </I18nProvider>
                    )}
                  />
                  <div className='grid grid-cols-2 gap-3'>
                    <Controller
                      name='startTime'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type='time'
                          label='Start Time'
                          isRequired
                          isInvalid={!!errors.startTime}
                          errorMessage={errors.startTime?.message}
                        />
                      )}
                    />
                    <Controller
                      name='endTime'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type='time'
                          label='End Time'
                          isRequired
                          isInvalid={!!errors.endTime}
                          errorMessage={errors.endTime?.message}
                        />
                      )}
                    />
                  </div>
                </div>

                <Controller
                  name='taskId'
                  control={control}
                  render={({ field }) => (
                    <Select
                      label='Task (optional)'
                      placeholder='Link to a task'
                      selectedKeys={
                        field.value ? new Set([field.value]) : new Set()
                      }
                      onSelectionChange={keys => {
                        if (keys === 'all') return;
                        const selectedKey = Array.from(keys)[0] as string;
                        field.onChange(selectedKey);
                      }}
                      isLoading={isTasksLoading}
                      isDisabled={
                        isTasksLoading || !tasks || tasks.length === 0
                      }
                      items={tasks}
                      renderValue={items => {
                        return items.map(item => {
                          const selectedTask = tasks?.find(
                            t => t.id.toString() === item.key
                          );
                          return (
                            <div
                              className='flex flex-col items-start'
                              key={item.key}
                            >
                              <span className='text-sm'>
                                {selectedTask?.title}
                              </span>
                            </div>
                          );
                        });
                      }}
                    >
                      {(tasks || []).map(task => (
                        <SelectItem key={task.id.toString()}>
                          <div className='flex flex-col items-start'>
                            <span className='text-sm'>{task.title}</span>
                            {task.course && (
                              <span className='text-xs text-gray-500'>
                                {task.course.name}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />

                {isEventTypesLoading ? (
                  <div className='flex justify-center p-4'>
                    <Spinner size='sm' />
                  </div>
                ) : (
                  <Controller
                    name='eventTypeId'
                    control={control}
                    render={({ field }) => (
                      <Select
                        label='Event Type'
                        placeholder='Select event type'
                        selectedKeys={
                          field.value ? new Set([field.value]) : new Set()
                        }
                        onSelectionChange={handleEventTypeChange}
                        isInvalid={!!errors.eventTypeId}
                        errorMessage={errors.eventTypeId?.message}
                        items={eventTypes}
                        renderValue={selectedItems =>
                          selectedItems.map(item => {
                            const selectedEventType = eventTypes?.find(
                              t => t.id.toString() === item.key
                            );
                            return (
                              <div
                                className='flex items-center gap-2'
                                key={item.key}
                              >
                                <div
                                  className='w-3 h-3 rounded-full'
                                  style={{
                                    backgroundColor: selectedEventType?.color,
                                  }}
                                />
                                {selectedEventType?.name}
                              </div>
                            );
                          })
                        }
                      >
                        {[
                          ...(eventTypes || []).map(type => (
                            <SelectItem key={type.id.toString()}>
                              <div className='flex items-center gap-2'>
                                <div
                                  className='w-3 h-3 rounded-full'
                                  style={{ backgroundColor: type.color }}
                                />
                                {type.name}
                              </div>
                            </SelectItem>
                          )),
                          <SelectItem
                            key={CREATE_NEW_KEY}
                            className='text-primary'
                            textValue='Create New Event Type'
                          >
                            <div className='flex items-center gap-2 font-medium text-primary'>
                              <Plus className='w-4 h-4' />
                              Create New Event Type
                            </div>
                          </SelectItem>,
                        ]}
                      </Select>
                    )}
                  />
                )}

                <Controller
                  name='note'
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label='Notes'
                      placeholder='Add any details...'
                    />
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant='light' onPress={handleClose}>
                  Cancel
                </Button>
                <Button
                  color='primary'
                  type='submit'
                  isLoading={isSubmitting}
                  isDisabled={!isDirty}
                >
                  {isEditMode ? 'Save Changes' : 'Add Event'}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      <CreateEventTypeModal
        isOpen={showCreateTypeModal}
        onClose={() => setShowCreateTypeModal(false)}
        onSuccess={handleEventTypeCreated}
      />
    </>
  );
};

export default AddEventModal;
