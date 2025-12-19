'use client';

import React, { useCallback, useState } from 'react';
import { Modal, ModalBody, ModalContent } from '@heroui/react';
import { X, Upload, Sparkles } from 'lucide-react';

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUpload?: (file: File) => void;
}

const UploadImageModal: React.FC<UploadImageModalProps> = ({
  isOpen,
  onClose,
  onImageUpload,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Call the upload handler
      onImageUpload?.(file);
    },
    [onImageUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClick = () => {
    document.getElementById('file-input')?.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='lg'
      classNames={{
        base: 'rounded-[20px]',
        body: 'p-0',
      }}
      hideCloseButton
    >
      <ModalContent>
        <ModalBody className='p-0'>
          <div className='bg-white border border-[rgba(0,0,0,0.1)] rounded-[20px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]'>
            {/* Header */}
            <div className='border-b border-gray-100 flex h-[61px] items-center justify-between px-6'>
              <div className='flex gap-2 items-center'>
                <Upload className='w-5 h-5 text-[#101828]' />
                <h2 className='text-[16px] font-normal text-[#101828] leading-[24px]'>
                  Upload Image to Create Task
                </h2>
              </div>
              <button
                onClick={onClose}
                className='opacity-70 hover:opacity-100 transition-opacity'
                aria-label='Close'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            {/* Content */}
            <div className='flex flex-col gap-4 p-6'>
              {/* Upload Area */}
              <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-[10px] h-[216px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-[#1447e6] bg-blue-50'
                    : 'border-[#d1d5dc] hover:border-[#1447e6] hover:bg-blue-50/50'
                }`}
              >
                <input
                  id='file-input'
                  type='file'
                  accept='image/*'
                  onChange={handleFileInput}
                  className='hidden'
                />
                {preview ? (
                  <div className='relative w-full h-full flex items-center justify-center'>
                    <img
                      src={preview}
                      alt='Preview'
                      className='max-w-full max-h-full object-contain rounded-[10px]'
                    />
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setPreview(null);
                      }}
                      className='absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100'
                      aria-label='Remove image'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className='w-12 h-12 text-[#6a7282] mb-4' />
                    <p className='text-[16px] text-[#364153] text-center mb-2'>
                      Drop an image here or click to upload
                    </p>
                    <p className='text-[14px] text-[#6a7282] text-center'>
                      Upload a photo of your assignment, notes, or task list
                    </p>
                  </>
                )}
              </div>

              {/* AI Info Box */}
              <div className='bg-blue-50 border border-[#bedbff] rounded-[10px] p-[17px]'>
                <div className='flex gap-3 items-start'>
                  <Sparkles className='w-5 h-5 text-[#1447e6] shrink-0 mt-0.5' />
                  <div className='flex flex-col gap-1'>
                    <h3 className='text-[16px] font-normal text-[#1c398e] leading-[24px]'>
                      AI-powered task extraction
                    </h3>
                    <p className='text-[16px] text-[#1447e6] leading-[24px]'>
                      Upload an image and we'll help you extract task details
                      automatically, or you can create tasks manually while
                      viewing the image.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UploadImageModal;
