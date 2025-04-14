/**
 * Trasy API dla ćwiczeń terapeutycznych
 * @module routes/exercise
 */

const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exercise.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware uwierzytelniania
router.use(authMiddleware);

/**
 * @route GET /api/exercises
 * @desc Pobiera wszystkie ćwiczenia użytkownika
 * @access Private
 */
router.get('/', exerciseController.getExercises);

/**
 * @route GET /api/exercises/stats
 * @desc Pobiera statystyki ćwiczeń użytkownika
 * @access Private
 */
router.get('/stats', exerciseController.getExerciseStats);

/**
 * @route GET /api/exercises/:id
 * @desc Pobiera ćwiczenie po ID
 * @access Private
 */
router.get('/:id', exerciseController.getExerciseById);

/**
 * @route POST /api/exercises
 * @desc Tworzy nowe ćwiczenie
 * @access Private
 */
router.post('/', exerciseController.createExercise);

/**
 * @route PUT /api/exercises/:id
 * @desc Aktualizuje ćwiczenie
 * @access Private
 */
router.put('/:id', exerciseController.updateExercise);

/**
 * @route DELETE /api/exercises/:id
 * @desc Usuwa ćwiczenie
 * @access Private
 */
router.delete('/:id', exerciseController.deleteExercise);

/**
 * @route POST /api/exercises/:id/history
 * @desc Dodaje wpis do historii wykonania ćwiczenia
 * @access Private
 */
router.post('/:id/history', exerciseController.addHistoryEntry);

/**
 * @route POST /api/exercises/initialize
 * @desc Inicjalizuje domyślne ćwiczenia dla użytkownika
 * @access Private
 */
router.post('/initialize', exerciseController.initializeDefaultExercises);

module.exports = router;
