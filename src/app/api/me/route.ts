import { NextResponse } from 'next/server';
import { readSessionCookie } from '@/lib/sessionCookie';
import apiClient from '@/lib/api';

export async function GET() {
  const sid = await readSessionCookie();
  if (!sid) return NextResponse.json({ user: null }, { status: 401 });

  const request = await apiClient.get(
    process.env.NEXT_PUBLIC_SERVER_URL + '/session/me',
    { headers: { 'x-session-id': sid } }
  );
  return NextResponse.json(request.data, { status: request.status });
}
