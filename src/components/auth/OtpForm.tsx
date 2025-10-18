'use client';

import { Button, Form, InputOtp } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';

interface OtpFormProps {
  email: string;
  length?: number;
}

interface OtpSubmitData extends Pick<OtpFormProps, 'email'> {
  otp: string;
}

const OtpForm: React.FC<OtpFormProps> = ({ email, length = 6 }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<OtpSubmitData>({
    mode: 'onSubmit',
    defaultValues: { email, otp: '' },
  });

  return (
    <Form onSubmit={handleSubmit(() => {})} className='mt-8 w-full space-y-6'>
      <Controller
        name='otp'
        control={control}
        rules={{
          required: 'Please enter the code',
          validate: {
            digitsOnly: v => (/^\d*$/.test(v) ? true : 'Digits only'),
            exactLength: v =>
              v.length === length || `Code must be ${length} digits`,
          },
        }}
        render={({ field }) => (
          <InputOtp
            className='mx-auto flex justify-center'
            length={length}
            value={field.value}
            onValueChange={field.onChange}
            onComplete={val => field.onChange(val)}
            pushPasswordManagerStrategy='none'
            isInvalid={!!errors.otp}
            errorMessage={errors.otp?.message}
          />
        )}
      />

      <Button
        type='submit'
        color='primary'
        className='w-full'
        isDisabled={!isValid || isSubmitting}
        isLoading={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : 'Continue'}
      </Button>
    </Form>
  );
};

export default OtpForm;
