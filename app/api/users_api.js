/**
 * API dla użytkowników
 * 
 * Ten moduł udostępnia API do zarządzania danymi użytkownika i jego ustawieniami.
 */

const express = require('express');
const router = express.Router();
const User = require('../data/models/user');
const { verifyToken } = require('./auth_api');

/**
 * @route GET /api/users/me
 * @desc Pobieranie danych zalogowanego użytkownika
 * @access Private
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'USER_NOT_FOUND', 
          message: 'Użytkownik nie został znaleziony' 
        } 
      });
    }
    
    res.json({ 
      success: true, 
      data: { 
        user: user.getPublicProfile() 
      } 
    });
  } catch (error) {
    console.error('Błąd podczas pobierania danych użytkownika:', error);
    res.status(500).json({ 
      success: false, 
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Błąd serwera' 
      } 
    });
  }
});

/**
 * @route PUT /api/users/me
 * @desc Aktualizacja danych zalogowanego użytkownika
 * @access Private
 */
router.put('/me', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'USER_NOT_FOUND', 
          message: 'Użytkownik nie został znaleziony' 
        } 
      });
    }
    
    // Aktualizacja danych
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    
    await user.save();
    
    res.json({ 
      success: true, 
      data: { 
        user: user.getPublicProfile() 
      }, 
      message: 'Dane użytkownika zostały zaktualizowane' 
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji danych użytkownika:', error);
    res.status(500).json({ 
      success: false, 
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Błąd serwera' 
      } 
    });
  }
});

/**
 * @route PUT /api/users/me/password
 * @desc Zmiana hasła zalogowanego użytkownika
 * @access Private
 */
router.put('/me/password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'MISSING_PARAMETERS', 
          message: 'Brak wymaganych parametrów' 
        } 
      });
    }
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'USER_NOT_FOUND', 
          message: 'Użytkownik nie został znaleziony' 
        } 
      });
    }
    
    // Sprawdzenie aktualnego hasła
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 'INVALID_PASSWORD', 
          message: 'Aktualne hasło jest nieprawidłowe' 
        } 
      });
    }
    
    // Aktualizacja hasła
    user.password = newPassword;
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Hasło zostało zmienione' 
    });
  } catch (error) {
    console.error('Błąd podczas zmiany hasła użytkownika:', error);
    res.status(500).json({ 
      success: false, 
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Błąd serwera' 
      } 
    });
  }
});

/**
 * @route GET /api/users/me/devices
 * @desc Pobieranie listy urządzeń zalogowanego użytkownika
 * @access Private
 */
router.get('/me/devices', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'USER_NOT_FOUND', 
          message: 'Użytkownik nie został znaleziony' 
        } 
      });
    }
    
    // Przygotowanie listy urządzeń bez tokenów
    const devices = user.devices.map(device => ({
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      lastLogin: device.lastLogin
    }));
    
    res.json({ 
      success: true, 
      data: { 
        devices 
      } 
    });
  } catch (error) {
    console.error('Błąd podczas pobierania listy urządzeń użytkownika:', error);
    res.status(500).json({ 
      success: false, 
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Błąd serwera' 
      } 
    });
  }
});

/**
 * @route GET /api/users/me/settings
 * @desc Pobieranie ustawień zalogowanego użytkownika
 * @access Private
 */
router.get('/me/settings', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'USER_NOT_FOUND', 
          message: 'Użytkownik nie został znaleziony' 
        } 
      });
    }
    
    res.json({ 
      success: true, 
      data: { 
        settings: user.settings 
      } 
    });
  } catch (error) {
    console.error('Błąd podczas pobierania ustawień użytkownika:', error);
    res.status(500).json({ 
      success: false, 
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Błąd serwera' 
      } 
    });
  }
});

/**
 * @route PUT /api/users/me/settings
 * @desc Aktualizacja ustawień zalogowanego użytkownika
 * @access Private
 */
router.put('/me/settings', verifyToken, async (req, res) => {
  try {
    const { preferredLLMProvider, preferredModel, theme, language, notifications } = req.body;
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'USER_NOT_FOUND', 
          message: 'Użytkownik nie został znaleziony' 
        } 
      });
    }
    
    // Aktualizacja ustawień
    if (preferredLLMProvider) user.settings.preferredLLMProvider = preferredLLMProvider;
    if (preferredModel) user.settings.preferredModel = preferredModel;
    if (theme) user.settings.theme = theme;
    if (language) user.settings.language = language;
    
    if (notifications) {
      if (notifications.email !== undefined) user.settings.notifications.email = notifications.email;
      if (notifications.push !== undefined) user.settings.notifications.push = notifications.push;
    }
    
    await user.save();
    
    res.json({ 
      success: true, 
      data: { 
        settings: user.settings 
      }, 
      message: 'Ustawienia zostały zaktualizowane' 
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji ustawień użytkownika:', error);
    res.status(500).json({ 
      success: false, 
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Błąd serwera' 
      } 
    });
  }
});

module.exports = router;
