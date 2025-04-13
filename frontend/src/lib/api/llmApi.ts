import api from './api';

export interface LLMProvider {
  id: string;
  name: string;
  description: string;
  models: LLMModel[];
  isAvailable: boolean;
}

export interface LLMModel {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  isAvailable: boolean;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMCompletionRequest {
  provider: string;
  model: string;
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMCompletionResponse {
  id: string;
  message: LLMMessage;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Pobieranie dostępnych dostawców LLM
 */
export const getLLMProviders = async (): Promise<LLMProvider[]> => {
  const response = await api.get('/llm/providers');
  
  if (response.data.success) {
    return response.data.data.providers;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania dostawców LLM');
};

/**
 * Pobieranie dostępnych modeli dla danego dostawcy LLM
 */
export const getLLMModels = async (providerId: string): Promise<LLMModel[]> => {
  const response = await api.get(`/llm/providers/${providerId}/models`);
  
  if (response.data.success) {
    return response.data.data.models;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania modeli LLM');
};

/**
 * Generowanie odpowiedzi LLM
 */
export const generateLLMCompletion = async (request: LLMCompletionRequest): Promise<LLMCompletionResponse> => {
  const response = await api.post('/llm/completions', request);
  
  if (response.data.success) {
    return response.data.data;
  }
  
  throw new Error(response.data.error?.message || 'Błąd generowania odpowiedzi LLM');
};

/**
 * Generowanie odpowiedzi LLM w trybie strumieniowym
 */
export const generateLLMCompletionStream = async (
  request: LLMCompletionRequest,
  onChunk: (chunk: string) => void,
  onComplete: (response: LLMCompletionResponse) => void,
  onError: (error: Error) => void
): Promise<void> => {
  try {
    const response = await api.post('/llm/completions/stream', request, {
      responseType: 'stream',
      onDownloadProgress: (progressEvent) => {
        const chunk = progressEvent.event.target.response;
        if (chunk) {
          onChunk(chunk);
        }
      },
    });
    
    if (response.data.success) {
      onComplete(response.data.data);
    } else {
      onError(new Error(response.data.error?.message || 'Błąd generowania odpowiedzi LLM'));
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Nieznany błąd'));
  }
};

/**
 * Pobieranie historii użycia LLM
 */
export const getLLMUsageHistory = async (): Promise<any> => {
  const response = await api.get('/llm/usage');
  
  if (response.data.success) {
    return response.data.data.usage;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania historii użycia LLM');
};

/**
 * Pobieranie limitów użycia LLM
 */
export const getLLMUsageLimits = async (): Promise<any> => {
  const response = await api.get('/llm/usage/limits');
  
  if (response.data.success) {
    return response.data.data.limits;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania limitów użycia LLM');
};
