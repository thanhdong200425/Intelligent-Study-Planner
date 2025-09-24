import apiClient from '@/lib/api';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const r = await apiClient.post(
    process.env.NEXT_PUBLIC_SERVER_URL + '/auth/register',
    body
  );
  return NextResponse.json(r.data, { status: r.status });
}
