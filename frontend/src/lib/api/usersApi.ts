import api from './api';

export interface User {
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
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateSettingsData {
  preferredLLMProvider?: string;
  preferredModel?: string;
  theme?: string;
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
  };
}

/**
 * Pobieranie danych zalogowanego użytkownika
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/users/me');
  
  if (response.data.success) {
    return response.data.data.user;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania danych użytkownika');
};

/**
 * Aktualizacja danych użytkownika
 */
export const updateUser = async (userData: UpdateUserData): Promise<User> => {
  const response = await api.put('/users/me', userData);
  
  if (response.data.success) {
    return response.data.data.user;
  }
  
  throw new Error(response.data.error?.message || 'Błąd aktualizacji danych użytkownika');
};

/**
 * Zmiana hasła użytkownika
 */
export const changePassword = async (passwordData: UpdatePasswordData): Promise<void> => {
  const response = await api.put('/users/me/password', passwordData);
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd zmiany hasła');
  }
};

/**
 * Pobieranie ustawień użytkownika
 */
export const getUserSettings = async (): Promise<User['settings']> => {
  const response = await api.get('/users/me/settings');
  
  if (response.data.success) {
    return response.data.data.settings;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania ustawień użytkownika');
};

/**
 * Aktualizacja ustawień użytkownika
 */
export const updateUserSettings = async (settingsData: UpdateSettingsData): Promise<User['settings']> => {
  const response = await api.put('/users/me/settings', settingsData);
  
  if (response.data.success) {
    return response.data.data.settings;
  }
  
  throw new Error(response.data.error?.message || 'Błąd aktualizacji ustawień użytkownika');
};

/**
 * Usuwanie konta użytkownika
 */
export const deleteAccount = async (password: string): Promise<void> => {
  const response = await api.delete('/users/me', { data: { password } });
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd usuwania konta');
  }
};

/**
 * Pobieranie urządzeń użytkownika
 */
export const getUserDevices = async (): Promise<any[]> => {
  const response = await api.get('/users/me/devices');
  
  if (response.data.success) {
    return response.data.data.devices;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania urządzeń użytkownika');
};

/**
 * Usuwanie urządzenia użytkownika
 */
export const removeUserDevice = async (deviceId: string): Promise<void> => {
  const response = await api.delete(`/users/me/devices/${deviceId}`);
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd usuwania urządzenia');
  }
};

/**
 * Wysyłanie linku do resetowania hasła
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  const response = await api.post('/auth/forgot-password', { email });
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd wysyłania linku do resetowania hasła');
  }
};

/**
 * Resetowanie hasła
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const response = await api.post('/auth/reset-password', { token, newPassword });
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd resetowania hasła');
  }
};
