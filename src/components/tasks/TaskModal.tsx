'use client';
import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@heroui/react';
import { Plus } from 'lucide-react';
import TaskForm from '@/components/forms/TaskForm';

interface TaskModalProps {
  title?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ title = 'Add task' }) => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  return (
    <>
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
      >
        <ModalContent>
          <ModalHeader>Add New Task</ModalHeader>
          <ModalBody>
            <TaskForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TaskModal;
