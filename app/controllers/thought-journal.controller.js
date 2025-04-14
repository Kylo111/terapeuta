/**
 * Kontroler dziennika myśli i emocji
 * @module controllers/thought-journal
 */

const thoughtJournalService = require('../services/thought-journal.service');

/**
 * Pobiera wszystkie wpisy z dziennika użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getEntries = async (req, res) => {
  try {
    const userId = req.user.userId;
    const options = req.query;

    const result = await thoughtJournalService.getEntries(userId, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Błąd podczas pobierania wpisów z dziennika:', error);
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
 * Pobiera wpis z dziennika po ID
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getEntryById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const entryId = req.params.id;

    const entry = await thoughtJournalService.getEntryById(entryId, userId);

    res.json({
      success: true,
      data: {
        entry
      }
    });
  } catch (error) {
    console.error('Błąd podczas pobierania wpisu z dziennika:', error);
    
    if (error.message === 'Wpis nie istnieje') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ENTRY_NOT_FOUND',
          message: 'Wpis nie istnieje'
        }
      });
    }

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
 * Tworzy nowy wpis w dzienniku
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.createEntry = async (req, res) => {
  try {
    const userId = req.user.userId;
    const entryData = req.body;

    const entry = await thoughtJournalService.createEntry(entryData, userId);

    res.status(201).json({
      success: true,
      data: {
        entry
      },
      message: 'Wpis został utworzony'
    });
  } catch (error) {
    console.error('Błąd podczas tworzenia wpisu w dzienniku:', error);
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
 * Aktualizuje wpis w dzienniku
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.updateEntry = async (req, res) => {
  try {
    const userId = req.user.userId;
    const entryId = req.params.id;
    const entryData = req.body;

    const entry = await thoughtJournalService.updateEntry(entryId, entryData, userId);

    res.json({
      success: true,
      data: {
        entry
      },
      message: 'Wpis został zaktualizowany'
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji wpisu w dzienniku:', error);
    
    if (error.message === 'Wpis nie istnieje') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ENTRY_NOT_FOUND',
          message: 'Wpis nie istnieje'
        }
      });
    }

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
 * Usuwa wpis z dziennika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.deleteEntry = async (req, res) => {
  try {
    const userId = req.user.userId;
    const entryId = req.params.id;

    await thoughtJournalService.deleteEntry(entryId, userId);

    res.json({
      success: true,
      message: 'Wpis został usunięty'
    });
  } catch (error) {
    console.error('Błąd podczas usuwania wpisu z dziennika:', error);
    
    if (error.message === 'Wpis nie istnieje') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ENTRY_NOT_FOUND',
          message: 'Wpis nie istnieje'
        }
      });
    }

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
 * Pobiera statystyki dziennika myśli i emocji
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getJournalStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const options = req.query;

    const stats = await thoughtJournalService.getJournalStats(userId, options);

    res.json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Błąd podczas pobierania statystyk dziennika:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};
