'use client';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from '@heroui/react';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement='center'>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Event Details
            </ModalHeader>
            <ModalBody>
              {/* Content can be expanded later to show event-specific info */}
              <div className='text-sm text-gray-600'>
                This is a placeholder for event details.
              </div>
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
