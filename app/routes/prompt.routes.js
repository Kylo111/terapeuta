/**
 * Trasy dla kontrolera promptów
 * @module routes/prompt
 */

const express = require('express');
const router = express.Router();
const promptController = require('../controllers/prompt.controller');

/**
 * @route GET /api/prompts
 * @desc Pobiera wszystkie prompty
 * @access Public
 */
router.get('/', promptController.getAllPrompts);

/**
 * @route GET /api/prompts/:id
 * @desc Pobiera prompt po ID
 * @access Public
 */
router.get('/:id', promptController.getPromptById);

/**
 * @route POST /api/prompts
 * @desc Tworzy nowy prompt
 * @access Private (Admin)
 */
router.post('/', promptController.createPrompt);

/**
 * @route PUT /api/prompts/:id
 * @desc Aktualizuje prompt
 * @access Private (Admin)
 */
router.put('/:id', promptController.updatePrompt);

/**
 * @route DELETE /api/prompts/:id
 * @desc Usuwa prompt
 * @access Private (Admin)
 */
router.delete('/:id', promptController.deletePrompt);

/**
 * @route POST /api/prompts/:id/effectiveness
 * @desc Dodaje ocenę skuteczności promptu
 * @access Private
 */
router.post('/:id/effectiveness', promptController.addEffectivenessRating);

/**
 * @route POST /api/prompts/:id/feedback
 * @desc Dodaje opinię użytkownika o promptcie
 * @access Private
 */
router.post('/:id/feedback', promptController.addFeedback);

/**
 * @route POST /api/prompts/:id/render
 * @desc Renderuje prompt z podstawionymi zmiennymi
 * @access Private
 */
router.post('/:id/render', promptController.renderPrompt);

module.exports = router;
