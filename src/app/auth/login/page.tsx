'use client';

import { useAppSelector } from '@/store/hooks';
import { Form, Input, Link } from '@heroui/react';
import { Eye, EyeOff } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BaseButton } from '@/components';
import { useLoginMutation } from '@/mutations';
import { AuthFormProps } from '@/components/auth/AuthForm';

export default function LoginPage() {
  const tempEmail = useAppSelector(state => state.app.temporaryEmail);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AuthFormProps>({
    mode: 'onBlur',
    defaultValues: {
      email: tempEmail || '',
      password: '',
    },
  });

  useEffect(() => {
    if (!tempEmail) {
      router.push('/auth');
    }
  }, [tempEmail]);

  const { mutateAsync: login, isPending } = useLoginMutation();

  const onSubmit = async (data: any) => {
    await login(data);
  };

  return (
    <div className='min-h-screen w-full bg-slate-50 flex items-center justify-center p-6'>
      <div className='w-full max-w-md'>
        <h1 className='text-center text-3xl font-extrabold tracking-tight text-slate-900'>
          Login to your account
        </h1>

        <Form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-5'>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                type='email'
                label='Email address'
                labelPlacement='outside-top'
                radius='full'
                value={field.value}
                onChange={field.onChange}
                readOnly
                endContent={
                  <Link
                    size='sm'
                    underline='hover'
                    className='hover:cursor-pointer'
                    onPress={() => router.push('/auth')}
                  >
                    Edit
                  </Link>
                }
              />
            )}
          />

          {/* Password */}
          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <Input
                type={showPassword ? 'text' : 'password'}
                label='Password'
                labelPlacement='outside-top'
                radius='full'
                endContent={
                  <button
                    type='button'
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className='text-slate-500'
                    onClick={() => setShowPassword(v => !v)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className='hover:cursor-pointer' />
                    ) : (
                      <Eye size={18} className='hover:cursor-pointer' />
                    )}
                  </button>
                }
                {...field}
              />
            )}
          />

          <BaseButton
            isValid={isValid}
            isLoading={isPending}
            content='Continue'
            type='submit'
          />
          {/* <BaseDivider /> */}
        </Form>
      </div>
    </div>
  );
}
