'use client';

import React, { useState } from 'react';
import { Twitter } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Form, Input, Button, addToast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { checkAuthMode, githubLogin, googleLogin } from '@/services';
import { setTemporaryEmail } from '@/store/slices/appSlice';
import { BaseButton, BaseDivider } from '@/components';
import Image from 'next/image';
import Google from '@/assets/google.svg';
import Github from '@/assets/github.svg';

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

  const onGoogleLogin = () => {
    googleLogin();
  };

  const onGithubLogin = () => {
    githubLogin();
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
          startContent={
            <Image src={Google} alt='Google' width={20} height={20} />
          }
          onPress={onGoogleLogin}
        >
          Sign In With Google
        </Button>
        <Button
          type='button'
          variant='bordered'
          className='w-full'
          startContent={
            <Image src={Github} alt='Github' width={20} height={20} />
          }
          onPress={onGithubLogin}
        >
          Sign In With Github
        </Button>
      </div>
    </Form>
  );
};

export default AuthForm;
