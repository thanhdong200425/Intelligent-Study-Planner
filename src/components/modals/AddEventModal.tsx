'use client';

import { useState } from 'react';
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
} from '@heroui/react';
import { Plus } from 'lucide-react';
import { useEventTypes } from '@/hooks/useEventType';
import { useTasks } from '@/hooks/useTask';
import { useCreateEventMutation } from '@/mutations/event';
import CreateEventTypeModal from './CreateEventTypeModal';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
}

const CREATE_NEW_KEY = '__create_new__';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  eventTypeId: z.string().min(1, 'Event type is required'),
  taskId: z.string().optional(),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose }) => {
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

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
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

  const onSubmit = async (data: FormData) => {
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

  const handleEventTypeChange = (keys: 'all' | Set<React.Key>) => {
    if (keys === 'all') return;

    const selectedKey = Array.from(keys)[0] as string;

    if (selectedKey === CREATE_NEW_KEY) {
      setShowCreateTypeModal(true);
      // Don't update the form value yet
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
                Add Event
              </ModalHeader>
              <ModalBody>
                <Controller
                  name='title'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label='Title'
                      placeholder='e.g., Study Session'
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
                      <Input
                        {...field}
                        type='date'
                        label='Date'
                        isRequired
                        isInvalid={!!errors.date}
                        errorMessage={errors.date?.message}
                      />
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
                        setValue('taskId', selectedKey, {
                          shouldValidate: true,
                        });
                      }}
                      isLoading={isTasksLoading}
                      isDisabled={
                        isTasksLoading || !tasks || tasks.length === 0
                      }
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
                        isRequired
                        isInvalid={!!errors.eventTypeId}
                        errorMessage={errors.eventTypeId?.message}
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
                <Button color='primary' type='submit' isLoading={isSubmitting}>
                  Add Event
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
