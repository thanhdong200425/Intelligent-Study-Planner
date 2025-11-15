'use server';

import { cookies } from 'next/headers';

const endpoint = {
  refresh: '/auth/refresh',
};

export const refreshAccessTokenForServer = async (): Promise<{
  accessToken: string;
}> => {
  const cookieStore = await cookies();
  const cookieValues = cookieStore.toString();

  const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!baseURL) throw new Error('NEXT_PUBLIC_SERVER_URL is not set');

  const res = await fetch(`${baseURL}${endpoint.refresh}`, {
    method: 'POST',
    headers: {
      Cookie: cookieValues,
    },
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Token refresh failed (${res.status}): ${text || res.statusText}`
    );
  }

  const result = await res.json();

  return {
    accessToken: result.accessToken,
  };
};

export const sendRequestFromServer = async (
  endpoint: string,
  includeRetry = true
) => {
  try {
    const { accessToken } = await refreshAccessTokenForServer();
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    // Make request with Authorization header for access token and Cookie header for cookies
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
        },
        credentials: 'include',
        cache: 'no-store',
      }
    );

    if (response.status === 401 && includeRetry) {
      // Try to make the request again after refreshing the token
      const { accessToken: newAccessToken } =
        await refreshAccessTokenForServer();
      const retryCookieStore = await cookies();
      const retryCookieHeader = retryCookieStore.toString();

      const retryResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            Cookie: retryCookieHeader,
          },
          credentials: 'include',
          cache: 'no-store',
        }
      );

      if (!retryResponse.ok) {
        throw new Error(`Request failed after retry: ${retryResponse.status}`);
      }

      return await retryResponse.json();
    }

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.log('Error sending request from server: ', err);
    throw err;
  }
};
