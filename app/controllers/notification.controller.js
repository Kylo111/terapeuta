/**
 * Kontroler powiadomień
 * @module controllers/notification
 */

const notificationService = require('../services/notification.service');

/**
 * Pobiera powiadomienia użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const options = req.query;

    const result = await notificationService.getNotifications(userId, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Błąd podczas pobierania powiadomień:', error);
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
 * Pobiera liczbę nieprzeczytanych powiadomień użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const count = await notificationService.getUnreadCount(userId);

    res.json({
      success: true,
      data: {
        count
      }
    });
  } catch (error) {
    console.error('Błąd podczas pobierania liczby nieprzeczytanych powiadomień:', error);
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
 * Tworzy nowe powiadomienie
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.createNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationData = {
      ...req.body,
      user: userId
    };

    const notification = await notificationService.createNotification(notificationData);

    res.status(201).json({
      success: true,
      data: {
        notification
      },
      message: 'Powiadomienie zostało utworzone'
    });
  } catch (error) {
    console.error('Błąd podczas tworzenia powiadomienia:', error);
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
 * Oznacza powiadomienie jako przeczytane
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationId = req.params.id;

    const notification = await notificationService.markAsRead(notificationId, userId);

    res.json({
      success: true,
      data: {
        notification
      },
      message: 'Powiadomienie zostało oznaczone jako przeczytane'
    });
  } catch (error) {
    console.error('Błąd podczas oznaczania powiadomienia jako przeczytane:', error);
    
    if (error.message === 'Powiadomienie nie istnieje') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOTIFICATION_NOT_FOUND',
          message: 'Powiadomienie nie istnieje'
        }
      });
    }

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
 * Oznacza wszystkie powiadomienia użytkownika jako przeczytane
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    const count = await notificationService.markAllAsRead(userId);

    res.json({
      success: true,
      data: {
        count
      },
      message: 'Wszystkie powiadomienia zostały oznaczone jako przeczytane'
    });
  } catch (error) {
    console.error('Błąd podczas oznaczania wszystkich powiadomień jako przeczytane:', error);
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
 * Usuwa powiadomienie
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationId = req.params.id;

    await notificationService.deleteNotification(notificationId, userId);

    res.json({
      success: true,
      message: 'Powiadomienie zostało usunięte'
    });
  } catch (error) {
    console.error('Błąd podczas usuwania powiadomienia:', error);
    
    if (error.message === 'Powiadomienie nie istnieje') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOTIFICATION_NOT_FOUND',
          message: 'Powiadomienie nie istnieje'
        }
      });
    }

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
 * Usuwa wszystkie powiadomienia użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const count = await notificationService.deleteAllNotifications(userId);

    res.json({
      success: true,
      data: {
        count
      },
      message: 'Wszystkie powiadomienia zostały usunięte'
    });
  } catch (error) {
    console.error('Błąd podczas usuwania wszystkich powiadomień:', error);
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
 * Tworzy przypomnienie
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.createReminder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, message, scheduledFor, action, relatedId, relatedType } = req.body;

    if (!title || !message || !scheduledFor) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATA',
          message: 'Brak wymaganych danych'
        }
      });
    }

    const reminder = await notificationService.createReminder(
      userId,
      title,
      message,
      new Date(scheduledFor),
      action,
      relatedId,
      relatedType
    );

    res.status(201).json({
      success: true,
      data: {
        reminder
      },
      message: 'Przypomnienie zostało utworzone'
    });
  } catch (error) {
    console.error('Błąd podczas tworzenia przypomnienia:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};
