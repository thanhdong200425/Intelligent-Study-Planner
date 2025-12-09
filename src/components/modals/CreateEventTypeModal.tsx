'use client';

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
  Button,
} from '@heroui/react';
import { useCreateEventTypeMutation } from '@/mutations/eventTypes';

// Types
interface CreateEventTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (eventTypeId: number) => void;
}

const formSchema = z.object({
  name: z.string().min(1, 'Event type name is required'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #3b82f6)'),
});

type FormData = z.infer<typeof formSchema>;

// Component
const CreateEventTypeModal: React.FC<CreateEventTypeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const createEventType = useCreateEventTypeMutation({});

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      color: '#3b82f6',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const newType = await createEventType.mutateAsync(data);
      reset();
      onSuccess?.(newType.id);
      onClose();
    } catch (error) {
      console.error('Failed to create event type:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} placement='center'>
      <ModalContent>
        {() => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Create Event Type</ModalHeader>
            <ModalBody className='flex flex-row gap-2 items-center'>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label='Event Type Name'
                    placeholder='e.g., Exam, Meeting, Assignment'
                    isRequired
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                  />
                )}
              />

              <Controller
                name='color'
                control={control}
                render={({ field }) => (
                  <div className='flex items-center gap-3'>
                    <Input
                      {...field}
                      type='color'
                      isRequired
                      isInvalid={!!errors.color}
                      errorMessage={errors.color?.message}
                      className='w-20'
                    />
                  </div>
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
                isLoading={isSubmitting || createEventType.isPending}
              >
                Create
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateEventTypeModal;
