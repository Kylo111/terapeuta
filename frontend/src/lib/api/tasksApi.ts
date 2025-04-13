import api from './api';

export interface Task {
  _id: string;
  profileId: string;
  profileName: string;
  sessionId: string;
  sessionDate: string;
  title: string;
  description: string;
  instructions?: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed';
  createdAt: string;
  completedAt?: string;
  feedback?: string;
  reflection?: string;
  attachments?: {
    name: string;
    url: string;
    uploadedAt: string;
  }[];
}

export interface CreateTaskData {
  profileId: string;
  sessionId?: string;
  title: string;
  description: string;
  instructions?: string;
  dueDate: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  instructions?: string;
  dueDate?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
  reflection?: string;
  feedback?: string;
}

/**
 * Pobieranie wszystkich zadań
 */
export const getTasks = async (filters?: { profileId?: string; status?: string }): Promise<Task[]> => {
  let url = '/tasks';
  const queryParams = [];
  
  if (filters?.profileId) {
    queryParams.push(`profileId=${filters.profileId}`);
  }
  
  if (filters?.status) {
    queryParams.push(`status=${filters.status}`);
  }
  
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }
  
  const response = await api.get(url);
  
  if (response.data.success) {
    return response.data.data.tasks;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania zadań');
};

/**
 * Pobieranie szczegółów zadania
 */
export const getTask = async (taskId: string): Promise<Task> => {
  const response = await api.get(`/tasks/${taskId}`);
  
  if (response.data.success) {
    return response.data.data.task;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania zadania');
};

/**
 * Tworzenie nowego zadania
 */
export const createTask = async (taskData: CreateTaskData): Promise<Task> => {
  const response = await api.post('/tasks', taskData);
  
  if (response.data.success) {
    return response.data.data.task;
  }
  
  throw new Error(response.data.error?.message || 'Błąd tworzenia zadania');
};

/**
 * Aktualizacja zadania
 */
export const updateTask = async (taskId: string, taskData: UpdateTaskData): Promise<Task> => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  
  if (response.data.success) {
    return response.data.data.task;
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
export const completeTask = async (taskId: string, reflection?: string): Promise<Task> => {
  const response = await api.post(`/tasks/${taskId}/complete`, { reflection });
  
  if (response.data.success) {
    return response.data.data.task;
  }
  
  throw new Error(response.data.error?.message || 'Błąd oznaczania zadania jako ukończone');
};

/**
 * Dodawanie załącznika do zadania
 */
export const addTaskAttachment = async (taskId: string, file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  if (response.data.success) {
    return response.data.data.attachment;
  }
  
  throw new Error(response.data.error?.message || 'Błąd dodawania załącznika');
};

/**
 * Usuwanie załącznika z zadania
 */
export const removeTaskAttachment = async (taskId: string, attachmentId: string): Promise<void> => {
  const response = await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd usuwania załącznika');
  }
};

/**
 * Dodawanie informacji zwrotnej do zadania
 */
export const addTaskFeedback = async (taskId: string, feedback: string): Promise<Task> => {
  const response = await api.post(`/tasks/${taskId}/feedback`, { feedback });
  
  if (response.data.success) {
    return response.data.data.task;
  }
  
  throw new Error(response.data.error?.message || 'Błąd dodawania informacji zwrotnej');
};
