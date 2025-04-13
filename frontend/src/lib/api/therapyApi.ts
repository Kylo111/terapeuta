import api from './api';

export interface TherapyMethod {
  _id: string;
  name: string;
  key: string;
  description: string;
  principles: string[];
  techniques: TherapyTechnique[];
  suitableFor: string[];
  contraindications: string[];
  prompts: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TherapyTechnique {
  name: string;
  description: string;
  applicationAreas: string[];
}

export interface TherapyPrompt {
  _id: string;
  title: string;
  therapyMethod: string;
  content: string;
  purpose: string;
  variables: PromptVariable[];
  tags: string[];
  version: number;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  effectivenessRating?: number;
  feedback: PromptFeedback[];
}

export interface PromptVariable {
  name: string;
  description?: string;
  defaultValue?: string;
}

export interface PromptFeedback {
  user?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface PromptType {
  value: string;
  label: string;
  description: string;
}

/**
 * Pobieranie listy dostępnych metod terapii
 */
export const getTherapyMethods = async (): Promise<TherapyMethod[]> => {
  const response = await api.get('/therapy-methods');

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd pobierania metod terapii');
};

/**
 * Pobieranie szczegółów określonej metody terapii
 */
export const getTherapyMethod = async (methodId: string): Promise<TherapyMethod> => {
  const response = await api.get(`/therapy-methods/${methodId}`);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd pobierania metody terapii');
};

/**
 * Pobieranie technik dla danej metody terapii
 */
export const getTherapyTechniques = async (methodId: string): Promise<TherapyTechnique[]> => {
  const response = await api.get(`/therapy-methods/${methodId}/techniques`);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd pobierania technik terapii');
};

/**
 * Pobieranie promptów dla danej metody terapii
 */
export const getTherapyPrompts = async (methodId: string): Promise<TherapyPrompt[]> => {
  const response = await api.get(`/prompts?therapyMethod=${methodId}`);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd pobierania promptów');
};

/**
 * Pobieranie określonego promptu
 */
export const getPrompt = async (promptId: string): Promise<TherapyPrompt> => {
  const response = await api.get(`/prompts/${promptId}`);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd pobierania promptu');
};

/**
 * Tworzenie nowego promptu
 */
export const createPrompt = async (prompt: Partial<TherapyPrompt>): Promise<TherapyPrompt> => {
  const response = await api.post('/prompts', prompt);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd tworzenia promptu');
};

/**
 * Aktualizacja promptu
 */
export const updatePrompt = async (promptId: string, prompt: Partial<TherapyPrompt>): Promise<TherapyPrompt> => {
  const response = await api.put(`/prompts/${promptId}`, prompt);

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd aktualizacji promptu');
};

/**
 * Usuwanie promptu
 */
export const deletePrompt = async (promptId: string): Promise<void> => {
  const response = await api.delete(`/prompts/${promptId}`);

  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd usuwania promptu');
  }
};

/**
 * Dodawanie oceny skuteczności promptu
 */
export const addPromptEffectivenessRating = async (promptId: string, rating: number): Promise<TherapyPrompt> => {
  const response = await api.post(`/prompts/${promptId}/effectiveness`, { rating });

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd dodawania oceny skuteczności');
};

/**
 * Dodawanie opinii o promptcie
 */
export const addPromptFeedback = async (promptId: string, rating: number, comment?: string): Promise<TherapyPrompt> => {
  const response = await api.post(`/prompts/${promptId}/feedback`, { rating, comment });

  if (response.data.success) {
    return response.data.data;
  }

  throw new Error(response.data.error?.message || 'Błąd dodawania opinii');
};

/**
 * Renderowanie promptu z podstawionymi zmiennymi
 */
export const renderPrompt = async (promptId: string, variables: Record<string, string>): Promise<string> => {
  const response = await api.post(`/prompts/${promptId}/render`, { variables });

  if (response.data.success) {
    return response.data.data.content;
  }

  throw new Error(response.data.error?.message || 'Błąd renderowania promptu');
};

/**
 * Pobieranie listy wszystkich typów promptów
 */
export const getPromptTypes = async (): Promise<PromptType[]> => {
  return [
    { value: 'session_start', label: 'Rozpoczęcie sesji', description: 'Prompt używany na początku sesji terapeutycznej' },
    { value: 'session_end', label: 'Zakończenie sesji', description: 'Prompt używany na końcu sesji terapeutycznej' },
    { value: 'goal_setting', label: 'Ustalanie celów', description: 'Prompt używany do ustalania celów terapeutycznych' },
    { value: 'challenge_identification', label: 'Identyfikacja wyzwań', description: 'Prompt używany do identyfikacji wyzwań' },
    { value: 'technique_application', label: 'Zastosowanie techniki', description: 'Prompt używany do zastosowania techniki terapeutycznej' },
    { value: 'homework', label: 'Zadanie domowe', description: 'Prompt używany do zadawania zadań domowych' },
    { value: 'reflection', label: 'Refleksja', description: 'Prompt używany do refleksji nad procesem terapeutycznym' },
    { value: 'crisis_intervention', label: 'Interwencja kryzysowa', description: 'Prompt używany w sytuacjach kryzysowych' },
    { value: 'progress_evaluation', label: 'Ocena postępów', description: 'Prompt używany do oceny postępów terapeutycznych' },
    { value: 'custom', label: 'Niestandardowy', description: 'Niestandardowy prompt' }
  ];
};
