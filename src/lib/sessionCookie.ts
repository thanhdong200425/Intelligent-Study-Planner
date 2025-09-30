import { cookies } from 'next/headers';
const COOKIE = 'sid';

// cookies() allow read incoming request cookie and use it inside Server components

export async function setSessionCookie(sid: string, maxAge: number) {
  const incomingRequestCookie = await cookies();
  incomingRequestCookie.set(COOKIE, sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function readSessionCookie() {
  const incomingRequestCookie = await cookies();
  return incomingRequestCookie.get(COOKIE)?.value ?? null;
}

export async function clearSessionCookie() {
  const incomingRequestCookie = await cookies();
  incomingRequestCookie.set(COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
