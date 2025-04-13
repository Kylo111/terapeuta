/**
 * Kontroler przypomnień
 * @module controllers/reminder
 */

const reminderService = require('../services/reminder.service');
const Task = require('../data/models/task');
const Profile = require('../data/models/profile');
const Session = require('../data/models/session');

/**
 * Ręczne wysłanie przypomnienia o zadaniu
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.sendTaskReminder = async (req, res) => {
  try {
    const { taskId, reminderId } = req.params;
    const userId = req.user.userId;

    // Pobieranie zadania
    const task = await Task.findById(taskId).populate('profile');
    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Zadanie nie zostało znalezione'
        }
      });
    }

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: task.profile._id, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tego zadania'
        }
      });
    }

    // Znalezienie przypomnienia
    const reminder = task.reminders.find(r => r._id.toString() === reminderId);
    if (!reminder) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REMINDER_NOT_FOUND',
          message: 'Przypomnienie nie zostało znalezione'
        }
      });
    }

    // Wysłanie przypomnienia
    await reminderService.sendTaskReminderManually(taskId, reminderId);

    res.status(200).json({
      success: true,
      message: 'Przypomnienie zostało wysłane'
    });
  } catch (error) {
    console.error('Błąd podczas wysyłania przypomnienia o zadaniu:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Ręczne wysłanie przypomnienia o sesji
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.sendSessionReminder = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    // Pobieranie sesji
    const session = await Session.findById(sessionId).populate('profile');
    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Sesja nie została znaleziona'
        }
      });
    }

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: session.profile._id, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tej sesji'
        }
      });
    }

    // Wysłanie przypomnienia
    await reminderService.sendSessionReminderManually(sessionId);

    res.status(200).json({
      success: true,
      message: 'Przypomnienie zostało wysłane'
    });
  } catch (error) {
    console.error('Błąd podczas wysyłania przypomnienia o sesji:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Ręczne wysłanie przypomnienia o zbliżającym się terminie zadania
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.sendDeadlineReminder = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;

    // Pobieranie zadania
    const task = await Task.findById(taskId).populate('profile');
    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Zadanie nie zostało znalezione'
        }
      });
    }

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: task.profile._id, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tego zadania'
        }
      });
    }

    // Wysłanie przypomnienia
    await reminderService.sendDeadlineReminderManually(taskId);

    res.status(200).json({
      success: true,
      message: 'Przypomnienie zostało wysłane'
    });
  } catch (error) {
    console.error('Błąd podczas wysyłania przypomnienia o zbliżającym się terminie zadania:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Pobieranie ustawień powiadomień użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Pobieranie użytkownika
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Użytkownik nie został znaleziony'
        }
      });
    }

    // Pobieranie ustawień powiadomień
    const notificationSettings = user.settings?.notifications || {
      email: true,
      push: false,
      sms: false,
      taskReminders: true,
      sessionReminders: true,
      deadlineReminders: true
    };

    res.status(200).json({
      success: true,
      data: notificationSettings
    });
  } catch (error) {
    console.error('Błąd podczas pobierania ustawień powiadomień:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Aktualizacja ustawień powiadomień użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { email, push, sms, taskReminders, sessionReminders, deadlineReminders } = req.body;

    // Pobieranie użytkownika
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Użytkownik nie został znaleziony'
        }
      });
    }

    // Inicjalizacja ustawień, jeśli nie istnieją
    if (!user.settings) {
      user.settings = {};
    }
    if (!user.settings.notifications) {
      user.settings.notifications = {};
    }

    // Aktualizacja ustawień powiadomień
    if (email !== undefined) user.settings.notifications.email = email;
    if (push !== undefined) user.settings.notifications.push = push;
    if (sms !== undefined) user.settings.notifications.sms = sms;
    if (taskReminders !== undefined) user.settings.notifications.taskReminders = taskReminders;
    if (sessionReminders !== undefined) user.settings.notifications.sessionReminders = sessionReminders;
    if (deadlineReminders !== undefined) user.settings.notifications.deadlineReminders = deadlineReminders;

    // Zapisanie zmian
    await user.save();

    res.status(200).json({
      success: true,
      data: user.settings.notifications,
      message: 'Ustawienia powiadomień zostały zaktualizowane'
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji ustawień powiadomień:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};
