import apiClient from '@/lib/api';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string | null;
  };
}

export type AuthTypeResponse = 'login' | 'register';

const endpoint = {
  register: '/auth/register',
  verifyOtp: '/auth/register/verify-otp',
  login: '/auth/login',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
};

export const checkAuthMode = async (
  data: Pick<AuthCredentials, 'email'>
): Promise<AuthTypeResponse | null> => {
  try {
    const response = await apiClient.post('/auth/check-type', data);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    return null;
  }
};

export const register = async (data: AuthCredentials) => {
  try {
    const response = await apiClient.post(endpoint.register, data);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(err.response.data.message);
  }
};

export const verifyRegisterOtp = async (data: {
  email: string;
  otp: number;
}): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post(endpoint.verifyOtp, data);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(err.response.data.message);
  }
};

export const login = async (data: AuthCredentials): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post(endpoint.login, data);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.delete(endpoint.logout);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(err.response?.data?.message || 'Logout failed');
  }
};

export const refreshAccessToken = async (): Promise<{
  accessToken: string;
}> => {
  try {
    const response = await apiClient.post(endpoint.refresh);
    return response.data;
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error(err.response?.data?.message || 'Token refresh failed');
  }
};
