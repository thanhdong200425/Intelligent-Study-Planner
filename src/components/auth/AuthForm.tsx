'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Facebook, Lock, Mail, Twitter } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Form, Input, Checkbox, Button, Divider, Link } from '@heroui/react';

interface AuthFormProps {
  email: string;
  password: string;
  remember: boolean;
}

const AuthForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AuthFormProps>({
    mode: 'onSubmit',
    defaultValues: { email: '', password: '', remember: true },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form
      onSubmit={handleSubmit(data => console.log(data))}
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
            placeholder='you@example.com'
            autoComplete='email'
            inputMode='email'
            variant='bordered'
            startContent={<Mail size={18} className='text-slate-400' />}
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
      <Controller
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
      />

      <div className='mt-3 flex flex-row w-full items-center justify-between'>
        <Controller
          name='remember'
          control={control}
          render={({ field: { value, onChange, onBlur, name, ref } }) => (
            <Checkbox
              isSelected={!!value}
              onValueChange={onChange}
              onBlur={onBlur}
              name={name}
              ref={ref}
            >
              Remember Me
            </Checkbox>
          )}
        />
        <Link
          href='#'
          className='text-sm font-medium text-slate-600 hover:text-slate-900'
        >
          Forgot Password
        </Link>
      </div>

      <Button
        type='submit'
        color='primary'
        className='w-full'
        isDisabled={!isValid || isSubmitting}
        isLoading={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : 'Continue'}
      </Button>

      <div className='flex w-full items-center my-6'>
        <Divider className='flex-1' orientation='horizontal' />
        <span className='mx-4 text-slate-400 font-semibold text-xs uppercase tracking-widest select-none'>
          OR
        </span>
        <Divider className='flex-1' orientation='horizontal' />
      </div>

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
