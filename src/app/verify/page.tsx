'use client';

import React, { useEffect } from 'react';
import BrandLogo from '@/components/auth/BrandLogo';
import { OtpForm } from '@/components/auth';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';

export default function VerifyCodePage() {
  const tempEmail = useAppSelector(state => state.app.temporaryEmail);
  const router = useRouter();

  useEffect(() => {
    if (!tempEmail) {
      router.push('/');
    }
  }, [tempEmail, router]);

  return (
    <div className='min-h-screen w-full bg-slate-50 flex items-center justify-center p-6'>
      <div className='w-full max-w-md rounded-2xl bg-white/80 backdrop-blur shadow-xl border border-slate-200 p-8'>
        <BrandLogo />

        <div className='flex flex-col items-center'>
          <h1 className='text-3xl font-extrabold text-slate-900 text-center'>
            Please Check Your Email
          </h1>
          <p className='mt-4 text-slate-600 text-center'>
            We’ve sent a code to{' '}
            <span className='font-medium'>{tempEmail}</span>
          </p>
        </div>

        <OtpForm email={tempEmail ?? ""} />
      </div>
    </div>
  );
}
