'use client';

import React from 'react';
import { FloatingFocusTimer } from '@/components/focus/FloatingFocusTimer';

interface GlobalFloatingTimerWrapperProps {
  children: React.ReactNode;
}

export const GlobalFloatingTimerWrapper: React.FC<
  GlobalFloatingTimerWrapperProps
> = ({ children }) => {
  return (
    <>
      {children}
      <FloatingFocusTimer />
    </>
  );
};
