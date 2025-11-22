'use client';

import { useState, useEffect } from 'react';

interface TimerSettings {
  focus: number;
  break: number;
  long_break: number;
}

interface TimerPreferences {
  timerSounds: boolean;
  darkMode: boolean;
}

const DEFAULT_SETTINGS: TimerSettings = {
  focus: 25,
  break: 5,
  long_break: 15,
};

const DEFAULT_PREFERENCES: TimerPreferences = {
  timerSounds: true,
  darkMode: false,
};

export const useTimerSettings = () => {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('timer-settings');

    if (saved) {
      setSettings(JSON.parse(saved));
    } else {
      localStorage.setItem('timer-settings', JSON.stringify(DEFAULT_SETTINGS));
    }

    setIsLoaded(true);
  }, []);

  // Helper to update settings and save to local storage automatically
  const updateSettings = (newSettings: typeof DEFAULT_SETTINGS) => {
    setSettings(newSettings);
    localStorage.setItem('timer-settings', JSON.stringify(newSettings));
  };

  return { settings, updateSettings, isLoaded };
};

export const useTimerPreferences = () => {
  const [preferences, setPreferences] =
    useState<TimerPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('timer-preferences');

    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch {
        setPreferences(DEFAULT_PREFERENCES);
        localStorage.setItem(
          'timer-preferences',
          JSON.stringify(DEFAULT_PREFERENCES)
        );
      }
    } else {
      localStorage.setItem(
        'timer-preferences',
        JSON.stringify(DEFAULT_PREFERENCES)
      );
    }

    setIsLoaded(true);
  }, []);

  const updatePreferences = (newPreferences: Partial<TimerPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPreferences };
      localStorage.setItem('timer-preferences', JSON.stringify(updated));
      return updated;
    });
  };

  return { preferences, updatePreferences, isLoaded };
};
