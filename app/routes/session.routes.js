/**
 * Trasy dla kontrolera sesji terapeutycznych
 * @module routes/session
 */

const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @route GET /api/profiles/:profileId/sessions
 * @desc Pobiera wszystkie sesje dla danego profilu
 * @access Private
 */
router.get('/profiles/:profileId/sessions', verifyToken, sessionController.getSessionsByProfile);

/**
 * @route GET /api/sessions/:sessionId
 * @desc Pobiera sesję po ID
 * @access Private
 */
router.get('/sessions/:sessionId', verifyToken, sessionController.getSessionById);

/**
 * @route POST /api/sessions
 * @desc Tworzy nową sesję
 * @access Private
 */
router.post('/sessions', verifyToken, sessionController.createSession);

/**
 * @route POST /api/sessions/:sessionId/messages
 * @desc Dodaje wiadomość do sesji
 * @access Private
 */
router.post('/sessions/:sessionId/messages', verifyToken, sessionController.addMessage);

/**
 * @route PUT /api/sessions/:sessionId/end
 * @desc Kończy sesję
 * @access Private
 */
router.put('/sessions/:sessionId/end', verifyToken, sessionController.endSession);

/**
 * @route POST /api/sessions/:sessionId/tasks
 * @desc Dodaje zadanie do sesji
 * @access Private
 */
router.post('/sessions/:sessionId/tasks', verifyToken, sessionController.addTask);

/**
 * @route GET /api/sessions/:sessionId/tasks
 * @desc Pobiera wszystkie zadania sesji
 * @access Private
 */
router.get('/sessions/:sessionId/tasks', verifyToken, sessionController.getSessionTasks);

/**
 * @route GET /api/sessions/:sessionId/export
 * @desc Eksportuje sesję do pliku JSON
 * @access Private
 */
router.get('/sessions/:sessionId/export', verifyToken, sessionController.exportSession);

module.exports = router;
