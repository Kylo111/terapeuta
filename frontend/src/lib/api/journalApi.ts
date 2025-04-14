import api from './api';

export interface Emotion {
  name: string;
  intensity: number;
}

export interface JournalEntry {
  _id: string;
  user: string;
  profile: string;
  profileName?: string;
  date: string;
  situation: string;
  automaticThoughts: string[];
  emotions: Emotion[];
  physicalReactions?: string[];
  cognitiveDistortions?: string[];
  alternativeThoughts?: string[];
  emotionsAfter?: Emotion[];
  conclusions?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntryInput {
  profile: string;
  date?: string;
  situation: string;
  automaticThoughts: string[];
  emotions: Emotion[];
  physicalReactions?: string[];
  cognitiveDistortions?: string[];
  alternativeThoughts?: string[];
  emotionsAfter?: Emotion[];
  conclusions?: string;
  tags?: string[];
}

export interface JournalStats {
  totalEntries: number;
  emotionsStats: {
    [emotion: string]: {
      count: number;
      totalIntensity: number;
      averageIntensity: number;
    };
  };
  distortionsStats: {
    [distortion: string]: number;
  };
  emotionalProgress: {
    date: string;
    emotions: {
      [emotion: string]: number;
    };
  }[];
  commonTags: {
    tag: string;
    count: number;
  }[];
}

export interface JournalFilterOptions {
  profileId?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedJournalEntries {
  entries: JournalEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Pobiera wszystkie wpisy z dziennika użytkownika
 * @param options Opcje filtrowania
 */
export const getJournalEntries = async (options: JournalFilterOptions = {}): Promise<PaginatedJournalEntries> => {
  const response = await api.get('/journal', { params: options });
  
  if (response.data.success) {
    return response.data.data;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania wpisów z dziennika');
};

/**
 * Pobiera wpis z dziennika po ID
 * @param id ID wpisu
 */
export const getJournalEntryById = async (id: string): Promise<JournalEntry> => {
  const response = await api.get(`/journal/${id}`);
  
  if (response.data.success) {
    return response.data.data.entry;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania wpisu z dziennika');
};

/**
 * Tworzy nowy wpis w dzienniku
 * @param entryData Dane wpisu
 */
export const createJournalEntry = async (entryData: JournalEntryInput): Promise<JournalEntry> => {
  const response = await api.post('/journal', entryData);
  
  if (response.data.success) {
    return response.data.data.entry;
  }
  
  throw new Error(response.data.error?.message || 'Błąd tworzenia wpisu w dzienniku');
};

/**
 * Aktualizuje wpis w dzienniku
 * @param id ID wpisu
 * @param entryData Dane wpisu
 */
export const updateJournalEntry = async (id: string, entryData: Partial<JournalEntryInput>): Promise<JournalEntry> => {
  const response = await api.put(`/journal/${id}`, entryData);
  
  if (response.data.success) {
    return response.data.data.entry;
  }
  
  throw new Error(response.data.error?.message || 'Błąd aktualizacji wpisu w dzienniku');
};

/**
 * Usuwa wpis z dziennika
 * @param id ID wpisu
 */
export const deleteJournalEntry = async (id: string): Promise<void> => {
  const response = await api.delete(`/journal/${id}`);
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd usuwania wpisu z dziennika');
  }
};

/**
 * Pobiera statystyki dziennika myśli i emocji
 * @param options Opcje filtrowania
 */
export const getJournalStats = async (options: JournalFilterOptions = {}): Promise<JournalStats> => {
  const response = await api.get('/journal/stats', { params: options });
  
  if (response.data.success) {
    return response.data.data.stats;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania statystyk dziennika');
};
