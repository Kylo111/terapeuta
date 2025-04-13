/**
 * Middleware do uwierzytelniania
 * @module middleware/auth
 */

const jwt = require('jsonwebtoken');
const { User } = require('../data/models');

/**
 * Middleware do weryfikacji tokenu JWT
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 * @param {Function} next - Funkcja next
 */
exports.verifyToken = (req, res, next) => {
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
 * Middleware do weryfikacji roli administratora
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 * @param {Function} next - Funkcja next
 */
exports.verifyAdmin = async (req, res, next) => {
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
    
    if (!user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'FORBIDDEN', 
          message: 'Brak uprawnień administratora' 
        } 
      });
    }
    
    next();
  } catch (error) {
    console.error('Błąd podczas weryfikacji uprawnień administratora:', error);
    return res.status(500).json({ 
      success: false, 
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Błąd serwera' 
      } 
    });
  }
};

/**
 * Middleware do weryfikacji właściciela zasobu
 * @param {String} modelName - Nazwa modelu
 * @param {String} paramName - Nazwa parametru zawierającego ID zasobu
 * @returns {Function} Middleware
 */
exports.verifyOwner = (modelName, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const resourceId = req.params[paramName];
      
      const Model = require(`../data/models/${modelName.toLowerCase()}`);
      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ 
          success: false, 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: 'Zasób nie istnieje' 
          } 
        });
      }
      
      // Sprawdzenie, czy użytkownik jest właścicielem zasobu
      if (resource.user && resource.user.toString() !== userId) {
        return res.status(403).json({ 
          success: false, 
          error: { 
            code: 'FORBIDDEN', 
            message: 'Brak uprawnień do tego zasobu' 
          } 
        });
      }
      
      next();
    } catch (error) {
      console.error('Błąd podczas weryfikacji właściciela zasobu:', error);
      return res.status(500).json({ 
        success: false, 
        error: { 
          code: 'SERVER_ERROR', 
          message: 'Błąd serwera' 
        } 
      });
    }
  };
};
