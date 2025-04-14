/**
 * Serwis eksportu danych
 * @module services/export
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const json2csv = require('json2csv').Parser;
const PDFDocument = require('pdfkit');
const User = require('../data/models/user');
const Profile = require('../data/models/profile');
const Session = require('../data/models/session');
const Task = require('../data/models/task');
const Report = require('../data/models/report');
const TherapyMethod = require('../data/models/therapy-method');
const Prompt = require('../data/models/prompt');

/**
 * Klasa serwisu eksportu danych
 */
class ExportService {
  /**
   * Eksportuje dane użytkownika do formatu JSON
   * @param {string} userId - ID użytkownika
   * @param {Object} options - Opcje eksportu
   * @param {boolean} options.includeUser - Czy eksportować dane użytkownika
   * @param {boolean} options.includeProfiles - Czy eksportować profile
   * @param {boolean} options.includeSessions - Czy eksportować sesje
   * @param {boolean} options.includeTasks - Czy eksportować zadania
   * @param {boolean} options.includeReports - Czy eksportować raporty
   * @param {boolean} options.includeTherapyMethods - Czy eksportować metody terapii
   * @param {boolean} options.includePrompts - Czy eksportować prompty
   * @returns {Promise<Object>} - Dane w formacie JSON
   */
  async exportToJSON(userId, options = {}) {
    try {
      const exportData = {};

      // Eksport danych użytkownika
      if (options.includeUser) {
        const user = await User.findById(userId).select('-password');
        if (user) {
          exportData.user = user.toObject();
        }
      }

      // Eksport profili
      if (options.includeProfiles) {
        const profiles = await Profile.find({ user: userId });
        exportData.profiles = profiles.map(profile => profile.toObject());
      }

      // Eksport sesji
      if (options.includeSessions) {
        const profiles = await Profile.find({ user: userId });
        const profileIds = profiles.map(profile => profile._id);
        const sessions = await Session.find({ profile: { $in: profileIds } });
        exportData.sessions = sessions.map(session => session.toObject());
      }

      // Eksport zadań
      if (options.includeTasks) {
        const profiles = await Profile.find({ user: userId });
        const profileIds = profiles.map(profile => profile._id);
        const tasks = await Task.find({ profile: { $in: profileIds } });
        exportData.tasks = tasks.map(task => task.toObject());
      }

      // Eksport raportów
      if (options.includeReports) {
        const reports = await Report.find({ user: userId });
        exportData.reports = reports.map(report => report.toObject());
      }

      // Eksport metod terapii
      if (options.includeTherapyMethods) {
        const therapyMethods = await TherapyMethod.find({ user: userId });
        exportData.therapyMethods = therapyMethods.map(method => method.toObject());
      }

      // Eksport promptów
      if (options.includePrompts) {
        const prompts = await Prompt.find({ user: userId });
        exportData.prompts = prompts.map(prompt => prompt.toObject());
      }

      return exportData;
    } catch (error) {
      console.error('Błąd podczas eksportu danych do JSON:', error);
      throw error;
    }
  }

  /**
   * Eksportuje dane użytkownika do formatu CSV
   * @param {string} userId - ID użytkownika
   * @param {Object} options - Opcje eksportu
   * @param {boolean} options.includeSessions - Czy eksportować sesje
   * @param {boolean} options.includeTasks - Czy eksportować zadania
   * @returns {Promise<Object>} - Dane w formacie CSV
   */
  async exportToCSV(userId, options = {}) {
    try {
      const result = {};

      // Eksport sesji
      if (options.includeSessions) {
        const profiles = await Profile.find({ user: userId });
        const profileIds = profiles.map(profile => profile._id);
        const sessions = await Session.find({ profile: { $in: profileIds } });
        
        // Przygotowanie danych sesji do eksportu CSV
        const sessionsData = sessions.map(session => {
          const sessionObj = session.toObject();
          return {
            id: sessionObj._id.toString(),
            profile: sessionObj.profile.toString(),
            startTime: sessionObj.startTime,
            endTime: sessionObj.endTime || '',
            duration: sessionObj.duration || 0,
            therapyMethod: sessionObj.therapyMethod || '',
            status: sessionObj.status || '',
            summary: sessionObj.summary || '',
            emotionalStateStart: sessionObj.emotionalStateStart 
              ? `Lęk: ${sessionObj.emotionalStateStart.anxiety}, Depresja: ${sessionObj.emotionalStateStart.depression}, Optymizm: ${sessionObj.emotionalStateStart.optimism}`
              : '',
            emotionalStateEnd: sessionObj.emotionalStateEnd 
              ? `Lęk: ${sessionObj.emotionalStateEnd.anxiety}, Depresja: ${sessionObj.emotionalStateEnd.depression}, Optymizm: ${sessionObj.emotionalStateEnd.optimism}`
              : '',
            sessionEffectivenessRating: sessionObj.sessionEffectivenessRating || 0,
            createdAt: sessionObj.createdAt,
            updatedAt: sessionObj.updatedAt
          };
        });

        // Konwersja do CSV
        if (sessionsData.length > 0) {
          const fields = Object.keys(sessionsData[0]);
          const parser = new json2csv({ fields });
          result.sessions = parser.parse(sessionsData);
        } else {
          result.sessions = '';
        }
      }

      // Eksport zadań
      if (options.includeTasks) {
        const profiles = await Profile.find({ user: userId });
        const profileIds = profiles.map(profile => profile._id);
        const tasks = await Task.find({ profile: { $in: profileIds } });
        
        // Przygotowanie danych zadań do eksportu CSV
        const tasksData = tasks.map(task => {
          const taskObj = task.toObject();
          return {
            id: taskObj._id.toString(),
            profile: taskObj.profile.toString(),
            session: taskObj.session ? taskObj.session.toString() : '',
            title: taskObj.title || '',
            description: taskObj.description || '',
            status: taskObj.status || '',
            priority: taskObj.priority || '',
            category: taskObj.category || '',
            dueDate: taskObj.dueDate || '',
            completionData: taskObj.completionData 
              ? `Ukończono: ${taskObj.completionData.completedAt}, Ocena: ${taskObj.completionData.successRating}, Refleksje: ${taskObj.completionData.reflections}, Wyzwania: ${taskObj.completionData.challenges}`
              : '',
            createdAt: taskObj.createdAt,
            updatedAt: taskObj.updatedAt
          };
        });

        // Konwersja do CSV
        if (tasksData.length > 0) {
          const fields = Object.keys(tasksData[0]);
          const parser = new json2csv({ fields });
          result.tasks = parser.parse(tasksData);
        } else {
          result.tasks = '';
        }
      }

      return result;
    } catch (error) {
      console.error('Błąd podczas eksportu danych do CSV:', error);
      throw error;
    }
  }

  /**
   * Eksportuje dane użytkownika do formatu PDF
   * @param {string} userId - ID użytkownika
   * @param {Object} options - Opcje eksportu
   * @param {boolean} options.includeUser - Czy eksportować dane użytkownika
   * @param {boolean} options.includeProfiles - Czy eksportować profile
   * @param {boolean} options.includeSessions - Czy eksportować sesje
   * @param {boolean} options.includeTasks - Czy eksportować zadania
   * @returns {Promise<Buffer>} - Dane w formacie PDF
   */
  async exportToPDF(userId, options = {}) {
    try {
      // Tworzenie dokumentu PDF
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      
      // Tytuł dokumentu
      doc.fontSize(25).text('Eksport danych z aplikacji Terapeuta', { align: 'center' });
      doc.moveDown();
      
      // Data eksportu
      doc.fontSize(12).text(`Data eksportu: ${new Date().toLocaleString('pl-PL')}`, { align: 'center' });
      doc.moveDown(2);

      // Eksport danych użytkownika
      if (options.includeUser) {
        const user = await User.findById(userId).select('-password');
        if (user) {
          doc.fontSize(16).text('Dane użytkownika', { underline: true });
          doc.moveDown();
          
          const userData = user.toObject();
          doc.fontSize(12).text(`Email: ${userData.email}`);
          doc.text(`Imię: ${userData.firstName || 'Nie podano'}`);
          doc.text(`Nazwisko: ${userData.lastName || 'Nie podano'}`);
          doc.text(`Data utworzenia konta: ${new Date(userData.createdAt).toLocaleString('pl-PL')}`);
          
          doc.moveDown(2);
        }
      }

      // Eksport profili
      if (options.includeProfiles) {
        const profiles = await Profile.find({ user: userId });
        
        doc.fontSize(16).text('Profile', { underline: true });
        doc.moveDown();
        
        if (profiles.length > 0) {
          profiles.forEach((profile, index) => {
            const profileData = profile.toObject();
            doc.fontSize(14).text(`Profil ${index + 1}: ${profileData.name}`);
            doc.fontSize(12).text(`Opis: ${profileData.description || 'Brak opisu'}`);
            doc.text(`Data utworzenia: ${new Date(profileData.createdAt).toLocaleString('pl-PL')}`);
            
            if (index < profiles.length - 1) {
              doc.moveDown();
            }
          });
        } else {
          doc.fontSize(12).text('Brak profili');
        }
        
        doc.moveDown(2);
      }

      // Eksport sesji
      if (options.includeSessions) {
        const profiles = await Profile.find({ user: userId });
        const profileIds = profiles.map(profile => profile._id);
        const sessions = await Session.find({ profile: { $in: profileIds } });
        
        doc.fontSize(16).text('Sesje terapeutyczne', { underline: true });
        doc.moveDown();
        
        if (sessions.length > 0) {
          sessions.forEach((session, index) => {
            const sessionData = session.toObject();
            doc.fontSize(14).text(`Sesja ${index + 1}`);
            doc.fontSize(12).text(`Data: ${new Date(sessionData.startTime).toLocaleString('pl-PL')}`);
            doc.text(`Czas trwania: ${sessionData.duration ? Math.round(sessionData.duration / 60) + ' min' : 'Nie określono'}`);
            doc.text(`Metoda terapii: ${sessionData.therapyMethod || 'Nie określono'}`);
            doc.text(`Status: ${sessionData.status || 'Nie określono'}`);
            
            if (sessionData.summary) {
              doc.moveDown();
              doc.text('Podsumowanie:', { underline: true });
              doc.text(sessionData.summary, { width: 500 });
            }
            
            if (index < sessions.length - 1) {
              doc.moveDown();
            }
            
            // Dodanie nowej strony po każdych 3 sesjach
            if ((index + 1) % 3 === 0 && index < sessions.length - 1) {
              doc.addPage();
            }
          });
        } else {
          doc.fontSize(12).text('Brak sesji');
        }
        
        doc.moveDown(2);
      }

      // Eksport zadań
      if (options.includeTasks) {
        const profiles = await Profile.find({ user: userId });
        const profileIds = profiles.map(profile => profile._id);
        const tasks = await Task.find({ profile: { $in: profileIds } });
        
        // Dodanie nowej strony dla zadań
        doc.addPage();
        
        doc.fontSize(16).text('Zadania terapeutyczne', { underline: true });
        doc.moveDown();
        
        if (tasks.length > 0) {
          tasks.forEach((task, index) => {
            const taskData = task.toObject();
            doc.fontSize(14).text(`Zadanie ${index + 1}: ${taskData.title || 'Bez tytułu'}`);
            doc.fontSize(12).text(`Opis: ${taskData.description || 'Brak opisu'}`);
            doc.text(`Status: ${taskData.status || 'Nie określono'}`);
            doc.text(`Priorytet: ${taskData.priority || 'Nie określono'}`);
            doc.text(`Kategoria: ${taskData.category || 'Nie określono'}`);
            
            if (taskData.dueDate) {
              doc.text(`Termin wykonania: ${new Date(taskData.dueDate).toLocaleString('pl-PL')}`);
            }
            
            if (taskData.completionData) {
              doc.moveDown();
              doc.text('Dane ukończenia:', { underline: true });
              doc.text(`Data ukończenia: ${new Date(taskData.completionData.completedAt).toLocaleString('pl-PL')}`);
              doc.text(`Ocena sukcesu: ${taskData.completionData.successRating || 'Nie określono'}`);
              
              if (taskData.completionData.reflections) {
                doc.text('Refleksje:', { underline: true });
                doc.text(taskData.completionData.reflections, { width: 500 });
              }
              
              if (taskData.completionData.challenges) {
                doc.text('Wyzwania:', { underline: true });
                doc.text(taskData.completionData.challenges, { width: 500 });
              }
            }
            
            if (index < tasks.length - 1) {
              doc.moveDown();
            }
            
            // Dodanie nowej strony po każdych 3 zadaniach
            if ((index + 1) % 3 === 0 && index < tasks.length - 1) {
              doc.addPage();
            }
          });
        } else {
          doc.fontSize(12).text('Brak zadań');
        }
      }

      // Finalizacja dokumentu
      doc.end();
      
      // Zwrócenie bufora z danymi PDF
      return new Promise((resolve) => {
        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });
      });
    } catch (error) {
      console.error('Błąd podczas eksportu danych do PDF:', error);
      throw error;
    }
  }

  /**
   * Eksportuje dane użytkownika do archiwum ZIP
   * @param {string} userId - ID użytkownika
   * @param {Object} options - Opcje eksportu
   * @returns {Promise<Buffer>} - Dane w formacie ZIP
   */
  async exportToZIP(userId, options = {}) {
    try {
      // Tworzenie archiwum ZIP
      const archive = archiver('zip', {
        zlib: { level: 9 } // Poziom kompresji
      });
      
      const buffers = [];
      
      archive.on('data', data => buffers.push(data));
      
      // Eksport danych do JSON
      const jsonData = await this.exportToJSON(userId, options);
      archive.append(JSON.stringify(jsonData, null, 2), { name: 'data.json' });
      
      // Eksport danych do CSV
      const csvData = await this.exportToCSV(userId, options);
      
      if (options.includeSessions && csvData.sessions) {
        archive.append(csvData.sessions, { name: 'sessions.csv' });
      }
      
      if (options.includeTasks && csvData.tasks) {
        archive.append(csvData.tasks, { name: 'tasks.csv' });
      }
      
      // Eksport danych do PDF
      const pdfData = await this.exportToPDF(userId, options);
      archive.append(pdfData, { name: 'report.pdf' });
      
      // Finalizacja archiwum
      archive.finalize();
      
      // Zwrócenie bufora z danymi ZIP
      return new Promise((resolve) => {
        archive.on('end', () => {
          resolve(Buffer.concat(buffers));
        });
      });
    } catch (error) {
      console.error('Błąd podczas eksportu danych do ZIP:', error);
      throw error;
    }
  }

  /**
   * Importuje dane użytkownika z formatu JSON
   * @param {string} userId - ID użytkownika
   * @param {Object} data - Dane do importu
   * @param {Object} options - Opcje importu
   * @param {boolean} options.importProfiles - Czy importować profile
   * @param {boolean} options.importSessions - Czy importować sesje
   * @param {boolean} options.importTasks - Czy importować zadania
   * @param {boolean} options.importTherapyMethods - Czy importować metody terapii
   * @param {boolean} options.importPrompts - Czy importować prompty
   * @returns {Promise<Object>} - Wynik importu
   */
  async importFromJSON(userId, data, options = {}) {
    try {
      const result = {
        profiles: { imported: 0, errors: 0 },
        sessions: { imported: 0, errors: 0 },
        tasks: { imported: 0, errors: 0 },
        therapyMethods: { imported: 0, errors: 0 },
        prompts: { imported: 0, errors: 0 }
      };

      // Importowanie profili
      if (options.importProfiles && data.profiles && Array.isArray(data.profiles)) {
        for (const profileData of data.profiles) {
          try {
            // Sprawdzenie, czy profil już istnieje
            const existingProfile = await Profile.findOne({
              user: userId,
              name: profileData.name
            });

            if (existingProfile) {
              // Aktualizacja istniejącego profilu
              await Profile.findByIdAndUpdate(existingProfile._id, {
                description: profileData.description,
                settings: profileData.settings
              });
            } else {
              // Tworzenie nowego profilu
              const newProfile = new Profile({
                user: userId,
                name: profileData.name,
                description: profileData.description,
                settings: profileData.settings
              });
              await newProfile.save();
            }

            result.profiles.imported++;
          } catch (error) {
            console.error('Błąd podczas importowania profilu:', error);
            result.profiles.errors++;
          }
        }
      }

      // Importowanie metod terapii
      if (options.importTherapyMethods && data.therapyMethods && Array.isArray(data.therapyMethods)) {
        for (const methodData of data.therapyMethods) {
          try {
            // Sprawdzenie, czy metoda już istnieje
            const existingMethod = await TherapyMethod.findOne({
              user: userId,
              name: methodData.name
            });

            if (existingMethod) {
              // Aktualizacja istniejącej metody
              await TherapyMethod.findByIdAndUpdate(existingMethod._id, {
                description: methodData.description,
                systemPrompt: methodData.systemPrompt,
                userPrompt: methodData.userPrompt,
                isActive: methodData.isActive
              });
            } else {
              // Tworzenie nowej metody
              const newMethod = new TherapyMethod({
                user: userId,
                name: methodData.name,
                description: methodData.description,
                systemPrompt: methodData.systemPrompt,
                userPrompt: methodData.userPrompt,
                isActive: methodData.isActive
              });
              await newMethod.save();
            }

            result.therapyMethods.imported++;
          } catch (error) {
            console.error('Błąd podczas importowania metody terapii:', error);
            result.therapyMethods.errors++;
          }
        }
      }

      // Importowanie promptów
      if (options.importPrompts && data.prompts && Array.isArray(data.prompts)) {
        for (const promptData of data.prompts) {
          try {
            // Sprawdzenie, czy prompt już istnieje
            const existingPrompt = await Prompt.findOne({
              user: userId,
              name: promptData.name
            });

            if (existingPrompt) {
              // Aktualizacja istniejącego promptu
              await Prompt.findByIdAndUpdate(existingPrompt._id, {
                description: promptData.description,
                content: promptData.content,
                category: promptData.category,
                isActive: promptData.isActive
              });
            } else {
              // Tworzenie nowego promptu
              const newPrompt = new Prompt({
                user: userId,
                name: promptData.name,
                description: promptData.description,
                content: promptData.content,
                category: promptData.category,
                isActive: promptData.isActive
              });
              await newPrompt.save();
            }

            result.prompts.imported++;
          } catch (error) {
            console.error('Błąd podczas importowania promptu:', error);
            result.prompts.errors++;
          }
        }
      }

      // Importowanie sesji i zadań wymaga mapowania ID profili
      if ((options.importSessions || options.importTasks) && data.profiles && Array.isArray(data.profiles)) {
        // Tworzenie mapy ID profili (stare ID -> nowe ID)
        const profileIdMap = new Map();
        
        for (const profileData of data.profiles) {
          if (profileData._id) {
            const existingProfile = await Profile.findOne({
              user: userId,
              name: profileData.name
            });
            
            if (existingProfile) {
              profileIdMap.set(profileData._id.toString(), existingProfile._id.toString());
            }
          }
        }

        // Importowanie sesji
        if (options.importSessions && data.sessions && Array.isArray(data.sessions)) {
          // Tworzenie mapy ID sesji (stare ID -> nowe ID)
          const sessionIdMap = new Map();
          
          for (const sessionData of data.sessions) {
            try {
              // Sprawdzenie, czy mamy mapowanie dla profilu
              if (sessionData.profile && profileIdMap.has(sessionData.profile.toString())) {
                const newProfileId = profileIdMap.get(sessionData.profile.toString());
                
                // Tworzenie nowej sesji
                const newSession = new Session({
                  profile: newProfileId,
                  startTime: sessionData.startTime,
                  endTime: sessionData.endTime,
                  duration: sessionData.duration,
                  therapyMethod: sessionData.therapyMethod,
                  status: sessionData.status,
                  summary: sessionData.summary,
                  emotionalStateStart: sessionData.emotionalStateStart,
                  emotionalStateEnd: sessionData.emotionalStateEnd,
                  sessionEffectivenessRating: sessionData.sessionEffectivenessRating,
                  conversation: sessionData.conversation || []
                });
                
                await newSession.save();
                
                // Dodanie mapowania ID sesji
                if (sessionData._id) {
                  sessionIdMap.set(sessionData._id.toString(), newSession._id.toString());
                }
                
                result.sessions.imported++;
              } else {
                result.sessions.errors++;
              }
            } catch (error) {
              console.error('Błąd podczas importowania sesji:', error);
              result.sessions.errors++;
            }
          }

          // Importowanie zadań
          if (options.importTasks && data.tasks && Array.isArray(data.tasks)) {
            for (const taskData of data.tasks) {
              try {
                // Sprawdzenie, czy mamy mapowanie dla profilu
                if (taskData.profile && profileIdMap.has(taskData.profile.toString())) {
                  const newProfileId = profileIdMap.get(taskData.profile.toString());
                  
                  // Sprawdzenie, czy mamy mapowanie dla sesji
                  let newSessionId = null;
                  if (taskData.session && sessionIdMap.has(taskData.session.toString())) {
                    newSessionId = sessionIdMap.get(taskData.session.toString());
                  }
                  
                  // Tworzenie nowego zadania
                  const newTask = new Task({
                    profile: newProfileId,
                    session: newSessionId,
                    title: taskData.title,
                    description: taskData.description,
                    status: taskData.status,
                    priority: taskData.priority,
                    category: taskData.category,
                    dueDate: taskData.dueDate,
                    completionData: taskData.completionData,
                    reminders: taskData.reminders || []
                  });
                  
                  await newTask.save();
                  
                  result.tasks.imported++;
                } else {
                  result.tasks.errors++;
                }
              } catch (error) {
                console.error('Błąd podczas importowania zadania:', error);
                result.tasks.errors++;
              }
            }
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Błąd podczas importu danych z JSON:', error);
      throw error;
    }
  }
}

module.exports = new ExportService();
