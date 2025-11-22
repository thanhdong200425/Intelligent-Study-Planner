'use client';

import { useEffect, useRef } from 'react';

const SOUND_MAP: Record<string, string> = {
  ocean: '/sounds/ocean-waves.mp3',
  rain: '/sounds/rain-sound.mp3',
  ambient: '/sounds/deep-abstract-ambient.mp3',
  forest: '/sounds/forest-birds.mp3',
};

export const useAmbientSound = (
  selectedPreset: string | null,
  isRunning: boolean
) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Stop and cleanup previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // If timer is running and a preset is selected, play the sound
    if (isRunning && selectedPreset && SOUND_MAP[selectedPreset]) {
      const audio = new Audio(SOUND_MAP[selectedPreset]);
      audio.loop = true; // Loop infinitely
      audio.volume = 0.5;

      // Play the audio
      audio.play().catch(error => {
        console.warn('Failed to play ambient sound:', error);
      });

      audioRef.current = audio;

      // Cleanup function
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
        }
      };
    }
  }, [selectedPreset, isRunning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);
};
