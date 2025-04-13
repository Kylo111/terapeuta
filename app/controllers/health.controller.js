/**
 * Kontroler zdrowia aplikacji
 * @module controllers/health
 */

const mongoose = require('mongoose');

/**
 * Sprawdza stan zdrowia aplikacji
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.checkHealth = async (req, res) => {
  try {
    // Sprawdzenie połączenia z bazą danych
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Sprawdzenie dostępności kluczy API
    const openaiApiKey = process.env.OPENAI_API_KEY ? 'available' : 'unavailable';
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY ? 'available' : 'unavailable';
    
    // Informacje o środowisku
    const environment = process.env.NODE_ENV || 'development';
    const uptime = process.uptime();
    
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        environment,
        uptime,
        database: {
          status: dbStatus
        },
        api: {
          openai: openaiApiKey,
          anthropic: anthropicApiKey
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Health check failed',
        details: error.message
      }
    });
  }
};
