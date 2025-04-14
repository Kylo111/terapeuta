/**
 * Trasy API dla eksportu/importu danych
 * @module routes/export
 */

const express = require('express');
const router = express.Router();
const exportController = require('../controllers/export.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware uwierzytelniania
router.use(authMiddleware);

/**
 * @route POST /api/export/json
 * @desc Eksportuje dane użytkownika do formatu JSON
 * @access Private
 */
router.post('/json', exportController.exportToJSON);

/**
 * @route POST /api/export/csv
 * @desc Eksportuje dane użytkownika do formatu CSV
 * @access Private
 */
router.post('/csv', exportController.exportToCSV);

/**
 * @route POST /api/export/pdf
 * @desc Eksportuje dane użytkownika do formatu PDF
 * @access Private
 */
router.post('/pdf', exportController.exportToPDF);

/**
 * @route POST /api/export/zip
 * @desc Eksportuje dane użytkownika do archiwum ZIP
 * @access Private
 */
router.post('/zip', exportController.exportToZIP);

/**
 * @route POST /api/export/import
 * @desc Importuje dane użytkownika z formatu JSON
 * @access Private
 */
router.post('/import', exportController.importFromJSON);

module.exports = router;
