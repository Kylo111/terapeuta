/**
 * Trasy dla kontrolera zadań
 * @module routes/task
 */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @route GET /api/tasks
 * @desc Pobiera wszystkie zadania użytkownika
 * @access Private
 */
router.get('/tasks', verifyToken, taskController.getTasks);

/**
 * @route GET /api/tasks/stats
 * @desc Pobiera statystyki zadań użytkownika
 * @access Private
 */
router.get('/tasks/stats', verifyToken, taskController.getTaskStats);

/**
 * @route GET /api/tasks/:id
 * @desc Pobiera szczegóły zadania
 * @access Private
 */
router.get('/tasks/:id', verifyToken, taskController.getTask);

/**
 * @route POST /api/tasks
 * @desc Tworzy nowe zadanie
 * @access Private
 */
router.post('/tasks', verifyToken, taskController.createTask);

/**
 * @route PUT /api/tasks/:id
 * @desc Aktualizuje zadanie
 * @access Private
 */
router.put('/tasks/:id', verifyToken, taskController.updateTask);

/**
 * @route DELETE /api/tasks/:id
 * @desc Usuwa zadanie
 * @access Private
 */
router.delete('/tasks/:id', verifyToken, taskController.deleteTask);

/**
 * @route POST /api/tasks/:id/complete
 * @desc Oznacza zadanie jako ukończone
 * @access Private
 */
router.post('/tasks/:id/complete', verifyToken, taskController.completeTask);

/**
 * @route POST /api/tasks/:id/incomplete
 * @desc Oznacza zadanie jako nieukończone
 * @access Private
 */
router.post('/tasks/:id/incomplete', verifyToken, taskController.incompleteTask);

/**
 * @route POST /api/tasks/:id/reminders
 * @desc Dodaje przypomnienie do zadania
 * @access Private
 */
router.post('/tasks/:id/reminders', verifyToken, taskController.addReminder);

/**
 * @route PUT /api/tasks/:id/reminders/:reminderId
 * @desc Aktualizuje przypomnienie w zadaniu
 * @access Private
 */
router.put('/tasks/:id/reminders/:reminderId', verifyToken, taskController.updateReminder);

/**
 * @route DELETE /api/tasks/:id/reminders/:reminderId
 * @desc Usuwa przypomnienie z zadania
 * @access Private
 */
router.delete('/tasks/:id/reminders/:reminderId', verifyToken, taskController.deleteReminder);

module.exports = router;
