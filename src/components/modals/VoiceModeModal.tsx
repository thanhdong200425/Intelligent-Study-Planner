'use client';

import React, { useState } from 'react';
import { Modal, ModalBody, ModalContent, Button } from '@heroui/react';
import { Mic, ChevronDown } from 'lucide-react';

export interface VoiceModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceModeModal: React.FC<VoiceModeModalProps> = ({ isOpen, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual voice recording logic
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='lg'
      classNames={{
        base: 'bg-[#0f1419] rounded-[20px]',
        body: 'p-0',
      }}
      hideCloseButton
    >
      <ModalContent>
        <ModalBody className='p-0'>
          <div className='flex flex-col bg-[#0f1419] text-white rounded-[20px]'>
            {/* Header */}
            <div className='border-b border-[#1e2939] flex h-[65px] items-center justify-between px-6'>
              <div className='flex gap-3 items-center'>
                <h2 className='text-[18px] font-normal text-white leading-[28px]'>
                  Voice Capture
                </h2>
                <div className='bg-[rgba(79,57,246,0.2)] border border-[rgba(79,57,246,0.3)] px-[9px] py-[3px] rounded-[4px]'>
                  <span className='text-[12px] text-[#7c86ff] font-normal leading-[16px]'>
                    PREVIEW
                  </span>
                </div>
              </div>

              {/* Waveform and Record Button */}
              <div className='flex gap-3 items-center'>
                {/* Waveform visualization */}
                <div className='flex gap-[2px] items-center h-[32px]'>
                  {Array.from({ length: 29 }).map((_, i) => (
                    <div
                      key={i}
                      className={`bg-[#364153] rounded-full w-[4px] h-[4px] ${
                        isRecording && i % 3 === 0 ? 'animate-pulse' : ''
                      }`}
                    />
                  ))}
                </div>

                {/* Record Button */}
                <button
                  onClick={handleToggleRecording}
                  className={`w-[32px] h-[32px] rounded-full flex items-center justify-center transition-colors ${
                    isRecording ? 'bg-red-500' : 'bg-[#4f39f6]'
                  }`}
                  aria-label={
                    isRecording ? 'Stop recording' : 'Start recording'
                  }
                >
                  <Mic className='w-[16px] h-[16px] text-white' />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className='flex flex-col gap-6 px-6 py-8'>
              {/* Description */}
              <p className='text-[14px] text-[#d1d5dc] leading-[20px]'>
                Speak your tasks naturally, and AI will organize them for you.
              </p>

              {/* Example Commands */}
              <div className='flex flex-col gap-2'>
                {/* Example 1 */}
                <div className='bg-[rgba(16,24,40,0.5)] border border-[#1e2939] rounded-[10px] px-3 py-3 flex gap-3'>
                  <Mic className='w-4 h-4 text-[#6a7282] shrink-0 mt-0.5' />
                  <div className='flex-1'>
                    <span className='text-[14px] text-[#99a1af] leading-[20px]'>
                      Try{' '}
                    </span>
                    <span className='text-[14px] text-[#7c86ff] leading-[20px]'>
                      "Complete homework by Friday at 5pm, add it to Math
                      course"
                    </span>
                  </div>
                </div>

                {/* Example 2 */}
                <div className='bg-[rgba(16,24,40,0.5)] border border-[#1e2939] rounded-[10px] px-3 py-3 flex gap-3'>
                  <Mic className='w-4 h-4 text-[#6a7282] shrink-0 mt-0.5' />
                  <div className='flex-1'>
                    <span className='text-[14px] text-[#99a1af] leading-[20px]'>
                      Say{' '}
                    </span>
                    <span className='text-[14px] text-[#05df72] leading-[20px]'>
                      "Study for exam tomorrow, high priority, 2 hours"
                    </span>
                  </div>
                </div>

                {/* Example 3 */}
                <div className='bg-[rgba(16,24,40,0.5)] border border-[#1e2939] rounded-[10px] px-3 py-3 flex gap-3'>
                  <Mic className='w-4 h-4 text-[#6a7282] shrink-0 mt-0.5' />
                  <div className='flex-1'>
                    <span className='text-[14px] text-[#99a1af] leading-[20px]'>
                      Edit or remove{' '}
                    </span>
                    <span className='text-[14px] text-[#ffb900] leading-[20px]'>
                      "End the session with done recording"
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='border-t border-[#1e2939] flex h-[69px] items-center justify-between px-6'>
              <button className='text-[14px] text-[#7c86ff] leading-[20px] hover:text-[#9ca6ff] transition-colors'>
                Share feedback
              </button>
              <Button
                variant='bordered'
                className='border-[#364153] text-[#d1d5dc] bg-transparent'
                onPress={onClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VoiceModeModal;
