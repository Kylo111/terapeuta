import api from './api';

export interface Profile {
  _id: string;
  name: string;
  age: number;
  gender: string;
  goals: string[];
  challenges: string[];
  preferredTherapyMethods?: string[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
  lastSessionAt?: string;
  sessionsCount: number;
  tasksCount: number;
  completedTasksCount: number;
  userId: string;
}

export interface CreateProfileData {
  name: string;
  age: number;
  gender: string;
  goals: string[];
  challenges: string[];
  preferredTherapyMethods?: string[];
  notes?: string;
}

export interface UpdateProfileData {
  name?: string;
  age?: number;
  gender?: string;
  goals?: string[];
  challenges?: string[];
  preferredTherapyMethods?: string[];
  notes?: string;
  isActive?: boolean;
}

/**
 * Pobieranie wszystkich profili użytkownika
 */
export const getProfiles = async (): Promise<Profile[]> => {
  const response = await api.get('/profiles');
  
  if (response.data.success) {
    return response.data.data.profiles;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania profili');
};

/**
 * Pobieranie szczegółów profilu
 */
export const getProfile = async (profileId: string): Promise<Profile> => {
  const response = await api.get(`/profiles/${profileId}`);
  
  if (response.data.success) {
    return response.data.data.profile;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania profilu');
};

/**
 * Tworzenie nowego profilu
 */
export const createProfile = async (profileData: CreateProfileData): Promise<Profile> => {
  const response = await api.post('/profiles', profileData);
  
  if (response.data.success) {
    return response.data.data.profile;
  }
  
  throw new Error(response.data.error?.message || 'Błąd tworzenia profilu');
};

/**
 * Aktualizacja profilu
 */
export const updateProfile = async (profileId: string, profileData: UpdateProfileData): Promise<Profile> => {
  const response = await api.put(`/profiles/${profileId}`, profileData);
  
  if (response.data.success) {
    return response.data.data.profile;
  }
  
  throw new Error(response.data.error?.message || 'Błąd aktualizacji profilu');
};

/**
 * Usuwanie profilu
 */
export const deleteProfile = async (profileId: string): Promise<void> => {
  const response = await api.delete(`/profiles/${profileId}`);
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd usuwania profilu');
  }
};

/**
 * Pobieranie sesji dla profilu
 */
export const getProfileSessions = async (profileId: string): Promise<any[]> => {
  const response = await api.get(`/profiles/${profileId}/sessions`);
  
  if (response.data.success) {
    return response.data.data.sessions;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania sesji profilu');
};

/**
 * Pobieranie zadań dla profilu
 */
export const getProfileTasks = async (profileId: string): Promise<any[]> => {
  const response = await api.get(`/profiles/${profileId}/tasks`);
  
  if (response.data.success) {
    return response.data.data.tasks;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania zadań profilu');
};

/**
 * Pobieranie statystyk profilu
 */
export const getProfileStats = async (profileId: string): Promise<any> => {
  const response = await api.get(`/profiles/${profileId}/stats`);
  
  if (response.data.success) {
    return response.data.data.stats;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania statystyk profilu');
};
