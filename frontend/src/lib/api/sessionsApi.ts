import api from './api';

export interface Session {
  _id: string;
  profile: string;
  profileName?: string;
  startTime: string;
  endTime?: string;
  therapyMethod: string;
  sessionNumber: number;
  continuityStatus: 'new' | 'continued' | 'resumed_after_break';
  conversation: SessionMessage[];
  summary?: {
    mainTopics: string[];
    keyInsights: string;
    progress: string;
    homework: string;
  };
  metrics?: {
    emotionalStateStart?: {
      anxiety: number;
      depression: number;
      optimism: number;
    };
    emotionalStateEnd?: {
      anxiety: number;
      depression: number;
      optimism: number;
    };
    sessionEffectivenessRating?: number;
  };
  tasks: string[];
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionData {
  profileId: string;
  therapyMethod?: string;
  emotionalStateStart?: {
    anxiety: number;
    depression: number;
    optimism: number;
  };
}

export interface EndSessionData {
  summary?: string;
  emotionalStateEnd?: {
    anxiety: number;
    depression: number;
    optimism: number;
  };
  sessionEffectivenessRating?: number;
}

export interface SessionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

/**
 * Pobieranie wszystkich sesji dla profilu
 */
export const getSessionsByProfile = async (profileId: string): Promise<Session[]> => {
  const response = await api.get(`/profiles/${profileId}/sessions`);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd pobierania sesji');
};

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
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd pobierania sesji');
};

/**
 * Pobieranie szczegółów sesji
 */
export const getSession = async (sessionId: string): Promise<Session> => {
  const response = await api.get(`/sessions/${sessionId}`);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd pobierania sesji');
};

/**
 * Tworzenie nowej sesji
 */
export const createSession = async (sessionData: CreateSessionData): Promise<Session> => {
  const response = await api.post('/sessions', sessionData);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd tworzenia sesji');
};

/**
 * Aktualizacja sesji
 */
export const updateSession = async (sessionId: string, sessionData: any): Promise<Session> => {
  const response = await api.put(`/sessions/${sessionId}`, sessionData);

  if (response.data.success) {
    return response.data.data;
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
 * Dodawanie wiadomości do sesji
 */
export const addMessage = async (sessionId: string, message: { role: string, content: string }): Promise<SessionMessage> => {
  const response = await api.post(`/sessions/${sessionId}/messages`, message);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd dodawania wiadomości');
};

/**
 * Wysyłanie wiadomości użytkownika w sesji
 */
export const sendSessionMessage = async (sessionId: string, message: string): Promise<SessionMessage> => {
  return addMessage(sessionId, { role: 'user', content: message });
};

/**
 * Zakończenie sesji
 */
export const endSession = async (sessionId: string, sessionData?: EndSessionData): Promise<Session> => {
  const response = await api.put(`/sessions/${sessionId}/end`, sessionData || {});

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd zakończenia sesji');
};

/**
 * Pobieranie zadań dla sesji
 */
export const getSessionTasks = async (sessionId: string): Promise<any[]> => {
  const response = await api.get(`/sessions/${sessionId}/tasks`);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd pobierania zadań sesji');
};

/**
 * Dodawanie zadania do sesji
 */
export const addTask = async (sessionId: string, taskData: { title: string, description: string, deadline?: string }): Promise<any> => {
  const response = await api.post(`/sessions/${sessionId}/tasks`, taskData);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd dodawania zadania');
};

/**
 * Eksportowanie sesji
 */
export const exportSession = async (sessionId: string): Promise<any> => {
  const response = await api.get(`/sessions/${sessionId}/export`);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd eksportowania sesji');
};
