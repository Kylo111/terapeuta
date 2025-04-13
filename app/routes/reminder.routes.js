/**
 * Trasy dla kontrolera przypomnień
 * @module routes/reminder
 */

const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminder.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @route POST /api/reminders/tasks/:taskId/:reminderId
 * @desc Ręczne wysłanie przypomnienia o zadaniu
 * @access Private
 */
router.post('/reminders/tasks/:taskId/:reminderId', verifyToken, reminderController.sendTaskReminder);

/**
 * @route POST /api/reminders/sessions/:sessionId
 * @desc Ręczne wysłanie przypomnienia o sesji
 * @access Private
 */
router.post('/reminders/sessions/:sessionId', verifyToken, reminderController.sendSessionReminder);

/**
 * @route POST /api/reminders/deadlines/:taskId
 * @desc Ręczne wysłanie przypomnienia o zbliżającym się terminie zadania
 * @access Private
 */
router.post('/reminders/deadlines/:taskId', verifyToken, reminderController.sendDeadlineReminder);

/**
 * @route GET /api/reminders/settings
 * @desc Pobieranie ustawień powiadomień użytkownika
 * @access Private
 */
router.get('/reminders/settings', verifyToken, reminderController.getNotificationSettings);

/**
 * @route PUT /api/reminders/settings
 * @desc Aktualizacja ustawień powiadomień użytkownika
 * @access Private
 */
router.put('/reminders/settings', verifyToken, reminderController.updateNotificationSettings);

module.exports = router;
