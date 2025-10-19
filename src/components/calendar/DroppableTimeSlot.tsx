'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableTimeSlotProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
}

export const DroppableTimeSlot: React.FC<DroppableTimeSlotProps> = ({
  id,
  children,
  className = '',
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${
        isOver ? 'bg-blue-100 border-blue-300' : ''
      } transition-colors`}
    >
      {children}
    </div>
  );
};
