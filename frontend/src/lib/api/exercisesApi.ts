import api from './api';

export interface Exercise {
  _id: string;
  name: string;
  description: string;
  category: 'mindfulness' | 'relaxation' | 'cognitive' | 'emotional' | 'behavioral' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  instructions: string[];
  tips: string[];
  benefits: string[];
  contraindications: string[];
  resources: {
    type: 'audio' | 'video' | 'image' | 'text' | 'link';
    title: string;
    url: string;
    description?: string;
  }[];
  isDefault: boolean;
  isActive: boolean;
  history: {
    _id?: string;
    date: string;
    duration: number;
    notes?: string;
    rating?: number;
    mood?: {
      before?: number;
      after?: number;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseInput {
  name: string;
  description: string;
  category: 'mindfulness' | 'relaxation' | 'cognitive' | 'emotional' | 'behavioral' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  instructions: string[];
  tips?: string[];
  benefits?: string[];
  contraindications?: string[];
  resources?: {
    type: 'audio' | 'video' | 'image' | 'text' | 'link';
    title: string;
    url: string;
    description?: string;
  }[];
  isActive?: boolean;
}

export interface HistoryEntryInput {
  date?: string;
  duration: number;
  notes?: string;
  rating?: number;
  mood?: {
    before?: number;
    after?: number;
  };
}

export interface ExerciseStats {
  totalExercises: number;
  totalCompletions: number;
  totalDuration: number;
  averageRating: number;
  byCategory: {
    [category: string]: {
      count: number;
      completions: number;
    };
  };
  byDifficulty: {
    [difficulty: string]: {
      count: number;
      completions: number;
    };
  };
  recentActivity: {
    exerciseId: string;
    exerciseName: string;
    category: string;
    date: string;
    duration: number;
    rating?: number;
  }[];
}

export interface ExerciseFilterOptions {
  category?: string;
  difficulty?: string;
  isActive?: boolean;
  maxDuration?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Pobiera wszystkie ćwiczenia użytkownika
 * @param options Opcje filtrowania
 */
export const getExercises = async (options: ExerciseFilterOptions = {}): Promise<Exercise[]> => {
  const response = await api.get('/exercises', { params: options });
  
  if (response.data.success) {
    return response.data.data.exercises;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania ćwiczeń');
};

/**
 * Pobiera ćwiczenie po ID
 * @param id ID ćwiczenia
 */
export const getExerciseById = async (id: string): Promise<Exercise> => {
  const response = await api.get(`/exercises/${id}`);
  
  if (response.data.success) {
    return response.data.data.exercise;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania ćwiczenia');
};

/**
 * Tworzy nowe ćwiczenie
 * @param exerciseData Dane ćwiczenia
 */
export const createExercise = async (exerciseData: ExerciseInput): Promise<Exercise> => {
  const response = await api.post('/exercises', exerciseData);
  
  if (response.data.success) {
    return response.data.data.exercise;
  }
  
  throw new Error(response.data.error?.message || 'Błąd tworzenia ćwiczenia');
};

/**
 * Aktualizuje ćwiczenie
 * @param id ID ćwiczenia
 * @param exerciseData Dane ćwiczenia
 */
export const updateExercise = async (id: string, exerciseData: Partial<ExerciseInput>): Promise<Exercise> => {
  const response = await api.put(`/exercises/${id}`, exerciseData);
  
  if (response.data.success) {
    return response.data.data.exercise;
  }
  
  throw new Error(response.data.error?.message || 'Błąd aktualizacji ćwiczenia');
};

/**
 * Usuwa ćwiczenie
 * @param id ID ćwiczenia
 */
export const deleteExercise = async (id: string): Promise<void> => {
  const response = await api.delete(`/exercises/${id}`);
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd usuwania ćwiczenia');
  }
};

/**
 * Dodaje wpis do historii wykonania ćwiczenia
 * @param id ID ćwiczenia
 * @param historyEntry Wpis historii
 */
export const addHistoryEntry = async (id: string, historyEntry: HistoryEntryInput): Promise<Exercise> => {
  const response = await api.post(`/exercises/${id}/history`, historyEntry);
  
  if (response.data.success) {
    return response.data.data.exercise;
  }
  
  throw new Error(response.data.error?.message || 'Błąd dodawania wpisu do historii');
};

/**
 * Inicjalizuje domyślne ćwiczenia dla użytkownika
 */
export const initializeDefaultExercises = async (): Promise<Exercise[]> => {
  const response = await api.post('/exercises/initialize');
  
  if (response.data.success) {
    return response.data.data.exercises;
  }
  
  throw new Error(response.data.error?.message || 'Błąd inicjalizacji domyślnych ćwiczeń');
};

/**
 * Pobiera statystyki ćwiczeń użytkownika
 */
export const getExerciseStats = async (): Promise<ExerciseStats> => {
  const response = await api.get('/exercises/stats');
  
  if (response.data.success) {
    return response.data.data.stats;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania statystyk ćwiczeń');
};
