/**
 * Kontroler ćwiczeń terapeutycznych
 * @module controllers/exercise
 */

const exerciseService = require('../services/exercise.service');

/**
 * Pobiera wszystkie ćwiczenia użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getExercises = async (req, res) => {
  try {
    const userId = req.user.userId;
    const options = req.query;

    const exercises = await exerciseService.getExercises(userId, options);

    res.json({
      success: true,
      data: {
        exercises
      }
    });
  } catch (error) {
    console.error('Błąd podczas pobierania ćwiczeń:', error);
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
 * Pobiera ćwiczenie po ID
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getExerciseById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const exerciseId = req.params.id;

    const exercise = await exerciseService.getExerciseById(exerciseId, userId);

    res.json({
      success: true,
      data: {
        exercise
      }
    });
  } catch (error) {
    console.error('Błąd podczas pobierania ćwiczenia:', error);
    
    if (error.message === 'Ćwiczenie nie istnieje') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXERCISE_NOT_FOUND',
          message: 'Ćwiczenie nie istnieje'
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
 * Tworzy nowe ćwiczenie
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.createExercise = async (req, res) => {
  try {
    const userId = req.user.userId;
    const exerciseData = req.body;

    const exercise = await exerciseService.createExercise(exerciseData, userId);

    res.status(201).json({
      success: true,
      data: {
        exercise
      },
      message: 'Ćwiczenie zostało utworzone'
    });
  } catch (error) {
    console.error('Błąd podczas tworzenia ćwiczenia:', error);
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
 * Aktualizuje ćwiczenie
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.updateExercise = async (req, res) => {
  try {
    const userId = req.user.userId;
    const exerciseId = req.params.id;
    const exerciseData = req.body;

    const exercise = await exerciseService.updateExercise(exerciseId, exerciseData, userId);

    res.json({
      success: true,
      data: {
        exercise
      },
      message: 'Ćwiczenie zostało zaktualizowane'
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji ćwiczenia:', error);
    
    if (error.message === 'Ćwiczenie nie istnieje') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXERCISE_NOT_FOUND',
          message: 'Ćwiczenie nie istnieje'
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
 * Usuwa ćwiczenie
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.deleteExercise = async (req, res) => {
  try {
    const userId = req.user.userId;
    const exerciseId = req.params.id;

    await exerciseService.deleteExercise(exerciseId, userId);

    res.json({
      success: true,
      message: 'Ćwiczenie zostało usunięte'
    });
  } catch (error) {
    console.error('Błąd podczas usuwania ćwiczenia:', error);
    
    if (error.message === 'Ćwiczenie nie istnieje') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXERCISE_NOT_FOUND',
          message: 'Ćwiczenie nie istnieje'
        }
      });
    }

    if (error.message === 'Nie można usunąć domyślnego ćwiczenia') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'CANNOT_DELETE_DEFAULT_EXERCISE',
          message: 'Nie można usunąć domyślnego ćwiczenia'
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
 * Dodaje wpis do historii wykonania ćwiczenia
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.addHistoryEntry = async (req, res) => {
  try {
    const userId = req.user.userId;
    const exerciseId = req.params.id;
    const historyEntry = req.body;

    const exercise = await exerciseService.addHistoryEntry(exerciseId, historyEntry, userId);

    res.json({
      success: true,
      data: {
        exercise
      },
      message: 'Wpis do historii został dodany'
    });
  } catch (error) {
    console.error('Błąd podczas dodawania wpisu do historii:', error);
    
    if (error.message === 'Ćwiczenie nie istnieje') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXERCISE_NOT_FOUND',
          message: 'Ćwiczenie nie istnieje'
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
 * Inicjalizuje domyślne ćwiczenia dla użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.initializeDefaultExercises = async (req, res) => {
  try {
    const userId = req.user.userId;

    const exercises = await exerciseService.initializeDefaultExercises(userId);

    res.json({
      success: true,
      data: {
        exercises
      },
      message: 'Domyślne ćwiczenia zostały zainicjalizowane'
    });
  } catch (error) {
    console.error('Błąd podczas inicjalizacji domyślnych ćwiczeń:', error);
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
 * Pobiera statystyki ćwiczeń użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getExerciseStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await exerciseService.getExerciseStats(userId);

    res.json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Błąd podczas pobierania statystyk ćwiczeń:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};
