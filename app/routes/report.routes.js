/**
 * Trasy API dla raportów
 * @module routes/report
 */

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware uwierzytelniania
router.use(authMiddleware);

/**
 * @route GET /api/reports
 * @desc Pobiera wszystkie raporty użytkownika
 * @access Private
 */
router.get('/', reportController.getReports);

/**
 * @route GET /api/reports/:id
 * @desc Pobiera szczegóły raportu
 * @access Private
 */
router.get('/:id', reportController.getReport);

/**
 * @route POST /api/reports/sessions/:sessionId
 * @desc Generuje raport z sesji
 * @access Private
 */
router.post('/sessions/:sessionId', reportController.generateSessionReport);

/**
 * @route POST /api/reports/progress/:profileId
 * @desc Generuje raport postępu
 * @access Private
 */
router.post('/progress/:profileId', reportController.generateProgressReport);

/**
 * @route POST /api/reports/tasks/:profileId
 * @desc Generuje raport zadań
 * @access Private
 */
router.post('/tasks/:profileId', reportController.generateTasksReport);

/**
 * @route POST /api/reports/sentiment/:profileId
 * @desc Generuje raport analizy sentymentu
 * @access Private
 */
router.post('/sentiment/:profileId', reportController.generateSentimentReport);

/**
 * @route DELETE /api/reports/:id
 * @desc Usuwa raport
 * @access Private
 */
router.delete('/:id', reportController.deleteReport);

module.exports = router;
