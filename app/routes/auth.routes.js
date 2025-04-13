/**
 * Trasy dla kontrolera uwierzytelniania
 * @module routes/auth
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @route POST /api/auth/register
 * @desc Rejestracja nowego użytkownika
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @desc Logowanie użytkownika
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route POST /api/auth/logout
 * @desc Wylogowanie użytkownika
 * @access Private
 */
router.post('/logout', verifyToken, authController.logout);

/**
 * @route POST /api/auth/logout-all
 * @desc Wylogowanie użytkownika ze wszystkich urządzeń
 * @access Private
 */
router.post('/logout-all', verifyToken, authController.logoutAll);

/**
 * @route POST /api/auth/refresh-token
 * @desc Odświeżanie tokenu
 * @access Public
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @route GET /api/auth/me
 * @desc Pobieranie danych zalogowanego użytkownika
 * @access Private
 */
router.get('/me', verifyToken, authController.getMe);

/**
 * @route PUT /api/auth/me
 * @desc Aktualizacja danych użytkownika
 * @access Private
 */
router.put('/me', verifyToken, authController.updateMe);

/**
 * @route PUT /api/auth/change-password
 * @desc Zmiana hasła użytkownika
 * @access Private
 */
router.put('/change-password', verifyToken, authController.changePassword);

/**
 * @route PUT /api/auth/settings
 * @desc Aktualizacja ustawień użytkownika
 * @access Private
 */
router.put('/settings', verifyToken, authController.updateSettings);

module.exports = router;
