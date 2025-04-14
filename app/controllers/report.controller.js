/**
 * Kontroler raportów
 * @module controllers/report
 */

const Report = require('../data/models/report');
const Profile = require('../data/models/profile');
const reportService = require('../services/report.service');
const sentimentService = require('../services/sentiment.service');

/**
 * Pobiera wszystkie raporty użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getReports = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { profileId, type, startDate, endDate, limit = 10, page = 1 } = req.query;

    // Przygotowanie filtrów
    const filters = { user: userId };

    if (profileId) {
      // Sprawdzenie, czy profil należy do użytkownika
      const profile = await Profile.findOne({ _id: profileId, user: userId });
      if (!profile) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Nie masz dostępu do tego profilu'
          }
        });
      }
      filters.profile = profileId;
    }

    if (type) {
      filters.type = type;
    }

    if (startDate || endDate) {
      filters.generatedAt = {};
      if (startDate) {
        filters.generatedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filters.generatedAt.$lte = new Date(endDate);
      }
    }

    // Pobieranie raportów z paginacją
    const skip = (page - 1) * limit;
    const reports = await Report.find(filters)
      .sort({ generatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('profile', 'name');

    // Pobieranie całkowitej liczby raportów
    const total = await Report.countDocuments(filters);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Błąd podczas pobierania raportów:', error);
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
 * Pobiera szczegóły raportu
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Pobieranie raportu
    const report = await Report.findById(id)
      .populate('profile', 'name');

    if (!report) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REPORT_NOT_FOUND',
          message: 'Raport nie został znaleziony'
        }
      });
    }

    // Sprawdzenie, czy raport należy do użytkownika
    if (report.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tego raportu'
        }
      });
    }

    res.json({
      success: true,
      data: {
        report
      }
    });
  } catch (error) {
    console.error('Błąd podczas pobierania szczegółów raportu:', error);
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
 * Generuje raport z sesji
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.generateSessionReport = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    // Generowanie raportu
    const report = await reportService.generateSessionReport(sessionId, userId);

    res.json({
      success: true,
      data: {
        report
      }
    });
  } catch (error) {
    console.error('Błąd podczas generowania raportu z sesji:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Błąd serwera'
      }
    });
  }
};

/**
 * Generuje raport postępu
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.generateProgressReport = async (req, res) => {
  try {
    const { profileId } = req.params;
    const userId = req.user.userId;
    const { startDate, endDate } = req.body;

    // Generowanie raportu
    const report = await reportService.generateProgressReport(profileId, userId, { startDate, endDate });

    res.json({
      success: true,
      data: {
        report
      }
    });
  } catch (error) {
    console.error('Błąd podczas generowania raportu postępu:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Błąd serwera'
      }
    });
  }
};

/**
 * Generuje raport zadań
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.generateTasksReport = async (req, res) => {
  try {
    const { profileId } = req.params;
    const userId = req.user.userId;
    const { startDate, endDate } = req.body;

    // Generowanie raportu
    const report = await reportService.generateTasksReport(profileId, userId, { startDate, endDate });

    res.json({
      success: true,
      data: {
        report
      }
    });
  } catch (error) {
    console.error('Błąd podczas generowania raportu zadań:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Błąd serwera'
      }
    });
  }
};

/**
 * Generuje raport analizy sentymentu
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.generateSentimentReport = async (req, res) => {
  try {
    const { profileId } = req.params;
    const userId = req.user.userId;
    const { startDate, endDate } = req.body;

    // Generowanie raportu
    const report = await sentimentService.generateSentimentReport(profileId, userId, { startDate, endDate });

    res.json({
      success: true,
      data: {
        report
      }
    });
  } catch (error) {
    console.error('Błąd podczas generowania raportu analizy sentymentu:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message || 'Błąd serwera'
      }
    });
  }
};

/**
 * Usuwa raport
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Pobieranie raportu
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REPORT_NOT_FOUND',
          message: 'Raport nie został znaleziony'
        }
      });
    }

    // Sprawdzenie, czy raport należy do użytkownika
    if (report.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tego raportu'
        }
      });
    }

    // Usuwanie raportu
    await report.remove();

    res.json({
      success: true,
      data: {
        message: 'Raport został usunięty'
      }
    });
  } catch (error) {
    console.error('Błąd podczas usuwania raportu:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};
