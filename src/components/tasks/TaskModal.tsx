'use client';
import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@heroui/react';
import { Plus, Upload } from 'lucide-react';
import TaskForm from '@/components/forms/TaskForm';
import UploadImageModal from '@/components/modals/UploadImageModal';

interface TaskModalProps {
  title?: string;
  showAdditionalButton?: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({
  title = 'Add task',
  showAdditionalButton = false,
}) => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isUploadImageModalOpen, setIsUploadImageModalOpen] = useState(false);

  const handleImageUpload = (file: File) => {
    // TODO: Implement image upload logic
    console.log('Image uploaded:', file);
    // After upload, you might want to close the modal and open the task form
    // or process the image for AI extraction
  };

  return (
    <>
      {showAdditionalButton && (
        <Button
          color='default'
          variant='light'
          startContent={<Upload className='w-4 h-4' />}
          onPress={() => setIsUploadImageModalOpen(true)}
        >
          Upload image
        </Button>
      )}
      <Button
        color='default'
        className='bg-[#101828] text-white'
        startContent={<Plus className='w-4 h-4' />}
        onPress={() => setIsAddTaskModalOpen(true)}
      >
        {title}
      </Button>

      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        size='2xl'
        scrollBehavior='inside'
        classNames={{
          base: 'rounded-[20px]',
          body: 'p-0',
        }}
        hideCloseButton
      >
        <ModalContent>
          <ModalBody className='p-5'>
            <TaskForm
              onClose={() => setIsAddTaskModalOpen(false)}
              onCancel={() => setIsAddTaskModalOpen(false)}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <UploadImageModal
        isOpen={isUploadImageModalOpen}
        onClose={() => setIsUploadImageModalOpen(false)}
        onImageUpload={handleImageUpload}
      />
    </>
  );
};

export default TaskModal;
