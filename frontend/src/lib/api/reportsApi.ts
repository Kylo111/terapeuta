import api from './api';

export interface Report {
  _id: string;
  user: string;
  profile: string;
  title: string;
  type: 'session' | 'progress' | 'tasks' | 'emotional' | 'summary';
  startDate: string;
  endDate: string;
  generatedAt: string;
  data: {
    session?: {
      sessionId: string;
      startTime: string;
      endTime: string;
      duration: number;
      therapyMethod: string;
      emotionalStateStart: {
        anxiety: number;
        depression: number;
        optimism: number;
      };
      emotionalStateEnd: {
        anxiety: number;
        depression: number;
        optimism: number;
      };
      keyTopics: string[];
      insights: string[];
      sessionEffectivenessRating: number;
    };
    progress?: {
      sessionsCount: number;
      totalDuration: number;
      emotionalStateChanges: Array<{
        date: string;
        anxiety: number;
        depression: number;
        optimism: number;
      }>;
      therapyMethods: Array<{
        method: string;
        count: number;
        effectiveness: number;
      }>;
      keyTopicsFrequency: Array<{
        topic: string;
        count: number;
      }>;
      overallProgress: number;
      recommendations: string[];
    };
    tasks?: {
      totalTasks: number;
      completedTasks: number;
      incompleteTasks: number;
      pendingTasks: number;
      completionRate: number;
      averageSuccessRating: number;
      tasksByCategory: Array<{
        category: string;
        count: number;
        completedCount: number;
        completionRate: number;
      }>;
      tasksByPriority: Array<{
        priority: string;
        count: number;
        completedCount: number;
        completionRate: number;
      }>;
      mostChallengingTasks: Array<{
        taskId: string;
        description: string;
        challenges: string;
        successRating: number;
      }>;
      mostSuccessfulTasks: Array<{
        taskId: string;
        description: string;
        reflections: string;
        successRating: number;
      }>;
    };
    emotional?: {
      moodChanges: Array<{
        date: string;
        mood: number;
        notes: string;
      }>;
      anxietyChanges: Array<{
        date: string;
        level: number;
        triggers: string[];
      }>;
      depressionChanges: Array<{
        date: string;
        level: number;
        factors: string[];
      }>;
      optimismChanges: Array<{
        date: string;
        level: number;
        factors: string[];
      }>;
      emotionalPatterns: Array<{
        pattern: string;
        frequency: number;
        triggers: string[];
        copingStrategies: string[];
      }>;
      sentimentAnalysis: {
        overallSentiment: number;
        positiveWords: Array<{
          word: string;
          count: number;
        }>;
        negativeWords: Array<{
          word: string;
          count: number;
        }>;
      };
    };
    summary?: {
      period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
      sessionsCount: number;
      tasksCompletionRate: number;
      emotionalStateAverage: {
        anxiety: number;
        depression: number;
        optimism: number;
      };
      emotionalStateChange: {
        anxiety: number;
        depression: number;
        optimism: number;
      };
      keyAchievements: string[];
      keyInsights: string[];
      challengingAreas: string[];
      recommendations: string[];
      nextSteps: string[];
    };
  };
  exported: boolean;
  exportFormat: 'pdf' | 'json' | 'csv' | null;
  exportedAt: string | null;
}

export interface ReportFilters {
  profileId?: string;
  type?: 'session' | 'progress' | 'tasks' | 'emotional' | 'summary';
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export interface PaginatedReports {
  reports: Report[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Pobiera listę raportów
 * @param filters Filtry raportów
 */
export const getReports = async (filters: ReportFilters = {}): Promise<PaginatedReports> => {
  const response = await api.get('/reports', { params: filters });
  
  if (response.data.success) {
    return response.data.data;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania raportów');
};

/**
 * Pobiera szczegóły raportu
 * @param id ID raportu
 */
export const getReport = async (id: string): Promise<Report> => {
  const response = await api.get(`/reports/${id}`);
  
  if (response.data.success) {
    return response.data.data.report;
  }
  
  throw new Error(response.data.error?.message || 'Błąd pobierania raportu');
};

/**
 * Generuje raport z sesji
 * @param sessionId ID sesji
 */
export const generateSessionReport = async (sessionId: string): Promise<Report> => {
  const response = await api.post(`/reports/sessions/${sessionId}`);
  
  if (response.data.success) {
    return response.data.data.report;
  }
  
  throw new Error(response.data.error?.message || 'Błąd generowania raportu z sesji');
};

/**
 * Generuje raport postępu
 * @param profileId ID profilu
 * @param options Opcje raportu
 */
export const generateProgressReport = async (
  profileId: string,
  options: { startDate?: string; endDate?: string } = {}
): Promise<Report> => {
  const response = await api.post(`/reports/progress/${profileId}`, options);
  
  if (response.data.success) {
    return response.data.data.report;
  }
  
  throw new Error(response.data.error?.message || 'Błąd generowania raportu postępu');
};

/**
 * Generuje raport zadań
 * @param profileId ID profilu
 * @param options Opcje raportu
 */
export const generateTasksReport = async (
  profileId: string,
  options: { startDate?: string; endDate?: string } = {}
): Promise<Report> => {
  const response = await api.post(`/reports/tasks/${profileId}`, options);
  
  if (response.data.success) {
    return response.data.data.report;
  }
  
  throw new Error(response.data.error?.message || 'Błąd generowania raportu zadań');
};

/**
 * Usuwa raport
 * @param id ID raportu
 */
export const deleteReport = async (id: string): Promise<void> => {
  const response = await api.delete(`/reports/${id}`);
  
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Błąd usuwania raportu');
  }
};
