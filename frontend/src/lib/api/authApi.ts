import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
  deviceName?: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    settings: {
      preferredLLMProvider: string;
      preferredModel: string;
      theme: string;
      language: string;
      notifications: {
        email: boolean;
        push: boolean;
      };
    };
    lastLogin: string;
    createdAt: string;
  };
  accessToken: string;
  refreshToken: string;
  deviceId: string;
}

/**
 * Logowanie użytkownika
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const deviceId = localStorage.getItem('deviceId');
  const response = await api.post('/auth/login', {
    ...credentials,
    deviceId,
  });
  
  if (response.data.success) {
    const { user, accessToken, refreshToken, deviceId } = response.data.data;
    
    // Zapisanie tokenów i deviceId
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('deviceId', deviceId);
    
    return response.data.data;
  }
  
  throw new Error(response.data.error?.message || 'Błąd logowania');
};

/**
 * Rejestracja użytkownika
 */
export const register = async (credentials: RegisterCredentials): Promise<any> => {
  const response = await api.post('/auth/register', credentials);
  
  if (response.data.success) {
    return response.data.data;
  }
  
  throw new Error(response.data.error?.message || 'Błąd rejestracji');
};

/**
 * Wylogowanie użytkownika
 */
export const logout = async (): Promise<void> => {
  const deviceId = localStorage.getItem('deviceId');
  
  try {
    await api.post('/auth/logout', { deviceId });
  } catch (error) {
    console.error('Błąd wylogowania:', error);
  } finally {
    // Usunięcie tokenów i deviceId niezależnie od wyniku żądania
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('deviceId');
  }
};

/**
 * Wylogowanie użytkownika ze wszystkich urządzeń
 */
export const logoutAll = async (): Promise<void> => {
  try {
    await api.post('/auth/logout-all');
  } catch (error) {
    console.error('Błąd wylogowania ze wszystkich urządzeń:', error);
  } finally {
    // Usunięcie tokenów i deviceId niezależnie od wyniku żądania
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('deviceId');
  }
};

/**
 * Sprawdzenie, czy użytkownik jest zalogowany
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};
