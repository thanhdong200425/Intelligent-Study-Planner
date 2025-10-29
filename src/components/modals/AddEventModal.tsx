"use client";

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input, Textarea, Select, SelectItem, Button } from '@heroui/react';

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenChange: (open: boolean) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose }) => {
    return <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Add Event</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Title"
                            placeholder="e.g., Study Session"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                type="date"
                                label="Date"

                            />
                            <Input
                                type="time"
                                label="Time"

                            />
                        </div>
                        <Select
                            label="Type"
                            selectedKeys={new Set(["study"])}
                        >
                            <SelectItem key="study">Study Session</SelectItem>
                            <SelectItem key="exam">Exam</SelectItem>
                            <SelectItem key="assignment">Assignment</SelectItem>
                        </Select>
                        <Textarea
                            label="Notes"
                            placeholder="Add any details..."

                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose}>Cancel</Button>
                        <Button color="primary" onPress={() => { /* handle save later */ onClose(); }}>Add</Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
}

export default AddEventModal;