'use client';

import React, { useState } from 'react';
import { Button, Select, SelectItem } from '@heroui/react';
import { Eye, Plus, X } from 'lucide-react';
import AddCustomViewModal, { CustomViewData } from './AddCustomViewModal';
import { SavedCustomView } from '@/services/customViews';

interface CustomViewProps {
  onAddView?: (viewData: CustomViewData) => void;
  customViews?: SavedCustomView[];
  onDeleteView?: (viewId: string) => void;
  onApplyView?: (view: SavedCustomView) => void;
}

const CustomView: React.FC<CustomViewProps> = ({
  onAddView,
  customViews = [],
  onDeleteView,
  onApplyView,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedViewId, setSelectedViewId] = useState<string>('');
  const [isShowClearButton, setIsShowClearButton] = useState<boolean>(false);

  const handleAddViewClick = () => {
    setIsModalOpen(true);
  };

  const handleSave = (viewData: CustomViewData) => {
    onAddView?.(viewData);
    setIsModalOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, viewId: string) => {
    e.stopPropagation();
    onDeleteView?.(viewId);
    if (selectedViewId === viewId) {
      setSelectedViewId('');
    }
  };

  const handleSelectChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    if (selectedKey) {
      setSelectedViewId(selectedKey);
      const view = customViews.find(v => v.id === selectedKey);
      if (view) {
        onApplyView?.(view);
      }
    }
  };

  return (
    <>
      <div className='bg-white border-[0.8px] border-[rgba(0,0,0,0.1)] rounded-[14px] p-4'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Eye className='w-4 h-4 text-[#101828]' />
            <span className='text-sm text-[#101828]'>Custom View:</span>
          </div>
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            {customViews.length > 0 ? (
              <Select
                selectedKeys={selectedViewId ? [selectedViewId] : []}
                onSelectionChange={handleSelectChange}
                placeholder='Select view'
                className='flex-1 min-w-0'
                classNames={{
                  trigger:
                    'bg-[#f3f3f5] border-[0.8px] border-[rgba(0,0,0,0)] rounded-[8px] h-[36px]',
                  value: 'text-sm text-[#717182]',
                }}
                items={customViews}
              >
                {view => (
                  <SelectItem key={view.id} textValue={view.name}>
                    {view.name}
                  </SelectItem>
                )}
              </Select>
            ) : null}
            {selectedViewId ? (
              <Button
                className='bg-transparent hover:bg-gray-200'
                startContent={<X className='w-3.5 h-3.5' />}
                onPress={() => {
                  setSelectedViewId('');
                  setIsShowClearButton(false);
                }}
              >
                Clear
              </Button>
            ) : null}
            <Button
              size='sm'
              variant='bordered'
              color='default'
              className='bg-white border-[rgba(0,0,0,0.1)] text-neutral-950 shrink-0'
              onPress={handleAddViewClick}
            >
              <span className='flex items-center gap-1'>
                <Plus className='w-3.5 h-3.5' />
                Add View
              </span>
            </Button>
          </div>
        </div>
      </div>

      <AddCustomViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};

export default CustomView;
