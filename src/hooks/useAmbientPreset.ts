'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'selected-ambient-preset';

export const useAmbientPreset = () => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load selected preset from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSelectedPreset(saved);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updated = localStorage.getItem(STORAGE_KEY);
      setSelectedPreset(updated);
    };

    // Listen for changes to the preset (when other components update it)
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event for same-tab updates
    const handleCustomStorageChange = () => {
      const updated = localStorage.getItem(STORAGE_KEY);
      setSelectedPreset(updated);
    };
    window.addEventListener(
      'ambient-preset-changed',
      handleCustomStorageChange
    );

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'ambient-preset-changed',
        handleCustomStorageChange
      );
    };
  }, []);

  // Update function that saves to localStorage and dispatches event
  const updatePreset = (preset: string | null) => {
    setSelectedPreset(preset);
    if (preset) {
      localStorage.setItem(STORAGE_KEY, preset);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('ambient-preset-changed'));
  };

  return { selectedPreset, updatePreset, isLoaded };
};
