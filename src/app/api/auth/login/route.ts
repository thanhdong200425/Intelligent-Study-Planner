import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/sessionCookie';
import apiClient from '@/lib/api';

export async function POST(req: Request) {
  const body = await req.json();
  const request = await apiClient.post(
    process.env.NEXT_PUBLIC_SERVER_URL + '/auth/login',
    body
  );
  if (request.status !== 200)
    return NextResponse.json({ ok: false }, { status: request.status });

  const { sessionId, absoluteSeconds } = request.data;
  await setSessionCookie(sessionId, absoluteSeconds ?? 14 * 24 * 3600);
  return NextResponse.json({ ok: true });
}
