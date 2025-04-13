import api from './api';

export interface TherapyMethod {
  methodName: string;
  displayName: string;
  description: string;
}

export interface TherapyTechnique {
  name: string;
  description: string;
  steps: string[];
}

export interface TherapyPrompt {
  type: string;
  content: string;
  displayName: string;
  description: string;
}

export interface PromptType {
  type: string;
  displayName: string;
  description: string;
}

/**
 * Pobieranie listy dostępnych metod terapii
 */
export const getTherapyMethods = async (): Promise<TherapyMethod[]> => {
  const response = await api.get('/therapy/methods');
  
  if (response.data.success) {
    return response.data.data.methods;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania metod terapii');
};

/**
 * Pobieranie szczegółów określonej metody terapii
 */
export const getTherapyMethod = async (methodName: string): Promise<TherapyMethod> => {
  const response = await api.get(`/therapy/methods/${methodName}`);
  
  if (response.data.success) {
    return response.data.data.method;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania metody terapii');
};

/**
 * Pobieranie technik dla danej metody terapii
 */
export const getTherapyTechniques = async (methodName: string): Promise<TherapyTechnique[]> => {
  const response = await api.get(`/therapy/methods/${methodName}/techniques`);
  
  if (response.data.success) {
    return response.data.data.techniques;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania technik terapii');
};

/**
 * Pobieranie przykładowych zadań dla danej metody terapii
 */
export const getTherapySampleTasks = async (methodName: string, profileId?: string): Promise<any[]> => {
  const url = profileId
    ? `/therapy/methods/${methodName}/tasks?profileId=${profileId}`
    : `/therapy/methods/${methodName}/tasks`;
  
  const response = await api.get(url);
  
  if (response.data.success) {
    return response.data.data.tasks;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania przykładowych zadań');
};

/**
 * Pobieranie promptów dla danej metody terapii
 */
export const getTherapyPrompts = async (methodName: string): Promise<Record<string, TherapyPrompt>> => {
  const response = await api.get(`/therapy/methods/${methodName}/prompts`);
  
  if (response.data.success) {
    return response.data.data.prompts;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania promptów');
};

/**
 * Pobieranie określonego promptu dla danej metody terapii
 */
export const getTherapyPrompt = async (methodName: string, promptType: string): Promise<TherapyPrompt> => {
  const response = await api.get(`/therapy/methods/${methodName}/prompts/${promptType}`);
  
  if (response.data.success) {
    return response.data.data.prompt;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania promptu');
};

/**
 * Aktualizacja określonego promptu dla danej metody terapii
 */
export const updateTherapyPrompt = async (methodName: string, promptType: string, content: string): Promise<void> => {
  const response = await api.put(`/therapy/methods/${methodName}/prompts/${promptType}`, { content });
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd aktualizacji promptu');
  }
};

/**
 * Resetowanie określonego promptu do wartości domyślnej
 */
export const resetTherapyPrompt = async (methodName: string, promptType: string): Promise<void> => {
  const response = await api.post(`/therapy/methods/${methodName}/prompts/${promptType}/reset`);
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd resetowania promptu');
  }
};

/**
 * Pobieranie listy wszystkich typów promptów
 */
export const getPromptTypes = async (): Promise<PromptType[]> => {
  const response = await api.get('/therapy/prompt-types');
  
  if (response.data.success) {
    return response.data.data.promptTypes;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania typów promptów');
};
