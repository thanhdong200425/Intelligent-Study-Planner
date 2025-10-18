'use client';

import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, Facebook, Lock, Mail, Twitter } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import {
  Form,
  Input,
  Checkbox,
  Button,
  Divider,
  Link,
  addToast,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuthMode } from '@/services';
import { setTemporaryEmail } from '@/store/slices/appSlice';
import { BaseButton, BaseDivider } from '@/components';

export interface AuthFormProps {
  email: string;
  password: string;
}

interface AuthFormComponentProps {
  redirectTo?: string;
}

type AuthMode = 'login' | 'register';

const AuthForm = ({ redirectTo }: AuthFormComponentProps) => {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const dispatch = useAppDispatch();
  // Form control
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isLoading },
  } = useForm<AuthFormProps>({
    mode: 'onSubmit',
    defaultValues: { email: '', password: '' },
  });

  // States
  const [showPassword, setShowPassword] = useState(false);

  // Handlers
  const onSubmit = async (data: Pick<AuthFormProps, 'email'>) => {
    await handleCheckType(data);
  };

  // Check whether to login or register based on email
  const handleCheckType = async (data: Pick<AuthFormProps, 'email'>) => {
    try {
      const result = await checkAuthMode(data);
      if (result === null) throw new Error('An error occurred');

      setAuthMode(result);
      dispatch(setTemporaryEmail(data.email));
      router.push(`/auth/${result}`);
    } catch (error: any) {
      addToast({
        title: 'Error',
        description: error?.response?.data?.message || 'An error occurred.',
        color: 'danger',
      });
    }
  };
  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className='mt-8 space-y-6 flex flex-col'
    >
      {/* Email */}
      <Controller
        name='email'
        control={control}
        rules={{
          required: 'Please enter your email.',
          pattern: {
            value: /.+@.+\..+/,
            message: 'Email format looks invalid.',
          },
        }}
        render={({ field }) => (
          <Input
            {...field}
            type='email'
            label='Email'
            autoComplete='email'
            inputMode='email'
            variant='bordered'
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            onChange={e =>
              field.onChange(
                typeof e.target.value === 'string'
                  ? e.target.value.trim().toLowerCase()
                  : e.target.value
              )
            }
          />
        )}
      />

      {/* Password */}
      {/*<Controller
        name='password'
        control={control}
        rules={{
          required: 'Please enter your password.',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters.',
          },
        }}
        render={({ field }) => (
          <Input
            {...field}
            type={showPassword ? 'text' : 'password'}
            label='Password'
            placeholder='••••••••'
            variant='bordered'
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            startContent={<Lock size={18} className='text-slate-400' />}
            endContent={
              <button
                type='button'
                className='text-slate-500'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
        )}
      />*/}

      <BaseButton
        type='submit'
        isValid={isValid}
        isLoading={isLoading}
        content={isLoading ? 'Processing...' : 'Continue'}
      />

      <BaseDivider />

      <div className='space-y-3'>
        <Button
          type='button'
          variant='bordered'
          className='w-full'
          startContent={<Facebook size={18} />}
          onClick={() => console.log('Facebook')}
        >
          Sign In With Facebook
        </Button>
        <Button
          type='button'
          variant='bordered'
          className='w-full'
          startContent={<Twitter size={18} />}
          onClick={() => console.log('Twitter')}
        >
          Sign In With Twitter
        </Button>
      </div>
    </Form>
  );
};

export default AuthForm;
