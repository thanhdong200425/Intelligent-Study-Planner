import { NextResponse } from 'next/server';
import { readSessionCookie, clearSessionCookie } from '@/lib/sessionCookie';
import apiClient from '@/lib/api';

export async function POST() {
  const sid = await readSessionCookie();
  if (sid) {
    await apiClient.post(
      process.env.NEXT_PUBLIC_SERVER_URL + '/session/revoke',
      {},
      {
        headers: { 'x-session-id': sid },
      }
    );
  }
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
