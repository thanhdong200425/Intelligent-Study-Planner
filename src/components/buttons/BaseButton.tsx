'use client';

import { Button, ButtonProps } from '@heroui/react';

interface BaseButtonProps extends ButtonProps {
  isValid: boolean;
  isLoading: boolean;
  content: string;
}

const BaseButton: React.FC<BaseButtonProps> = ({
  isValid,
  isLoading,
  className,
  content,
  ...props
}: BaseButtonProps) => {
  return (
    <Button
      className={`w-full bg-black text-white hover:bg-black/80 ${className}`}
      isDisabled={!isValid || isLoading}
      isLoading={isLoading}
      {...props}
    >
      {isLoading ? 'Processing...' : content}
    </Button>
  );
};

export default BaseButton;
