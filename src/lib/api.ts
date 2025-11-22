import { refreshAccessToken } from '@/services';
import { store } from '@/store';
import { clearAuth, setAccessToken } from '@/store/slices/authSlice';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { is } from 'date-fns/locale';

// Base URL can be configured via environment variable
export const baseURL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3030';

// Maintain an in-memory auth token to avoid localStorage usage
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
      pathname.includes('/auth/signout') ||
      pathname.includes('/auth/refresh')
    );
  } catch {
    const pathname = url.toLowerCase();
    return (
      pathname.includes('/auth/login') ||
      pathname.includes('/auth/signin') ||
      pathname.includes('/auth/logout') ||
      pathname.includes('/auth/signout') ||
      pathname.includes('/auth/refresh')
    );
  }
};

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  config => {
    if (!shouldSkipAuth(config)) {
      const token = store.getState().auth.accessToken;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { accessToken } = await refreshAccessToken();
        store.dispatch(setAccessToken(accessToken));

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (err) {
        store.dispatch(clearAuth());
        processQueue(err, null);
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
