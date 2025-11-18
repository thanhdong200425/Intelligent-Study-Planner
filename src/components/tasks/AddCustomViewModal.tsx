'use client';

import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from '@heroui/react';

interface AddCustomViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (viewData: CustomViewData) => void;
}

export interface CustomViewData {
  name: string;
  filter?: string;
  sortBy?: string;
}

const AddCustomViewModal: React.FC<AddCustomViewModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [filter, setFilter] = useState<string>('');
  const [isFilterSelected, setIsFilterSelected] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('');

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }

    const viewData: CustomViewData = {
      name: name.trim(),
      filter: filter || undefined,
      sortBy: sortBy || undefined,
    };

    onSave?.(viewData);
    // Reset form
    setName('');
    setFilter('');
    setIsFilterSelected(false);
    setSortBy('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setFilter('');
    setIsFilterSelected(false);
    setSortBy('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='2xl'
      scrollBehavior='inside'
      placement='center'
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Add Custom View
            </ModalHeader>
            <ModalBody>
              <div className='flex flex-col gap-4'>
                {/* View Name */}
                <div className='flex flex-col gap-2'>
                  <label className='text-sm text-neutral-950 leading-[14px]'>
                    View Name
                  </label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder='Enter view name'
                    className='w-full'
                    classNames={{
                      input: 'text-sm text-[#717182]',
                      inputWrapper:
                        'bg-[#f3f3f5] border-[0.8px] border-[rgba(0,0,0,0)] rounded-[8px] h-[36px]',
                    }}
                  />
                </div>

                {/* Filter */}
                <div className='flex flex-col gap-2'>
                  <label className='text-sm text-neutral-950 leading-[14px]'>
                    Filter
                  </label>
                  <Select
                    selectedKeys={filter ? [filter] : []}
                    onSelectionChange={keys => {
                      const selected = Array.from(keys)[0] as string;
                      setFilter(selected || '');
                      setIsFilterSelected(true);
                    }}
                    placeholder='Select filter'
                    className='w-full'
                    classNames={{
                      trigger:
                        'bg-[#f3f3f5] border-[0.8px] border-[rgba(0,0,0,0)] rounded-[8px] h-[36px]',
                      value: 'text-sm text-[#717182]',
                    }}
                  >
                    <SelectItem key='all'>All Tasks</SelectItem>
                    <SelectItem key='priority'>Priority</SelectItem>
                  </Select>
                </div>

                {/* Sort By */}
                {isFilterSelected && (
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm text-neutral-950 leading-[14px]'>
                      Sort By
                    </label>
                    <Select
                      selectedKeys={sortBy ? [sortBy] : []}
                      onSelectionChange={keys => {
                        const selected = Array.from(keys)[0] as string;
                        setSortBy(selected || '');
                      }}
                      placeholder='Select sort option'
                      className='w-full'
                      classNames={{
                        trigger:
                          'bg-[#f3f3f5] border-[0.8px] border-[rgba(0,0,0,0)] rounded-[8px] h-[36px]',
                        value: 'text-sm text-[#717182]',
                      }}
                    >
                      <SelectItem key='priority-asc'>
                        Priority (Low to High)
                      </SelectItem>
                      <SelectItem key='priority-desc'>
                        Priority (High to Low)
                      </SelectItem>
                      <SelectItem key='date-asc'>
                        Date (Oldest First)
                      </SelectItem>
                      <SelectItem key='date-desc'>
                        Date (Newest First)
                      </SelectItem>
                      <SelectItem key='name-asc'>Name (A-Z)</SelectItem>
                      <SelectItem key='name-desc'>Name (Z-A)</SelectItem>
                    </Select>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant='light' onPress={handleClose} className='text-sm'>
                Cancel
              </Button>
              <Button
                color='default'
                onPress={handleSave}
                isDisabled={!name.trim()}
                className='bg-[#101828] text-white rounded-[8px] h-[36px] px-4 min-w-[89px]'
              >
                <span className='text-sm text-white'>Add View</span>
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddCustomViewModal;
