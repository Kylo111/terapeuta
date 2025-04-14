/**
 * Serwis powiadomień
 * @module services/notification
 */

const Notification = require('../data/models/notification');
const User = require('../data/models/user');
const emailService = require('./email.service');
const config = require('../config');

/**
 * Klasa serwisu powiadomień
 */
class NotificationService {
  /**
   * Pobiera powiadomienia użytkownika
   * @param {string} userId - ID użytkownika
   * @param {Object} options - Opcje filtrowania
   * @returns {Promise<Array>} - Lista powiadomień
   */
  async getNotifications(userId, options = {}) {
    try {
      const query = { user: userId };

      // Filtrowanie po statusie przeczytania
      if (options.isRead !== undefined) {
        query.isRead = options.isRead;
      }

      // Filtrowanie po typie
      if (options.type) {
        query.type = options.type;
      }

      // Filtrowanie po priorytecie
      if (options.priority) {
        query.priority = options.priority;
      }

      // Filtrowanie po dacie
      if (options.startDate || options.endDate) {
        query.createdAt = {};
        if (options.startDate) {
          query.createdAt.$gte = new Date(options.startDate);
        }
        if (options.endDate) {
          query.createdAt.$lte = new Date(options.endDate);
        }
      }

      // Sortowanie
      const sortOptions = {};
      if (options.sortBy) {
        sortOptions[options.sortBy] = options.sortOrder === 'desc' ? -1 : 1;
      } else {
        sortOptions.createdAt = -1; // Domyślnie sortuj od najnowszych
      }

      // Paginacja
      const limit = options.limit || 20;
      const skip = options.page ? (options.page - 1) * limit : 0;

      const notifications = await Notification.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const total = await Notification.countDocuments(query);

      return {
        notifications,
        pagination: {
          total,
          page: options.page || 1,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Błąd podczas pobierania powiadomień:', error);
      throw error;
    }
  }

  /**
   * Pobiera liczbę nieprzeczytanych powiadomień użytkownika
   * @param {string} userId - ID użytkownika
   * @returns {Promise<number>} - Liczba nieprzeczytanych powiadomień
   */
  async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({
        user: userId,
        isRead: false
      });
      return count;
    } catch (error) {
      console.error('Błąd podczas pobierania liczby nieprzeczytanych powiadomień:', error);
      throw error;
    }
  }

  /**
   * Tworzy nowe powiadomienie
   * @param {Object} notificationData - Dane powiadomienia
   * @returns {Promise<Object>} - Utworzone powiadomienie
   */
  async createNotification(notificationData) {
    try {
      const notification = new Notification(notificationData);
      
      // Jeśli powiadomienie ma być wysłane natychmiast
      if (!notification.scheduledFor) {
        notification.isSent = true;
        notification.sentAt = new Date();
        
        // Wysyłanie powiadomienia e-mail
        if (notification.channels.email) {
          await this.sendEmailNotification(notification);
        }
        
        // Wysyłanie powiadomienia push
        if (notification.channels.push) {
          await this.sendPushNotification(notification);
        }
      }
      
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Błąd podczas tworzenia powiadomienia:', error);
      throw error;
    }
  }

  /**
   * Oznacza powiadomienie jako przeczytane
   * @param {string} notificationId - ID powiadomienia
   * @param {string} userId - ID użytkownika
   * @returns {Promise<Object>} - Zaktualizowane powiadomienie
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        user: userId
      });

      if (!notification) {
        throw new Error('Powiadomienie nie istnieje');
      }

      if (!notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();
      }

      return notification;
    } catch (error) {
      console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', error);
      throw error;
    }
  }

  /**
   * Oznacza wszystkie powiadomienia użytkownika jako przeczytane
   * @param {string} userId - ID użytkownika
   * @returns {Promise<number>} - Liczba zaktualizowanych powiadomień
   */
  async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      return result.nModified;
    } catch (error) {
      console.error('Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:', error);
      throw error;
    }
  }

  /**
   * Usuwa powiadomienie
   * @param {string} notificationId - ID powiadomienia
   * @param {string} userId - ID użytkownika
   * @returns {Promise<boolean>} - Czy operacja się powiodła
   */
  async deleteNotification(notificationId, userId) {
    try {
      const result = await Notification.deleteOne({
        _id: notificationId,
        user: userId
      });

      if (result.deletedCount === 0) {
        throw new Error('Powiadomienie nie istnieje');
      }

      return true;
    } catch (error) {
      console.error('Błąd podczas usuwania powiadomienia:', error);
      throw error;
    }
  }

  /**
   * Usuwa wszystkie powiadomienia użytkownika
   * @param {string} userId - ID użytkownika
   * @returns {Promise<number>} - Liczba usuniętych powiadomień
   */
  async deleteAllNotifications(userId) {
    try {
      const result = await Notification.deleteMany({ user: userId });
      return result.deletedCount;
    } catch (error) {
      console.error('Błąd podczas usuwania wszystkich powiadomień:', error);
      throw error;
    }
  }

  /**
   * Wysyła zaplanowane powiadomienia
   * @returns {Promise<number>} - Liczba wysłanych powiadomień
   */
  async sendScheduledNotifications() {
    try {
      const now = new Date();
      
      // Pobierz powiadomienia, które powinny być wysłane
      const notifications = await Notification.find({
        scheduledFor: { $lte: now },
        isSent: false
      });
      
      let sentCount = 0;
      
      // Wysyłanie powiadomień
      for (const notification of notifications) {
        // Wysyłanie powiadomienia e-mail
        if (notification.channels.email) {
          await this.sendEmailNotification(notification);
        }
        
        // Wysyłanie powiadomienia push
        if (notification.channels.push) {
          await this.sendPushNotification(notification);
        }
        
        // Aktualizacja statusu powiadomienia
        notification.isSent = true;
        notification.sentAt = now;
        await notification.save();
        
        sentCount++;
      }
      
      return sentCount;
    } catch (error) {
      console.error('Błąd podczas wysyłania zaplanowanych powiadomień:', error);
      throw error;
    }
  }

  /**
   * Wysyła powiadomienie e-mail
   * @param {Object} notification - Powiadomienie
   * @returns {Promise<void>}
   */
  async sendEmailNotification(notification) {
    try {
      // Pobierz dane użytkownika
      const user = await User.findById(notification.user);
      
      if (!user || !user.email) {
        console.warn('Nie można wysłać powiadomienia e-mail - brak adresu e-mail użytkownika');
        return;
      }
      
      // Przygotowanie danych e-maila
      const emailData = {
        to: user.email,
        subject: notification.title,
        text: notification.message,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">${notification.title}</h2>
            <p style="color: #666; font-size: 16px;">${notification.message}</p>
            ${notification.action ? `<a href="${config.appUrl}${notification.action}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px;">Przejdź do aplikacji</a>` : ''}
            <p style="color: #999; font-size: 12px; margin-top: 30px;">To jest automatyczna wiadomość, prosimy na nią nie odpowiadać.</p>
          </div>
        `
      };
      
      // Wysłanie e-maila
      await emailService.sendEmail(emailData);
    } catch (error) {
      console.error('Błąd podczas wysyłania powiadomienia e-mail:', error);
      // Nie rzucaj błędu, aby nie przerywać procesu wysyłania powiadomień
    }
  }

  /**
   * Wysyła powiadomienie push
   * @param {Object} notification - Powiadomienie
   * @returns {Promise<void>}
   */
  async sendPushNotification(notification) {
    try {
      // Implementacja wysyłania powiadomień push
      // To jest zaślepka - faktyczna implementacja zależy od wybranego dostawcy powiadomień push
      console.log('Wysyłanie powiadomienia push:', notification.title);
    } catch (error) {
      console.error('Błąd podczas wysyłania powiadomienia push:', error);
      // Nie rzucaj błędu, aby nie przerywać procesu wysyłania powiadomień
    }
  }

  /**
   * Tworzy powiadomienie o sesji
   * @param {Object} session - Sesja
   * @param {string} userId - ID użytkownika
   * @param {string} type - Typ powiadomienia (reminder, start, end)
   * @param {Date} scheduledFor - Data i czas zaplanowanego wysłania powiadomienia
   * @returns {Promise<Object>} - Utworzone powiadomienie
   */
  async createSessionNotification(session, userId, type = 'reminder', scheduledFor = null) {
    try {
      let title, message, action;
      
      switch (type) {
        case 'reminder':
          title = 'Przypomnienie o sesji';
          message = `Przypominamy o nadchodzącej sesji terapeutycznej ${session.therapyMethod || ''}, która rozpocznie się ${new Date(session.startTime).toLocaleString('pl-PL')}.`;
          action = `/sessions/${session._id}`;
          break;
        case 'start':
          title = 'Sesja rozpoczęta';
          message = `Twoja sesja terapeutyczna ${session.therapyMethod || ''} właśnie się rozpoczęła.`;
          action = `/sessions/${session._id}`;
          break;
        case 'end':
          title = 'Sesja zakończona';
          message = `Twoja sesja terapeutyczna ${session.therapyMethod || ''} została zakończona. Możesz teraz dodać podsumowanie i ocenić jej efektywność.`;
          action = `/sessions/${session._id}`;
          break;
        default:
          title = 'Powiadomienie o sesji';
          message = `Informacja dotycząca sesji terapeutycznej ${session.therapyMethod || ''}.`;
          action = `/sessions/${session._id}`;
      }
      
      const notificationData = {
        user: userId,
        title,
        message,
        type: 'session',
        priority: 'medium',
        action,
        relatedId: session._id,
        relatedType: 'session',
        channels: {
          app: true,
          email: true,
          push: false
        },
        scheduledFor
      };
      
      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Błąd podczas tworzenia powiadomienia o sesji:', error);
      throw error;
    }
  }

  /**
   * Tworzy powiadomienie o zadaniu
   * @param {Object} task - Zadanie
   * @param {string} userId - ID użytkownika
   * @param {string} type - Typ powiadomienia (reminder, due, completed)
   * @param {Date} scheduledFor - Data i czas zaplanowanego wysłania powiadomienia
   * @returns {Promise<Object>} - Utworzone powiadomienie
   */
  async createTaskNotification(task, userId, type = 'reminder', scheduledFor = null) {
    try {
      let title, message, action, priority;
      
      switch (type) {
        case 'reminder':
          title = 'Przypomnienie o zadaniu';
          message = `Przypominamy o zadaniu "${task.title}", które ma termin wykonania ${task.dueDate ? new Date(task.dueDate).toLocaleString('pl-PL') : 'wkrótce'}.`;
          action = `/tasks/${task._id}`;
          priority = 'medium';
          break;
        case 'due':
          title = 'Termin zadania';
          message = `Dzisiaj upływa termin wykonania zadania "${task.title}".`;
          action = `/tasks/${task._id}`;
          priority = 'high';
          break;
        case 'completed':
          title = 'Zadanie ukończone';
          message = `Gratulacje! Zadanie "${task.title}" zostało oznaczone jako ukończone.`;
          action = `/tasks/${task._id}`;
          priority = 'low';
          break;
        default:
          title = 'Powiadomienie o zadaniu';
          message = `Informacja dotycząca zadania "${task.title}".`;
          action = `/tasks/${task._id}`;
          priority = 'medium';
      }
      
      const notificationData = {
        user: userId,
        title,
        message,
        type: 'task',
        priority,
        action,
        relatedId: task._id,
        relatedType: 'task',
        channels: {
          app: true,
          email: task.priority === 'high',
          push: false
        },
        scheduledFor
      };
      
      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Błąd podczas tworzenia powiadomienia o zadaniu:', error);
      throw error;
    }
  }

  /**
   * Tworzy powiadomienie systemowe
   * @param {string} userId - ID użytkownika
   * @param {string} title - Tytuł powiadomienia
   * @param {string} message - Treść powiadomienia
   * @param {string} action - Akcja powiadomienia
   * @param {string} priority - Priorytet powiadomienia
   * @param {Date} scheduledFor - Data i czas zaplanowanego wysłania powiadomienia
   * @returns {Promise<Object>} - Utworzone powiadomienie
   */
  async createSystemNotification(userId, title, message, action = null, priority = 'medium', scheduledFor = null) {
    try {
      const notificationData = {
        user: userId,
        title,
        message,
        type: 'system',
        priority,
        action,
        channels: {
          app: true,
          email: priority === 'high',
          push: false
        },
        scheduledFor
      };
      
      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Błąd podczas tworzenia powiadomienia systemowego:', error);
      throw error;
    }
  }

  /**
   * Tworzy przypomnienie
   * @param {string} userId - ID użytkownika
   * @param {string} title - Tytuł przypomnienia
   * @param {string} message - Treść przypomnienia
   * @param {Date} scheduledFor - Data i czas zaplanowanego wysłania przypomnienia
   * @param {string} action - Akcja przypomnienia
   * @param {string} relatedId - ID powiązanego obiektu
   * @param {string} relatedType - Typ powiązanego obiektu
   * @returns {Promise<Object>} - Utworzone przypomnienie
   */
  async createReminder(userId, title, message, scheduledFor, action = null, relatedId = null, relatedType = null) {
    try {
      const reminderData = {
        user: userId,
        title,
        message,
        type: 'reminder',
        priority: 'medium',
        action,
        relatedId,
        relatedType,
        channels: {
          app: true,
          email: true,
          push: false
        },
        scheduledFor
      };
      
      return await this.createNotification(reminderData);
    } catch (error) {
      console.error('Błąd podczas tworzenia przypomnienia:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
