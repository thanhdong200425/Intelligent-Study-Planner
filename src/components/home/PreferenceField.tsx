import React from 'react';
import { Input, Button } from '@heroui/react';
import { type UserProfile } from '@/types';

interface PreferenceFieldProps {
  label: string;
  value: number;
  name: keyof UserProfile;
  onChange: (value: number) => void;
}

const PreferenceField: React.FC<PreferenceFieldProps> = ({
  label,
  value,
  name,
  onChange,
}) => {
  const increase = () => onChange(value + 1);
  const decrease = () => onChange(Math.max(0, value - 1));

  return (
    <div className='space-y-2'>
      <Input
        label={label}
        type='number'
        value={String(value)}
        name={name}
        onChange={e => onChange(Number(e.target.value))}
        className='w-full'
        size='md'
      />

      <div className='flex items-center gap-2'>
        <Button size='sm' variant='flat' onPress={decrease}>
          -
        </Button>

        <Button size='sm' variant='flat' onPress={increase}>
          +
        </Button>
      </div>
    </div>
  );
};

export default PreferenceField;
