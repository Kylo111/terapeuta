import api from './api';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'session' | 'task' | 'reminder' | 'system' | 'other';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  isSent: boolean;
  sentAt?: string;
  readAt?: string;
  scheduledFor?: string;
  action?: string;
  relatedId?: string;
  relatedType?: 'session' | 'task' | 'profile' | 'exercise' | 'journal' | 'other';
  channels: {
    app: boolean;
    email: boolean;
    push: boolean;
  };
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationInput {
  title: string;
  message: string;
  type?: 'session' | 'task' | 'reminder' | 'system' | 'other';
  priority?: 'low' | 'medium' | 'high';
  scheduledFor?: string;
  action?: string;
  relatedId?: string;
  relatedType?: 'session' | 'task' | 'profile' | 'exercise' | 'journal' | 'other';
  channels?: {
    app?: boolean;
    email?: boolean;
    push?: boolean;
  };
  metadata?: any;
}

export interface ReminderInput {
  title: string;
  message: string;
  scheduledFor: string;
  action?: string;
  relatedId?: string;
  relatedType?: 'session' | 'task' | 'profile' | 'exercise' | 'journal' | 'other';
}

export interface NotificationFilterOptions {
  isRead?: boolean;
  type?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedNotifications {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Pobiera powiadomienia użytkownika
 * @param options Opcje filtrowania
 */
export const getNotifications = async (options: NotificationFilterOptions = {}): Promise<PaginatedNotifications> => {
  const response = await api.get('/notifications', { params: options });
  
  if (response.data.success) {
    return response.data.data;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania powiadomień');
};

/**
 * Pobiera liczbę nieprzeczytanych powiadomień użytkownika
 */
export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get('/notifications/unread');
  
  if (response.data.success) {
    return response.data.data.count;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania liczby nieprzeczytanych powiadomień');
};

/**
 * Tworzy nowe powiadomienie
 * @param notificationData Dane powiadomienia
 */
export const createNotification = async (notificationData: NotificationInput): Promise<Notification> => {
  const response = await api.post('/notifications', notificationData);
  
  if (response.data.success) {
    return response.data.data.notification;
  }
  
  throw new Error(response.data.error?.message || 'Błąd tworzenia powiadomienia');
};

/**
 * Oznacza powiadomienie jako przeczytane
 * @param id ID powiadomienia
 */
export const markAsRead = async (id: string): Promise<Notification> => {
  const response = await api.put(`/notifications/${id}/read`);
  
  if (response.data.success) {
    return response.data.data.notification;
  }
  
  throw new Error(response.data.error?.message || 'Błąd oznaczania powiadomienia jako przeczytane');
};

/**
 * Oznacza wszystkie powiadomienia użytkownika jako przeczytane
 */
export const markAllAsRead = async (): Promise<number> => {
  const response = await api.put('/notifications/read-all');
  
  if (response.data.success) {
    return response.data.data.count;
  }
  
  throw new Error(response.data.error?.message || 'Błąd oznaczania wszystkich powiadomień jako przeczytane');
};

/**
 * Usuwa powiadomienie
 * @param id ID powiadomienia
 */
export const deleteNotification = async (id: string): Promise<void> => {
  const response = await api.delete(`/notifications/${id}`);
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd usuwania powiadomienia');
  }
};

/**
 * Usuwa wszystkie powiadomienia użytkownika
 */
export const deleteAllNotifications = async (): Promise<number> => {
  const response = await api.delete('/notifications');
  
  if (response.data.success) {
    return response.data.data.count;
  }
  
  throw new Error(response.data.error?.message || 'Błąd usuwania wszystkich powiadomień');
};

/**
 * Tworzy przypomnienie
 * @param reminderData Dane przypomnienia
 */
export const createReminder = async (reminderData: ReminderInput): Promise<Notification> => {
  const response = await api.post('/notifications/reminder', reminderData);
  
  if (response.data.success) {
    return response.data.data.reminder;
  }
  
  throw new Error(response.data.error?.message || 'Błąd tworzenia przypomnienia');
};
