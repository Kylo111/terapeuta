/**
 * Kontroler eksportu/importu danych
 * @module controllers/export
 */

const exportService = require('../services/export.service');

/**
 * Eksportuje dane użytkownika do formatu JSON
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.exportToJSON = async (req, res) => {
  try {
    const userId = req.user.userId;
    const options = req.body;

    // Eksport danych
    const data = await exportService.exportToJSON(userId, options);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Błąd podczas eksportu danych do JSON:', error);
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
 * Eksportuje dane użytkownika do formatu CSV
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.exportToCSV = async (req, res) => {
  try {
    const userId = req.user.userId;
    const options = req.body;

    // Eksport danych
    const data = await exportService.exportToCSV(userId, options);

    // Ustawienie nagłówków odpowiedzi
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=export.csv');

    // Wysłanie danych
    if (options.includeSessions && data.sessions) {
      res.write(data.sessions);
      res.write('\n\n');
    }

    if (options.includeTasks && data.tasks) {
      res.write(data.tasks);
    }

    res.end();
  } catch (error) {
    console.error('Błąd podczas eksportu danych do CSV:', error);
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
 * Eksportuje dane użytkownika do formatu PDF
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.exportToPDF = async (req, res) => {
  try {
    const userId = req.user.userId;
    const options = req.body;

    // Eksport danych
    const data = await exportService.exportToPDF(userId, options);

    // Ustawienie nagłówków odpowiedzi
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=export.pdf');
    res.setHeader('Content-Length', data.length);

    // Wysłanie danych
    res.end(data);
  } catch (error) {
    console.error('Błąd podczas eksportu danych do PDF:', error);
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
 * Eksportuje dane użytkownika do archiwum ZIP
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.exportToZIP = async (req, res) => {
  try {
    const userId = req.user.userId;
    const options = req.body;

    // Eksport danych
    const data = await exportService.exportToZIP(userId, options);

    // Ustawienie nagłówków odpowiedzi
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=export.zip');
    res.setHeader('Content-Length', data.length);

    // Wysłanie danych
    res.end(data);
  } catch (error) {
    console.error('Błąd podczas eksportu danych do ZIP:', error);
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
 * Importuje dane użytkownika z formatu JSON
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.importFromJSON = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { data, options } = req.body;

    // Importowanie danych
    const result = await exportService.importFromJSON(userId, data, options);

    res.json({
      success: true,
      data: {
        result
      }
    });
  } catch (error) {
    console.error('Błąd podczas importu danych z JSON:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};
