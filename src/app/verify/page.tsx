import React from 'react';
import BrandLogo from '@/components/auth/BrandLogo';
import { OtpForm } from '@/components/auth';

interface VerifyCodePageProps {
  email?: string;
}

export default function VerifyCodePage({
  email = 'abc@gmail.com',
}: VerifyCodePageProps) {
  return (
    <div className='min-h-screen w-full bg-slate-50 flex items-center justify-center p-6'>
      <div className='w-full max-w-md rounded-2xl bg-white/80 backdrop-blur shadow-xl border border-slate-200 p-8'>
        <BrandLogo />

        <div className='flex flex-col items-center'>
          <h1 className='text-3xl font-extrabold text-slate-900 text-center'>
            Please Check Your Email
          </h1>
          <p className='mt-4 text-slate-600 text-center'>
            We’ve sent a code to <span className='font-medium'>{email}</span>
          </p>
        </div>

        <OtpForm email={email} />
      </div>
    </div>
  );
}
