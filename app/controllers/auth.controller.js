/**
 * Kontroler uwierzytelniania
 * @module controllers/auth
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../data/models');

/**
 * Rejestracja nowego użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Sprawdzenie, czy użytkownik już istnieje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
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

    // Generowanie tokenów
    const deviceId = req.body.deviceId || uuidv4();
    const deviceName = req.body.deviceName || 'Nieznane urządzenie';

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

    // Zapisanie informacji o urządzeniu
    user.devices = [{
      deviceId,
      deviceName,
      refreshToken,
      lastActive: Date.now()
    }];

    user.lastLogin = Date.now();
    await user.save();

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        accessToken,
        refreshToken,
        deviceId
      },
      message: 'Rejestracja zakończona sukcesem'
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
};

/**
 * Logowanie użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.login = async (req, res) => {
  try {
    const { email, password, deviceId, deviceName } = req.body;

    // Sprawdzenie, czy użytkownik istnieje
    const user = await User.findOne({ email }).select('+password');
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
    const isPasswordValid = await bcrypt.compare(password, user.password);
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
    const actualDeviceId = deviceId || uuidv4();
    const actualDeviceName = deviceName || 'Nieznane urządzenie';

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, deviceId: actualDeviceId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Aktualizacja informacji o urządzeniu
    const existingDevice = user.devices.find(device => device.deviceId === actualDeviceId);
    if (existingDevice) {
      existingDevice.refreshToken = refreshToken;
      existingDevice.lastActive = Date.now();
    } else {
      user.devices.push({
        deviceId: actualDeviceId,
        deviceName: actualDeviceName,
        refreshToken,
        lastActive: Date.now()
      });
    }

    user.lastLogin = Date.now();
    await user.save();

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
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
};

/**
 * Wylogowanie użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.logout = async (req, res) => {
  try {
    const { deviceId } = req.body;
    const userId = req.user.userId;

    // Usunięcie tokenu odświeżania dla urządzenia
    await User.updateOne(
      { _id: userId },
      { $pull: { devices: { deviceId } } }
    );

    res.json({
      success: true,
      message: 'Wylogowanie zakończone sukcesem'
    });
  } catch (error) {
    console.error('Błąd podczas wylogowania użytkownika:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Wylogowanie użytkownika ze wszystkich urządzeń
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.logoutAll = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Usunięcie wszystkich tokenów odświeżania
    await User.updateOne(
      { _id: userId },
      { $set: { devices: [] } }
    );

    res.json({
      success: true,
      message: 'Wylogowanie ze wszystkich urządzeń zakończone sukcesem'
    });
  } catch (error) {
    console.error('Błąd podczas wylogowania użytkownika ze wszystkich urządzeń:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Odświeżanie tokenu
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.refreshToken = async (req, res) => {
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

    // Sprawdzenie, czy użytkownik istnieje
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Użytkownik nie istnieje'
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
    device.refreshToken = newRefreshToken;
    device.lastActive = Date.now();
    await user.save();

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken
      },
      message: 'Token odświeżony pomyślnie'
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
};

/**
 * Pobieranie danych zalogowanego użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Użytkownik nie istnieje'
        }
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profiles: user.profiles,
          settings: user.settings,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
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
};

/**
 * Aktualizacja danych użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.updateMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, email } = req.body;

    // Sprawdzenie, czy email jest już używany przez innego użytkownika
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'EMAIL_IN_USE',
            message: 'Podany adres email jest już używany'
          }
        });
      }
    }

    // Aktualizacja danych użytkownika
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Użytkownik nie istnieje'
        }
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      },
      message: 'Dane użytkownika zaktualizowane pomyślnie'
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
};

/**
 * Zmiana hasła użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Sprawdzenie, czy użytkownik istnieje
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Użytkownik nie istnieje'
        }
      });
    }

    // Sprawdzenie, czy aktualne hasło jest poprawne
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
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
      message: 'Hasło zmienione pomyślnie'
    });
  } catch (error) {
    console.error('Błąd podczas zmiany hasła:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Aktualizacja ustawień użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { settings } = req.body;

    // Aktualizacja ustawień użytkownika
    const user = await User.findByIdAndUpdate(
      userId,
      { settings },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Użytkownik nie istnieje'
        }
      });
    }

    res.json({
      success: true,
      data: {
        settings: user.settings
      },
      message: 'Ustawienia użytkownika zaktualizowane pomyślnie'
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
};
