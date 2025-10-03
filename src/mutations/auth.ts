import apiClient from '@/lib/api';

export interface AuthCredentials {
  email: string;
  password: string;
}

const endpoint = {
  register: '/auth/register',
  login: '/auth/login',
};

/**
 * Attempts to register first; if the account already exists, falls back to login.
 * Returns whatever the backend responds with (e.g., user, tokens, etc.).
 */
export const registerOrLogin = async (data: AuthCredentials) => {
  try {
    const registerResponse = await apiClient.post(endpoint.register, data);
    return registerResponse.data;
  } catch (err: any) {
    const status = err?.response?.status;
    // If the backend indicates the user already exists, try to login
    if (status === 409 || status === 400) {
      const code = err?.response?.data?.code || err?.response?.data?.error;
      const message: string = (err?.response?.data?.message || '')
        .toString()
        .toLowerCase();
      const alreadyExists =
        code === 'User already exists' ||
        message.includes('already') ||
        message.includes('exists');
      if (alreadyExists) {
        const loginResponse = await apiClient.post(endpoint.login, data);
        return loginResponse.data;
      }
    }
    // Otherwise rethrow the original error
    throw err;
  }
};

type AuthTypeResponse = 'login' | 'register';

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
