/**
 * Serwis przypomnień
 * @module services/reminder
 */

const Task = require('../data/models/task');
const Profile = require('../data/models/profile');
const User = require('../data/models/user');
const Session = require('../data/models/session');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

/**
 * Klasa serwisu przypomnień
 */
class ReminderService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.cronJobs = {};
    
    // Inicjalizacja transportera e-mail
    this.initializeEmailTransporter();
    
    // Inicjalizacja zadań cron
    this.initializeCronJobs();
  }

  /**
   * Inicjalizacja transportera e-mail
   */
  initializeEmailTransporter() {
    try {
      // Konfiguracja transportera e-mail
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      
      // Weryfikacja konfiguracji
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        this.transporter.verify((error) => {
          if (error) {
            console.error('Błąd konfiguracji transportera e-mail:', error);
          } else {
            console.log('Transporter e-mail skonfigurowany poprawnie');
            this.initialized = true;
          }
        });
      } else {
        console.warn('Brak konfiguracji e-mail. Powiadomienia e-mail będą wyłączone.');
      }
    } catch (error) {
      console.error('Błąd inicjalizacji transportera e-mail:', error);
    }
  }

  /**
   * Inicjalizacja zadań cron
   */
  initializeCronJobs() {
    try {
      // Zadanie cron do wysyłania przypomnień o zadaniach
      this.cronJobs.taskReminders = cron.schedule('*/15 * * * *', async () => {
        console.log('Uruchomiono zadanie cron: wysyłanie przypomnień o zadaniach');
        await this.sendTaskReminders();
      });
      
      // Zadanie cron do wysyłania przypomnień o sesjach
      this.cronJobs.sessionReminders = cron.schedule('0 */1 * * *', async () => {
        console.log('Uruchomiono zadanie cron: wysyłanie przypomnień o sesjach');
        await this.sendSessionReminders();
      });
      
      // Zadanie cron do wysyłania przypomnień o zbliżających się terminach zadań
      this.cronJobs.upcomingDeadlines = cron.schedule('0 9 * * *', async () => {
        console.log('Uruchomiono zadanie cron: wysyłanie przypomnień o zbliżających się terminach zadań');
        await this.sendUpcomingDeadlineReminders();
      });
      
      console.log('Zadania cron zainicjalizowane');
    } catch (error) {
      console.error('Błąd inicjalizacji zadań cron:', error);
    }
  }

  /**
   * Wysyłanie przypomnień o zadaniach
   */
  async sendTaskReminders() {
    try {
      const now = new Date();
      const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
      const fifteenMinutesAhead = new Date(now.getTime() + 15 * 60 * 1000);
      
      // Pobieranie zadań z przypomnieniami, które powinny zostać wysłane
      const tasks = await Task.find({
        status: 'pending',
        'reminders.time': {
          $gte: fifteenMinutesAgo,
          $lte: fifteenMinutesAhead
        },
        'reminders.isSent': false
      }).populate({
        path: 'profile',
        select: 'name user',
        populate: {
          path: 'user',
          select: 'email settings'
        }
      });
      
      console.log(`Znaleziono ${tasks.length} zadań z przypomnieniami do wysłania`);
      
      // Wysyłanie przypomnień
      for (const task of tasks) {
        for (const reminder of task.reminders) {
          const reminderTime = new Date(reminder.time);
          
          // Sprawdzenie, czy przypomnienie powinno zostać wysłane
          if (!reminder.isSent && 
              reminderTime >= fifteenMinutesAgo && 
              reminderTime <= fifteenMinutesAhead) {
            
            // Wysyłanie przypomnienia
            await this.sendTaskReminderNotification(task, reminder);
            
            // Oznaczenie przypomnienia jako wysłane
            reminder.isSent = true;
          }
        }
        
        // Zapisanie zmian w zadaniu
        await task.save();
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania przypomnień o zadaniach:', error);
    }
  }

  /**
   * Wysyłanie przypomnień o sesjach
   */
  async sendSessionReminders() {
    try {
      const now = new Date();
      const oneDayAhead = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const oneHourAhead = new Date(now.getTime() + 60 * 60 * 1000);
      
      // Pobieranie sesji, które rozpoczną się w ciągu najbliższych 24 godzin
      const sessions = await Session.find({
        startTime: {
          $gte: now,
          $lte: oneDayAhead
        },
        isCompleted: false,
        reminderSent: { $ne: true }
      }).populate({
        path: 'profile',
        select: 'name user',
        populate: {
          path: 'user',
          select: 'email settings'
        }
      });
      
      console.log(`Znaleziono ${sessions.length} sesji z przypomnieniami do wysłania`);
      
      // Wysyłanie przypomnień
      for (const session of sessions) {
        const sessionTime = new Date(session.startTime);
        const timeDiff = sessionTime.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        // Wysyłanie przypomnienia 24 godziny przed sesją
        if (hoursDiff <= 24 && hoursDiff > 23 && !session.reminderSent) {
          await this.sendSessionReminderNotification(session, '24h');
          session.reminderSent = true;
          await session.save();
        }
        
        // Wysyłanie przypomnienia 1 godzinę przed sesją
        if (hoursDiff <= 1 && hoursDiff > 0 && !session.reminderSent1h) {
          await this.sendSessionReminderNotification(session, '1h');
          session.reminderSent1h = true;
          await session.save();
        }
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania przypomnień o sesjach:', error);
    }
  }

  /**
   * Wysyłanie przypomnień o zbliżających się terminach zadań
   */
  async sendUpcomingDeadlineReminders() {
    try {
      const now = new Date();
      const oneDayAhead = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      // Pobieranie zadań, których termin wykonania upływa w ciągu najbliższych 24 godzin
      const tasks = await Task.find({
        status: 'pending',
        deadline: {
          $gte: now,
          $lte: oneDayAhead
        },
        deadlineReminderSent: { $ne: true }
      }).populate({
        path: 'profile',
        select: 'name user',
        populate: {
          path: 'user',
          select: 'email settings'
        }
      });
      
      console.log(`Znaleziono ${tasks.length} zadań z przypomnieniami o terminie do wysłania`);
      
      // Wysyłanie przypomnień
      for (const task of tasks) {
        await this.sendDeadlineReminderNotification(task);
        
        // Oznaczenie przypomnienia jako wysłane
        task.deadlineReminderSent = true;
        await task.save();
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania przypomnień o zbliżających się terminach zadań:', error);
    }
  }

  /**
   * Wysyłanie powiadomienia o przypomnieniu zadania
   * @param {Object} task - Zadanie
   * @param {Object} reminder - Przypomnienie
   */
  async sendTaskReminderNotification(task, reminder) {
    try {
      if (!this.initialized || !this.transporter) {
        console.warn('Transporter e-mail nie jest zainicjalizowany. Nie można wysłać powiadomienia.');
        return;
      }
      
      const user = task.profile.user;
      
      // Sprawdzenie, czy użytkownik ma włączone powiadomienia e-mail
      if (user.settings && user.settings.notifications && user.settings.notifications.email) {
        // Przygotowanie wiadomości e-mail
        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: user.email,
          subject: `Przypomnienie o zadaniu: ${task.description.substring(0, 30)}...`,
          html: `
            <h2>Przypomnienie o zadaniu</h2>
            <p><strong>Wiadomość:</strong> ${reminder.message}</p>
            <p><strong>Zadanie:</strong> ${task.description}</p>
            <p><strong>Profil:</strong> ${task.profile.name}</p>
            <p><strong>Termin:</strong> ${new Date(task.deadline).toLocaleString()}</p>
            <p><strong>Priorytet:</strong> ${this.getPriorityLabel(task.priority)}</p>
            <p><a href="${process.env.FRONTEND_URL}/tasks/${task._id}">Zobacz szczegóły zadania</a></p>
          `
        };
        
        // Wysłanie wiadomości e-mail
        await this.transporter.sendMail(mailOptions);
        console.log(`Wysłano przypomnienie o zadaniu do ${user.email}`);
      }
      
      // TODO: Implementacja innych kanałów powiadomień (push, SMS, itp.)
    } catch (error) {
      console.error('Błąd podczas wysyłania powiadomienia o przypomnieniu zadania:', error);
    }
  }

  /**
   * Wysyłanie powiadomienia o przypomnieniu sesji
   * @param {Object} session - Sesja
   * @param {string} type - Typ przypomnienia (24h, 1h)
   */
  async sendSessionReminderNotification(session, type) {
    try {
      if (!this.initialized || !this.transporter) {
        console.warn('Transporter e-mail nie jest zainicjalizowany. Nie można wysłać powiadomienia.');
        return;
      }
      
      const user = session.profile.user;
      
      // Sprawdzenie, czy użytkownik ma włączone powiadomienia e-mail
      if (user.settings && user.settings.notifications && user.settings.notifications.email) {
        // Przygotowanie wiadomości e-mail
        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: user.email,
          subject: `Przypomnienie o sesji terapeutycznej: ${type === '24h' ? 'jutro' : 'za godzinę'}`,
          html: `
            <h2>Przypomnienie o sesji terapeutycznej</h2>
            <p>Twoja sesja terapeutyczna odbędzie się ${type === '24h' ? 'jutro' : 'za godzinę'}: <strong>${new Date(session.startTime).toLocaleString()}</strong></p>
            <p><strong>Profil:</strong> ${session.profile.name}</p>
            <p><strong>Metoda terapii:</strong> ${this.getTherapyMethodLabel(session.therapyMethod)}</p>
            <p><a href="${process.env.FRONTEND_URL}/sessions/${session._id}">Zobacz szczegóły sesji</a></p>
          `
        };
        
        // Wysłanie wiadomości e-mail
        await this.transporter.sendMail(mailOptions);
        console.log(`Wysłano przypomnienie o sesji (${type}) do ${user.email}`);
      }
      
      // TODO: Implementacja innych kanałów powiadomień (push, SMS, itp.)
    } catch (error) {
      console.error('Błąd podczas wysyłania powiadomienia o przypomnieniu sesji:', error);
    }
  }

  /**
   * Wysyłanie powiadomienia o zbliżającym się terminie zadania
   * @param {Object} task - Zadanie
   */
  async sendDeadlineReminderNotification(task) {
    try {
      if (!this.initialized || !this.transporter) {
        console.warn('Transporter e-mail nie jest zainicjalizowany. Nie można wysłać powiadomienia.');
        return;
      }
      
      const user = task.profile.user;
      
      // Sprawdzenie, czy użytkownik ma włączone powiadomienia e-mail
      if (user.settings && user.settings.notifications && user.settings.notifications.email) {
        // Przygotowanie wiadomości e-mail
        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: user.email,
          subject: `Zbliża się termin zadania: ${task.description.substring(0, 30)}...`,
          html: `
            <h2>Zbliża się termin zadania</h2>
            <p>Termin wykonania zadania upływa w ciągu 24 godzin: <strong>${new Date(task.deadline).toLocaleString()}</strong></p>
            <p><strong>Zadanie:</strong> ${task.description}</p>
            <p><strong>Profil:</strong> ${task.profile.name}</p>
            <p><strong>Priorytet:</strong> ${this.getPriorityLabel(task.priority)}</p>
            <p><a href="${process.env.FRONTEND_URL}/tasks/${task._id}">Zobacz szczegóły zadania</a></p>
          `
        };
        
        // Wysłanie wiadomości e-mail
        await this.transporter.sendMail(mailOptions);
        console.log(`Wysłano przypomnienie o zbliżającym się terminie zadania do ${user.email}`);
      }
      
      // TODO: Implementacja innych kanałów powiadomień (push, SMS, itp.)
    } catch (error) {
      console.error('Błąd podczas wysyłania powiadomienia o zbliżającym się terminie zadania:', error);
    }
  }

  /**
   * Pobieranie etykiety priorytetu
   * @param {string} priority - Priorytet
   * @returns {string} - Etykieta priorytetu
   */
  getPriorityLabel(priority) {
    switch (priority) {
      case 'high':
        return 'Wysoki';
      case 'medium':
        return 'Średni';
      case 'low':
        return 'Niski';
      default:
        return priority;
    }
  }

  /**
   * Pobieranie etykiety metody terapii
   * @param {string} method - Metoda terapii
   * @returns {string} - Etykieta metody terapii
   */
  getTherapyMethodLabel(method) {
    switch (method) {
      case 'cognitive_behavioral':
        return 'Terapia poznawczo-behawioralna';
      case 'psychodynamic':
        return 'Terapia psychodynamiczna';
      case 'humanistic':
        return 'Terapia humanistyczna';
      case 'systemic':
        return 'Terapia systemowa';
      case 'solution_focused':
        return 'Terapia skoncentrowana na rozwiązaniach';
      default:
        return method;
    }
  }

  /**
   * Ręczne wysłanie przypomnienia o zadaniu
   * @param {string} taskId - ID zadania
   * @param {string} reminderId - ID przypomnienia
   * @returns {Promise<boolean>} - Czy przypomnienie zostało wysłane
   */
  async sendTaskReminderManually(taskId, reminderId) {
    try {
      // Pobieranie zadania
      const task = await Task.findById(taskId).populate({
        path: 'profile',
        select: 'name user',
        populate: {
          path: 'user',
          select: 'email settings'
        }
      });
      
      if (!task) {
        throw new Error('Zadanie nie zostało znalezione');
      }
      
      // Znalezienie przypomnienia
      const reminder = task.reminders.find(r => r._id.toString() === reminderId);
      if (!reminder) {
        throw new Error('Przypomnienie nie zostało znalezione');
      }
      
      // Wysłanie przypomnienia
      await this.sendTaskReminderNotification(task, reminder);
      
      // Oznaczenie przypomnienia jako wysłane
      reminder.isSent = true;
      await task.save();
      
      return true;
    } catch (error) {
      console.error('Błąd podczas ręcznego wysyłania przypomnienia o zadaniu:', error);
      throw error;
    }
  }

  /**
   * Ręczne wysłanie przypomnienia o sesji
   * @param {string} sessionId - ID sesji
   * @returns {Promise<boolean>} - Czy przypomnienie zostało wysłane
   */
  async sendSessionReminderManually(sessionId) {
    try {
      // Pobieranie sesji
      const session = await Session.findById(sessionId).populate({
        path: 'profile',
        select: 'name user',
        populate: {
          path: 'user',
          select: 'email settings'
        }
      });
      
      if (!session) {
        throw new Error('Sesja nie została znaleziona');
      }
      
      // Wysłanie przypomnienia
      await this.sendSessionReminderNotification(session, 'manual');
      
      return true;
    } catch (error) {
      console.error('Błąd podczas ręcznego wysyłania przypomnienia o sesji:', error);
      throw error;
    }
  }

  /**
   * Ręczne wysłanie przypomnienia o zbliżającym się terminie zadania
   * @param {string} taskId - ID zadania
   * @returns {Promise<boolean>} - Czy przypomnienie zostało wysłane
   */
  async sendDeadlineReminderManually(taskId) {
    try {
      // Pobieranie zadania
      const task = await Task.findById(taskId).populate({
        path: 'profile',
        select: 'name user',
        populate: {
          path: 'user',
          select: 'email settings'
        }
      });
      
      if (!task) {
        throw new Error('Zadanie nie zostało znalezione');
      }
      
      // Wysłanie przypomnienia
      await this.sendDeadlineReminderNotification(task);
      
      return true;
    } catch (error) {
      console.error('Błąd podczas ręcznego wysyłania przypomnienia o zbliżającym się terminie zadania:', error);
      throw error;
    }
  }

  /**
   * Zatrzymanie wszystkich zadań cron
   */
  stopAllCronJobs() {
    try {
      for (const [name, job] of Object.entries(this.cronJobs)) {
        job.stop();
        console.log(`Zatrzymano zadanie cron: ${name}`);
      }
    } catch (error) {
      console.error('Błąd podczas zatrzymywania zadań cron:', error);
    }
  }
}

module.exports = new ReminderService();
