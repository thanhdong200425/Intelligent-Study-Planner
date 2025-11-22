'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalBody,
  Switch,
  Button,
  Input,
} from '@heroui/react';
import { Volume2, Moon, X, Music2 } from 'lucide-react';
import { BaseButton } from '../buttons';
import { useAmbientPreset, TimerPreferences } from '@/hooks';
import { baseURL } from '@/lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { disconnectSpotify } from '@/store/slices/spotifySlice';

interface TimerDurations {
  focus: number;
  break: number;
  long_break: number;
}

interface FocusSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  timerDurations?: TimerDurations;
  onTimerDurationsChange?: (durations: TimerDurations) => void;
  preferences: TimerPreferences;
  onPreferencesChange: (preferences: Partial<TimerPreferences>) => void;
}

// DONE: Add a ok button to persist settings
// DONE: Remove the scroll bar
// DONE: Save timer durations to local storage and load on mount, update when changed
// DONE: Add function for timer sounds and dark mode
// DONE: Add function for quick presets
// DONE: The dark mode isn't work until user refresh the page
// TODO: Add function for Spotify integration
// Add routes for authorization to request user grant access to Spotify, then request access token

const FocusSettingsModal: React.FC<FocusSettingsModalProps> = ({
  isOpen,
  onClose,
  timerDurations = { focus: 25, break: 5, long_break: 15 },
  onTimerDurationsChange,
  preferences,
  onPreferencesChange,
}) => {
  const [durations, setDurations] = useState<TimerDurations>(timerDurations);

  // Update local state when prop changes
  useEffect(() => {
    setDurations(timerDurations);
  }, [timerDurations]);

  const handleDurationChange = (mode: keyof TimerDurations, value: string) => {
    const numValue = parseInt(value) || 0;
    const newDurations = { ...durations, [mode]: numValue };
    setDurations(newDurations);
    onTimerDurationsChange?.(newDurations);
  };

  const quickPresets = [
    { id: 'ocean', label: '🌊 Ocean Waves' },
    { id: 'rain', label: '🌧️ Rain Sounds' },
    { id: 'ambient', label: '🌌 Deep Ambient' },
    { id: 'forest', label: '🌲 Forest Birds' },
  ];

  const { selectedPreset, updatePreset } = useAmbientPreset();
  const dispatch = useDispatch();
  const { isConnected } = useSelector((state: RootState) => state.spotify);

  const handleSpotifyClick = () => {
    if (isConnected) {
      dispatch(disconnectSpotify());
    } else {
      window.location.href = `${baseURL}/spotify/auth/login`;
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='lg'
      scrollBehavior={undefined}
      classNames={{
        base: 'max-w-[500px]',
        body: 'p-0',
      }}
      hideCloseButton
    >
      <ModalContent>
        <ModalBody className='p-0'>
          <div className='bg-white border border-gray-100 rounded-[10px] relative'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 pb-4'>
              <h2 className='text-lg font-bold text-neutral-950'>
                Focus Settings
              </h2>
              <button
                onClick={onClose}
                className='w-4 h-4 opacity-70 hover:opacity-100 transition-opacity'
                aria-label='Close'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            {/* Content */}
            <div className='px-6 pb-6'>
              <div className='bg-white border border-gray-100 rounded-2xl pt-6 px-6 pb-1'>
                <div className='flex flex-col gap-6'>
                  {/* Timer Sounds */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3 flex-1'>
                      <div className='w-5 h-5 flex items-center justify-center'>
                        <Volume2 className='w-5 h-5 text-gray-600' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-base font-normal text-[#101828]'>
                          Timer Sounds
                        </p>
                        <p className='text-sm text-[#6a7282]'>
                          Play sound when timer ends
                        </p>
                      </div>
                    </div>
                    <Switch
                      isSelected={preferences.timerSounds}
                      onValueChange={value =>
                        onPreferencesChange({ timerSounds: value })
                      }
                      size='sm'
                      classNames={{
                        wrapper: preferences.timerSounds
                          ? 'bg-[#030213]'
                          : 'bg-[#cbced4]',
                        thumb: 'bg-white',
                      }}
                    />
                  </div>

                  {/* Dark Mode */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3 flex-1'>
                      <div className='w-5 h-5 flex items-center justify-center'>
                        <Moon className='w-5 h-5 text-gray-600' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-base font-normal text-[#101828]'>
                          Dark Mode
                        </p>
                        <p className='text-sm text-[#6a7282]'>
                          Reduce eye strain
                        </p>
                      </div>
                    </div>
                    <Switch
                      isSelected={preferences.darkMode}
                      onValueChange={value =>
                        onPreferencesChange({ darkMode: value })
                      }
                      size='sm'
                      classNames={{
                        wrapper: preferences.darkMode
                          ? 'bg-[#030213]'
                          : 'bg-[#cbced4]',
                        thumb: 'bg-white',
                      }}
                    />
                  </div>

                  {/* Timer Durations */}
                  <div className='border-t border-gray-100 pt-[17px] flex flex-col gap-4'>
                    <p className='text-sm text-[#4a5565] font-normal'>
                      Timer Durations
                    </p>
                    <div className='flex flex-col gap-3'>
                      {/* Focus */}
                      <div className='flex items-center justify-between'>
                        <p className='text-base font-normal text-[#101828]'>
                          Focus
                        </p>
                        <div className='flex items-center gap-2'>
                          <Input
                            type='number'
                            value={durations.focus.toString()}
                            onValueChange={value =>
                              handleDurationChange('focus', value)
                            }
                            min={1}
                            max={120}
                            classNames={{
                              base: 'w-24',
                              input: 'text-right text-base text-[#101828]',
                              inputWrapper:
                                'bg-gray-100 border-0 h-10 rounded-lg px-3',
                            }}
                            radius='lg'
                            variant='flat'
                          />
                          <span className='text-sm text-[#6a7282]'>min</span>
                        </div>
                      </div>

                      {/* Short Break */}
                      <div className='flex items-center justify-between'>
                        <p className='text-base font-normal text-[#101828]'>
                          Short Break
                        </p>
                        <div className='flex items-center gap-2'>
                          <Input
                            type='number'
                            value={durations.break.toString()}
                            onValueChange={value =>
                              handleDurationChange('break', value)
                            }
                            min={1}
                            max={60}
                            classNames={{
                              base: 'w-24',
                              input: 'text-right text-base text-[#101828]',
                              inputWrapper:
                                'bg-gray-100 border-0 h-10 rounded-lg px-3',
                            }}
                            radius='lg'
                            variant='flat'
                          />
                          <span className='text-sm text-[#6a7282]'>min</span>
                        </div>
                      </div>

                      {/* Long Break */}
                      <div className='flex items-center justify-between'>
                        <p className='text-base font-normal text-[#101828]'>
                          Long Break
                        </p>
                        <div className='flex items-center gap-2'>
                          <Input
                            type='number'
                            value={durations.long_break.toString()}
                            onValueChange={value =>
                              handleDurationChange('long_break', value)
                            }
                            min={1}
                            max={60}
                            classNames={{
                              base: 'w-24',
                              input: 'text-right text-base text-[#101828]',
                              inputWrapper:
                                'bg-gray-100 border-0 h-10 rounded-lg px-3',
                            }}
                            radius='lg'
                            variant='flat'
                          />
                          <span className='text-sm text-[#6a7282]'>min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className='border-t border-gray-100 pt-[17px] flex flex-col gap-3'>
                    <p className='text-sm text-[#4a5565]'>Quick Presets</p>
                    <div className='grid grid-cols-2 gap-2 h-20'>
                      {quickPresets.map(preset => {
                        const isSelected = selectedPreset === preset.id;
                        return (
                          <Button
                            key={preset.id}
                            variant='flat'
                            className={`h-10 justify-start px-4 py-2 transition-all ${
                              isSelected
                                ? 'bg-black text-white border-2 border-black'
                                : 'bg-gray-100 text-[#364153] hover:bg-gray-200 border-2 border-transparent'
                            }`}
                            radius='lg'
                            onPress={() =>
                              updatePreset(
                                selectedPreset === preset.id ? null : preset.id
                              )
                            }
                          >
                            <span className='text-sm whitespace-pre-wrap'>
                              {preset.label}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Spotify Integration */}
                  <div className='border-t border-gray-100 pt-[17px] flex flex-col gap-3'>
                    <p className='text-sm text-[#4a5565]'>
                      Spotify Integration
                    </p>
                    <Button
                      className={`${
                        isConnected
                          ? 'bg-red-500 text-white'
                          : 'bg-[#1db954] text-white'
                      } h-11 relative`}
                      radius='lg'
                      startContent={
                        !isConnected && <Music2 className='w-5 h-5' />
                      }
                      onPress={handleSpotifyClick}
                    >
                      <span className='text-sm'>
                        {isConnected
                          ? 'Disconnect Spotify'
                          : 'Connect to Spotify'}
                      </span>
                    </Button>
                    <p className='text-xs text-[#6a7282] text-center leading-4'>
                      Play your favorite playlists during focus sessions
                    </p>
                  </div>

                  <div className='border-t border-gray-100 pt-[17px] flex flex-col gap-3'>
                    <BaseButton onPress={onClose} content='OK' />
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

export default FocusSettingsModal;
