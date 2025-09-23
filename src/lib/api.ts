import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Base URL can be configured via environment variable
const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3030';

// Maintain an in-memory auth token to avoid localStorage usage
let inMemoryToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  inMemoryToken = token;
};

const getAccessTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

const shouldSkipAuth = (config: AxiosRequestConfig): boolean => {
  const url = config.url || '';
  // Normalize to path part only
  try {
    const full = new URL(
      url,
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost'
    );
    const pathname = full.pathname.toLowerCase();
    return (
      pathname.includes('/auth/login') ||
      pathname.includes('/auth/signin') ||
      pathname.includes('/auth/logout') ||
      pathname.includes('/auth/signout')
    );
  } catch {
    const pathname = url.toLowerCase();
    return (
      pathname.includes('/auth/login') ||
      pathname.includes('/auth/signin') ||
      pathname.includes('/auth/logout') ||
      pathname.includes('/auth/signout')
    );
  }
};

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use(config => {
  if (!shouldSkipAuth(config)) {
    const token = inMemoryToken || getAccessTokenFromCookie();
    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>)['Authorization'] =
        `Bearer ${token}`;
    }
  }
  return config;
});

export default apiClient;
