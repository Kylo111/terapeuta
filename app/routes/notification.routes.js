/**
 * Trasy API dla powiadomień
 * @module routes/notification
 */

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware uwierzytelniania
router.use(authMiddleware);

/**
 * @route GET /api/notifications
 * @desc Pobiera powiadomienia użytkownika
 * @access Private
 */
router.get('/', notificationController.getNotifications);

/**
 * @route GET /api/notifications/unread
 * @desc Pobiera liczbę nieprzeczytanych powiadomień użytkownika
 * @access Private
 */
router.get('/unread', notificationController.getUnreadCount);

/**
 * @route POST /api/notifications
 * @desc Tworzy nowe powiadomienie
 * @access Private
 */
router.post('/', notificationController.createNotification);

/**
 * @route PUT /api/notifications/:id/read
 * @desc Oznacza powiadomienie jako przeczytane
 * @access Private
 */
router.put('/:id/read', notificationController.markAsRead);

/**
 * @route PUT /api/notifications/read-all
 * @desc Oznacza wszystkie powiadomienia użytkownika jako przeczytane
 * @access Private
 */
router.put('/read-all', notificationController.markAllAsRead);

/**
 * @route DELETE /api/notifications/:id
 * @desc Usuwa powiadomienie
 * @access Private
 */
router.delete('/:id', notificationController.deleteNotification);

/**
 * @route DELETE /api/notifications
 * @desc Usuwa wszystkie powiadomienia użytkownika
 * @access Private
 */
router.delete('/', notificationController.deleteAllNotifications);

/**
 * @route POST /api/notifications/reminder
 * @desc Tworzy przypomnienie
 * @access Private
 */
router.post('/reminder', notificationController.createReminder);

module.exports = router;
