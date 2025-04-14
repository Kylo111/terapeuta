import api from './api';

export interface ExportOptions {
  includeUser?: boolean;
  includeProfiles?: boolean;
  includeSessions?: boolean;
  includeTasks?: boolean;
  includeReports?: boolean;
  includeTherapyMethods?: boolean;
  includePrompts?: boolean;
}

export interface ImportOptions {
  importProfiles?: boolean;
  importSessions?: boolean;
  importTasks?: boolean;
  importTherapyMethods?: boolean;
  importPrompts?: boolean;
}

export interface ImportResult {
  profiles: { imported: number; errors: number };
  sessions: { imported: number; errors: number };
  tasks: { imported: number; errors: number };
  therapyMethods: { imported: number; errors: number };
  prompts: { imported: number; errors: number };
}

/**
 * Eksportuje dane użytkownika do formatu JSON
 * @param options Opcje eksportu
 */
export const exportToJSON = async (options: ExportOptions = {}): Promise<any> => {
  const response = await api.post('/export/json', options);
  
  if (response.data.success) {
    return response.data.data;
  }
  
  throw new Error(response.data.error?.message || 'Błąd eksportu danych do JSON');
};

/**
 * Eksportuje dane użytkownika do formatu CSV
 * @param options Opcje eksportu
 */
export const exportToCSV = async (options: ExportOptions = {}): Promise<void> => {
  try {
    const response = await api.post('/export/csv', options, {
      responseType: 'blob'
    });
    
    // Tworzenie linku do pobrania pliku
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link);
    link.click();
    
    // Czyszczenie
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error('Błąd eksportu danych do CSV:', error);
    throw new Error('Błąd eksportu danych do CSV');
  }
};

/**
 * Eksportuje dane użytkownika do formatu PDF
 * @param options Opcje eksportu
 */
export const exportToPDF = async (options: ExportOptions = {}): Promise<void> => {
  try {
    const response = await api.post('/export/pdf', options, {
      responseType: 'blob'
    });
    
    // Tworzenie linku do pobrania pliku
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'export.pdf');
    document.body.appendChild(link);
    link.click();
    
    // Czyszczenie
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error('Błąd eksportu danych do PDF:', error);
    throw new Error('Błąd eksportu danych do PDF');
  }
};

/**
 * Eksportuje dane użytkownika do archiwum ZIP
 * @param options Opcje eksportu
 */
export const exportToZIP = async (options: ExportOptions = {}): Promise<void> => {
  try {
    const response = await api.post('/export/zip', options, {
      responseType: 'blob'
    });
    
    // Tworzenie linku do pobrania pliku
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'export.zip');
    document.body.appendChild(link);
    link.click();
    
    // Czyszczenie
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error('Błąd eksportu danych do ZIP:', error);
    throw new Error('Błąd eksportu danych do ZIP');
  }
};

/**
 * Importuje dane użytkownika z formatu JSON
 * @param data Dane do importu
 * @param options Opcje importu
 */
export const importFromJSON = async (data: any, options: ImportOptions = {}): Promise<ImportResult> => {
  const response = await api.post('/export/import', { data, options });
  
  if (response.data.success) {
    return response.data.data.result;
  }
  
  throw new Error(response.data.error?.message || 'Błąd importu danych z JSON');
};
