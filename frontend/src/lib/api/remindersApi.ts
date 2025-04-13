import api from './api';

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  taskReminders: boolean;
  sessionReminders: boolean;
  deadlineReminders: boolean;
}

/**
 * Pobieranie ustawień powiadomień użytkownika
 */
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await api.get('/reminders/settings');
  
  if (response.data.success) {
    return response.data.data;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania ustawień powiadomień');
};

/**
 * Aktualizacja ustawień powiadomień użytkownika
 */
export const updateNotificationSettings = async (settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
  const response = await api.put('/reminders/settings', settings);
  
  if (response.data.success) {
    return response.data.data;
  }
  
  throw new Error(response.data.error?.message || 'Błąd aktualizacji ustawień powiadomień');
};

/**
 * Ręczne wysłanie przypomnienia o zadaniu
 */
export const sendTaskReminder = async (taskId: string, reminderId: string): Promise<void> => {
  const response = await api.post(`/reminders/tasks/${taskId}/${reminderId}`);
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd wysyłania przypomnienia o zadaniu');
  }
};

/**
 * Ręczne wysłanie przypomnienia o sesji
 */
export const sendSessionReminder = async (sessionId: string): Promise<void> => {
  const response = await api.post(`/reminders/sessions/${sessionId}`);
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd wysyłania przypomnienia o sesji');
  }
};

/**
 * Ręczne wysłanie przypomnienia o zbliżającym się terminie zadania
 */
export const sendDeadlineReminder = async (taskId: string): Promise<void> => {
  const response = await api.post(`/reminders/deadlines/${taskId}`);
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd wysyłania przypomnienia o zbliżającym się terminie zadania');
  }
};
