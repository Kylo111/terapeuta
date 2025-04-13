/**
 * API dla autentykacji
 * 
 * Ten moduł udostępnia API do rejestracji, logowania, wylogowania i zarządzania tokenami użytkowników.
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../data/models/user');
const { v4: uuidv4 } = require('uuid');

// Middleware do weryfikacji tokenu
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      error: { 
        code: 'UNAUTHORIZED', 
        message: 'Brak tokenu autoryzacyjnego' 
      } 
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: { 
        code: 'INVALID_TOKEN', 
        message: 'Token jest nieprawidłowy lub wygasł' 
      } 
    });
  }
};

/**
 * @route POST /api/auth/register
 * @desc Rejestracja nowego użytkownika
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Sprawdzenie, czy użytkownik już istnieje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'EMAIL_IN_USE', 
          message: 'Użytkownik o podanym adresie email już istnieje' 
        } 
      });
    }
    
    // Utworzenie nowego użytkownika
    const user = new User({
      email,
      password,
      firstName,
      lastName
    });
    
    await user.save();
    
    res.status(201).json({ 
      success: true, 
      data: { 
        user: user.getPublicProfile() 
      }, 
      message: 'Użytkownik został zarejestrowany' 
    });
  } catch (error) {
    console.error('Błąd podczas rejestracji użytkownika:', error);
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
 * @route POST /api/auth/login
 * @desc Logowanie użytkownika
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, deviceId, deviceName } = req.body;
    
    // Sprawdzenie, czy użytkownik istnieje
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 'INVALID_CREDENTIALS', 
          message: 'Nieprawidłowy email lub hasło' 
        } 
      });
    }
    
    // Sprawdzenie, czy użytkownik jest aktywny
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 'ACCOUNT_INACTIVE', 
          message: 'Konto jest nieaktywne' 
        } 
      });
    }
    
    // Sprawdzenie hasła
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 'INVALID_CREDENTIALS', 
          message: 'Nieprawidłowy email lub hasło' 
        } 
      });
    }
    
    // Generowanie tokenów
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user._id, deviceId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    // Aktualizacja informacji o urządzeniu
    const actualDeviceId = deviceId || uuidv4();
    const actualDeviceName = deviceName || 'Nieznane urządzenie';
    
    user.addDevice(actualDeviceId, actualDeviceName, refreshToken);
    user.lastLogin = Date.now();
    await user.save();
    
    res.json({ 
      success: true, 
      data: { 
        user: user.getPublicProfile(),
        accessToken,
        refreshToken,
        deviceId: actualDeviceId
      }, 
      message: 'Logowanie zakończone sukcesem' 
    });
  } catch (error) {
    console.error('Błąd podczas logowania użytkownika:', error);
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
 * @route POST /api/auth/refresh-token
 * @desc Odświeżanie tokenu dostępu
 * @access Public
 */
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken, deviceId } = req.body;
    
    if (!refreshToken || !deviceId) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'MISSING_PARAMETERS', 
          message: 'Brak wymaganych parametrów' 
        } 
      });
    }
    
    // Weryfikacja tokenu odświeżania
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 'INVALID_REFRESH_TOKEN', 
          message: 'Token odświeżania jest nieprawidłowy lub wygasł' 
        } 
      });
    }
    
    // Sprawdzenie, czy token odświeżania należy do tego urządzenia
    if (decoded.deviceId !== deviceId) {
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 'DEVICE_MISMATCH', 
          message: 'Token odświeżania nie należy do tego urządzenia' 
        } 
      });
    }
    
    // Pobranie użytkownika
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 'USER_NOT_FOUND', 
          message: 'Użytkownik nie został znaleziony' 
        } 
      });
    }
    
    // Sprawdzenie, czy użytkownik jest aktywny
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 'ACCOUNT_INACTIVE', 
          message: 'Konto jest nieaktywne' 
        } 
      });
    }
    
    // Sprawdzenie, czy token odświeżania jest aktualny
    const device = user.devices.find(device => device.deviceId === deviceId);
    if (!device || device.refreshToken !== refreshToken) {
      return res.status(401).json({ 
        success: false, 
        error: { 
          code: 'INVALID_REFRESH_TOKEN', 
          message: 'Token odświeżania jest nieprawidłowy lub wygasł' 
        } 
      });
    }
    
    // Generowanie nowego tokenu dostępu
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    // Generowanie nowego tokenu odświeżania
    const newRefreshToken = jwt.sign(
      { userId: user._id, deviceId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    // Aktualizacja tokenu odświeżania
    user.updateRefreshToken(deviceId, newRefreshToken);
    await user.save();
    
    res.json({ 
      success: true, 
      data: { 
        accessToken,
        refreshToken: newRefreshToken
      }, 
      message: 'Token został odświeżony' 
    });
  } catch (error) {
    console.error('Błąd podczas odświeżania tokenu:', error);
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
 * @route POST /api/auth/logout
 * @desc Wylogowanie użytkownika
 * @access Private
 */
router.post('/logout', verifyToken, async (req, res) => {
  try {
    const { deviceId } = req.body;
    
    if (!deviceId) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'MISSING_PARAMETERS', 
          message: 'Brak wymaganych parametrów' 
        } 
      });
    }
    
    // Pobranie użytkownika
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
    
    // Usunięcie urządzenia
    user.removeDevice(deviceId);
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Wylogowanie zakończone sukcesem' 
    });
  } catch (error) {
    console.error('Błąd podczas wylogowywania użytkownika:', error);
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
 * @route POST /api/auth/logout-all
 * @desc Wylogowanie użytkownika ze wszystkich urządzeń
 * @access Private
 */
router.post('/logout-all', verifyToken, async (req, res) => {
  try {
    // Pobranie użytkownika
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
    
    // Usunięcie wszystkich urządzeń
    user.devices = [];
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Wylogowanie ze wszystkich urządzeń zakończone sukcesem' 
    });
  } catch (error) {
    console.error('Błąd podczas wylogowywania użytkownika ze wszystkich urządzeń:', error);
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
 * @route POST /api/auth/logout-device
 * @desc Wylogowanie użytkownika z określonego urządzenia
 * @access Private
 */
router.post('/logout-device', verifyToken, async (req, res) => {
  try {
    const { deviceId } = req.body;
    
    if (!deviceId) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'MISSING_PARAMETERS', 
          message: 'Brak wymaganych parametrów' 
        } 
      });
    }
    
    // Pobranie użytkownika
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
    
    // Sprawdzenie, czy urządzenie istnieje
    const device = user.devices.find(device => device.deviceId === deviceId);
    if (!device) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'DEVICE_NOT_FOUND', 
          message: 'Urządzenie nie zostało znalezione' 
        } 
      });
    }
    
    // Usunięcie urządzenia
    user.removeDevice(deviceId);
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Wylogowanie z urządzenia zakończone sukcesem' 
    });
  } catch (error) {
    console.error('Błąd podczas wylogowywania użytkownika z urządzenia:', error);
    res.status(500).json({ 
      success: false, 
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Błąd serwera' 
      } 
    });
  }
});

// Eksport middleware do weryfikacji tokenu
module.exports.verifyToken = verifyToken;

// Eksport routera
module.exports.router = router;
