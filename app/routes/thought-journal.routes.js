/**
 * Trasy API dla dziennika myśli i emocji
 * @module routes/thought-journal
 */

const express = require('express');
const router = express.Router();
const thoughtJournalController = require('../controllers/thought-journal.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware uwierzytelniania
router.use(authMiddleware);

/**
 * @route GET /api/journal
 * @desc Pobiera wszystkie wpisy z dziennika użytkownika
 * @access Private
 */
router.get('/', thoughtJournalController.getEntries);

/**
 * @route GET /api/journal/stats
 * @desc Pobiera statystyki dziennika myśli i emocji
 * @access Private
 */
router.get('/stats', thoughtJournalController.getJournalStats);

/**
 * @route GET /api/journal/:id
 * @desc Pobiera wpis z dziennika po ID
 * @access Private
 */
router.get('/:id', thoughtJournalController.getEntryById);

/**
 * @route POST /api/journal
 * @desc Tworzy nowy wpis w dzienniku
 * @access Private
 */
router.post('/', thoughtJournalController.createEntry);

/**
 * @route PUT /api/journal/:id
 * @desc Aktualizuje wpis w dzienniku
 * @access Private
 */
router.put('/:id', thoughtJournalController.updateEntry);

/**
 * @route DELETE /api/journal/:id
 * @desc Usuwa wpis z dziennika
 * @access Private
 */
router.delete('/:id', thoughtJournalController.deleteEntry);

module.exports = router;
