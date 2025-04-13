/**
 * Trasy dla kontrolera modeli językowych (LLM)
 * @module routes/llm
 */

const express = require('express');
const router = express.Router();
const llmController = require('../controllers/llm.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @route GET /api/llm/providers
 * @desc Pobiera dostępnych dostawców LLM
 * @access Private
 */
router.get('/providers', verifyToken, llmController.getProviders);

/**
 * @route GET /api/llm/providers/:providerId/models
 * @desc Pobiera dostępne modele dla dostawcy LLM
 * @access Private
 */
router.get('/providers/:providerId/models', verifyToken, llmController.getModels);

/**
 * @route POST /api/llm/completions
 * @desc Generuje odpowiedź od modelu LLM
 * @access Private
 */
router.post('/completions', verifyToken, llmController.generateCompletion);

/**
 * @route POST /api/llm/embeddings
 * @desc Generuje embeddingi dla tekstu
 * @access Private
 */
router.post('/embeddings', verifyToken, llmController.generateEmbeddings);

/**
 * @route POST /api/llm/therapy-response
 * @desc Generuje odpowiedź asystenta dla sesji terapeutycznej
 * @access Private
 */
router.post('/therapy-response', verifyToken, llmController.generateTherapyResponse);

module.exports = router;
