import api from './api';

export interface Task {
  _id: string;
  profile: string;
  profileName: string;
  session?: string;
  sessionDate?: string;
  description: string;
  category: 'technika_terapeutyczna' | 'cwiczenie' | 'refleksja' | 'inne';
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'incomplete';
  createdAt: string;
  completionData?: {
    completionDate?: string;
    successRating?: number;
    challenges?: string;
    reflections?: string;
    emotionalResponse?: string;
  };
  discussedInSession?: boolean;
  reminders?: {
    _id: string;
    time: string;
    message: string;
    isSent: boolean;
  }[];
}

export interface CreateTaskData {
  profile: string;
  session?: string;
  description: string;
  category?: 'technika_terapeutyczna' | 'cwiczenie' | 'refleksja' | 'inne';
  deadline: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateTaskData {
  description?: string;
  category?: 'technika_terapeutyczna' | 'cwiczenie' | 'refleksja' | 'inne';
  deadline?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'completed' | 'incomplete';
}

/**
 * Pobieranie wszystkich zadań
 */
export const getTasks = async (filters?: { profileId?: string; status?: string; category?: string; priority?: string; sort?: string; order?: 'asc' | 'desc'; limit?: number; skip?: number }): Promise<{ tasks: Task[]; total: number; limit: number; skip: number }> => {
  let url = '/tasks';
  const queryParams = [];

  if (filters?.profileId) {
    queryParams.push(`profileId=${filters.profileId}`);
  }

  if (filters?.status) {
    queryParams.push(`status=${filters.status}`);
  }

  if (filters?.category) {
    queryParams.push(`category=${filters.category}`);
  }

  if (filters?.priority) {
    queryParams.push(`priority=${filters.priority}`);
  }

  if (filters?.sort) {
    queryParams.push(`sort=${filters.sort}`);
  }

  if (filters?.order) {
    queryParams.push(`order=${filters.order}`);
  }

  if (filters?.limit) {
    queryParams.push(`limit=${filters.limit}`);
  }

  if (filters?.skip) {
    queryParams.push(`skip=${filters.skip}`);
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }

  const response = await api.get(url);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd pobierania zadań');
};

/**
 * Pobieranie szczegółów zadania
 */
export const getTask = async (taskId: string): Promise<Task> => {
  const response = await api.get(`/tasks/${taskId}`);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd pobierania zadania');
};

/**
 * Tworzenie nowego zadania
 */
export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  const response = await api.post('/tasks', taskData);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd tworzenia zadania');
};

/**
 * Aktualizacja zadania
 */
export const updateTask = async (taskId: string, taskData: UpdateTaskData): Promise<Task> => {
  const response = await api.put(`/tasks/${taskId}`, taskData);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd aktualizacji zadania');
};

/**
 * Usuwanie zadania
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  const response = await api.delete(`/tasks/${taskId}`);

  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd usuwania zadania');
  }
};

/**
 * Oznaczanie zadania jako ukończone
 */
export const completeTask = async (taskId: string, completionData?: { successRating?: number; challenges?: string; reflections?: string; emotionalResponse?: string }): Promise<Task> => {
  const response = await api.post(`/tasks/${taskId}/complete`, completionData);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd oznaczania zadania jako ukończone');
};

/**
 * Oznaczanie zadania jako nieukończone
 */
export const incompleteTask = async (taskId: string, reason?: string): Promise<Task> => {
  const response = await api.post(`/tasks/${taskId}/incomplete`, { reason });

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd oznaczania zadania jako nieukończone');
};

/**
 * Dodawanie przypomnienia do zadania
 */
export const addReminder = async (taskId: string, reminderData: { time: string; message: string }): Promise<Task> => {
  const response = await api.post(`/tasks/${taskId}/reminders`, reminderData);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd dodawania przypomnienia');
};

/**
 * Aktualizacja przypomnienia w zadaniu
 */
export const updateReminder = async (taskId: string, reminderId: string, reminderData: { time?: string; message?: string }): Promise<Task> => {
  const response = await api.put(`/tasks/${taskId}/reminders/${reminderId}`, reminderData);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd aktualizacji przypomnienia');
};

/**
 * Usuwanie przypomnienia z zadania
 */
export const deleteReminder = async (taskId: string, reminderId: string): Promise<Task> => {
  const response = await api.delete(`/tasks/${taskId}/reminders/${reminderId}`);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd usuwania przypomnienia');
};

/**
 * Pobieranie statystyk zadań
 */
export const getTaskStats = async (profileId?: string): Promise<{ total: number; completed: number; incomplete: number; pending: number; completionRate: number; byCategory: Record<string, number>; byPriority: Record<string, number> }> => {
  let url = '/tasks/stats';

  if (profileId) {
    url += `?profileId=${profileId}`;
  }

  const response = await api.get(url);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd pobierania statystyk zadań');
};
