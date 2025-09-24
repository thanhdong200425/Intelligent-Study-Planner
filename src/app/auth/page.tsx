import React from 'react';
import { AuthCard, BrandLogo, AuthForm } from '@/components/auth';

export default async function AuthPage() {
  return (
    <div className='min-h-screen w-full bg-slate-50 flex items-center justify-center p-6'>
      <AuthCard>
        <BrandLogo />
        <h1 className='text-center text-3xl font-extrabold tracking-tight text-slate-900'>
          Login Or Sign Up
        </h1>
        <AuthForm />
      </AuthCard>
    </div>
  );
}
