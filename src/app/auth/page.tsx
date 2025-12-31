import React from 'react';
import { AuthCard, AuthForm } from '@/components/auth';

interface AuthPageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

export default async function AuthPage(props: AuthPageProps) {
  const params = await props.searchParams;

  return (
    <div className='min-h-screen w-full bg-slate-50 flex items-center justify-center p-6'>
      <AuthCard>
        <h1 className='text-center text-3xl font-extrabold tracking-tight text-slate-900'>
          Login Or Sign Up
        </h1>
        <AuthForm redirectTo={params.redirect} />
      </AuthCard>
    </div>
  );
}
