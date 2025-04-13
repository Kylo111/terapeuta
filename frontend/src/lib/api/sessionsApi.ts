import api from './api';

export interface Session {
  _id: string;
  profileId: string;
  profileName: string;
  date: string;
  therapyMethod: string;
  duration: number;
  status: 'in_progress' | 'completed';
  summary?: string;
  notes?: string;
  mood?: {
    before: number;
    after: number;
  };
  topics?: string[];
  techniques?: string[];
  transcript?: {
    role: 'system' | 'assistant' | 'user';
    content: string;
  }[];
  tasks?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionData {
  profileId: string;
  therapyMethod: string;
  initialMessage?: string;
  mood?: number;
}

export interface UpdateSessionData {
  summary?: string;
  notes?: string;
  mood?: {
    before?: number;
    after?: number;
  };
  topics?: string[];
  techniques?: string[];
  status?: 'in_progress' | 'completed';
}

export interface SessionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Pobieranie wszystkich sesji
 */
export const getSessions = async (filters?: { profileId?: string }): Promise<Session[]> => {
  let url = '/sessions';
  
  if (filters?.profileId) {
    url += `?profileId=${filters.profileId}`;
  }
  
  const response = await api.get(url);
  
  if (response.data.success) {
    return response.data.data.sessions;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania sesji');
};

/**
 * Pobieranie szczegółów sesji
 */
export const getSession = async (sessionId: string): Promise<Session> => {
  const response = await api.get(`/sessions/${sessionId}`);
  
  if (response.data.success) {
    return response.data.data.session;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania sesji');
};

/**
 * Tworzenie nowej sesji
 */
export const createSession = async (sessionData: CreateSessionData): Promise<Session> => {
  const response = await api.post('/sessions', sessionData);
  
  if (response.data.success) {
    return response.data.data.session;
  }
  
  throw new Error(response.data.error?.message || 'Błąd tworzenia sesji');
};

/**
 * Aktualizacja sesji
 */
export const updateSession = async (sessionId: string, sessionData: UpdateSessionData): Promise<Session> => {
  const response = await api.put(`/sessions/${sessionId}`, sessionData);
  
  if (response.data.success) {
    return response.data.data.session;
  }
  
  throw new Error(response.data.error?.message || 'Błąd aktualizacji sesji');
};

/**
 * Usuwanie sesji
 */
export const deleteSession = async (sessionId: string): Promise<void> => {
  const response = await api.delete(`/sessions/${sessionId}`);
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd usuwania sesji');
  }
};

/**
 * Pobieranie transkrypcji sesji
 */
export const getSessionTranscript = async (sessionId: string): Promise<SessionMessage[]> => {
  const response = await api.get(`/sessions/${sessionId}/transcript`);
  
  if (response.data.success) {
    return response.data.data.transcript;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania transkrypcji sesji');
};

/**
 * Wysyłanie wiadomości w sesji
 */
export const sendSessionMessage = async (sessionId: string, message: string): Promise<SessionMessage> => {
  const response = await api.post(`/sessions/${sessionId}/messages`, { content: message });
  
  if (response.data.success) {
    return response.data.data.message;
  }
  
  throw new Error(response.data.error?.message || 'Błąd wysyłania wiadomości');
};

/**
 * Zakończenie sesji
 */
export const endSession = async (sessionId: string, sessionData?: UpdateSessionData): Promise<Session> => {
  const response = await api.post(`/sessions/${sessionId}/end`, sessionData || {});
  
  if (response.data.success) {
    return response.data.data.session;
  }
  
  throw new Error(response.data.error?.message || 'Błąd zakończenia sesji');
};

/**
 * Pobieranie zadań dla sesji
 */
export const getSessionTasks = async (sessionId: string): Promise<any[]> => {
  const response = await api.get(`/sessions/${sessionId}/tasks`);
  
  if (response.data.success) {
    return response.data.data.tasks;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania zadań sesji');
};
