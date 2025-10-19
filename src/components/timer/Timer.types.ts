import { TimeBlock } from '@/types';

export type TimerMode = 'focus' | 'break' | 'rest';

export interface TimerProps {
  timeBlock?: TimeBlock;
  onComplete?: (actualMinutes: number) => void;
  onCancel?: () => void;
}

export interface PomoContainerProps {
  minutes: number;
  seconds: number;
  hours?: number;
  isRunning: boolean;
  onPress?: () => void;
  onReset?: () => void;
}
