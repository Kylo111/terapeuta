/**
 * Trasy dla kontrolera metod terapeutycznych
 * @module routes/therapy-method
 */

const express = require('express');
const router = express.Router();
const therapyMethodController = require('../controllers/therapy-method.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

/**
 * @route GET /api/therapy-methods
 * @desc Pobiera wszystkie metody terapeutyczne
 * @access Public
 */
router.get('/', therapyMethodController.getAllTherapyMethods);

/**
 * @route GET /api/therapy-methods/:id
 * @desc Pobiera metodę terapeutyczną po ID
 * @access Public
 */
router.get('/:id', therapyMethodController.getTherapyMethodById);

/**
 * @route POST /api/therapy-methods
 * @desc Tworzy nową metodę terapeutyczną
 * @access Private (Admin)
 */
router.post('/', verifyToken, verifyAdmin, therapyMethodController.createTherapyMethod);

/**
 * @route PUT /api/therapy-methods/:id
 * @desc Aktualizuje metodę terapeutyczną
 * @access Private (Admin)
 */
router.put('/:id', verifyToken, verifyAdmin, therapyMethodController.updateTherapyMethod);

/**
 * @route DELETE /api/therapy-methods/:id
 * @desc Usuwa metodę terapeutyczną
 * @access Private (Admin)
 */
router.delete('/:id', verifyToken, verifyAdmin, therapyMethodController.deleteTherapyMethod);

/**
 * @route POST /api/therapy-methods/:id/techniques
 * @desc Dodaje technikę do metody terapeutycznej
 * @access Private (Admin)
 */
router.post('/:id/techniques', verifyToken, verifyAdmin, therapyMethodController.addTechnique);

/**
 * @route GET /api/therapy-methods/:id/techniques
 * @desc Pobiera wszystkie techniki dla metody terapeutycznej
 * @access Public
 */
router.get('/:id/techniques', therapyMethodController.getTechniques);

module.exports = router;
