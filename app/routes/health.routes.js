/**
 * Trasy dla kontrolera zdrowia
 * @module routes/health
 */

const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

/**
 * @route GET /api/health
 * @desc Sprawdza stan zdrowia aplikacji
 * @access Public
 */
router.get('/', healthController.checkHealth);

module.exports = router;
